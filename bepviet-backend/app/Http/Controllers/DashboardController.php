<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Recipe;
use App\Models\Review;
use App\Models\Activity;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Lấy dữ liệu thống kê từ database
        $totalUsers = User::count();
        $totalRecipes = Recipe::count();
        $totalPosts = Post::count();
        $totalReviews = Review::count();
        
        // Tính trung bình đánh giá, mặc định là 0 nếu chưa có
        $avgRating = Review::avg('rating') ?: 0;

        // Thống kê mới trong ngày
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();
        $newContentToday = Recipe::whereDate('created_at', Carbon::today())->count() 
                         + Post::whereDate('created_at', Carbon::today())->count();

        $stats = [
            'totalUsers' => $totalUsers,
            'newUsersToday' => $newUsersToday,
            'totalPosts' => $totalRecipes + $totalPosts, // Tổng cộng cả công thức và blog
            'newPostsToday' => $newContentToday,
            'totalReviews' => $totalReviews,
            'avgRating' => (float)$avgRating
        ];
    
        // 2. Dữ liệu biểu đồ 7 ngày gần nhất
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $chartData[] = [
                'name' => $date->format('d/m'),
                'user' => User::whereDate('created_at', $date)->count(),
                'post' => Recipe::whereDate('created_at', $date)->count() + Post::whereDate('created_at', $date)->count()
            ];
        }
    
        // 3. Lấy lịch sử hoạt động
        $recentActivities = Activity::orderBy('created_at', 'desc')->take(10)->get();
    
        return response()->json([
            'stats' => $stats,
            'chartData' => $chartData,
            'recentActivities' => $recentActivities
        ]);
    }
}