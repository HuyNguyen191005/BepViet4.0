<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use App\Models\ForumComment;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    // 1. Lấy danh sách câu hỏi (Mới nhất lên đầu)
    public function index() {
        return ForumPost::with('user') // Kèm thông tin người đăng
            ->withCount('comments')    // Đếm số câu trả lời
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // 2. Xem chi tiết 1 câu hỏi
    public function show($id) {
        $post = ForumPost::with(['user', 'comments'])->find($id);
        if (!$post) return response()->json(['message' => 'Không tìm thấy'], 404);
        
        $post->increment('views'); // Tự động tăng view
        return response()->json($post);
    }

    // 3. Đăng câu hỏi mới (Cần đăng nhập)
    public function store(Request $request) {
        $request->validate(['title' => 'required', 'content' => 'required']);
        
        $post = ForumPost::create([
            'user_id' => auth()->id(), // Lấy ID người đang đăng nhập
            'title' => $request->title,
            'content' => $request->content
        ]);
        return response()->json($post, 201);
    }

    // 4. Gửi câu trả lời (Cần đăng nhập)
    public function reply(Request $request, $id) {
        $request->validate(['content' => 'required']);
        
        $comment = ForumComment::create([
            'user_id' => auth()->id(),
            'forum_post_id' => $id,
            'content' => $request->content
        ]);
        
        return response()->json($comment->load('user'), 201);
    }
}