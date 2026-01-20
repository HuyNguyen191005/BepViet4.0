<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Lấy danh sách bình luận của 1 công thức
    public function index($recipeId)
    {
        $reviews = Review::where('recipe_id', $recipeId)
            ->whereNull('parent_id') // Chỉ lấy bình luận Cha
            ->with(['user', 'children.user']) // Lấy user của cha VÀ user của các con (children.user)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    // Lưu bình luận mới (Hoặc trả lời)
    public function store(Request $request)
    {
        // 1. Cấu hình Validate động
        $rules = [
            'recipe_id' => 'required|integer', // Tốt nhất nên thêm |exists:recipes,recipe_id
            'content'   => 'required|string|max:500',
            'parent_id' => 'nullable|integer|exists:reviews,review_id', // Kiểm tra ID cha có tồn tại không
        ];

        // Nếu CÓ parent_id (là trả lời) -> Rating được phép null
        // Nếu KHÔNG CÓ parent_id (là đánh giá gốc) -> Rating bắt buộc 1-5 sao
        if ($request->has('parent_id') && $request->parent_id != null) {
            $rules['rating'] = 'nullable';
        } else {
            $rules['rating'] = 'required|integer|min:1|max:5';
        }

        // Validate dữ liệu
        $validated = $request->validate($rules);

        // 2. Tạo review
        $review = Review::create([
            'user_id'   => Auth::id(),
            'recipe_id' => $validated['recipe_id'],
            // Nếu là reply thì rating = null, ngược lại lấy từ request
            'rating'    => isset($validated['rating']) ? $validated['rating'] : null,
            'content'   => $validated['content'],
            'parent_id' => $request->parent_id ?? null,
        ]);
        // 3. Ghi log hoạt động nếu là đánh giá gốc (không có parent_id)
        $recipe = \App\Models\Recipe::find($request->recipe_id);
        \App\Models\Activity::create([
            'user_id' => Auth::id(),
            'username' => Auth::user()->full_name,
            'action' => 'vừa đánh giá ' . $request->rating . ' sao cho món: ' . $recipe->title,
            'type' => 'review' // Loại mới: review
        ]);
        // 3. Load thêm thông tin user để trả về frontend hiển thị ngay
        $review->load('user:user_id,full_name,avatar');

        return response()->json($review, 201);
    }
}