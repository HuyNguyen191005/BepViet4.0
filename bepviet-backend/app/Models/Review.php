<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model {
    protected $table = 'reviews';
    protected $primaryKey = 'review_id';

    // Review thuộc về 1 User (để hiện tên người bình luận)
    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
