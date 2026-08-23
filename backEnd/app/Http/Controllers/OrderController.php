<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Orders::query()
                ->with(['driver:userID,fName,lName,email,phone,role'])
                ->orderByDesc('orderID')
                ->get();

            return response()->json($orders, 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to load orders',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'driverId' => 'required|exists:users,userID',
                'orderName' => 'required|string|max:255',
                'orderAddress' => 'required|string|max:255',
                'customerName' => 'required|string|max:255',
                'customerPhone' => 'required|string|max:25',
                 // 'regex:/^(03|70|71|76|78|79|81|82|83|84|85|86|87|88|89)[0-9]{6}$/',
                'totalPrice' => 'required|numeric|min:0',
                'deliveryPrice' => 'required|numeric|min:0',
                'status' => 'required|in:pending,in_progress,delivered,cancelled',
                'currency' => 'required|in:usd,lbp',
            ]);

            $order = Orders::create($data);

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to create order',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function update(Request $request, $orderID)
    {
        try {
            $data = $request->validate([
                'status' => 'required|in:pending,in_progress,delivered,cancelled',
            ]);

            $order = Orders::where('orderID', $orderID)->first();

            if (! $order) {
                return response()->json([
                    'message' => 'Order not found',
                ], 404);
            }

            $order->update([
                'status' => $data['status'],
            ]);

            $order->load(['driver:userID,fName,lName,email,phone,role']);

            return response()->json([
                'message' => 'Order updated successfully',
                'order' => $order,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to update order',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function destroy($orderID)
    {
        try {
            $order = Orders::where('orderID', $orderID)->first();

            if (! $order) {
                return response()->json([
                    'message' => 'Order not found',
                ], 404);
            }

            $order->delete();

            return response()->json([
                'message' => 'Order deleted successfully',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete order',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function destroyAll()
    {
        try {
            Orders::query()->delete();

            return response()->json([
                'message' => 'All orders deleted successfully',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete all orders',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}