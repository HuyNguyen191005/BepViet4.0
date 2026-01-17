<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    protected $table = 'steps';
    protected $primaryKey = 'step_id';
    public $timestamps = false; // Bảng này không có created_at/updated_at
    protected $fillable = [
        'recipe_id',
        'step_order',
        'content',
        'image_url',
    ];
}
