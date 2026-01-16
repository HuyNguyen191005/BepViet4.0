<?php

namespace App\Models;
<<<<<<< HEAD
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    protected $table = 'categories';
    protected $primaryKey = 'category_id'; // Do bảng của bạn dùng category_id
    public $timestamps = false;

    public function recipes() {
        return $this->belongsToMany(Recipe::class, 'recipe_categories', 'category_id', 'recipe_id');
    }
=======

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Khai báo tên bảng nếu tên bảng của bạn không phải là 'categories'
    // protected $table = 'categories'; 

    // Khai báo khóa chính (thường là id, nếu bạn dùng category_id thì sửa lại)
    protected $primaryKey = 'category_id'; 
>>>>>>> 2acc1d928f96f794e1c4f5ecba4ecabdc5759f7d
}