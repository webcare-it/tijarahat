<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Category;
use App\Models\CombinedOrder;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\ShippingCost;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManualOrderController extends Controller
{
    protected function getManualOrderToken(Request $request)
    {
        if (!$request->session()->has('manual_order_temp_user_id')) {
            $request->session()->put('manual_order_temp_user_id', bin2hex(random_bytes(10)));
        }

        return $request->session()->get('manual_order_temp_user_id');
    }

    protected function getManualOrderSettings(Request $request)
    {
        return [
            'discount' => floatval($request->session()->get('manual_order_discount', 0)),
            'discount_type' => $request->session()->get('manual_order_discount_type', 'flat'),
            'shipping' => floatval($request->session()->get('manual_order_shipping', 0)),
            'shipping_name' => $request->session()->get('manual_order_shipping_name', ''),
            'shipping_id' => $request->session()->get('manual_order_shipping_id', null),
            'coupon_code' => $request->session()->get('manual_order_coupon_code', null),
            'coupon_discount' => floatval($request->session()->get('manual_order_coupon_discount', 0)),
        ];
    }

    protected function formatCartResponse(Request $request)
    {
        $token = $this->getManualOrderToken($request);
        $cartItems = Cart::where('temp_user_id', $token)->get();
        $settings = $this->getManualOrderSettings($request);

        $items = [];
        $subTotal = 0;
        $tax = 0;
        $itemCount = 0;

        foreach ($cartItems as $item) {
            $product = Product::find($item->product_id);
            $itemCount += $item->quantity;
            $subTotal += $item->price * $item->quantity;
            $tax += $item->tax * $item->quantity;

            $items[] = [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $product ? $product->name : '',
                'slug' => $product ? $product->slug : '',
                'thumbnail' => $product ? uploaded_asset($product->thumbnail_img) : '',
                'price' => $item->price,
                'tax' => $item->tax,
                'quantity' => $item->quantity,
                'variation' => $item->variation,
                'total' => ($item->price + $item->tax) * $item->quantity,
                'variant_product' => $product ? intval($product->variant_product) : 0,
            ];
        }

        $shipping = $settings['shipping'];
        $discount = $settings['discount'];
        $discountType = $settings['discount_type'];
        $couponDiscount = $settings['coupon_discount'];

        // Calculate discount based on type
        $calculatedDiscount = 0;
        if ($discountType === 'percentage') {
            $calculatedDiscount = ($subTotal * $discount) / 100;
        } else {
            $calculatedDiscount = $discount;
        }

        $grandTotal = max(0, $subTotal + $tax + $shipping - $calculatedDiscount - $couponDiscount);

        return [
            'items' => $items,
            'item_count' => $itemCount,
            'sub_total' => $subTotal,
            'tax' => $tax,
            'shipping_cost' => $shipping,
            'shipping_name' => $settings['shipping_name'],
            'shipping_id' => $settings['shipping_id'],
            'discount' => $calculatedDiscount,
            'discount_type' => $discountType,
            'coupon_code' => $settings['coupon_code'],
            'coupon_discount' => $couponDiscount,
            'grand_total' => $grandTotal,
        ];
    }

    public function index(Request $request)
    {
        $categories = Category::orderBy('name')->get();
        return view('backend.sales.manual_order.index', compact('categories'));
    }

    public function products(Request $request)
    {
        $search = trim($request->get('search', ''));
        $categoryId = $request->get('category_id');
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 12);

        // Debug logging
        \Log::info('ManualOrderController@products called', [
            'search' => $search,
            'categoryId' => $categoryId,
            'page' => $page,
            'perPage' => $perPage,
            'all_params' => $request->all()
        ]);

        $query = Product::with('stocks', 'category')->where('published', 1);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage, ['*'], 'page', $page);

        \Log::info('Products query result', [
            'total_products' => $products->total(),
            'current_page' => $products->currentPage(),
            'per_page' => $products->perPage(),
            'has_more' => $products->hasMorePages()
        ]);

        $result = $products->map(function ($product) {
            $variants = [];
            if ($product->variant_product == 1) {
                $variants = $product->stocks
                    ->where('qty', '>', 0)
                    ->pluck('variant')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'thumbnail' => uploaded_asset($product->thumbnail_img),
                'price' => single_price($product->unit_price),
                'price_value' => $product->unit_price,
                'variant_product' => intval($product->variant_product),
                'variants' => $variants,
                'category_name' => $product->category ? $product->category->name : null,
            ];
        });

        return response()->json([
            'products' => $result,
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'has_more' => $products->hasMorePages()
        ]);
    }

    public function getShippingCosts()
    {
        $shippingCosts = ShippingCost::where('status', 1)->orderBy('name')->get();
        
        return response()->json([
            'shipping_costs' => $shippingCosts->map(function($cost) {
                return [
                    'id' => $cost->id,
                    'name' => $cost->name,
                    'amount' => $cost->amount,
                    'formatted_amount' => single_price($cost->amount)
                ];
            })
        ]);
    }

    public function cart(Request $request)
    {
        return response()->json(['cart' => $this->formatCartResponse($request)]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'variant' => 'nullable|string',
        ]);

        $token = $this->getManualOrderToken($request);
        $product = Product::with('stocks', 'taxes')->where('published', 1)->findOrFail($request->id);
        $quantity = intval($request->quantity);
        $variant = $request->get('variant', '');

        if ($product->variant_product == 1 && trim($variant) === '') {
            return response()->json(['result' => false, 'message' => translate('Please select a product variant before adding to cart')], 422);
        }

        if ($product->variant_product == 1) {
            $productStock = $product->stocks->where('variant', $variant)->first();
            if (!$productStock || $productStock->qty < $quantity) {
                return response()->json(['result' => false, 'message' => translate('Selected variant is not available in the requested quantity')], 422);
            }
            $price = $productStock->price;
        } else {
            $productStock = $product->stocks->first();
            $price = $product->unit_price;
            if ($productStock && $productStock->qty < $quantity) {
                return response()->json(['result' => false, 'message' => translate('Requested quantity is not available')], 422);
            }
        }

        $discountApplicable = false;
        if ($product->discount_start_date == null) {
            $discountApplicable = true;
        } elseif (strtotime(date('d-m-Y H:i:s')) >= $product->discount_start_date && strtotime(date('d-m-Y H:i:s')) <= $product->discount_end_date) {
            $discountApplicable = true;
        }

        if ($discountApplicable) {
            if ($product->discount_type == 'percent') {
                $price -= ($price * $product->discount) / 100;
            } elseif ($product->discount_type == 'amount') {
                $price -= $product->discount;
            }
        }

        $tax = 0;
        foreach ($product->taxes as $productTax) {
            if ($productTax->tax_type == 'percent') {
                $tax += ($price * $productTax->tax) / 100;
            } elseif ($productTax->tax_type == 'amount') {
                $tax += $productTax->tax;
            }
        }

        if ($product->min_qty > $quantity) {
            return response()->json(['result' => false, 'message' => translate('Minimum').' '.$product->min_qty.' '.translate('item(s) should be ordered')], 422);
        }

        $cartItem = Cart::firstOrNew([
            'temp_user_id' => $token,
            'owner_id' => $product->user_id,
            'product_id' => $product->id,
            'variation' => $variant,
        ]);

        $cartItem->price = $price;
        $cartItem->tax = $tax;
        $cartItem->shipping_cost = 0;
        $cartItem->discount = 0;
        $cartItem->quantity = ($cartItem->exists ? $cartItem->quantity : 0) + $quantity;
        $cartItem->save();

        return response()->json(['result' => true, 'message' => translate('Product added to cart successfully'), 'cart' => $this->formatCartResponse($request)]);
    }

    public function updateQuantity(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $token = $this->getManualOrderToken($request);
        $cartItem = Cart::where('id', $id)->where('temp_user_id', $token)->first();

        if (!$cartItem) {
            return response()->json(['result' => false, 'message' => translate('Cart item not found')], 404);
        }

        $product = Product::with('stocks')->find($cartItem->product_id);
        if (!$product) {
            return response()->json(['result' => false, 'message' => translate('Product not found')], 404);
        }

        $quantity = intval($request->quantity);
        $productStock = $product->variant_product == 1
            ? $product->stocks->where('variant', $cartItem->variation)->first()
            : $product->stocks->first();

        if ($productStock && $productStock->qty < $quantity) {
            return response()->json(['result' => false, 'message' => translate('Maximum available quantity reached')], 422);
        }

        $cartItem->update(['quantity' => $quantity]);

        return response()->json(['result' => true, 'message' => translate('Cart updated'), 'cart' => $this->formatCartResponse($request)]);
    }

    public function destroyCartItem(Request $request, $id)
    {
        $token = $this->getManualOrderToken($request);
        $cartItem = Cart::where('id', $id)->where('temp_user_id', $token)->first();

        if (!$cartItem) {
            return response()->json(['result' => false, 'message' => translate('Cart item not found')], 404);
        }

        $cartItem->delete();

        return response()->json(['result' => true, 'message' => translate('Product removed from cart'), 'cart' => $this->formatCartResponse($request)]);
    }

    public function applyDiscount(Request $request)
    {
        $request->validate([
            'discount' => 'required|numeric|min:0',
            'discount_type' => 'required|in:flat,percentage',
        ]);

        $discount = floatval($request->discount);
        $discountType = $request->discount_type;

        // If percentage, validate it's not more than 100%
        if ($discountType === 'percentage' && $discount > 100) {
            return response()->json(['result' => false, 'message' => translate('Percentage discount cannot exceed 100%')], 422);
        }

        $request->session()->put('manual_order_discount', $discount);
        $request->session()->put('manual_order_discount_type', $discountType);

        return response()->json(['result' => true, 'message' => translate('Discount applied'), 'cart' => $this->formatCartResponse($request)]);
    }

    public function applyShipping(Request $request)
    {
        $request->validate([
            'shipping_cost_id' => 'required|exists:shipping_costs,id',
        ]);

        $shippingCost = ShippingCost::findOrFail($request->shipping_cost_id);
        
        $request->session()->put('manual_order_shipping', $shippingCost->amount);
        $request->session()->put('manual_order_shipping_name', $shippingCost->name);
        $request->session()->put('manual_order_shipping_id', $shippingCost->id);

        return response()->json([
            'result' => true, 
            'message' => translate('Shipping cost updated'), 
            'cart' => $this->formatCartResponse($request)
        ]);
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string|max:255',
        ]);

        $coupon = Coupon::where('code', $request->coupon_code)->first();

        if (!$coupon) {
            return response()->json(['result' => false, 'message' => translate('Coupon code is invalid')], 422);
        }

        $cart = $this->formatCartResponse($request);
        $discountValue = 0;

        if (isset($coupon->discount_type) && $coupon->discount_type == 'percent') {
            $discountValue = ($cart['sub_total'] + $cart['tax'] + $cart['shipping_cost']) * $coupon->discount / 100;
        } else {
            $discountValue = $coupon->discount;
        }

        $discountValue = min($discountValue, $cart['sub_total'] + $cart['tax'] + $cart['shipping_cost']);

        $request->session()->put('manual_order_coupon_code', $coupon->code);
        $request->session()->put('manual_order_coupon_discount', floatval($discountValue));

        return response()->json(['result' => true, 'message' => translate('Coupon applied'), 'cart' => $this->formatCartResponse($request)]);
    }

    public function placeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:100',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'nullable|string|max:500',
        ]);

        $token = $this->getManualOrderToken($request);
        $cartItems = Cart::where('temp_user_id', $token)->get();
        $settings = $this->getManualOrderSettings($request);

        if ($cartItems->isEmpty()) {
            return response()->json(['result' => false, 'message' => translate('Cart is empty')], 422);
        }

        if (empty($settings['shipping_id'])) {
            return response()->json(['result' => false, 'message' => translate('Please select a shipping cost before placing the order')], 422);
        }

        $shippingAddress = [
            'name' => $request->customer_name,
            'email' => $request->customer_email,
            'phone' => $request->customer_phone,
            'address' => $request->customer_address,
        ];

        // Find user by phone number, or create new user
        $user = User::where('phone', $request->customer_phone)->first();
        if (!$user) {
            $user = new User();
            $user->name = $request->customer_name;
            $user->phone = $request->customer_phone;
            if ($request->customer_email) {
                $user->email = $request->customer_email;
            }
            $user->password = bcrypt($request->customer_phone);
            $user->email_verified_at = date('Y-m-d H:i:s');
            $user->save();
        }

        $combinedOrder = new CombinedOrder();
        $combinedOrder->user_id = $user->id;
        $combinedOrder->shipping_address = json_encode($shippingAddress);
        $combinedOrder->grand_total = 0;
        $combinedOrder->save();

        $ownerGroups = $cartItems->groupBy('owner_id');
        $shippingTotal = $settings['shipping'];
        $shippingPerItem = $cartItems->count() ? $shippingTotal / $cartItems->count() : 0;

        foreach ($ownerGroups as $group) {
            $order = new Order();
            $order->combined_order_id = $combinedOrder->id;
            $order->user_id = $user->id;
            $order->order_type = 'manual_order';
            $order->shipping_address = json_encode($shippingAddress);
            $order->payment_type = 'manual_payment';
            $order->notes = translate('Manual order created by admin');
            $order->delivery_viewed = '0';
            $order->payment_status_viewed = '0';
            $order->delivery_status = 'pending';
            $order->payment_status = 'unpaid';
            $order->code = generate_order_code();
            $order->date = strtotime('now');
            $order->save();

            $subtotal = 0;
            $tax = 0;
            $shipping = 0;

            foreach ($group as $cartItem) {
                $product = Product::with('stocks')->find($cartItem->product_id);
                if (!$product) {
                    continue;
                }

                $productStock = $product->variant_product == 1
                    ? $product->stocks->where('variant', $cartItem->variation)->first()
                    : $product->stocks->first();

                if ($productStock && $productStock->qty < $cartItem->quantity && $product->digital != 1) {
                    return response()->json(['result' => false, 'message' => translate('Insufficient stock for').' '.$product->name], 422);
                }

                if ($productStock && $product->digital != 1) {
                    $productStock->qty -= $cartItem->quantity;
                    $productStock->save();
                }

                $subtotal += $cartItem->price * $cartItem->quantity;
                $tax += $cartItem->tax * $cartItem->quantity;
                $shipping += $shippingPerItem;

                $detail = new OrderDetail();
                $detail->order_id = $order->id;
                $detail->seller_id = $product->user_id;
                $detail->product_id = $product->id;
                $detail->variation = $cartItem->variation;
                $detail->price = $cartItem->price * $cartItem->quantity;
                $detail->tax = $cartItem->tax * $cartItem->quantity;
                $detail->shipping_type = 'flat_rate';
                $detail->product_referral_code = null;
                $detail->shipping_cost = $shippingPerItem;
                $detail->quantity = $cartItem->quantity;
                $detail->save();

                $product->num_of_sale += $cartItem->quantity;
                $product->save();

                $order->seller_id = $product->user_id;
            }

            $order->shipping_cost = $shipping;
            $order->coupon_discount = $settings['coupon_discount'];
            $order->grand_total = max(0, $subtotal + $tax + $shipping - $settings['discount'] - $settings['coupon_discount']);
            $order->save();
            $combinedOrder->grand_total += $order->grand_total;
        }

        $combinedOrder->save();
        Cart::where('temp_user_id', $token)->delete();
        $request->session()->forget(['manual_order_discount', 'manual_order_shipping', 'manual_order_coupon_code', 'manual_order_coupon_discount']);

        return response()->json([
            'result' => true,
            'message' => translate('Manual order placed successfully'),
            'order_code' => $order->code,
            'redirect_url' => route('all_orders.index'),
        ]);
    }
}
 