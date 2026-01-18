<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    // Toggle Like (Nếu chưa like thì like, like rồi thì bỏ like)
    public function toggleFavorite($recipeId)
    {
        try {
            // 1. Kiểm tra User
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Bạn chưa đăng nhập (User null)'], 401);
            }

            // 2. Kiểm tra Recipe
            // Lưu ý: Đảm bảo dòng 'use App\Models\Recipe;' đã có ở đầu file
            $recipe = Recipe::find($recipeId);
            if (!$recipe) {
                return response()->json(['message' => 'Không tìm thấy ID món ăn: ' . $recipeId], 404);
            }

            // 3. Thực hiện Toggle
            // Log lại để debug nếu cần
            // \Log::info('User ' . $user->user_id . ' toggling recipe ' . $recipeId);

            $result = $user->favorites()->toggle($recipeId);

            // 4. Trả về kết quả
            if (count($result['attached']) > 0) {
                return response()->json(['status' => 'added', 'message' => 'Đã thêm vào yêu thích']);
            } else {
                return response()->json(['status' => 'removed', 'message' => 'Đã bỏ yêu thích']);
            }

        } catch (\Exception $e) {
            // --- ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT ---
            // Nếu có lỗi, trả về chi tiết lỗi ngay lập tức
            return response()->json([
                'error_message' => $e->getMessage(), // Lỗi gì?
                'file' => $e->getFile(),             // Lỗi ở file nào?
                'line' => $e->getLine()              // Lỗi ở dòng bao nhiêu?
            ], 500);
        }
    }
    // Lấy danh sách món đã thích
    public function getMyFavorites()
    {
        $user = Auth::user();
        
        // Lấy danh sách yêu thích + Tính toán rating trung bình
        $recipes = $user->favorites()
            ->withAvg('reviews', 'rating') // Tính số sao trung bình
            ->orderBy('favorites.created_at', 'desc') // Món mới thích hiện lên đầu
            ->get()
            ->map(function($recipe) {
                // --- MAP DỮ LIỆU CHO KHỚP VỚI FRONTEND ---
                return [
                    'recipe_id' => $recipe->recipe_id ?? $recipe->id, // Xử lý cả 2 trường hợp tên cột
                    'title' => $recipe->title,
                    
                    // Fallback: nếu DB là cột 'image' thì gán vào 'image_url'
                    'image_url' => $recipe->image_url ?? $recipe->image, 
                    
                    'cooking_time' => $recipe->cooking_time,
                    'difficulty' => $recipe->difficulty,
                    'views' => $recipe->views,
                    'rating' => round($recipe->reviews_avg_rating, 1) ?? 0,
                    'created_at' => $recipe->pivot->created_at, // Thời gian mình bấm nút Like
                ];
            });

        return response()->json($recipes);
    }
}