<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Step;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RecipeController extends Controller
{
    // --- 1. LẤY DANH SÁCH MÓN ĂN (TRANG CHỦ) ---
    public function index()
    {
        $recipes = Recipe::with('author')
            ->where('status', 'Published')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return response()->json($recipes);
    }

    // --- 2. CHI TIẾT MÓN ĂN ---
    public function show($id)
    {
        $recipe = Recipe::with(['author', 'steps', 'ingredients', 'reviews.user'])
            ->find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Không tìm thấy món ăn'], 404);
        }

        return response()->json($recipe);
    }

    // --- 3. TÌM KIẾM ---
    public function search(Request $request)
    {
        $query = Recipe::query();

        if ($request->filled('query')) {
            $query->where('title', 'like', '%' . $request->input('query') . '%');
        }

        if ($request->filled('categories')) {
            $categoryIds = explode(',', $request->input('categories'));
            if (!empty($categoryIds) && $categoryIds[0] != "") {
                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.category_id', $categoryIds);
                });
            }
        }

        if ($request->filled('difficulty')) {
            $difficulties = explode(',', $request->input('difficulty'));
            if (!empty($difficulties) && $difficulties[0] != "") {
                $query->whereIn('difficulty', $difficulties);
            }
        }

        $recipes = $query->with('categories')
            ->where('status', 'Published')
            ->get();

        return response()->json($recipes);
    }

    // --- 4. TẠO MÓN ĂN (QUAN TRỌNG: ĐÃ FIX LỖI) ---
    public function store(Request $request)
    {
        // A. Lấy ID người dùng (Ưu tiên Token -> Sau đó đến dữ liệu gửi lên)
        $userId = auth()->id();
        
        // Nếu Token không giải mã được user, lấy từ form gửi lên (Fallback)
        if (!$userId && $request->has('user_id')) {
            $userId = $request->input('user_id');
        }

        if (!$userId) {
            return response()->json(['message' => 'Lỗi xác thực: Không tìm thấy ID người dùng.'], 401);
        }

        // B. Xử lý dữ liệu JSON từ FormData (Nguyên liệu & Bước làm)
        // Vì FormData gửi Array dưới dạng String, cần decode ra
        $ingredients = $request->ingredients;
        if (is_string($ingredients)) {
            $ingredients = json_decode($ingredients, true);
        }

        $steps = $request->steps;
        if (is_string($steps)) {
            $steps = json_decode($steps, true);
        }

        // Gán lại vào request để validate
        $request->merge([
            'ingredients' => $ingredients,
            'steps' => $steps
        ]);

        // C. Validate
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cooking_time' => 'required',
            'difficulty' => 'required',
            'category_ids' => 'nullable', // Có thể để null nếu không bắt buộc
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // 1. Upload ảnh chính
            $imagePath = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('recipes', 'public');
                $imagePath = asset('storage/' . $path); // Lưu đường dẫn đầy đủ
            }

            // 2. Tạo Recipe
            $recipe = Recipe::create([
                'user_id' => $userId, // Chắc chắn có ID
                'title' => $request->title,
                'description' => $request->description,
                'cooking_time' => (int)$request->cooking_time,
                'difficulty' => $request->difficulty,
                'image_url' => $imagePath,
                'status' => 'Published'
            ]);

            // 3. Lưu Categories (Nếu có)
            if ($request->has('category_ids') && !empty($request->category_ids)) {
                 // Xử lý nếu category_ids là string "1,2,3"
                 $cats = is_string($request->category_ids) ? explode(',', $request->category_ids) : $request->category_ids;
                 $recipe->categories()->attach($cats);
            }

            // 4. Lưu Nguyên liệu
            if (!empty($ingredients) && is_array($ingredients)) {
                foreach ($ingredients as $ing) {
                    // Kiểm tra dữ liệu hợp lệ trước khi lưu
                    if (isset($ing['ingredient_id'])) {
                        $recipe->ingredients()->attach($ing['ingredient_id'], [
                            'quantity' => $ing['quantity'] ?? '',
                            'unit' => $ing['unit'] ?? ''
                        ]);
                    }
                }
            }

            // 5. Lưu Các bước làm
            if (!empty($steps) && is_array($steps)) {
                foreach ($steps as $index => $stepData) {
                    $stepContent = is_array($stepData) ? ($stepData['content'] ?? '') : $stepData;
                    
                    Step::create([
                        'recipe_id' => $recipe->recipe_id ?? $recipe->id,
                        'step_order' => $index + 1,
                        'content' => $stepContent,
                        'image_url' => null // Xử lý ảnh bước sau nếu cần
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Đăng công thức thành công!', 'data' => $recipe], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Lỗi tạo món ăn: " . $e->getMessage());
            return response()->json(['message' => 'Lỗi Server: ' . $e->getMessage()], 500);
        }
    }

    // --- 5. LẤY MÓN ĂN CỦA TÔI ---
    public function getMyRecipes(Request $request)
    {
        // Tương tự, ưu tiên Auth, fallback sang request gửi lên
        $userId = auth()->id();
        if (!$userId && $request->has('user_id')) {
            $userId = $request->input('user_id');
        }

        if (!$userId) {
             // Nếu vẫn không có user_id, trả về mảng rỗng thay vì lỗi 401 để trang web không bị crash
            return response()->json([]);
        }

        $recipes = Recipe::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($recipes);
    }
    
    public function getCategories()
    {
        return response()->json(Category::all());
    }
}