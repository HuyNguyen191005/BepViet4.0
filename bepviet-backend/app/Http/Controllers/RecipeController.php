<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Step; // Đảm bảo đã có Model Step
use Illuminate\Support\Facades\DB; // <-- QUAN TRỌNG: Để dùng Transaction
use Illuminate\Support\Facades\Validator;

class RecipeController extends Controller
{
    public function index()
    {
        // Lấy các món có status là 'Published', mới nhất lên đầu
        $recipes = Recipe::with('author')
                        ->where('status', 'Published') 
                        ->orderBy('created_at', 'desc')
                        ->take(8)
                        ->get();
        
        return response()->json($recipes);
    }
    public function show($id)
    {
        // Eager Load: Lấy Recipe kèm theo:
        // 1. author: Tác giả món ăn
        // 2. steps: Các bước làm
        // 3. ingredients: Nguyên liệu
        // 4. reviews.user: Các đánh giá và thông tin người đánh giá đó
        $recipe = Recipe::with(['author', 'steps', 'ingredients', 'reviews.user'])
                        ->find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Không tìm thấy món ăn'], 404);
        }

        return response()->json($recipe);   
    }
    public function getByCategory($id)
{
    // Kiểm tra Category có tồn tại không
    $category = Category::findOrFail($id);

    $recipes = Recipe::where('status', 'Published') // Thêm lọc trạng thái
        ->whereHas('categories', function($query) use ($id) {
            // Sử dụng tên bảng pivot hoặc quan hệ chuẩn
            $query->where('categories.category_id', $id);
        })
        ->with('author') // Đảm bảo Model Recipe có function author()
        ->orderBy('created_at', 'desc')
        ->paginate(9); 

    return response()->json([
        'category' => $category,
        'recipes' => $recipes 
    ]);
}
    public function search(Request $request)
    {
    $query = Recipe::query();

    // 1. Tìm theo từ khóa
    if ($request->filled('query')) {
        $keyword = $request->input('query');
        $query->where('title', 'like', '%' . $keyword . '%');
    }

    // 2. Lọc Category (CHỈ LỌC KHI CÓ DỮ LIỆU)
    if ($request->filled('categories')) {
        $categoryIds = explode(',', $request->input('categories'));
        // Kiểm tra xem mảng có rỗng không trước khi lọc
        if (!empty($categoryIds) && $categoryIds[0] != "") {
            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.category_id', $categoryIds);
            });
        }
    }

    // 3. Lọc Độ khó (CHỈ LỌC KHI CÓ DỮ LIỆU)
    if ($request->filled('difficulty')) {
        $difficulties = explode(',', $request->input('difficulty'));
        if (!empty($difficulties) && $difficulties[0] != "") {
            $query->whereIn('difficulty', $difficulties);
        }
    }

    // 4. Lọc Thời gian
    if ($request->filled('max_time')) {
        $query->where('cooking_time', '<=', $request->input('max_time'));
    }

    // 5. Lấy kèm dữ liệu liên quan
    $recipes = $query->with('categories')
                     ->withAvg('reviews', 'rating')
                     ->withCount('reviews')
                     ->get();

    return response()->json($recipes);
    }

// Đảm bảo bạn CÓ hàm này để lấy danh sách Loại món
public function getCategories() {
    return response()->json(\App\Models\Category::all());
}
// --- HÀM MỚI: TẠO MÓN ĂN ---
    public function store(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cooking_time' => 'required|integer',
            'difficulty' => 'required|in:Dễ,Trung bình,Khó', // Kiểm tra đúng giá trị ENUM
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate ảnh
            
            // Validate mảng danh mục
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,category_id',

            // Validate mảng nguyên liệu
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,ingredient_id',
            'ingredients.*.quantity' => 'required',
            'ingredients.*.unit' => 'required',

            // Validate mảng các bước
            'steps' => 'required|array',
            'steps.*.content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Bắt đầu Transaction
        DB::beginTransaction();

        try {
            // A. Xử lý upload ảnh (nếu có)
            $imagePath = null;
            if ($request->hasFile('image')) {
                // Lưu vào storage/app/public/recipes
                $path = $request->file('image')->store('recipes', 'public');
                // Tạo đường dẫn URL đầy đủ
                $imagePath = asset('storage/' . $path);
            }

            // B. Tạo món ăn vào bảng `recipes`
            $recipe = Recipe::create([
                // Giả sử đã đăng nhập, lấy ID người dùng hiện tại
                // Nếu chưa làm đăng nhập, bạn có thể hardcode: 'author_id' => 1,
               'user_id' => auth()->id() ?? 1,
                'title' => $request->title,
                'description' => $request->description,
                'cooking_time' => $request->cooking_time,
                'difficulty' => $request->difficulty,
                'image_url' => $imagePath,
                'status' => 'Published', // Mặc định chờ duyệt
            ]);

            // C. Lưu danh mục (Bảng trung gian recipe_categories)
            // attach: tự động thêm vào bảng phụ
            $recipe->categories()->attach($request->category_ids);

            // D. Lưu nguyên liệu (Bảng trung gian recipe_ingredients)
            foreach ($request->ingredients as $ing) {
                // attach có thể nhận tham số thứ 2 là các cột phụ (quantity, unit)
                $recipe->ingredients()->attach($ing['ingredient_id'], [
                    'quantity' => $ing['quantity'],
                    'unit' => $ing['unit']
                ]);
            }

            // E. Lưu các bước làm (Bảng steps)
          if ($request->has('steps')) {
        foreach ($request->steps as $index => $stepData) {
            $stepImagePath = null;
            
            // Lưu ý: Key gửi lên từ Postman/Frontend vẫn là 'image' cho ngắn gọn
            // Ví dụ: steps[0][image]
            if ($request->hasFile("steps.$index.image")) {
                $file = $request->file("steps.$index.image");
                $path = $file->store('steps', 'public');
                $stepImagePath = asset('storage/' . $path);
            }

            Step::create([
                'recipe_id' => $recipe->recipe_id, // hoặc $recipe->id
                'step_order' => $index + 1,
                'content' => $stepData['content'],
                
                // --- SỬA CHỖ NÀY ---
                'image_url' => $stepImagePath 
                // -------------------
            ]);
        }
    }

            // Nếu mọi thứ ngon lành -> Lưu vào DB thật
            DB::commit(); 

            return response()->json([
                'message' => 'Tạo món ăn thành công!',
                'recipe' => $recipe
            ], 201);

        } catch (\Exception $e) {
            // Nếu có lỗi bất kỳ -> Hủy toàn bộ thao tác nãy giờ
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }
}