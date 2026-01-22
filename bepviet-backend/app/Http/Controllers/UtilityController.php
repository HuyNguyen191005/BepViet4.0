<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Post; // Nếu có model Post

class UtilityController extends Controller
{
    // API 1: Lấy món ăn ngẫu nhiên (Tính năng "Hôm nay ăn gì?")
    public function randomRecipe()
    {
        // Lấy 1 món bất kỳ từ DB
        $recipe = Recipe::inRandomOrder()->first();
        
        if (!$recipe) {
            return response()->json(['message' => 'Chưa có món ăn nào'], 404);
        }
        
        return response()->json($recipe);
    }

    // API 2: Thống kê tổng quan (Dùng hiển thị số liệu ở Footer hoặc trang Admin)
    public function systemStats()
    {
        return response()->json([
            'total_users'   => User::count(),
            'total_recipes' => Recipe::count(),
            // 'total_posts'   => Post::count(), // Bỏ comment nếu có bảng posts
            'server_time'   => now()->toDateTimeString()
        ]);
    }

    // API 3: Top 5 thành viên đóng góp tích cực nhất (BXH)
    public function topUsers()
    {
        // Đếm xem user nào có nhiều công thức nhất
        // Yêu cầu: Model User phải có hàm recipes() (hasMany)
        $users = User::withCount('recipes')
                    ->orderBy('recipes_count', 'desc')
                    ->limit(5)
                    ->get();

        return response()->json($users);
    }

    // API 4: Kiểm tra thông tin ứng dụng (About Us)
    public function appInfo()
    {
        return response()->json([
            'app_name' => 'Bếp Việt 4.0',
            'version'  => '1.0.0',
            'author'   => 'Huy Nguyen',
            'support'  => 'admin@bepviet.com',
            'description' => 'Mạng xã hội chia sẻ công thức nấu ăn hàng đầu Việt Nam'
        ]);
    }
    public function getDifficultyLevels()
    {
        return response()->json([
            ['key' => 'de', 'label' => 'Dễ', 'color' => 'green'],
            ['key' => 'trung-binh', 'label' => 'Trung bình', 'color' => 'yellow'],
            ['key' => 'kho', 'label' => 'Khó', 'color' => 'red'],
            ['key' => 'chuyen-nghiep', 'label' => 'Chuyên nghiệp', 'color' => 'purple'],
        ]);
    }

    // API 6: Gợi ý tìm kiếm (Autocomplete)
    // Khi user gõ "Ga", API này trả về 5 tên món bắt đầu bằng "Ga..."
    public function searchSuggestions(Request $request)
    {
        $keyword = $request->query('keyword');

        if (!$keyword) return response()->json([]);

        // Chỉ lấy cột title để nhẹ server
        $suggestions = Recipe::where('title', 'LIKE', "%{$keyword}%")
                             ->select('title', 'slug') 
                             ->limit(5)
                             ->get();

        return response()->json($suggestions);
    }

    // API 7: Health Check (Kiểm tra sức khỏe hệ thống)
    // API này dùng để check xem Server và Database có còn sống không
    public function healthCheck()
    {
        try {
            \DB::connection()->getPdo(); // Thử kết nối DB
            return response()->json([
                'status' => 'ok', 
                'message' => 'Hệ thống hoạt động bình thường',
                'database' => 'connected',
                'timestamp' => now()->timestamp
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Lỗi kết nối cơ sở dữ liệu'
            ], 500);
        }
    }

    // API 8: Lấy danh sách Tag phổ biến (Hard-code giả lập)
    // Giả vờ trả về các hashtag đang hot
    public function trendingTags()
    {
        return response()->json([
            '#monngonmoingay',
            '#healthy',
            '#giamcan',
            '#anvat',
            '#mientay'
        ]);
    }
    public function privacyPolicy()
    {
        return response()->json([
            'policy_url' => 'https://bepviet.com/privacy',
            'terms_url'  => 'https://bepviet.com/terms',
            'last_updated' => '2025-01-01',
            'summary' => 'Chúng tôi cam kết bảo mật thông tin cá nhân của bạn tuyệt đối...'
        ]);
    }
}