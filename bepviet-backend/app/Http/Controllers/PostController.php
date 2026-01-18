<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    // --- 1. HÀM LẤY DANH SÁCH (Đã sửa) ---
    public function index()
    {
        // Thêm with('user') để kèm thông tin người đăng vào mỗi bài viết trong danh sách
        $posts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(7);
            
        return response()->json($posts);
    }

    // --- 2. HÀM LẤY CHI TIẾT (Đã sửa) ---
    public function show($id)
    {
        // Thêm with('user') để lấy thông tin người đăng của bài viết này
        $post = Post::with('user')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Bài viết không tồn tại'], 404);
        }
        return response()->json($post);
    }

    // --- 3. HÀM TẠO BÀI VIẾT (Giữ nguyên logic của bạn) ---
    public function store(Request $request)
    {
        // Kiểm tra đăng nhập
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Lỗi xác thực: Bạn chưa đăng nhập hoặc Token không hợp lệ.',
            ], 401);
        }

        // Validate dữ liệu
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'type' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        try {
            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('posts', 'public');
            }

            // Tạo bài viết
            $post = Post::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'content' => $validated['content'],
                'type' => $validated['type'],
                'thumbnail' => $thumbnailPath,
                'views' => 0,
            ]);

            // Ghi log hoạt động (Activity)
            Activity::create([
                'user_id' => auth()->id(),
                'username' => auth()->user()->full_name, // Đảm bảo bảng users có cột full_name
                'action' => 'vừa đăng bài viết mới: ' . $post->title,
                'type' => 'post'
            ]);

            return response()->json(['message' => 'Đăng thành công!', 'post' => $post], 201);

        } catch (\Exception $e) {
            \Log::error('Lỗi server: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi Server: ' . $e->getMessage()], 500);
        }
    }
}