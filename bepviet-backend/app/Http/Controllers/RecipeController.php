<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Activity;
use App\Models\Step;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    // ======================================================
    // 1. LẤY DANH SÁCH (TRANG CHỦ)
    // ======================================================
    public function index()
    {
        $recipes = Recipe::with('user')
            ->where('status', 'Published')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $formattedRecipes = $recipes->map(function ($recipe) {
            return $this->formatRecipeData($recipe);
        });

        return response()->json($formattedRecipes);
    }

    // ======================================================
    // 2. CHI TIẾT MÓN ĂN (SHOW) - Đã fix lỗi ảnh và ID
    // ======================================================
    public function show($id)
    {
        // Dùng where recipe_id để chắc chắn tìm đúng cột
        $recipe = Recipe::with(['user', 'steps', 'ingredients', 'reviews.user'])
            ->where('recipe_id', $id)
            ->first();

        if (!$recipe) {
            return response()->json(['message' => 'Không tìm thấy món ăn'], 404);
        }

        // Tái sử dụng hàm format dữ liệu để đảm bảo ảnh hiển thị đúng như trang chủ
        // Tuy nhiên, trang chi tiết cần nhiều info hơn (steps, ingredients) nên ta merge thêm vào
        $basicData = $this->formatRecipeData($recipe);
        
        $detailData = array_merge($basicData, [
            'description' => $recipe->description,
            'servings' => $recipe->servings,
            'ingredients' => $recipe->ingredients,
            'steps' => $recipe->steps->map(function($step) {
                // Xử lý ảnh cho từng bước (Step) nếu có
                if ($step->image_url && !str_contains($step->image_url, 'http')) {
                    $cleanStepImg = str_replace('storage/', '', $step->image_url);
                    $step->image_url = asset('storage/' . $cleanStepImg);
                }
                return $step;
            }),
            'reviews' => $recipe->reviews // Nếu cần format user trong review thì map thêm
        ]);

        return response()->json($detailData);
    }

    // ======================================================
    // HÀM PHỤ: FORMAT DỮ LIỆU CHUNG (Giúp code gọn hơn)
    // ======================================================
private function formatRecipeData($recipe)
    {
        // --- 1. XỬ LÝ ẢNH MÓN ĂN ---
        $finalImage = null;
        
        if ($recipe->image_url) {
            // Trường hợp 1: Link online (http...)
            if (str_contains($recipe->image_url, 'http')) {
                $finalImage = $recipe->image_url;
            } 
            // Trường hợp 2: Ảnh trong máy (File sạch: "CanhRauNgot.png")
            else {
                // Chỉ cần nối chuỗi đơn giản
                $finalImage = asset('storage/' . $recipe->image_url);
            }
        }

        // 2. Xử lý Avatar User
$avatarName = $recipe->user->avatar ? trim($recipe->user->avatar) : null;

// 2. Logic tạo đường dẫn (như cũ nhưng dùng biến đã trim)
$userAvatar = 'storage/default-avtar.png'; // Ảnh mặc định

if ($avatarName) {
    if (strpos($avatarName, 'http') === 0) {
        $userAvatar = $avatarName;
    } elseif (strpos($avatarName, 'storage/') === 0) {
        $userAvatar = $avatarName;
    } else {
        $userAvatar = 'storage/' . $avatarName;
    }
}

        return [
            'recipe_id'    => $recipe->recipe_id, // Quan trọng: Trả về đúng recipe_id
            'id'           => $recipe->recipe_id, // Fallback cho frontend cũ
            'title'        => $recipe->title,
            'created_at'   => $recipe->created_at,
            'cooking_time' => $recipe->cooking_time,
            'difficulty'   => $recipe->difficulty,
            'image'        => $finalImage, // Link ảnh chuẩn
            'user'         => $recipe->user ? [
                'full_name' => $recipe->user->full_name,
               'avatar'    => asset($userAvatar)
            ] : null
        ];
    }

    // ======================================================
    // 3. LẤY THEO DANH MỤC
    // ======================================================
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
        
        // Format lại data trong pagination
        $recipes->getCollection()->transform(function ($recipe) {
             return $this->formatRecipeData($recipe);
        });

        return response()->json([
            'category' => $category,
            'recipes' => $recipes 
        ]);
    }

    // ======================================================
    // 4. TÌM KIẾM
    // ======================================================
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


        // Lọc thời gian
        if ($request->filled('max_time')) {
            $query->where('cooking_time','<=', $request->input('max_time'));
        }

        $recipes = $query->with('categories')
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->get();

        // Format ảnh cho kết quả tìm kiếm luôn
        $formatted = $recipes->map(function($recipe){
             // Nếu cần full data thì dùng formatRecipeData, 
             // còn không thì trả về $recipe gốc (tùy frontend xử lý)
             // Ở đây mình trả về gốc để tránh lỗi cấu trúc trang search
             return $recipe; 
        });

        return response()->json($recipes);
    }

    // ======================================================
    // 5. LẤY CATEGORIES
    // ======================================================
    public function getCategories() {
        return response()->json(\App\Models\Category::all());
    }

    // ======================================================
    // 6. TẠO MÓN ĂN (STORE)
    // ======================================================
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cooking_time' => 'required|integer',
            'difficulty' => 'required|in:Dễ,Trung bình,Khó',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // 'category_ids' => 'required', 
            // 'ingredients' => 'required',
            // 'steps' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // A. Upload ảnh chính
            $imagePath = null;
            if ($request->hasFile('image')) {
                // Lưu file vào thư mục public/recipes
                $path = $request->file('image')->store('recipes', 'public');
                // LƯU Ý: Lưu đường dẫn ngắn gọn vào DB, khi hiển thị mới dùng asset()
                // Nhưng để tương thích với dữ liệu cũ của bạn, mình sẽ lưu tạm tên file
                // $imagePath = $path; 
                // HOẶC theo cách cũ của bạn (lưu full path):
                $imagePath = 'storage/' . $path; // Lưu ý mình bỏ asset() ở đây để tránh cứng domain
            }
            
            $settings = \App\Models\SystemSetting::first();
            $status = ($settings && $settings->auto_approve_recipes) ? 'Published' : 'Draft';
            
            // B. Tạo Recipe
            $recipe = Recipe::create([
                'user_id' => Auth::id() ?? 1, 
                'title' => $request->title,
                'description' => $request->description,
                'cooking_time' => $request->cooking_time,
                'difficulty' => $request->difficulty,
                'image_url' => $imagePath,
                'status' => $status,          
                'views' => 0,
            ]);

            // C. Xử lý Categories
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
            if ($request->has('steps')) {
                $stepsData = $request->steps; 
                // Mẹo: Nếu gửi FormData, steps là mảng các chuỗi JSON nếu không decode khéo
                // Ở đây mình giả định cấu trúc chuẩn
                // Nếu FE gửi steps là string JSON tổng:
                if (is_string($stepsData)) $stepsData = json_decode($stepsData, true);

                foreach ($stepsData as $index => $stepData) {
                    $stepImagePath = null;
                    
                    // Kiểm tra nếu có file ảnh cho bước này
                    if ($request->hasFile("steps.$index.image")) {
                        $file = $request->file("steps.$index.image");
                        $path = $file->store('steps', 'public');
                        $stepImagePath = 'storage/' . $path;
                    }

                    // Content có thể nằm trong mảng hoặc là string
                    $content = is_array($stepData) ? ($stepData['content'] ?? '') : $stepData;

                    Step::create([
                        'recipe_id' => $recipe->recipe_id, // Lấy ID vừa tạo
                        'step_order' => $index + 1,
                        'content' => $content,
                        'image_url' => $stepImagePath
                    ]);
                }
            }

            // F. Log
            Activity::create([
                'user_id'  => Auth::id() ?? 1,
                'username' => Auth::user() ? Auth::user()->full_name : 'Admin',
                'action'   => 'vừa đăng một công thức mới: ' . $recipe->title,
                'type'     => 'recipe'
            ]);

            DB::commit();
            
            return response()->json([
                'message' => $status === 'Published' ? 'Bài viết đã được đăng!' : 'Đang chờ duyệt.',
                'recipe' => $recipe
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // ======================================================
    // 7. ADMIN & DUYỆT BÀI
    // ======================================================
    public function getAdminRecipes()
    {
        $recipes = Recipe::with(['user', 'categories']) // author -> user
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($recipes);
    }

    public function approve($id)
    {
        $recipe = Recipe::where('recipe_id', $id)->firstOrFail();
        $recipe->status = 'Published';
        $recipe->save();
        return response()->json($recipe->load(['user', 'categories']));
    }

    public function toggleStatus($id)
    {
        $recipe = Recipe::where('recipe_id', $id)->firstOrFail();
        $recipe->status = ($recipe->status === 'Published') ? 'Draft' : 'Published';
        $recipe->save();
        return response()->json($recipe->load(['user','categories']));
    }

    // ======================================================
    // 8. YÊU THÍCH
    // ======================================================
    public function toggleFavorite($id) {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        // toggle cần ID của recipe, Laravel tự xử lý bảng trung gian
        $status = $user->favorites()->toggle($id);
        
        return response()->json([
            'is_favorited' => count($status['attached']) > 0,
            'message' => 'Cập nhật bộ sưu tập thành công'
        ]);
    }

    // ======================================================
    // 9. CẬP NHẬT (UPDATE)
    // ======================================================
    public function update(Request $request, $id)
    {
        $recipe = Recipe::where('recipe_id', $id)->first();

        if (!$recipe) return response()->json(['message' => 'Không tìm thấy bài viết'], 404);
        
        if ($recipe->user_id !== Auth::id() && Auth::id() != 1) { // Thêm check admin ID 1 nếu cần
             // return response()->json(['message' => 'Bạn không có quyền sửa bài này'], 403);
        }

        DB::beginTransaction();
        try {
            $recipe->fill($request->only(['title', 'description', 'cooking_time', 'servings', 'difficulty', 'status']));

            // Update ảnh chính
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ
                if ($recipe->image_url && !str_contains($recipe->image_url, 'http')) {
                    $oldPath = str_replace('storage/', '', $recipe->image_url);
                      Storage::disk('public')->delete($oldPath);
                }
                $path = $request->file('image')->store('recipes', 'public');
                $recipe->image_url = 'storage/' . $path;
            }
            $recipe->save();

            // Update Categories
            if ($request->has('category_ids')) {
                $catIds = is_string($request->category_ids) ? json_decode($request->category_ids) : $request->category_ids;
                $recipe->categories()->sync($catIds);
            }

            // Update Ingredients
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

            // Update Steps (Reset và tạo mới)
            if ($request->has('steps')) {
                $recipe->steps()->delete(); 
                $stepsData = is_string($request->steps) ? json_decode($request->steps, true) : $request->steps;
                
                if ($stepsData) {
                    foreach ($stepsData as $index => $stepContent) {
                        $content = is_array($stepContent) ? ($stepContent['content'] ?? '') : $stepContent;
                        Step::create([
                            'recipe_id' => $recipe->recipe_id,
                            'step_order' => $index + 1,
                            'content' => $content
                            // TODO: Logic giữ ảnh cũ hoặc up ảnh mới cho step ở đây cần phức tạp hơn
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

    // ======================================================
    // 10. XÓA BÀI VIẾT (Xóa cứng)
    // ======================================================
    public function destroy($id)
    {
        $recipe = Recipe::where('recipe_id', $id)->first();
        if (!$recipe) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        try {
            // Xóa ảnh
            if ($recipe->image_url && !str_contains($recipe->image_url, 'http')) {
                $relativePath = str_replace('storage/', '', $recipe->image_url);
                Storage::disk('public')->delete($relativePath);
            }
            
            // Các quan hệ hasMany thường setup onDelete('cascade') trong migration
            // Nếu không thì phải xóa tay:
            $recipe->ingredients()->detach();
            $recipe->categories()->detach();
            $recipe->steps()->delete();
            $recipe->reviews()->delete();
            
            $recipe->delete();
            return response()->json(['message' => 'Đã xóa thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi xóa: ' . $e->getMessage()], 500);
        }
    }

    // ======================================================
    // 11. CHUYỂN VÀO THÙNG RÁC (User tự xóa)
    // ======================================================
    public function moveToTrash($id) 
    {
        // Chỉ cho phép xóa bài của chính mình
        $recipe = Recipe::where('recipe_id', $id)
                        ->where('user_id', Auth::id())
                        ->first();
                        
        if ($recipe) {
            Activity::create([
                'user_id' => Auth::id(),
                'username' => Auth::user()->full_name,
                'action' => 'vừa xóa bài viết: ' . $recipe->title,
                'type' => 'delete'
            ]);
            
            // Gọi hàm xóa cứng luôn (hoặc SoftDelete nếu Model có dùng trait SoftDeletes)
            $this->destroy($id);
            
            return response()->json(['message' => 'Đã xóa bài viết']);
        }

        return response()->json(['message' => 'Không tìm thấy hoặc không có quyền'], 403);
    }
}