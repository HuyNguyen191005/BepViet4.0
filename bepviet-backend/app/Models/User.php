<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Khai báo tên bảng và khóa chính
    protected $table = 'users';
    protected $primaryKey = 'user_id'; 
    public $incrementing = true;

    // 2. Các cột được phép thêm dữ liệu
    protected $fillable = [
        'username',
        'email',
        'password_hash', // Lưu ý: tên cột trong DB của bạn
        'full_name',
        'avatar',
        'role',
        'status',
    ];

    // 3. Ẩn các cột nhạy cảm khi trả về API
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    // 4. Quan trọng: Chỉ định cột mật khẩu cho Laravel biết
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
    public function favorites() {
        return $this->belongsToMany(Recipe::class, 'favorites', 'user_id', 'recipe_id');
        
    }
}