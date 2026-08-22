<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function drivers(Request $request)
    {
        try {
            $query = User::query()
                ->whereIn('role', ['user'])
                ->select([
                    'userID',
                    'fName',
                    'lName',
                    'phone',
                    'email',
                    'role',
                    'created_at',
                ])
                ->orderByDesc('userID');

            $drivers = $query->get();

            return response()->json($drivers, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load drivers',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    
    public function destroy($userID)
{
    try {
        $user = User::where('userID', $userID)
            ->where('role', 'user')
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'Driver not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Driver deleted successfully',
        ], 200);

    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Failed to delete driver',
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], 500);
    }
}
}
