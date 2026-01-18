<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Activity; // 2. Thêm cái này để ghi Activity
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth; // 1. Thêm cái này để gọi Auth

class PostController extends Controller
{
    // ... Giữ nguyên hàm index và show ...
    public function index()
    {
        $posts = Post::orderBy('created_at', 'desc')->paginate(7);
        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['message' => 'Bài viết không tồn tại'], 404);
        }
        return response()->json($post);
    }

    // --- SỬA HÀM STORE ---
 public function store(Request $request)
{
    // --- DEBUG: Kiểm tra xem User có đăng nhập được không ---
    if (!auth()->check()) {
        // Nếu vào đây nghĩa là Token gửi lên sai, hoặc Route chưa có middleware
        return response()->json([
            'message' => 'Lỗi xác thực: Bạn chưa đăng nhập hoặc Token không hợp lệ.',
            'debug_user_id' => auth()->id() // Sẽ là null
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
            'user_id' => auth()->id(), // Lấy ID chuẩn từ Token
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'thumbnail' => $thumbnailPath,
            'views' => 0,
        ]);
        // Trong RecipeController.php sau khi $recipe = Recipe::create(...) thành công
       // Sửa $recipe thành $post và type thành 'post'
        Activity::create([
            'user_id' => auth()->id(),
            'username' => auth()->user()->full_name,
            'action' => 'vừa đăng bài viết mới: ' . $post->title, // Dùng $post->title mới đúng
            'type' => 'post' // Chuyển type thành post để hiển thị icon khác nếu cần
        ]);

        return response()->json(['message' => 'Đăng thành công!', 'post' => $post], 201);

    } catch (\Exception $e) {
        \Log::error('Lỗi server: ' . $e->getMessage());
        return response()->json(['message' => 'Lỗi Server: ' . $e->getMessage()], 500);
    }
}
}