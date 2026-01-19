<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Activity;
use App\Models\Step;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // <-- Đã thêm
use Illuminate\Support\Facades\Auth;    // <-- Đã thêm

class RecipeController extends Controller
{
    // 1. Lấy danh sách (Trang chủ)
    public function index()
    {
        $recipes = Recipe::with('user') 
                        ->where('status', 'Published')
                        ->orderBy('created_at', 'desc')
                        ->take(8)
                        ->get();
        
        return response()->json($recipes);
    }

    // 2. Chi tiết món ăn
    public function show($id)
    {
        $recipe = Recipe::with(['author', 'steps', 'ingredients', 'reviews.user'])
                        ->find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Không tìm thấy món ăn'], 404);
        }

        return response()->json($recipe);   
    }

    // 3. Lấy theo danh mục
    public function getByCategory($id)
    {
        $category = Category::findOrFail($id);

        $recipes = Recipe::where('status', 'Published')
            ->whereHas('categories', function($query) use ($id) {
                $query->where('categories.category_id', $id);
            })
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(9); 

        return response()->json([
            'category' => $category,
            'recipes' => $recipes 
        ]);
    }

    // 4. Tìm kiếm
    public function search(Request $request)
    {
        $query = Recipe::query();

        // Tìm theo từ khóa
        if ($request->filled('query')) {
            $query->where('title', 'like', '%' . $request->input('query') . '%');
        }

        // Lọc Category
        if ($request->filled('categories')) {
            $categoryIds = explode(',', $request->input('categories'));
            if (!empty($categoryIds) && $categoryIds[0] != "") {
                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.category_id', $categoryIds);
                });
            }
        }

        // Lọc Độ khó
        if ($request->filled('difficulty')) {
            $difficulties = explode(',', $request->input('difficulty'));
            if (!empty($difficulties) && $difficulties[0] != "") {
                $query->whereIn('difficulty', $difficulties);
            }
        }

        // Lọc Thời gian
        if ($request->filled('max_time')) {
            $query->where('cooking_time', '<=', $request->input('max_time'));
        }

        $recipes = $query->with('categories')
                         ->withAvg('reviews', 'rating')
                         ->withCount('reviews')
                         ->get();

        return response()->json($recipes);
    }

    // 5. Lấy danh sách Categories (cho form lọc/tạo)
    public function getCategories() {
        return response()->json(\App\Models\Category::all());
    }

    // 6. TẠO MÓN ĂN (STORE)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cooking_time' => 'required|integer',
            'difficulty' => 'required|in:Dễ,Trung bình,Khó',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_ids' => 'required', // array hoặc json string
            'ingredients' => 'required',  // array hoặc json string
            'steps' => 'required',        // array hoặc json string
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // A. Upload ảnh chính
            $imagePath = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('recipes', 'public');
                // Lưu ý: nên lưu path tương đối, khi hiển thị mới nối asset()
                // Nhưng nếu FE cần full link ngay thì giữ nguyên logic của bạn:
                $imagePath = asset('storage/' . $path); 
            }

            // B. Tạo Recipe
            $recipe = Recipe::create([
                'user_id' => Auth::id() ?? 1, // Fallback ID 1 nếu chưa login (chỉ để test)
                'title' => $request->title,
                'description' => $request->description,
                'cooking_time' => $request->cooking_time,
                'difficulty' => $request->difficulty,
                'image_url' => $imagePath,
                'status' => 'Draft',             
                'views' => 0,
            ]);

            // C. Xử lý Categories
            // Frontend có thể gửi Array hoặc JSON String (nếu dùng FormData)
            $catIds = is_string($request->category_ids) ? json_decode($request->category_ids, true) : $request->category_ids;
            if($catIds) $recipe->categories()->attach($catIds);

            // D. Xử lý Ingredients
            $ingredients = is_string($request->ingredients) ? json_decode($request->ingredients, true) : $request->ingredients;
            if($ingredients) {
                foreach ($ingredients as $ing) {
                    $recipe->ingredients()->attach($ing['ingredient_id'], [
                        'quantity' => $ing['quantity'],
                        'unit' => $ing['unit']
                    ]);
                }
            }

            // E. Xử lý Steps
            // Lưu ý: Logic upload ảnh từng bước rất phức tạp với FormData
            // Ở đây giữ logic cơ bản
            if ($request->has('steps')) {
                // Nếu gửi JSON string thì decode, nếu không lấy trực tiếp
                // LƯU Ý: Nếu upload file trong step, JSON string không chứa được file. 
                // FE phải gửi dạng steps[0][content], steps[0][image]
                
                $stepsData = $request->steps; 
                // Nếu là string JSON (thường không kèm file)
                if (is_string($stepsData)) $stepsData = json_decode($stepsData, true);

                foreach ($stepsData as $index => $stepData) {
                    $stepImagePath = null;
                    
                    // Logic check file cho từng bước
                    // name="steps[0][image]"
                    if ($request->hasFile("steps.$index.image")) {
                        $file = $request->file("steps.$index.image");
                        $path = $file->store('steps', 'public');
                        $stepImagePath = asset('storage/' . $path);
                    }

                    Step::create([
                        'recipe_id' => $recipe->recipe_id,
                        'step_order' => $index + 1,
                        'content' => is_array($stepData) ? $stepData['content'] : $stepData,
                        'image_url' => $stepImagePath
                    ]);
                }
            }

            // F. Ghi Log Activity
            Activity::create([
                'user_id'  => Auth::id() ?? 1,
                'username' => Auth::user() ? Auth::user()->full_name : 'Admin',
                'action'   => 'vừa đăng một công thức mới: ' . $recipe->title,
                'type'     => 'recipe'
            ]);

            DB::commit();
            
            return response()->json([
                'message' => 'Tạo món ăn thành công!',
                'recipe' => $recipe
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // 7. Lấy danh sách cho Admin
    public function getAdminRecipes()
    {
        $recipes = Recipe::with(['author', 'categories']) 
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($recipes);
    }

    // 8. Duyệt bài
    public function approve($id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->status = 'Published';
        $recipe->save();
        return response()->json($recipe->load(['author', 'categories']));
    }

    // 9. Đổi trạng thái nhanh
    public function toggleStatus($id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->status = ($recipe->status === 'Published') ? 'Draft' : 'Published';
        $recipe->save();
        return response()->json($recipe->load(['author','categories'])); // 'categorise' -> 'categories'
    }

    // 10. Yêu thích
    public function toggleFavorite($id) {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $status = $user->favorites()->toggle($id);
        
        return response()->json([
            'is_favorited' => count($status['attached']) > 0,
            'message' => 'Cập nhật bộ sưu tập thành công'
        ]);
    }

    // 11. CẬP NHẬT (UPDATE) - Đã gộp 2 hàm update thành 1
    public function update(Request $request, $id)
    {
        $recipe = Recipe::find($id);

        if (!$recipe) return response()->json(['message' => 'Không tìm thấy bài viết'], 404);
        
        // Kiểm tra quyền (nếu cần thiết)
        if ($recipe->user_id !== Auth::id()) {
            // return response()->json(['message' => 'Bạn không có quyền sửa bài này'], 403);
        }

        DB::beginTransaction();
        try {
            // 1. Update thông tin cơ bản
            $recipe->fill($request->only(['title', 'description', 'cooking_time', 'servings', 'difficulty', 'status']));

            // 2. Update ảnh chính
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ nếu không phải link ngoài
                if ($recipe->image_url && strpos($recipe->image_url, 'http') === false) {
                     Storage::disk('public')->delete($recipe->image_url);
                }
                // Lưu ảnh mới
                $path = $request->file('image')->store('recipes', 'public');
                $recipe->image_url = asset('storage/' . $path);
            }
            $recipe->save();

            // 3. Update Categories
            if ($request->has('category_ids')) {
                $catIds = is_string($request->category_ids) ? json_decode($request->category_ids) : $request->category_ids;
                $recipe->categories()->sync($catIds);
            }

            // 4. Update Ingredients (Xóa cũ -> Tạo mới)
            if ($request->has('ingredients')) {
                $recipe->ingredients()->detach(); 
                $ingredients = is_string($request->ingredients) ? json_decode($request->ingredients, true) : $request->ingredients;
                if ($ingredients) {
                    foreach ($ingredients as $item) {
                        $recipe->ingredients()->attach($item['ingredient_id'], [
                            'quantity' => $item['quantity'],
                            'unit' => $item['unit']
                        ]);
                    }
                }
            }

            // 5. Update Steps (Xóa cũ -> Tạo mới cho đơn giản)
            // Lưu ý: Cách này sẽ làm mất ảnh của các bước cũ nếu không xử lý kỹ.
            // Để đơn giản hóa, ta giả sử user phải nhập lại các bước hoặc FE gửi lại toàn bộ.
            if ($request->has('steps')) {
                $recipe->steps()->delete(); 
                
                $stepsData = is_string($request->steps) ? json_decode($request->steps, true) : $request->steps;
                if ($stepsData) {
                    foreach ($stepsData as $index => $stepContent) {
                        $content = is_array($stepContent) ? $stepContent['content'] : $stepContent;
                        // TODO: Xử lý ảnh cho update step ở đây (khá phức tạp với logic xóa đi tạo lại)
                        Step::create([
                            'recipe_id' => $recipe->recipe_id,
                            'step_order' => $index + 1,
                            'content' => $content
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Cập nhật thành công', 'data' => $recipe]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi cập nhật: ' . $e->getMessage()], 500);
        }
    }

    // 12. XÓA (DESTROY) - Đã gộp 2 hàm destroy thành 1
    public function destroy($id)
    {
        $recipe = Recipe::find($id);
        if (!$recipe) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        // if ($recipe->user_id !== Auth::id()) return response()->json(['message' => 'Cấm xóa'], 403);

        try {
            // Xóa ảnh
            if ($recipe->image_url) {
                // Tách lấy path tương đối để xóa (nếu lưu full url)
                $relativePath = str_replace(asset('storage/'), '', $recipe->image_url);
                Storage::disk('public')->delete($relativePath);
            }
            
            // Xóa quan hệ
            $recipe->ingredients()->detach();
            $recipe->categories()->detach();
            $recipe->steps()->delete();
            $recipe->reviews()->delete(); // Nếu có review thì xóa luôn
            
            $recipe->delete();
            return response()->json(['message' => 'Đã xóa thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi xóa: ' . $e->getMessage()], 500);
        }
    }
    
}