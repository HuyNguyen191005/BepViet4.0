<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'recipes';
    protected $primaryKey = 'recipe_id'; // Khóa chính đúng với DB của bạn

    // Danh sách các cột được phép thêm sửa (Mass Assignment)
    protected $fillable = [
        'title',
        'description',
        'cooking_time', // Khớp với DB
        'difficulty',   // Khớp với DB
        'servings',     // Khớp với DB
        'image_url',    // Tên cột trong DB là image_url
        'status',
        'user_id',      // Khóa ngoại
        'views',        
    ];

    // 1. Quan hệ với người đăng (User)
    // Mặc định User PK là id, nếu bảng users của bạn dùng user_id làm PK thì giữ nguyên tham số thứ 3 là 'user_id'
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
    // Quan trọng: Hàm này cần thiết để Controller dùng được withAvg('reviews', 'rating')
    public function reviews()
    {
        return $this->hasMany(Review::class, 'recipe_id', 'recipe_id')->orderBy('created_at', 'desc');
    }

    // 5. Quan hệ với Danh mục (Categories)
    public function categories() {
        return $this->belongsToMany(Category::class, 'recipe_categories', 'recipe_id', 'category_id');
    }

    // Helper: Lấy đường dẫn ảnh đầy đủ (Optional)
    // Dùng khi bạn muốn gọi $recipe->full_image_path trong code PHP
    public function getFullImagePathAttribute()
    {
        if (!$this->image_url) {
            return asset('default-food.png'); // Ảnh mặc định nếu chưa có
        }
        // Nếu là link online
        if (str_starts_with($this->image_url, 'http')) {
            return $this->image_url;
        }
        // Nếu là file local trong public/
        return asset($this->image_url);
    }
    // app/Models/Recipe.php
// Để đếm xem món này có bao nhiêu lượt like
public function favoritedBy()
{
    return $this->belongsToMany(User::class, 'favorites', 'recipe_id', 'user_id');
}
}