<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    // 1. Lấy danh sách đi chợ của user
    public function index() {
        // Giả sử user_id = 1 nếu chưa login, hoặc dùng auth()->id()
        $userId = auth()->id() ?? 1; 
        return ShoppingList::where('user_id', $userId)->get();
    }

    // 2. Thêm nhiều món cùng lúc (Từ trang Chi tiết công thức)
    public function bulkStore(Request $request) {
        $request->validate([
            'items' => 'required|array',
        ]);

        $userId = auth()->id() ?? 1;
        $data = [];

        foreach ($request->items as $item) {
            $data[] = [
                'user_id' => $userId,
                'ingredient_name' => $item['name'], // Map với cột ingredient_name
                'quantity' => $item['quantity'] ?? null, // Map với cột quantity
                'is_bought' => 0,
                // Nếu bảng có created_at thì thêm dòng này: 'created_at' => now(), 'updated_at' => now()
            ];
        }

        ShoppingList::insert($data);

        return response()->json(['message' => 'Đã thêm vào giỏ thành công!']);
    }

    // 3. Xóa món
    public function destroy($id) {
        ShoppingList::destroy($id);
        return response()->json(['message' => 'Đã xóa']);
    }

    // 4. Cập nhật trạng thái (Đã mua/Chưa mua)
    public function update(Request $request, $id) {
        $item = ShoppingList::find($id);
        if ($item) {
            $item->is_bought = $request->is_bought;
            $item->save();
        }
        return response()->json($item);
    }
}