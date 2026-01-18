<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show($user_id)
    {
        // 1. Tìm user theo id (Lưu ý: Eloquent thường dùng cột 'id' làm khóa chính)
        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 2. Lấy danh sách công thức của user
        // Kèm theo tính toán rating trung bình
        $recipes = $user->recipes()
            ->withAvg('reviews', 'rating') // Cần có quan hệ reviews() trong model Recipe
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Chuẩn bị dữ liệu trả về
        $responseData = [
            'info' => [
                'user_id' => $user->id,
                'full_name' => $user->full_name ?? $user->name, // Fallback nếu DB dùng column name
                
                // Trả về null hoặc tên file trong DB để Frontend tự xử lý ảnh mặc định local
                'avatar' => $user->avatar, 
                'cover_image' => $user->cover_image ?? null, 
                
                'bio' => $user->bio ?? 'Thành viên yêu bếp của Bếp Việt 4.0',
                'badge' => $user->role === 'Admin' ? 'Admin' : 'Masterchef',
            ],
            
            'stats' => [
                'recipes_count' => $recipes->count(),
                'followers' => 1205, // Số liệu giả lập
                'following' => 45
            ],
            
            // 4. Map dữ liệu công thức (QUAN TRỌNG: Phải khớp với cột trong DB Recipes)
            'recipes' => $recipes->map(function($recipe) {
                return [
                    'recipe_id' => $recipe->recipe_id, // ID của món ăn
                    'title' => $recipe->title,
                    'image_url' => $recipe->image_url, // Tên file ảnh (vd: logo.png)
                    
                    // --- THÊM 2 TRƯỜNG NÀY ĐỂ HIỂN THỊ UI ---
                    'cooking_time' => $recipe->cooking_time, // Thời gian nấu
                    'difficulty' => $recipe->difficulty,     // Độ khó
                    // ----------------------------------------

                    'views' => $recipe->views,
                    'rating' => round($recipe->reviews_avg_rating, 1) ?? 0,
                    'created_at' => $recipe->created_at,
                ];
            })
        ];

        return response()->json($responseData);
    }
}