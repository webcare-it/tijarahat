<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PosController extends Controller
{
    public function search(Request $request)
    {
        $search = $request->search;
        $products = \App\Models\Product::where('name', 'like', '%' . $search . '%')
            ->orWhere('barcode', 'like', '%' . $search . '%')
            ->where('published', 1)
            ->take(20)
            ->get();
        
        return response()->json($products);
    }

    public function addToCart(Request $request)
    {
        $product_id = $request->product_id;
        $quantity = $request->quantity ?? 1;
        
        $cart = session()->get('pos_cart', []);
        
        if(isset($cart[$product_id])) {
            $cart[$product_id]['quantity'] += $quantity;
        } else {
            $product = \App\Models\Product::find($product_id);
            if($product) {
                $cart[$product_id] = [
                    "name" => $product->name,
                    "quantity" => $quantity,
                    "price" => $product->unit_price,
                    "photo" => $product->thumbnail_img
                ];
            }
        }
        
        session()->put('pos_cart', $cart);
        return response()->json(['status' => 'success', 'cart' => $cart]);
    }

    public function updateQuantity(Request $request)
    {
        $product_id = $request->product_id;
        $quantity = $request->quantity;
        
        $cart = session()->get('pos_cart', []);
        
        if(isset($cart[$product_id])) {
            if($quantity <= 0) {
                unset($cart[$product_id]);
            } else {
                $cart[$product_id]['quantity'] = $quantity;
            }
        }
        
        session()->put('pos_cart', $cart);
        return response()->json(['status' => 'success', 'cart' => $cart]);
    }

    public function removeFromCart(Request $request)
    {
        $product_id = $request->product_id;
        
        $cart = session()->get('pos_cart', []);
        
        if(isset($cart[$product_id])) {
            unset($cart[$product_id]);
        }
        
        session()->put('pos_cart', $cart);
        return response()->json(['status' => 'success', 'cart' => $cart]);
    }

    public function getShippingAddress(Request $request)
    {
        $customer_id = $request->customer_id;
        $addresses = \App\Models\Address::where('user_id', $customer_id)->get();
        return response()->json($addresses);
    }

    public function getShippingAddressForSeller(Request $request)
    {
        $seller_id = auth()->user()->id;
        $addresses = \App\Models\Address::where('user_id', $seller_id)->get();
        return response()->json($addresses);
    }

    public function setDiscount(Request $request)
    {
        $discount = $request->discount;
        $discount_type = $request->discount_type ?? 'percent'; // percent or amount
        
        session()->put('pos_discount', [
            'amount' => $discount,
            'type' => $discount_type
        ]);
        
        return response()->json(['status' => 'success']);
    }

    public function setShipping(Request $request)
    {
        $shipping_cost = $request->shipping_cost;
        session()->put('pos_shipping', $shipping_cost);
        return response()->json(['status' => 'success']);
    }

    public function set_shipping_address(Request $request)
    {
        $address_id = $request->address_id;
        session()->put('pos_shipping_address', $address_id);
        return response()->json(['status' => 'success']);
    }

    public function get_order_summary(Request $request)
    {
        $cart = session()->get('pos_cart', []);
        $discount = session()->get('pos_discount', ['amount' => 0, 'type' => 'percent']);
        $shipping = session()->get('pos_shipping', 0);
        
        $subtotal = 0;
        foreach($cart as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }
        
        $discount_amount = 0;
        if($discount['type'] == 'percent') {
            $discount_amount = ($subtotal * $discount['amount']) / 100;
        } else {
            $discount_amount = $discount['amount'];
        }
        
        $total = $subtotal - $discount_amount + $shipping;
        
        return response()->json([
            'subtotal' => $subtotal,
            'discount' => $discount_amount,
            'shipping' => $shipping,
            'total' => $total,
            'item_count' => count($cart)
        ]);
    }

    public function order_store(Request $request)
    {
        // Create order
        $order = new \App\Models\Order();
        $order->user_id = $request->customer_id;
        $order->shipping_address = $request->shipping_address;
        $order->payment_type = $request->payment_type;
        $order->payment_status = 'paid';
        $order->grand_total = $request->total;
        $order->save();
        
        // Add order details
        $cart = session()->get('pos_cart', []);
        foreach($cart as $product_id => $item) {
            $order_detail = new \App\Models\OrderDetail();
            $order_detail->order_id = $order->id;
            $order_detail->product_id = $product_id;
            $order_detail->quantity = $item['quantity'];
            $order_detail->price = $item['price'];
            $order_detail->save();
        }
        
        // Clear POS session
        session()->forget(['pos_cart', 'pos_discount', 'pos_shipping', 'pos_shipping_address']);
        
        return response()->json(['status' => 'success', 'order_id' => $order->id]);
    }

    public function index()
    {
        $customers = \App\Models\User::where('user_type', 'customer')->get();
        $categories = \App\Models\Category::all();
        return view('pos.index', compact('customers', 'categories'));
    }

    public function pos_activation()
    {
        $business_settings = \App\Models\BusinessSetting::where('type', 'pos_activation')->first();
        return response()->json(['pos_activation' => $business_settings ? $business_settings->value : 0]);
    }

    public function seller_index()
    {
        $seller_id = auth()->user()->id;
        $products = \App\Models\Product::where('user_id', $seller_id)->get();
        return view('pos.seller_index', compact('products'));
    }
}