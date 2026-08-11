<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use App\Http\Middleware\UseSanctumTokenFromCookie;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:6',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;
    
    //   $cookie = Cookie(
    //     'auth_token',        // اسم الكوكي
    //     $token,              // القيمة
    //     60 * 24,             // المدة بالدقائق (هنا يوم)
    //     '/',                 // المسار
    //     null,                // الدومين (خليه null محليًا)
    //     false,               // https فقط؟ false لأننا محليًا
    //     true,                // HTTP Only = true
    //     false,               // Raw
    //     'Strict'             // SameSite
    // );
    $cookie = Cookie(
    'auth_token',
    $token,
    60 * 24,
    '/',
    null,
    true,       // Secure
    true,       // HttpOnly
    false,      // Raw
    'None'      // SameSite
);

    return response()->json([
        'message' => 'Login successful',
        
        // 'token_preview' => substr($token, 0, 15) . '...',
        'user' => $user,
    ])->cookie($cookie);
});
Route::post("/register" , function(Request $request){
    $request->validate([
        'fName'=>'required | string | max:255',
        'lName'=>'required | string | max:255',
        'phone'=>'required | string  | min:8 |max:8' ,
        'email'=>'required | string  | unique:users,email' ,
        'password'=>'required | string  | min:6' ,
        // 'role' => 'required|in:admin,user',
    ]);

    $user = User::create([
        'fName' => $request->fName,
        'lName' => $request->lName,
        'phone' => $request->phone,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'user',
        // 'role' => $request->role ?? 'user',
        // 'role' => $request->role,
    ]);
    $token = $user->createToken('auth_token')->plainTextToken;
    //  $cookie = Cookie(
    //     'auth_token',        // اسم الكوكي
    //     $token,              // القيمة
    //     60 * 24,             // المدة بالدقائق (هنا يوم)
    //     '/',                 // المسار
    //     null,                // الدومين (خليه null محليًا)
    //     false,               // https فقط؟ false لأننا محليًا
    //     true,                // HTTP Only = true
    //     false,               // Raw
    //     'Strict'             // SameSite
    // );
    $cookie = Cookie(
    'auth_token',
    $token,
    60 * 24,
    '/',
    null,
    true,       // Secure
    true,       // HttpOnly
    false,      // Raw
    'None'      // SameSite
);

    return response()->json([
        // 'message'=>'user registered successfully',
        'token' => $token,
        'user' => $user,
    ], 201)->cookie($cookie);
});

  Route::get('/drivers', [UserController::class, 'drivers']);


    Route::post('/orders', [OrderController::class, 'store']);

    Route::get('/orders', [OrderController::class, 'index']);

    Route::patch('/orders/{orderID}', [OrderController::class, 'update']);

    Route::delete('/orders/{orderID}', [OrderController::class, 'destroy']);

    Route::delete('/orders', [OrderController::class, 'destroyAll']);

// Route::middleware([
//     UseSanctumTokenFromCookie::class,
//     'auth:sanctum',
// ])->group(function () {

  
// });




// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return response()->json([
//         'user' => $request->user(),
//     ]);
// });









// Route::get('/test-token', function () {
//     $user = User::first();

//     if (! $user) {
//         return response()->json(['message' => 'No user found'], 404);
//     }

//     return response()->json([
//         'token' => $user->createToken('auth_token')->plainTextToken,
//     ]);
// });

