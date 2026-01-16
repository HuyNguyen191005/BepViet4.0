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
    // // Thêm dòng này để Laravel luôn đính kèm link ảnh đầy đủ khi trả về JSON
    // protected $appends = ['full_image_path'];

    // // Hàm này sẽ tự động tạo ra link ảnh đầy đủ
    // public function getFullImagePathAttribute()
    // {
    //     // Nếu trong DB chưa có ảnh, trả về ảnh mặc định (bạn có thể thay link khác)
    //     if (!$this->image_url) {
    //         return 'https://via.placeholder.com/640x480.png/00cc77?text=No+Image';
    //     }

    //     // Nếu link đã có http rồi (ảnh lấy trên mạng) thì giữ nguyên
    //     if (str_starts_with($this->image_url, 'http')) {
    //         return $this->image_url;
    //     }

    //     // Trả về link đầy đủ từ server của bạn
    //     // Ví dụ: http://localhost:8000/storage/logo.png
    //     return asset('storage/' . $this->image_url);
    // }
}