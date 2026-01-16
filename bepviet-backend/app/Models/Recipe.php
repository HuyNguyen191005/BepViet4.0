<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $table = 'recipes';
    protected $primaryKey = 'recipe_id'; // Khóa chính của bạn

    // protected $fillable = [
    //     'title',
    //     'description',
    //     'cooking_time', // Sửa lại cho đúng tên cột trong ảnh
    //     'servings',     // Số người ăn
    //     'difficulty',
    //     'image_url',
    //     'status',
    //     'views',
    //     'user_id'
    // ];

    // 1. Quan hệ với người đăng (User)
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // 2. Quan hệ với Các bước làm (Steps) - 1 món có nhiều bước
    public function steps()
    {
        // Sắp xếp theo thứ tự step_order
        return $this->hasMany(Step::class, 'recipe_id', 'recipe_id')->orderBy('step_order', 'asc');
    }

    // 3. Quan hệ với Nguyên liệu (Ingredients) - Qua bảng trung gian recipe_ingredients
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients', 'recipe_id', 'ingredient_id')
                    ->withPivot('quantity', 'unit'); // Lấy thêm cột số lượng và đơn vị từ bảng trung gian
    }

    // 4. Quan hệ với Đánh giá (Reviews)
    public function reviews()
    {
        return $this->hasMany(Review::class, 'recipe_id', 'recipe_id')->orderBy('created_at', 'desc');
    }
    // Liên kết n-n với Categories
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'recipe_categories', 'recipe_id', 'category_id');
    }

    // Liên kết 1-n với Reviews
    // public function reviews()
    // {
    //     return $this->hasMany(Review::class, 'recipe_id', 'recipe_id');
    // }

    // Accessor để lấy đường dẫn ảnh đầy đủ (tùy chọn)
    public function getFullImagePathAttribute()
    {
        // Giả sử ảnh lưu trong public/images
        return asset('images/' . $this->image_url);
    }
}