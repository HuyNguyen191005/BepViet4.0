<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    protected $table = 'categories';
    protected $primaryKey = 'category_id'; // Do bảng của bạn dùng category_id
    public $timestamps = false;

    public function recipes() {
        return $this->belongsToMany(Recipe::class, 'recipe_categories', 'category_id', 'recipe_id');
    }
}