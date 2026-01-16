<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Khai báo tên bảng nếu tên bảng của bạn không phải là 'categories'
    // protected $table = 'categories'; 

    // Khai báo khóa chính (thường là id, nếu bạn dùng category_id thì sửa lại)
    protected $primaryKey = 'category_id'; 
}