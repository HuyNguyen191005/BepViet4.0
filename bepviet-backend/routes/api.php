<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;

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
Route::get('/recipes/{id}', [RecipeController::class, 'show']); // Lấy chi tiết 1 món
// Route cần đăng nhập mới vào được (Test token)
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);
