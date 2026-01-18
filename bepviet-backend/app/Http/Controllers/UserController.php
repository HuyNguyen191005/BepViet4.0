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
}

