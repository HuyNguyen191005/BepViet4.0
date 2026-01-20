<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model {
    protected $table = 'sys_settings';
    protected $fillable = [
        'maintenance_mode', 
        'auto_approve_recipes', 
        'allow_registration',
        'site_name',
        'hotline',
        'support_email',
        'footer_copyright',
        'max_upload_size',
        'items_per_page',
        'session_timeout',
        'max_images_per_recipe',
        'max_ingredients_per_recipe'
    ];
}

