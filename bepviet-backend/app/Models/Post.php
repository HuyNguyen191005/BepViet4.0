<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // 1. Khai báo tên bảng trong Database
    protected $table = 'posts';

    // 2. QUAN TRỌNG: Khai báo khóa chính (Vì bạn dùng post_id chứ không phải id)
    protected $primaryKey = 'post_id';

    // 3. Các cột được phép thêm/sửa dữ liệu
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'thumbnail', // Tên cột ảnh trong DB của bạn
        'type'
    ];
}