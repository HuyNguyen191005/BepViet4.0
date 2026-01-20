<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemSetting; // THÊM DÒNG NÀY
use App\Models\Activity;      // THÊM DÒNG NÀY
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller {
    public function getSettings() {
        $settings = SystemSetting::first();
        return response()->json($settings);
    }
    public function updateSettings(Request $request) {
        $settings = SystemSetting::first();
        $data = $request->all();
        
        // Chuyển đổi trạng thái đăng ký từ string sang boolean
        if ($request->has('registration_status')) {
            $data['allow_registration'] = ($request->registration_status === 'open');
        }

        // --- DÒNG QUAN TRỌNG NHẤT BỊ THIẾU ---
        $settings->update($data); // Lưu thực tế vào Database
        // ------------------------------------

        Activity::create([
            'user_id' => auth()->id(),
            'username' => auth()->user()->full_name,
            'action' => 'vừa thay đổi cấu hình vận hành hệ thống',
            'type' => 'settings'
        ]);
        
        return response()->json(['message' => 'Cập nhật thành công']);
    }
}