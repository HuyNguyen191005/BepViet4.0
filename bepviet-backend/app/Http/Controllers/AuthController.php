<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request) {
        // Validate dữ liệu gửi lên
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm user theo email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra password (dùng Hash::check để so sánh với password_hash)
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
    public function register(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $fields = $request->validate([
            'username' => 'required|string|unique:users,username', // Username không được trùng
            'full_name' => 'required|string',
            'email' => 'required|string|email|unique:users,email', // Email không được trùng
            'password' => 'required|string|confirmed|min:6', // 'confirmed' bắt buộc frontend phải gửi thêm password_confirmation
        ]);

        // 2. Tạo user mới
        $user = User::create([
            'username' => $fields['username'],
            'full_name' => $fields['full_name'],
            'email' => $fields['email'],
            'password_hash' => Hash::make($fields['password']), // Mã hóa password lưu vào cột password_hash
            'role' => 'User', // Mặc định là User thường
        ]);

        // 3. Tạo token ngay lập tức (để đăng ký xong là đăng nhập luôn)
        $token = $user->createToken('authToken')->plainTextToken;

        // 4. Trả về kết quả
        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'message' => 'Đăng ký tài khoản thành công!'
        ], 201);
    }
    // API lấy thông tin user hiện tại (để test token)
    public function me(Request $request) {
        return $request->user();
    }
}