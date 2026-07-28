<?php

use App\Models\User;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

// صفحة البداية (اختياري)
Route::get('/aa', function () {
    return view('welcome'); // تأكد إن عندك ملف welcome.blade.php أو غيرها
});

// مثال route اختبار بسيط
// Route::get('/test-web', function () {
//     return 'This is a test route from web.php';
// });

Route::get('/test-token', function (Request $request) {
    $user = User::first();
    if (!$user) {
        return response('No user found', 404);
    }
    return $user->createToken('auth_token')->plainTextToken;
});

// أضف أي routes خاصة بالويب هنا

