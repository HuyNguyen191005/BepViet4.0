<?php

namespace App\Http\Controllers;

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
    public function getByCategory($id)
    {
        $category = Category::findOrFail($id);
    
        // Thay ->get() bằng ->paginate(8)
        $recipes = Recipe::whereHas('categories', function($query) use ($id) {
            $query->where('categories.category_id', $id);
        })->with('author')->paginate(9); 
    
        return response()->json([
            'category' => $category,
            'recipes' => $recipes 
        ]);
    }
}