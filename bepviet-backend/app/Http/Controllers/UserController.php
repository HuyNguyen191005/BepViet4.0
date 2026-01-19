<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Step; // Đảm bảo đã có Model Step
use App\Models\User;
use Illuminate\Support\Facades\DB; // <-- QUAN TRỌNG: Để dùng Transaction
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Hàm lấy thông tin người dùng theo ID
    public function getUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }

        return response()->json($user);
    }
    public function index() {
        // Sử dụng where để chỉ lấy những người dùng có role là 'User'
        $users = User::where('role', 'User')->get(); 

        return response()->json($users);
    }
    // UserController.php
    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->update($request->only(['full_name', 'email', 'role', 'status']));
        return response()->json(['message' => 'Cập nhật thành công', 'user' => $user]);
    }

    public function toggleStatus($id) {
        $user = User::findOrFail($id);
        // Đảo ngược trạng thái giữa 'active' và 'locked'
        $user->status = ($user->status === 'active' || $user->status === '') ? 'locked' : 'active';
        $user->save();
        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'user' => $user]);
    }

    public function destroy($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Xóa tài khoản thành công']);
    }
    
    public function getProfile() {
        // $user = auth()->user(); // Lấy user hiện tại thông qua Token
    
        // // Lấy danh sách công thức của user này kèm đếm số lượng
        // $recipes = \App\Models\Recipe::where('user_id', $user->user_id)
        //             ->orderBy('created_at', 'desc')
        //             ->get();
    
        // return response()->json([
        //     'user' => $user,
        //     'recipes' => $recipes,
        //     'recipes_count' => $recipes->count(),
        //     'posts_count' => \App\Models\Post::where('user_id', $user->user_id)->count(),
        //     'total_views' => $recipes->sum('views'), // Tính tổng lượt xem món ăn
        // ]);
    $user = auth()->user();
    $recipes = \App\Models\Recipe::where('user_id', $user->user_id)
    ->orderBy('created_at', 'desc')
    ->get();
    
    // Lấy danh sách món ăn mà user đã nhấn LIKE
    $favoriteRecipes = $user->favorites()->orderBy('favorites.created_at', 'desc')->get();

    return response()->json([
        'user' => $user,
        'recipes' => $recipes,
        'favorite_recipes' => $favoriteRecipes, // Gửi dữ liệu này về
        'recipes_count' => $recipes->count(),
        'favorites_count' => $favoriteRecipes->count(),
        'posts_count' => \App\Models\Post::where('user_id', $user->user_id)->count(),
        'total_views' => $recipes->sum('views')
    ]);
    }
}

