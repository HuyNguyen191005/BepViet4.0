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


// Route công khai
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/recipes', [RecipeController::class, 'index']); // Lấy danh sách
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/categories', [RecipeController::class, 'getCategories']); // API lấy danh mục cho sidebar
Route::get('/recipes/{id}', [RecipeController::class, 'show']); // Lấy chi tiết 1 món
Route::get('/categories/{id}/recipes', [RecipeController::class, 'getByCategory']); // Lấy món theo danh mục
Route::get('/posts/{id}/comments', [CommentController::class, 'index']);


// Route cần đăng nhập mới vào được (Test token)
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);


Route::get('/posts', [PostController::class, 'index']);
Route::get('/reviews/{recipeId}', [ReviewController::class, 'index']);
// Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [App\Http\Controllers\PostController::class, 'show']);

// Các API cần đăng nhập (Phải có Token mới vào được)
Route::middleware('auth:sanctum')->group(function () { 
    
    // API Đăng bài nằm trong này mới lấy được auth()->id()
    
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::post('/posts', [PostController::class, 'store']); 
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user/profile', [UserController::class, 'getProfile']);
        Route::post('/recipes/{id}/favorite', [RecipeController::class, 'toggleFavorite']);
        // ... các route khác ...
    });
});


Route::get('/admin/users', [UserController::class, 'index']);
// api.php
// Thêm các route sau dưới route lấy danh sách user
Route::put('/admin/users/{id}', [UserController::class, 'update']); // Sửa thông tin
Route::patch('/admin/users/{id}/status', [UserController::class, 'toggleStatus']); // Khóa/Mở khóa
Route::delete('/admin/users/{id}', [UserController::class, 'destroy']); // Xóa tài khoản

Route::get('/admin/dashboard', [DashboardController::class, 'index']);
Route::get('/admin/recipes', [RecipeController::class, 'getAdminRecipes']);

// Route duyệt bài (Cập nhật status sang 'Published')
Route::patch('/admin/recipes/{id}/approve', [RecipeController::class, 'approve']); 
// Route xóa bài
Route::delete('/admin/recipes/{id}', [RecipeController::class, 'destroy']);
// Thêm route thay đổi trạng thái bài viết
Route::patch('/admin/recipes/{id}/status', [RecipeController::class, 'toggleStatus']);
