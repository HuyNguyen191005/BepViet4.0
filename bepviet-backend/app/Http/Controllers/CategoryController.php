<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Activity;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Lấy danh sách kèm số lượng món ăn
    public function index()
    {
        $categories = Category::withCount('recipes')->get();
        return response()->json($categories);
    }

    // Thêm danh mục mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:categories,name',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $imagePath = asset('storage/' . $path);
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'image_url' => $imagePath,
        ]);

        Activity::create([
            'user_id' => auth()->id(),
            'username' => auth()->user()->full_name,
            'action' => 'vừa thêm danh mục mới: ' . $category->name,
            'type' => 'settings'
        ]);

        return response()->json($category, 201);
    }

    // Cập nhật danh mục
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $data = $request->only(['name', 'description']);
        
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($category->image_url) {
                $oldPath = str_replace(asset('storage/'), '', $category->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('categories', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        $category->update($data);

        return response()->json(['message' => 'Cập nhật thành công', 'category' => $category]);
    }

    // Xóa danh mục
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Kiểm tra xem có món ăn nào thuộc danh mục này không để cảnh báo hoặc chặn xóa
        if ($category->recipes()->count() > 0) {
            return response()->json(['message' => 'Không thể xóa danh mục đang có món ăn!'], 400);
        }

        $category->delete();
        return response()->json(['message' => 'Đã xóa danh mục']);
    }
}