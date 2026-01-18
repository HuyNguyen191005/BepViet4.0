<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'recipes';
    protected $primaryKey = 'recipe_id'; // Khóa chính đúng với DB của bạn

    // --- SỬA LỖI TẠI ĐÂY ---
    // Dòng này tắt chế độ tự động điền created_at và updated_at của Laravel
    // Giúp sửa lỗi "Column not found: updated_at"
    public $timestamps = false;
    // -----------------------

    // Danh sách các cột được phép thêm sửa (Mass Assignment)
    protected $fillable = [
        'title',
        'description',
        'cooking_time', 
        'difficulty',   
        'servings',     
        'image_url',    
        'status',
        'user_id',      
        'views',        
        'created_at' // Nếu bạn muốn tự lưu thời gian tạo, hãy thêm dòng này vào fillable
    ];

    // 1. Quan hệ với người đăng (User)
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // 2. Quan hệ với Các bước làm (Steps)
    public function steps()
    {
        return $this->hasMany(Step::class, 'recipe_id', 'recipe_id')->orderBy('step_order', 'asc');
    }

    // 3. Quan hệ với Nguyên liệu (Ingredients)
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients', 'recipe_id', 'ingredient_id')
                    ->withPivot('quantity', 'unit'); 
    }

    // 4. Quan hệ với Đánh giá (Reviews)
    public function reviews()
    {
        return $this->hasMany(Review::class, 'recipe_id', 'recipe_id')->orderBy('created_at', 'desc');
    }

    // 5. Quan hệ với Danh mục (Categories)
    public function categories() {
        return $this->belongsToMany(Category::class, 'recipe_categories', 'recipe_id', 'category_id');
    }

    // 6. Quan hệ Likes/Favorites
    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'recipe_id', 'user_id');
    }

    // Helper: Lấy đường dẫn ảnh đầy đủ
    public function getFullImagePathAttribute()
    {
        if (!$this->image_url) {
            return asset('default-food.png'); 
        }
        if (str_starts_with($this->image_url, 'http')) {
            return $this->image_url;
        }
        return asset($this->image_url);
    }

    
}