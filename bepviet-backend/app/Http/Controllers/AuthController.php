<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 1. ĐĂNG KÝ
    public function register(Request $request)
    {
        $settings = \App\Models\SystemSetting::first();

    // Kiểm tra Quyền đăng ký
        if (!$settings->allow_registration) {
            return response()->json([
                'message' => 'Hiện tại hệ thống đã đóng đăng ký thành viên mới. Vui lòng quay lại sau.'
            ], 403);
        }
        // Validate dữ liệu đầu vào với luật tùy chỉnh
        $fields = $request->validate([
            'username' => [
                'required',
                'string',
                'unique:users,username',
               
            ],
           'full_name' => [
            'required',
            'string',
            'regex:/^[^0-9]+$/' // Luật: Chuỗi không được chứa số
        ],
            'email' => 'required|string|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'confirmed', // Bắt buộc Frontend phải gửi kèm field 'password_confirmation'
                'min:6',     // 👈 Luật: Tối thiểu 6 ký tự
                'regex:/[A-Z]/' // 👈 Luật: Phải chứa ít nhất 1 chữ hoa
            ],
        ], [
            // Tùy chỉnh thông báo lỗi tiếng Việt trả về cho Frontend
            'full_name.regex' => 'Họ và tên không được chứa số.',
            'username.unique' => 'Tên đăng nhập này đã tồn tại.',
            'email.unique' => 'Email này đã được sử dụng.',
            'password.confirmed' => 'Mật khẩu nhập lại không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.regex' => 'Mật khẩu phải chứa ít nhất 1 chữ cái in hoa.',
        ]);

        // Tạo user mới
        $user = User::create([
            'username' => $fields['username'],
            'full_name' => $fields['full_name'],
            'email' => $fields['email'],
            // Lưu ý: Cột trong DB bạn là password_hash nên phải gán đúng tên
            'password_hash' => Hash::make($fields['password']), 
            'role' => 'User', 
        ]);
        Activity::create([
            'user_id' => $user->user_id,
            'username' => $user->full_name,
            'action' => 'vừa đăng ký tài khoản mới',
            'type' => 'user'
        ]);

        // 👇 THAY ĐỔI: Không tạo token nữa.
        // Chỉ trả về thông báo thành công để Frontend chuyển trang Login.
        return response()->json([
            'message' => 'Đăng ký thành công! Vui lòng đăng nhập.',
            'user' => $user
        ], 201);

        
    }

    // 2. ĐĂNG NHẬP
    public function login(Request $request) {
        // 1. Validate dữ liệu đầu vào trước
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tìm user và kiểm tra mật khẩu
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Tài khoản hoặc mật khẩu không đúng!'
            ], 401);
        }

        // 3. KIỂM TRA BẢO TRÌ: Sau khi đã biết User đó là ai
        $settings = \App\Models\SystemSetting::first();
        
        if ($settings && $settings->maintenance_mode) {
            // Nếu ĐANG BẢO TRÌ mà người đăng nhập KHÔNG PHẢI Admin thì mới chặn
            if ($user->role !== 'Admin') {
                return response()->json([
                    'message' => 'Hệ thống đang bảo trì. Vui lòng quay lại sau 15 phút.'
                ], 503);
            }
        }

        // 4. Nếu là Admin hoặc hệ thống không bảo trì thì cho phép tạo Token
        $token = $user->createToken('authToken')->plainTextToken;
        
        Activity::create([
            'user_id' => $user->user_id,
            'username' => $user->full_name,
            'action' => 'vừa đăng nhập vào hệ thống',
            'type' => 'user'
        ]);

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'user' => $user
        ], 200);
    }

    // API lấy thông tin user hiện tại (để test)
    public function me(Request $request) {
        return $request->user();
    }
}