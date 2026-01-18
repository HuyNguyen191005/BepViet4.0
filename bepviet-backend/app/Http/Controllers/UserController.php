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
        return User::all(); // Hoặc User::paginate(10);
    }
}

