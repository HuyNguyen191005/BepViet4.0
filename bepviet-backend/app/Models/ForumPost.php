<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumPost extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'title', 'content', 'views'];

    // Quan hệ với User (Người đăng)
    public function user() {
        return $this->belongsTo(User::class);
    }
    // Quan hệ với Comment (Các câu trả lời)
    public function comments() {
        return $this->hasMany(ForumComment::class)->with('user'); // Lấy luôn thông tin người trả lời
    }
}
