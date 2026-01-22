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
| API ROUTES - BẾP VIỆT 4.0
|--------------------------------------------------------------------------
*/

/* ========================================================================
   1. PUBLIC ROUTES (Không cần đăng nhập)
   ======================================================================== */

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Recipes & Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/recipes', [RecipeController::class, 'getByCategory']);
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/search', [RecipeController::class, 'search']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);

// Blog & Forum
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/posts/{id}/comments', [CommentController::class, 'index']);
Route::get('/forum', [ForumController::class, 'index']);
Route::get('/forum/{id}', [ForumController::class, 'show']);

// Reviews
Route::get('/reviews/{recipeId}', [ReviewController::class, 'index']);


/* ========================================================================
   2. USER ROUTES (Cần Token & Chịu ảnh hưởng bởi Bảo trì)
   ======================================================================== */
Route::middleware(['auth:sanctum', 'check.maintenance'])->group(function () {

    // User Profile
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/user/profile', [UserController::class, 'getProfile']);

    // Shopping List
    Route::post('shopping-list/bulk', [ShoppingListController::class, 'bulkStore']);
    Route::resource('shopping-list', ShoppingListController::class);

    // My Recipes (CRUD)
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::post('/recipes/{id}/update', [RecipeController::class, 'update']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroy']);
    Route::patch('/recipes/{id}/trash', [RecipeController::class, 'moveToTrash']);
    Route::post('/recipes/{id}/favorite', [RecipeController::class, 'toggleFavorite']);

    // Community Interaction (Comment, Review, Forum)
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::post('/posts', [PostController::class, 'store']); // Tạo bài blog cá nhân
    Route::post('/forum', [ForumController::class, 'store']); // Tạo topic
    Route::post('/forum/{id}/comment', [ForumController::class, 'reply']); // Trả lời topic
});


/* ========================================================================
   3. ADMIN ROUTES (Cần Token Admin - Không bị chặn bởi Bảo trì)
   ======================================================================== */
Route::middleware(['auth:sanctum'])->group(function () {

    // Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    // User Management
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::patch('/admin/users/{id}/status', [UserController::class, 'toggleStatus']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

    // Recipe Management (Global)
    Route::get('/admin/recipes', [RecipeController::class, 'getAdminRecipes']);
    Route::patch('/admin/recipes/{id}/approve', [RecipeController::class, 'approve']);
    Route::patch('/admin/recipes/{id}/status', [RecipeController::class, 'toggleStatus']);
    Route::delete('/admin/recipes/{id}', [RecipeController::class, 'destroy']);

    // Category Management
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    // System Settings
    Route::get('/admin/settings', [SettingController::class, 'getSettings']);
    Route::post('/admin/settings', [SettingController::class, 'updateSettings']);
});