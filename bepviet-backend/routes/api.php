<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\Api\ProfileController;

// --- QUAN TRỌNG: Phải thêm 2 dòng này thì mới chạy được chức năng Tim ---
use App\Http\Controllers\FavoriteController; 
use App\Http\Controllers\CollectionController;
// ------------------------------------------------------------------------

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- 1. Route CÔNG KHAI (Không cần đăng nhập) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/recipes', [RecipeController::class, 'index']); // Lấy danh sách
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']); // Lấy chi tiết 1 món
Route::post('/recipes', [RecipeController::class, 'store']); // (Lưu ý: Thường tạo món phải cần đăng nhập, bạn cân nhắc chuyển xuống dưới)

Route::get('/categories', [RecipeController::class, 'getCategories']); // Lấy danh mục
Route::get('/categories/{id}/recipes', [RecipeController::class, 'getByCategory']); // Lấy món theo danh mục

Route::get('/profile/{id}', [ProfileController::class, 'show']);


// --- 2. Route CẦN ĐĂNG NHẬP (Có Token mới vào được) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Lấy thông tin user hiện tại
    Route::get('/user', [AuthController::class, 'me']);

    // --- CHỨC NĂNG YÊU THÍCH (TIM) ---
    // Toggle: Đã thích thì bỏ thích, chưa thích thì thêm thích
    Route::post('/recipes/{id}/favorite', [FavoriteController::class, 'toggleFavorite']);
    Route::get('/my-favorites', [FavoriteController::class, 'getMyFavorites']);
    
    // --- CHỨC NĂNG BỘ SƯU TẬP ---
    Route::resource('collections', CollectionController::class);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recipes/{id}/favorite', [FavoriteController::class, 'toggleFavorite']);
    Route::get('/my-favorites', [FavoriteController::class, 'getMyFavorites']);
});

Route::middleware('auth:sanctum')->group(function () {
    
    // ... các route cũ (store, favorite...)

    // --- THÊM DÒNG NÀY ---
    Route::get('/my-recipes', [RecipeController::class, 'getMyRecipes']);
    // ---------------------
});