<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';      // Tên bảng
    protected $primaryKey = 'user_id'; // Khóa chính tùy chỉnh (thay vì id)

    // Các cột được phép thêm/sửa (Mass Assignment)
    protected $fillable = [
        'username', 
        'email', 
        'password_hash', 
        'full_name', 
        'avatar', 
        'cover_image', // Thêm cột ảnh bìa
        'bio',         // Thêm cột giới thiệu
        'role'
    ];

    // Các cột bị ẩn khi trả về JSON (Bảo mật)
    protected $hidden = [
        'password_hash', 
        'remember_token',
    ];

    // Định dạng dữ liệu tự động
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    // --- CẤU HÌNH AUTHENTICATION ---

    // Laravel mặc định tìm cột 'password', ta trỏ nó về 'password_hash'
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // --- CÁC MỐI QUAN HỆ (RELATIONSHIPS) ---

    // 1. Một User có nhiều công thức nấu ăn (Recipes)
    public function recipes()
    {
        // tham số 2: khóa ngoại bên bảng recipes (user_id)
        // tham số 3: khóa chính bên bảng users (user_id)
        return $this->hasMany(Recipe::class, 'user_id', 'user_id');
    }

    // 2. Một User có thể viết nhiều đánh giá (Reviews)
    public function reviews()
    {
        return $this->hasMany(Review::class, 'user_id', 'user_id');
    }
    // app/Models/User.php
public function favorites()
{
    return $this->belongsToMany(Recipe::class, 'favorites', 'user_id', 'recipe_id')->withTimestamps();
}

public function collections()
{
    return $this->hasMany(Collection::class, 'user_id');
}
}