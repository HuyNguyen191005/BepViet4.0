<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    // Khai báo tên bảng và khóa chính (do bảng của bạn dùng review_id)
    protected $table = 'reviews';
    protected $primaryKey = 'review_id';

    protected $fillable = [
        'user_id',
        'recipe_id',
        'rating',
        'content',
        'parent_id'
    ];
    const UPDATED_AT = null;
    // Relationship: Để lấy tên người bình luận từ bảng users
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function children()
    {
        return $this->hasMany(Review::class, 'parent_id')->with('user'); // Lấy luôn thông tin người trả lời
    }
}