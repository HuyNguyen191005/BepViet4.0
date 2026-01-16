<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 1. ĐĂNG KÝ
    public function register(Request $request)
    {
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

        // 👇 THAY ĐỔI: Không tạo token nữa.
        // Chỉ trả về thông báo thành công để Frontend chuyển trang Login.
        return response()->json([
            'message' => 'Đăng ký thành công! Vui lòng đăng nhập.',
            'user' => $user
        ], 201);
    }

    // 2. ĐĂNG NHẬP
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra password
        // Lưu ý: So sánh password gửi lên với cột 'password_hash' trong DB
        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Tài khoản hoặc mật khẩu không đúng!'
            ], 401);
        }

        // Tạo token
        $token = $user->createToken('authToken')->plainTextToken;

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