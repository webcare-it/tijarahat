<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\Address;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Product;
use App\Models\OrderDetail;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\BusinessSetting;
use App\Models\User;
use DB;
use \App\Utility\NotificationUtility;
use App\Models\CombinedOrder;
use App\Http\Controllers\AffiliateController;
use App\Models\Models\GuestOtpCode;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function store(Request $request, $set_paid = false)
    {

        // Check if OTP for order is enabled
        if (BusinessSetting::where('type', 'otp_for_order')->first()->value == 1) {
            // Verify OTP before proceeding
            $user = User::where('phone', $request->phone)->first();
            $otp_verified = false;
            
            if ($user && $request->has('otp_code')) {
                // For registered users, verify OTP from database
                if ($user->verification_code == $request->otp_code) {
                    $otp_verified = true;
                    // Clear the OTP code after successful verification
                    $user->verification_code = null;
                    $user->save();
                }
            } elseif (!$user && $request->has('otp_code')) {
                // For guest users, verify OTP from guest_otp_codes table
                $guestOtp = GuestOtpCode::where('phone', $request->phone)
                    ->where('otp_code', $request->otp_code)
                    ->where('expires_at', '>', Carbon::now())
                    ->first();
                
                if ($guestOtp) {
                    $otp_verified = true;
                    // Delete the OTP record after successful verification
                    $guestOtp->delete();
                }
            } else {
                // OTP is required but not provided
                return response()->json([
                    'combined_order_id' => 0,
                    'result' => false,
                    'message' => translate('OTP is required for order placement')
                ]);
            }
            
            if (!$otp_verified) {
                return response()->json([
                    'combined_order_id' => 0,
                    'result' => false,
                    'message' => translate('Invalid OTP code')
                ]);
            }
        }

        $cartItems = Cart::where('user_id', $request->user_id)->orWhere('temp_user_id', $request->user_id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'combined_order_id' => 0,
                'result' => false,
                'message' => translate('Cart is Empty')
            ]);
        }

        $user = User::find($request->user_id);

        $shippingAddress = [];

        $shippingAddress['name']        = $request->name;
        $shippingAddress['email']       = $request->email ?? null;
        $shippingAddress['address']     = $request->address;
        $shippingAddress['country']     = $request->country_name;
        $shippingAddress['state']       = $request->state_name;
        $shippingAddress['city']        = $request->city_name;
        $shippingAddress['postal_code'] = $request->postal_code ?? null;
        $shippingAddress['phone']       = $request->phone;
        if ($request->latitude || $request->longitude) {
            $shippingAddress['lat_lang'] = $request->latitude . ',' . $request->longitude;
        }

        $combined_order = new CombinedOrder;
        $combined_order->user_id = $user->id ?? $request->user_id;
        $combined_order->shipping_address = json_encode($shippingAddress);
        $combined_order->save();

        $seller_products = array();
        foreach ($cartItems as $cartItem) {
            $product_ids = array();
            $product = Product::where('published', 1)->find($cartItem['product_id']);
            if (isset($seller_products[$product->user_id])) {
                $product_ids = $seller_products[$product->user_id];
            }
            array_push($product_ids, $cartItem);
            $seller_products[$product->user_id] = $product_ids;
        }

        foreach ($seller_products as $seller_product) {
            $order = new Order;
            $order->combined_order_id = $combined_order->id;
            if ($user)
            {
                $order->user_id = $user->id ?? 0;
            }
            else
            {
                $order->guest_id = $request->user_id ?? null;
            }
            $order->shipping_address = json_encode($shippingAddress);
            $order->payment_type = $request->payment_type;
            $order->shipping_cost = $request->shipping_cost;
            $order->notes = $request->notes;
            $order->delivery_viewed = '0';
            $order->payment_status_viewed = '0';
            $order->code = generate_order_code();
            $order->date = strtotime('now');
            if($set_paid){
                $order->payment_status = 'paid';
            }else{
                $order->payment_status = 'unpaid';
            }

            $order->save();

            $subtotal = 0;
            $tax = 0;
            $shipping = 0;
            $coupon_discount = 0;

            //Order Details Storing
            foreach ($seller_product as $cartItem) {
                $product = Product::where('published', 1)->find($cartItem['product_id']);

                $subtotal += $cartItem['price'] * $cartItem['quantity'];
                $tax += $cartItem['tax'] * $cartItem['quantity'];
                $coupon_discount += $cartItem['discount'];

                $product_variation = $cartItem['variation'];

                $product_stock = $product->stocks->where('variant', $product_variation)->first();
                if ($product->digital != 1 && $cartItem['quantity'] > $product_stock->qty) {
                    $order->delete();
                    $combined_order->delete();
                    return response()->json([
                        'combined_order_id' => 0,
                        'result' => false,
                        'message' => translate('The requested quantity is not available for ') . $product->name
                    ]);
                } elseif ($product->digital != 1) {
                    $product_stock->qty -= $cartItem['quantity'];
                    $product_stock->save();
                }

                $order_detail = new OrderDetail;
                $order_detail->order_id = $order->id;
                $order_detail->seller_id = $product->user_id;
                $order_detail->product_id = $product->id;
                $order_detail->variation = $product_variation;
                $order_detail->price = $cartItem['price'] * $cartItem['quantity'];
                $order_detail->tax = $cartItem['tax'] * $cartItem['quantity'];
                $order_detail->shipping_type = $cartItem['shipping_type'];
                $order_detail->product_referral_code = $cartItem['product_referral_code'];
                $order_detail->shipping_cost = $cartItem['shipping_cost'];

                $shipping += $cartItem['shipping_cost'];

                if ($cartItem['shipping_type'] == 'pickup_point') {
                    $order_detail->pickup_point_id = $cartItem['pickup_point'];
                }
                //End of storing shipping cost

                $order_detail->quantity = $cartItem['quantity'];
                $order_detail->save();

                $product->num_of_sale = $product->num_of_sale + $cartItem['quantity'];
                $product->save();

                $order->seller_id = $product->user_id;

                if (addon_is_activated('affiliate_system')) {
                    if ($order_detail->product_referral_code) {
                        $referred_by_user = User::where('referral_code', $order_detail->product_referral_code)->first();

                        $affiliateController = new AffiliateController;
                        $affiliateController->processAffiliateStats($referred_by_user->id, 0, $order_detail->quantity, 0, 0);
                    }
                }
            }

            $order->grand_total = $subtotal + $tax + $shipping;

            if ($seller_product[0]->coupon_code != null) {
                // if (Session::has('club_point')) {
                //     $order->club_point = Session::get('club_point');
                // }
                $order->coupon_discount = $coupon_discount;
                $order->grand_total -= $coupon_discount;

                $coupon_usage = new CouponUsage;
                $coupon_usage->user_id = $user->id;
                $coupon_usage->coupon_id = Coupon::where('code', $seller_product[0]->coupon_code)->first()->id;
                $coupon_usage->save();
            }

            $combined_order->grand_total += $order->grand_total;

            if (strpos($request->payment_type, "manual_payment_") !== false) { // if payment type like  manual_payment_1 or  manual_payment_25 etc)

                $order->manual_payment = 1;
                $order->save();

            }


            $order->save();
        }
        $combined_order->save();



        Cart::where('user_id', $request->user_id)->orWhere('temp_user_id', $request->user_id)->delete();
        
        if (
           $request->payment_type == 'cash_on_delivery'
           || $request->payment_type == 'wallet'
           || strpos($request->payment_type, "manual_payment_") !== false 
          ) {
               NotificationUtility::sendOrderPlacedNotification($order);
            }


        return response()->json([
            'combined_order_id' => $combined_order->id,
            'result' => true,
            'message' => translate('Your order has been placed successfully')
        ]);
    }

    public function combined_order($combined_order_id)
{
    // ✅ Validate ID
    if (!is_numeric($combined_order_id)) {
        return response()->json([
            'result' => false,
            'message' => 'Invalid combined order ID',
        ], 404);
    }

    $combined_order_id = (int) $combined_order_id;

    // ✅ Fetch orders with relations
    $orders = Order::with(['orderDetails.product', 'user'])
        ->where('combined_order_id', $combined_order_id)
        ->get();

    if ($orders->isEmpty()) {
        return response()->json([
            'result' => false,
            'message' => 'No order found for this combined order ID',
        ], 404);
    }

    $firstOrder = $orders->first();

    // ✅ Decode shipping address
    $shipping_address = json_decode($firstOrder->shipping_address, true);

    // ✅ Calculate totals
    $subtotal = 0;
    $total_shipping_cost = 0;
    $tax = 0;
    $coupon_discount = 0;

    foreach ($orders as $order) {
        foreach ($order->orderDetails as $detail) {
            $subtotal += $detail->price;
            $total_shipping_cost += $detail->shipping_cost ?? 0;
        }
        $tax += $order->tax ?? 0;
        $coupon_discount += $order->coupon_discount ?? 0;
    }

    $grand_total = ($subtotal + $total_shipping_cost + $tax) - $coupon_discount;

    // ✅ Determine customer type (New or Returning) using phone number
    $phone = $shipping_address['phone'] ?? ($firstOrder->user->phone ?? null);
    $customer_type = 'Unknown';

    if ($phone) {
        $previousOrdersCount = Order::whereHas('user', function ($query) use ($phone) {
            $query->where('phone', $phone);
        })
        ->where('id', '<>', $firstOrder->id) // exclude current order
        ->count();

        $customer_type = $previousOrdersCount > 0 ? 'Returning' : 'New';
    }

    // ✅ Prepare invoice data
    $invoice = [
        'order_code' => $firstOrder->code,
        'order_date' => $firstOrder->created_at->format('d-m-Y h:i A'),
        'order_status' => $firstOrder->delivery_status,
        'payment_method' => $firstOrder->payment_type,
        'customer_type' => $customer_type,
        'subtotal' => format_price(round($subtotal, 2)),
        'shipping_cost' => format_price(round($total_shipping_cost, 2)),
        'tax' => format_price(round($tax, 2)),
        'coupon_discount' => format_price(round($coupon_discount, 2)),
        'grand_total' => format_price(round($grand_total, 2)),

        'shipping_address' => [
            'name' => $shipping_address['name'] ?? null,
            'email' => $shipping_address['email'] ?? null,
            'phone' => $phone,
            'address' => $shipping_address['address'] ?? null,
            'city' => $shipping_address['city'] ?? null,
            'postal_code' => $shipping_address['postal_code'] ?? null,
            'country' => $shipping_address['country'] ?? null,
        ],

        'user' => [
            'name' => $firstOrder->user->name ?? 'Guest',
            'email' => $firstOrder->user->email ?? 'N/A',
            'phone' => $firstOrder->user->phone ?? 'N/A',
        ],

        'order_items' => $orders->flatMap(function ($order) {
            return $order->orderDetails->map(function ($detail) {
                return [
                    'product_name' => $detail->product->name ?? 'Unknown Product',
                    'category_name' => $detail->product && $detail->product->category ? $detail->product->category->name : '',
                    'product_id' => $detail->product->id ?? null,
                    'product_thumbnail_image' => api_asset($detail->product->thumbnail_img) ?? null,
                    'variation' => $detail->variation,
                    'quantity' => $detail->quantity,
                    'delivery_type' => $detail->delivery_status ?? 'N/A',
                    'price' => format_price($detail->price),
                    'shipping_cost' => format_price($detail->shipping_cost ?? 0),
                    'subtotal' => format_price(($detail->price * $detail->quantity) + ($detail->shipping_cost ?? 0)),
                ];
            });
        })->values(),
    ];

    return response()->json([
        'result' => true,
        'message' => 'Invoice data retrieved successfully',
        'invoice' => $invoice,
    ], 200);
}

    public function track_order(Request $request, $order_code)
    {
        // Validate the order code
        if (empty($order_code)) {
            return response()->json([
                'result' => false,
                'message' => translate('Order code is required')
            ]);
        }

        // Find the order by code
        $order = Order::where('code', $order_code)->first();

        // Check if order exists
        if (!$order) {
            return response()->json([
                'result' => false,
                'message' => translate('Order not found')
            ]);
        }

        // Get order details
        $order_details = $order->orderDetails->map(function($detail) {
            return [
                'id' => $detail->id,
                'product_id' => $detail->product ? $detail->product->id : '',
                'product_name' => $detail->product ? $detail->product->name : '',
                'product_thumbnail_image' => $detail->product ? api_asset($detail->product->thumbnail_img) : null,
                'variation' => $detail->variation,
                'quantity' => $detail->quantity,
                'price' => format_price($detail->price),
                'shipping_cost' => format_price($detail->shipping_cost),
                'delivery_status' => $detail->delivery_status,
            ];
        });

        // Decode shipping address
        $shipping_address = json_decode($order->shipping_address, true);

        // Create delivery status timeline
        $delivery_timeline = $this->getDeliveryTimeline($order->delivery_status);

        // Prepare response data
        // Calculate total shipping cost from order details
        $total_shipping_cost = $order->orderDetails->sum('shipping_cost');
        
        $order_data = [
            'id' => $order->id,
            'code' => $order->code,
            'date' => date('d-m-Y H:i A', $order->date),
            'payment_type' => translate(ucfirst(str_replace('_', ' ', $order->payment_type))),
            'payment_status' => $order->payment_status,
            'delivery_status' => $order->delivery_status,
            'delivery_timeline' => $delivery_timeline,
            'tracking_code' => $order->tracking_code,
            'grand_total' => format_price($order->grand_total),
            'shipping_cost' => format_price($total_shipping_cost),
            'shipping_address' => [
                'name' => $shipping_address['name'] ?? '',
                'email' => $shipping_address['email'] ?? '',
                'phone' => $shipping_address['phone'] ?? '',
                'address' => $shipping_address['address'] ?? '',
                'city' => $shipping_address['city'] ?? '',
                'postal_code' => $shipping_address['postal_code'] ?? '',
                'country' => $shipping_address['country'] ?? '',
            ],
            'order_details' => $order_details
        ];

        return response()->json([
            'result' => true,
            'message' => translate('Order details retrieved successfully'),
            'data' => $order_data
        ]);
    }

    /**
     * Generate delivery timeline based on current delivery status
     *
     * @param string $delivery_status
     * @return array
     */
    private function getDeliveryTimeline($delivery_status)
    {
        // Define all possible delivery statuses in order
        $statuses = [
            'pending' => translate('Order Placed'),
            'confirmed' => translate('Confirmed'),
            'picked_up' => translate('Picked Up'),
            'on_the_way' => translate('On The Way'),
            'delivered' => translate('Delivered'),
            'cancelled' => translate('Cancelled')
        ];

        // Define the order of statuses
        $status_order = ['pending', 'confirmed', 'picked_up', 'on_the_way', 'delivered', 'cancelled'];

        // Create timeline
        $timeline = [];
        $current_status_found = false;

        foreach ($status_order as $status) {
            $timeline[] = [
                'status' => $status,
                'label' => $statuses[$status],
                'completed' => $current_status_found || $status === $delivery_status,
                'active' => $status === $delivery_status
            ];

            if ($status === $delivery_status) {
                $current_status_found = true;
            }
        }

        return $timeline;
    }

}
