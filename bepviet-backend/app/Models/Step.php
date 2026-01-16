<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    protected $table = 'steps';
    protected $primaryKey = 'step_id';
    public $timestamps = false; // Bảng này không có created_at/updated_at
//    protected $appends = ['full_step_image'];

    // public function getFullStepImageAttribute()
    // {
    //     // Giả sử cột lưu ảnh trong bảng steps tên là 'image' (bạn kiểm tra lại trong DB nhé)
    //     // Nếu tên cột là 'image_url' thì sửa $this->image thành $this->image_url
    //     if (!$this->image) { 
    //         return null; // Không có ảnh thì thôi
    //     }

    //     if (str_starts_with($this->image, 'http')) {
    //         return $this->image;
    //     }

    //     return asset('storage/' . $this->image);
    // }
}
