<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    use HasFactory;

    // 1. Chỉ định tên bảng chính xác
    protected $table = 'shopping_list';

    // 2. Khai báo các cột được phép thêm dữ liệu
    protected $fillable = [
        'user_id',
        'ingredient_name', // Tên nguyên liệu
        'quantity',        // Số lượng (VD: 500g)
        'is_bought'        // Trạng thái đã mua (0 hoặc 1)
    ];

    // Tắt tính năng tự động timestamp nếu bảng của bạn không có cột created_at/updated_at
    // Nếu bảng có created_at/updated_at thì xóa dòng dưới đi
    public $timestamps = false; 
}