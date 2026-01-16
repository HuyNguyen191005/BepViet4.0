<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;

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
}