<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\CustomerPackage;

class CustomerDashboardController extends Controller
{
    public function dashboard_summary($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'result' => false,
                'message' => 'User not found'
            ]);
        }

        // Get cart items count
        $cart_count = Cart::where('user_id', $id)->count();

        // Get wishlist items count
        $wishlist_count = $user->wishlists()->count();

        // Get total ordered products count
        $orders = Order::where('user_id', $id)->get();
        $total_ordered_products = 0;
        foreach ($orders as $order) {
            $total_ordered_products += $order->orderDetails()->count();
        }

        // Get pending and delivered order counts
        $pending_orders_count = Order::where('user_id', $id)->where('delivery_status', 'pending')->count();
        $delivered_orders_count = Order::where('user_id', $id)->where('delivery_status', 'delivered')->count();

        // Get default shipping address
        $default_address = null;
        if ($user->addresses) {
            $default_address = $user->addresses()->where('set_default', 1)->first();
        }

        // Get customer package info
        $customer_package = null;
        $package_info = null;
        if (get_setting('classified_product')) {
            $customer_package = CustomerPackage::find($user->customer_package_id);
            if ($customer_package) {
                $package_info = [
                    'name' => $customer_package->getTranslation('name'),
                    'logo' => api_asset($customer_package->logo),
                    'product_upload' => $customer_package->product_upload,
                    'remaining_uploads' => $user->remaining_uploads
                ];
            }
        }

        return response()->json([
            'result' => true,
            'dashboard_summary' => [
                'cart_count' => $cart_count,
                'wishlist_count' => $wishlist_count,
                'total_ordered_products' => $total_ordered_products,
                'pending_orders_count' => $pending_orders_count,
                'delivered_orders_count' => $delivered_orders_count,
                'default_address' => $default_address,
                'customer_package' => $package_info,
                'total_amount' => $total_ordered_products * $orders->sum('grand_total')
            ]
        ]);
    }
}