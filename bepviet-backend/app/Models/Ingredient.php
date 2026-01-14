<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model {
    protected $table = 'ingredients';
    protected $primaryKey = 'ingredient_id';
    public $timestamps = false;
}
