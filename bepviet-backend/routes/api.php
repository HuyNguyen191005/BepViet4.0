<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;

use App\Http\Controllers\UserController;


use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route công khai
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/recipes', [RecipeController::class, 'index']); // Lấy danh sách
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/categories', [RecipeController::class, 'getCategories']); // API lấy danh mục cho sidebar
Route::get('/recipes/{id}', [RecipeController::class, 'show']); // Lấy chi tiết 1 món
Route::get('/categories/{id}/recipes', [RecipeController::class, 'getByCategory']); // Lấy món theo danh mục
Route::get('/admin/users', [UserController::class, 'index']);

Route::post('/recipes', [RecipeController::class, 'store']);
// Route cần đăng nhập mới vào được (Test token)
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);

Route::get('/posts', [PostController::class, 'index']);
// Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [App\Http\Controllers\PostController::class, 'show']);
 Route::post('/recipes', [RecipeController::class, 'store']);

// Các API cần đăng nhập (Phải có Token mới vào được)
Route::middleware('auth:sanctum')->group(function () { 
    
    // API Đăng bài nằm trong này mới lấy được auth()->id()
    Route::post('/posts', [PostController::class, 'store']); 
    
});

