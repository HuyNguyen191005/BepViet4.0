<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// --- BẮT BUỘC PHẢI CÓ CÁC DÒNG NÀY ---
use App\Models\Recipe;     
use App\Models\Review;     
use App\Models\Collection; 
// -------------------------------------

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'user_id'; // Vì bạn dùng user_id

    protected $fillable = [
        'username', 'email', 'password_hash', 'full_name', 'avatar', 
        'cover_image', 'bio', 'role'
    ];

    protected $hidden = ['password_hash', 'remember_token'];

    // Auth Password
    public function getAuthPassword() {
        return $this->password_hash;
    }

    // --- Mối quan hệ Favorites ---
    public function favorites()
    {
        // Tham số thứ 3: 'user_id' (khóa của bảng users trong bảng favorites)
        // Tham số thứ 4: 'recipe_id' (khóa của bảng recipes trong bảng favorites)
        return $this->belongsToMany(Recipe::class, 'favorites', 'user_id', 'recipe_id')
                    ->withTimestamps();
    }
    
    // Các quan hệ khác giữ nguyên...
    public function recipes() { return $this->hasMany(Recipe::class, 'user_id', 'user_id'); }
    public function collections() { return $this->hasMany(Collection::class, 'user_id'); }
}