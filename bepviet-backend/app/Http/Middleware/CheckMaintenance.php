<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SystemSetting; // THÊM DÒNG NÀY
use Illuminate\Support\Facades\Auth; // THÊM DÒNG NÀY

class CheckMaintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $settings = SystemSetting::first();

        // Nếu đang bảo trì VÀ người đang truy cập KHÔNG PHẢI là Admin
        if ($settings && $settings->maintenance_mode) {
            if (!Auth::check() || Auth::user()->role !== 'Admin') {
                return response()->json([
                    'message' => 'Hệ thống đang bảo trì. Vui lòng quay lại sau 15 phút.'
                ], 503);
            }
        }
        return $next($request);
    }
}
