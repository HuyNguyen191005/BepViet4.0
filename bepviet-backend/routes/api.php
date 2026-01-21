<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ShoppingListController;
/*
|--------------------------------------------------------------------------
| API Routes - Hệ thống Bếp Việt 4.0
|--------------------------------------------------------------------------
*/

// --- NHÓM 1: ROUTE CÔNG KHAI (Ai cũng xem được, không bị chặn bởi bảo trì) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/recipes', [RecipeController::class, 'getByCategory']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/posts/{id}/comments', [CommentController::class, 'index']);
Route::get('/reviews/{recipeId}', [ReviewController::class, 'index']);
// Ai cũng xem được
Route::get('/forum', [ForumController::class, 'index']);
Route::get('/forum/{id}', [ForumController::class, 'show']);
// Route thêm nhiều món
Route::post('shopping-list/bulk', [ShoppingListController::class, 'bulkStore']);

// Route xem, xóa, sửa
Route::resource('shopping-list', ShoppingListController::class);
// --- NHÓM 2: ROUTE NGƯỜI DÙNG (Cần Token & Bị chặn khi bật Bảo trì) ---
// Nhóm này áp dụng 'check.maintenance' để chặn User khi Admin đang sửa hệ thống
Route::middleware(['auth:sanctum', 'check.maintenance'])->group(function () {
    
    // Thông tin cá nhân
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/user/profile', [UserController::class, 'getProfile']);
    
    // Tương tác bài viết (Thích, Bình luận, Đánh giá)
    Route::post('/recipes/{id}/favorite', [RecipeController::class, 'toggleFavorite']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/comments', [CommentController::class, 'store']);
    
    // Quản lý bài viết cá nhân
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::post('/recipes/{id}/update', [RecipeController::class, 'update']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroy']);
    Route::patch('/recipes/{id}/trash', [RecipeController::class, 'moveToTrash']);
    
    // Quản lý Blog cá nhân
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/forum', [ForumController::class, 'store']);
    Route::post('/forum/{id}/comment', [ForumController::class, 'reply']);
});


// --- NHÓM 3: ROUTE QUẢN TRỊ (Cần Token Admin & KHÔNG BỊ CHẶN khi bảo trì) ---
// Admin cần vào được đây để Tắt/Bật chế độ bảo trì hoặc quản lý dữ liệu
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Dashboard & Thống kê
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);
    
    // Quản lý Người dùng
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::patch('/admin/users/{id}/status', [UserController::class, 'toggleStatus']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    
    // Quản lý Công thức toàn hệ thống
    Route::get('/admin/recipes', [RecipeController::class, 'getAdminRecipes']);
    Route::patch('/admin/recipes/{id}/approve', [RecipeController::class, 'approve']);
    Route::patch('/admin/recipes/{id}/status', [RecipeController::class, 'toggleStatus']);
    Route::delete('/admin/recipes/{id}', [RecipeController::class, 'destroy']); // Xóa vĩnh viễn
    
    // Cài đặt hệ thống (Duyệt bài, Bảo trì, Cấu hình kỹ thuật)
    Route::get('/admin/settings', [SettingController::class, 'getSettings']);
    Route::post('/admin/settings', [SettingController::class, 'updateSettings']);

    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']); // Dùng POST + _method PUT cho ảnh
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
});