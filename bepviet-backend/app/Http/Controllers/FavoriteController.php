<?php

// app/Http/Controllers/FavoriteController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    // Toggle Like (Nếu chưa like thì like, like rồi thì bỏ like)
    public function toggleFavorite($recipeId)
    {
        $user = Auth::user(); // Lấy user đang đăng nhập
        $recipe = Recipe::findOrFail($recipeId);

        // Kiểm tra xem đã like chưa
        $exists = $user->favorites()->where('favorites.recipe_id', $recipeId)->exists();

        if ($exists) {
            $user->favorites()->detach($recipeId); // Bỏ like
            return response()->json(['status' => 'removed', 'message' => 'Đã bỏ thích']);
        } else {
            $user->favorites()->attach($recipeId); // Like
            return response()->json(['status' => 'added', 'message' => 'Đã thêm vào yêu thích']);
        }
    }

    // Lấy danh sách món đã thích của user
    public function getMyFavorites()
    {
        $recipes = Auth::user()->favorites()->with('author')->get();
        return response()->json($recipes);
    }
}