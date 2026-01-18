<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model {
    protected $table = 'activities';
    protected $fillable = ['user_id', 'username', 'action', 'type'];
    public $timestamps = false; // Vì ta dùng created_at mặc định của SQL
}