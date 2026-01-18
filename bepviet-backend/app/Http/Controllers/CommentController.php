<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Lấy danh sách bình luận của 1 bài viết
    public function index($postId)
    {
        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id') // Chỉ lấy comment cha
            ->with(['user', 'children.user']) // Lấy thông tin user và các câu trả lời
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    // Gửi bình luận mới
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|integer|exists:posts,post_id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|integer|exists:comments,comment_id'
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $request->post_id,
            'content' => $request->content,
            'parent_id' => $request->parent_id ?? null
        ]);

        // Load thông tin user để trả về frontend hiển thị ngay
        $comment->load('user:user_id,full_name,avatar');

        return response()->json($comment, 201);
    }
}