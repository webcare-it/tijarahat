<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AffiliateController;
use App\Http\Controllers\OTPVerificationController;
use Illuminate\Http\Request;
use App\Http\Controllers\ClubPointController;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Address;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\CommissionHistory;
use App\Models\Color;
use App\Models\OrderDetail;
use App\Models\CouponUsage;
use App\Models\Coupon;
use App\OtpConfiguration;
use App\Models\User;
use App\Models\BusinessSetting;
use App\Models\CombinedOrder;
use App\Models\SmsTemplate;
use Auth;
use Session;
use DB;
use Mail;
use App\Mail\InvoiceEmailManager;
use App\Utility\NotificationUtility;
use CoreComponentRepository;
use App\Utility\SmsUtility;
use Illuminate\Support\Facades\Http;
use App\Utility\SteadfastUtility;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource to seller.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $payment_status = null;
        $delivery_status = null;
        $sort_search = null;
        $orders = DB::table('orders')
            ->orderBy('id', 'desc')
            //->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->where('seller_id', Auth::user()->id)
            ->select('orders.id')
            ->distinct();

        if ($request->payment_status != null) {
            $orders = $orders->where('payment_status', $request->payment_status);
            $payment_status = $request->payment_status;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($request->has('search')) {
            $sort_search = $request->search;
            $orders = $orders->where('code', 'like', '%' . $sort_search . '%');
        }

        $orders = $orders->paginate(15);

        foreach ($orders as $key => $value) {
            $order = \App\Models\Order::find($value->id);
            $order->viewed = 1;
            $order->save();
        }

        return view('frontend.user.seller.orders', compact('orders', 'payment_status', 'delivery_status', 'sort_search'));
    }

    // All Orders
    public function all_orders(Request $request)
    {
        CoreComponentRepository::instantiateShopRepository();

        $date = $request->date;
        $sort_search = null;
        $delivery_status = null;
        $order_type = null;

        $orders = Order::with('orderDetails.product')->orderBy('id', 'desc');
        if ($request->has('search') && $request->search != null) {
            $sort_search = $request->search;

            $orders = $orders->where(function ($query) use ($sort_search) {
                $query->where('code', 'like', '%' . $sort_search . '%')
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.phone') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.name') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.address') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereHas('combinedOrder', function ($q) use ($sort_search) {
                        $q->where(function ($query) use ($sort_search) {
                            $query->whereRaw("JSON_EXTRACT(shipping_address, '$.phone') LIKE ?", ['%' . $sort_search . '%'])
                                  ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.name') LIKE ?", ['%' . $sort_search . '%'])
                                  ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.address') LIKE ?", ['%' . $sort_search . '%']);
                        });
                    });
            });
        }
        
        if ($request->order_type != null) {
            $orders = $orders->where('order_type', $request->order_type);
            $order_type = $request->order_type;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($date != null) {
            $orders = $orders->where('created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->where('created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
        }
        $orders = $orders->paginate(15);
        return view('backend.sales.all_orders.index', compact('orders', 'sort_search', 'delivery_status', 'order_type', 'date'));
    }

    public function all_orders_show($id)
    {
        $order = Order::findOrFail(decrypt($id));
        $order_shipping_address = $order->shipping_address ? json_decode($order->shipping_address) : null;
        $city = optional($order_shipping_address)->city;
        $delivery_boys = $city ? User::where('city', $city)->where('user_type', 'delivery_boy')->get() : collect();

        return view('backend.sales.all_orders.show', compact('order', 'delivery_boys'));
    }

    // Droploo Product Sales — orders that contain at least one Droploo-sourced product (b_product_id is set)
    public function droploo_orders(Request $request)
    {
        CoreComponentRepository::instantiateShopRepository();

        $date = $request->date;
        $sort_search = null;
        $delivery_status = null;
        $order_type = null;

        $orders = Order::with('orderDetails.product')->orderBy('id', 'desc')
            ->whereHas('orderDetails.product', function ($q) {
                $q->whereNotNull('b_product_id');
            });

        if ($request->has('search') && $request->search != null) {
            $sort_search = $request->search;

            $orders = $orders->where(function ($query) use ($sort_search) {
                $query->where('code', 'like', '%' . $sort_search . '%')
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.phone') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.name') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.address') LIKE ?", ['%' . $sort_search . '%']);
            });
        }

        if ($request->order_type != null) {
            $orders = $orders->where('order_type', $request->order_type);
            $order_type = $request->order_type;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($date != null) {
            $orders = $orders->where('created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->where('created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
        }
        $orders = $orders->paginate(15);
        return view('backend.sales.droploo_orders.index', compact('orders', 'sort_search', 'delivery_status', 'order_type', 'date'));
    }

    public function droploo_orders_show($id)
    {
        $order = Order::findOrFail(decrypt($id));
        $order_shipping_address = $order->shipping_address ? json_decode($order->shipping_address) : null;
        $city = optional($order_shipping_address)->city;
        $delivery_boys = $city ? User::where('city', $city)->where('user_type', 'delivery_boy')->get() : collect();

        return view('backend.sales.all_orders.show', compact('order', 'delivery_boys'));
    }

    // Own Product Sales — orders that contain at least one own (non-Droploo) product (b_product_id is null)
    public function own_orders(Request $request)
    {
        CoreComponentRepository::instantiateShopRepository();

        $date = $request->date;
        $sort_search = null;
        $delivery_status = null;
        $order_type = null;

        $orders = Order::with('orderDetails.product')->orderBy('id', 'desc')
            ->whereHas('orderDetails.product', function ($q) {
                $q->whereNull('b_product_id');
            });

        if ($request->has('search') && $request->search != null) {
            $sort_search = $request->search;

            $orders = $orders->where(function ($query) use ($sort_search) {
                $query->where('code', 'like', '%' . $sort_search . '%')
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.phone') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.name') LIKE ?", ['%' . $sort_search . '%'])
                    ->orWhereRaw("JSON_EXTRACT(shipping_address, '$.address') LIKE ?", ['%' . $sort_search . '%']);
            });
        }

        if ($request->order_type != null) {
            $orders = $orders->where('order_type', $request->order_type);
            $order_type = $request->order_type;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($date != null) {
            $orders = $orders->where('created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->where('created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
        }
        $orders = $orders->paginate(15);
        return view('backend.sales.own_orders.index', compact('orders', 'sort_search', 'delivery_status', 'order_type', 'date'));
    }

    public function own_orders_show($id)
    {
        $order = Order::findOrFail(decrypt($id));
        $order_shipping_address = $order->shipping_address ? json_decode($order->shipping_address) : null;
        $city = optional($order_shipping_address)->city;
        $delivery_boys = $city ? User::where('city', $city)->where('user_type', 'delivery_boy')->get() : collect();

        return view('backend.sales.all_orders.show', compact('order', 'delivery_boys'));
    }

    // Inhouse Orders
    public function admin_orders(Request $request)
    {
        CoreComponentRepository::instantiateShopRepository();

        $date = $request->date;
        $payment_status = null;
        $delivery_status = null;
        $sort_search = null;
        $admin_user_id = User::where('user_type', 'admin')->first()->id;
        $orders = Order::orderBy('id', 'desc')
                        ->where('seller_id', $admin_user_id);

        if ($request->payment_type != null) {
            $orders = $orders->where('payment_status', $request->payment_type);
            $payment_status = $request->payment_type;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($request->has('search')) {
            $sort_search = $request->search;
            $orders = $orders->where('code', 'like', '%' . $sort_search . '%');
        }
        if ($date != null) {
            $orders = $orders->whereDate('created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->whereDate('created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
        }

        $orders = $orders->paginate(15);
        return view('backend.sales.inhouse_orders.index', compact('orders', 'payment_status', 'delivery_status', 'sort_search', 'admin_user_id', 'date'));
    }

    public function show($id)
    {
        $order = Order::findOrFail(decrypt($id));
        $order_shipping_address = json_decode($order->shipping_address);
        $delivery_boys = User::where('city', $order_shipping_address->city)
            ->where('user_type', 'delivery_boy')
            ->get();

        $order->viewed = 1;
        $order->save();
        return view('backend.sales.inhouse_orders.show', compact('order', 'delivery_boys'));
    }

    // Seller Orders
    public function seller_orders(Request $request)
    {
        CoreComponentRepository::instantiateShopRepository();

        $date = $request->date;
        $seller_id = $request->seller_id;
        $payment_status = null;
        $delivery_status = null;
        $sort_search = null;
        $admin_user_id = User::where('user_type', 'admin')->first()->id;
        $orders = Order::orderBy('code', 'desc')
            ->where('orders.seller_id', '!=', $admin_user_id);

        if ($request->payment_type != null) {
            $orders = $orders->where('payment_status', $request->payment_type);
            $payment_status = $request->payment_type;
        }
        if ($request->delivery_status != null) {
            $orders = $orders->where('delivery_status', $request->delivery_status);
            $delivery_status = $request->delivery_status;
        }
        if ($request->has('search')) {
            $sort_search = $request->search;
            $orders = $orders->where('code', 'like', '%' . $sort_search . '%');
        }
        if ($date != null) {
            $orders = $orders->whereDate('created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->whereDate('created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
        }
        if ($seller_id) {
            $orders = $orders->where('seller_id', $seller_id);
        }

        $orders = $orders->paginate(15);
        return view('backend.sales.seller_orders.index', compact('orders', 'payment_status', 'delivery_status', 'sort_search', 'admin_user_id', 'seller_id', 'date'));
    }

    public function seller_orders_show($id)
    {
        $order = Order::findOrFail(decrypt($id));
        $order->viewed = 1;
        $order->save();
        return view('backend.sales.seller_orders.show', compact('order'));
    }


    // Pickup point orders
    public function pickup_point_order_index(Request $request)
    {
        $date = $request->date;
        $sort_search = null;

        if (Auth::user()->user_type == 'staff' && Auth::user()->staff->pick_up_point != null) {
            $orders = DB::table('orders')
                ->orderBy('code', 'desc')
                ->join('order_details', 'orders.id', '=', 'order_details.order_id')
                ->where('order_details.pickup_point_id', Auth::user()->staff->pick_up_point->id)
                ->select('orders.id')
                ->distinct();

            if ($request->has('search')) {
                $sort_search = $request->search;
                $orders = $orders->where('code', 'like', '%' . $sort_search . '%');
            }
            if ($date != null) {
                $orders = $orders->whereDate('orders.created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->whereDate('orders.created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
            }

            $orders = $orders->paginate(15);

            return view('backend.sales.pickup_point_orders.index', compact('orders', 'sort_search', 'date'));
        } else {
            $orders = DB::table('orders')
                ->orderBy('code', 'desc')
                ->join('order_details', 'orders.id', '=', 'order_details.order_id')
                ->where('order_details.shipping_type', 'pickup_point')
                ->select('orders.id')
                ->distinct();

            if ($request->has('search')) {
                $sort_search = $request->search;
                $orders = $orders->where('code', 'like', '%' . $sort_search . '%');
            }
            if ($date != null) {
                $orders = $orders->whereDate('orders.created_at', '>=', date('Y-m-d', strtotime(explode(" to ", $date)[0])))->whereDate('orders.created_at', '<=', date('Y-m-d', strtotime(explode(" to ", $date)[1])));
            }

            $orders = $orders->paginate(15);

            return view('backend.sales.pickup_point_orders.index', compact('orders', 'sort_search', 'date'));
        }
    }

    public function pickup_point_order_sales_show($id)
    {
        if (Auth::user()->user_type == 'staff') {
            $order = Order::findOrFail(decrypt($id));
            $order_shipping_address = json_decode($order->shipping_address);
            $delivery_boys = User::where('city', $order_shipping_address->city)
                ->where('user_type', 'delivery_boy')
                ->get();

            return view('backend.sales.pickup_point_orders.show', compact('order', 'delivery_boys'));
        } else {
            $order = Order::findOrFail(decrypt($id));
            $order_shipping_address = json_decode($order->shipping_address);
            $delivery_boys = User::where('city', $order_shipping_address->city)
                ->where('user_type', 'delivery_boy')
                ->get();

            return view('backend.sales.pickup_point_orders.show', compact('order', 'delivery_boys'));
        }
    }

    /**
     * Display a single sale to admin.
     *
     * @return \Illuminate\Http\Response
     */


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
     public function store(Request $request)
    {

             if(Auth::user()){
                   $carts = Cart::where('user_id', Auth::user()->id)
            ->get();
         

        if ($carts->isEmpty()) {
            flash(translate('Your cart is empty'))->warning();
            return redirect()->route('home');
        }
        

        $address = Address::where('id', $carts[0]['address_id'])->first();
        $shippingAddress = [];
        if ($address != null) {
            $shippingAddress['name']        = Auth::user()->name;
            $shippingAddress['email']       = Auth::user()->email;
            $shippingAddress['address']     = $address->address;
            $shippingAddress['country']     = $address->country->name;
            $shippingAddress['state']       = $address->state->name;
            $shippingAddress['city']        = $address->city->name;
            $shippingAddress['postal_code'] = $address->postal_code;
            $shippingAddress['phone']       = $address->phone;
            if ($address->latitude || $address->longitude) {
                $shippingAddress['lat_lang'] = $address->latitude . ',' . $address->longitude;
            }
        }

        $combined_order = new CombinedOrder;
        $combined_order->user_id = Auth::user()->id;
        $combined_order->shipping_address = json_encode($shippingAddress);
        $combined_order->save();

        $seller_products = array();
        foreach ($carts as $cartItem){
            $product_ids = array();
            $product = Product::find($cartItem['product_id']);
            if(isset($seller_products[$product->user_id])){
                $product_ids = $seller_products[$product->user_id];
            }
            array_push($product_ids, $cartItem);
            $seller_products[$product->user_id] = $product_ids;
        }

        foreach ($seller_products as $seller_product) {
            $order = new Order;
            $order->combined_order_id = $combined_order->id;
            $order->user_id = Auth::user()->id;
            $order->shipping_address = $combined_order->shipping_address;

            $order->payment_type = $request->payment_option;
            $order->delivery_viewed = '0';
            $order->payment_status_viewed = '0';
            $order->code = generate_order_code();
            $order->date = strtotime('now');
            $order->save();

            $subtotal = 0;
            $tax = 0;
            $shipping = 0;
            $coupon_discount = 0;

            //Order Details Storing
            foreach ($seller_product as $cartItem) {
                $product = Product::find($cartItem['product_id']);

                $subtotal += $cartItem['price'] * $cartItem['quantity'];
                $tax += $cartItem['tax'] * $cartItem['quantity'];
                $coupon_discount += $cartItem['discount'];

                $product_variation = $cartItem['variation'];

                $product_stock = $product->stocks->where('variant', $product_variation)->first();
                if ($product->digital != 1 && $cartItem['quantity'] > $product_stock->qty) {
                    flash(translate('The requested quantity is not available for ') . $product->getTranslation('name'))->warning();
                    $order->delete();
                    return redirect()->route('cart')->send();
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

                $shipping += $order_detail->shipping_cost;

                if ($cartItem['shipping_type'] == 'pickup_point') {
                    $order_detail->pickup_point_id = $cartItem['pickup_point'];
                }
                //End of storing shipping cost

                $order_detail->quantity = $cartItem['quantity'];
                $order_detail->save();

                $product->num_of_sale += $cartItem['quantity'];
                $product->save();

                $order->seller_id = $product->user_id;

                if ($product->added_by == 'seller' && $product->user->seller != null){
                    $seller = $product->user->seller;
                    $seller->num_of_sale += $cartItem['quantity'];
                    $seller->save();
                }

                if (addon_is_activated('affiliate_system') && class_exists('App\\Http\\Controllers\\AffiliateController')) {
                    if ($order_detail->product_referral_code) {
                        $referred_by_user = User::where('referral_code', $order_detail->product_referral_code)->first();

                        if ($referred_by_user) {
                            $affiliateController = new \App\Http\Controllers\AffiliateController;
                            $affiliateController->processAffiliateStats($referred_by_user->id, 0, $order_detail->quantity, 0, 0);
                        }
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
                $coupon_usage->user_id = Auth::user()->id;
                $coupon_usage->coupon_id = Coupon::where('code', $seller_product[0]->coupon_code)->first()->id;
                $coupon_usage->save();
            }

            $combined_order->grand_total += $order->grand_total;

            $order->save();
        }

        $combined_order->save();

        $request->session()->put('combined_order_id', $combined_order->id);
                 
             }else{
                 
                 
         // $tempid=Cart::select('temp_user_id')->get();
        // $tempids=$tempid->temp_user_id;
        $carts = Cart::where('temp_user_id',$request->session()->get('temp_user_id'))
            ->get();
              $cat= $carts->count();
        if ($carts->isEmpty()) {
            flash(translate('Your cart is empty'))->warning();
            return redirect()->route('home');
        }

        // $address = Address::where('id', $carts[0]['address_id'])->first();
        $address=null;

        $shippingAddress = [];
       
        if ($address == null) {
            $shippingAddress['name']        = $request->name;
            $shippingAddress['email']       = $request->email;
            $shippingAddress['address']     = $request->address;
            $shippingAddress['country']     = "Bangladesh";
            $shippingAddress['state']       = "null";
            $shippingAddress['city']        = $request->city;
            $shippingAddress['postal_code'] = "null";
            $shippingAddress['phone']       = $request->phone;
            // if ($address->latitude || $address->longitude) {
            //     $shippingAddress['lat_lang'] = $address->latitude . ',' . $address->longitude;
            // }
        }
        

        $combined_order = new CombinedOrder;
        $combined_order->user_id ="NULL";
        $combined_order->shipping_address = json_encode($shippingAddress);
        $combined_order->save();

        $seller_products = array();
        foreach ($carts as $cartItem){
            $product_ids = array();
            $product = Product::find($cartItem['product_id']);
            if(isset($seller_products[$product->user_id])){
                $product_ids = $seller_products[$product->user_id];
            }
            array_push($product_ids, $cartItem);
            $seller_products[$product->user_id] = $product_ids;
        }

        foreach ($seller_products as $seller_product) {
            $order = new Order;
            $order->combined_order_id = $combined_order->id;
            $order->user_id = "NULL";
            $order->shipping_address = $combined_order->shipping_address;
            $order->shipping_type =$request->city;
            if ($carts[0]['shipping_type'] == 'pickup_point') {
                $order->pickup_point_id = $cartItem['pickup_point'];
            }
            $order->payment_type = "cash_on_delivery";
            $order->delivery_viewed = '0';
            $order->payment_status_viewed = '0';
            $order->code = generate_order_code();
            $order->date = strtotime('now');
            $order->save();

            $subtotal = 0;
            $tax = 0;
            $shipping = 0;
            $coupon_discount = 0;

            //Order Details Storing
            foreach ($seller_product as $cartItem) {
                $product = Product::find($cartItem['product_id']);

                $subtotal += $cartItem['price'] * $cartItem['quantity'];
                $tax += $cartItem['tax'] * $cartItem['quantity'];
                $coupon_discount += $cartItem['discount'];

                $product_variation = $cartItem['variation'];

                $product_stock = $product->stocks->where('variant', $product_variation)->first();
                if ($product->digital != 1 && $cartItem['quantity'] > $product_stock->qty) {
                    flash(translate('The requested quantity is not available for ') . $product->getTranslation('name'))->warning();
                    $order->delete();
                    return redirect()->route('cart')->send();
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
                $order_detail->shipping_type =$request->city;
              
               
                $order_detail->product_referral_code = $cartItem['product_referral_code'];
                if($request->city=="In Dhaka City"){
                     
                      $order_detail->shipping_cost = 60/$cat;
                     $shipping +=60/$cat;
                }else if($request->city=="sub city Of Dhaka"){
                    $order_detail->shipping_cost = 100/$cat;
                     $shipping +=100/$cat;
                    
                }else if($request->city=="Out Of Dhaka City"){
                    
                     $order_detail->shipping_cost = 120/$cat;
                     $shipping +=120/$cat;
                }
               
                //End of storing shipping cost

                $order_detail->quantity = $cartItem['quantity'];
                $order_detail->save();

                $product->num_of_sale += $cartItem['quantity'];
                $product->save();

                $order->seller_id = $product->user_id;

                if ($product->added_by == 'seller' && $product->user->seller != null){
                    $seller = $product->user->seller;
                    $seller->num_of_sale += $cartItem['quantity'];
                    $seller->save();
                }

                if (addon_is_activated('affiliate_system') && class_exists('App\\Http\\Controllers\\AffiliateController')) {
                    if ($order_detail->product_referral_code) {
                        $referred_by_user = User::where('referral_code', $order_detail->product_referral_code)->first();

                        if ($referred_by_user) {
                            $affiliateController = new \App\Http\Controllers\AffiliateController;
                            $affiliateController->processAffiliateStats($referred_by_user->id, 0, $order_detail->quantity, 0, 0);
                        }
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
                $coupon_usage->user_id = date('Ymd-His');
                $coupon_usage->coupon_id = Coupon::where('code', $seller_product[0]->coupon_code)->first()->id;
                $coupon_usage->save();
            }

            $combined_order->grand_total += $order->grand_total;

            $order->save();
        }

        $combined_order->save();
        
         $request->session()->put('combined_order_id', $combined_order->id);
        
         flash(translate("Your order has been placed successfully"))->success();
                    return redirect()->route('order_confirmed');
         
     
             }
      
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */


    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $order = Order::findOrFail($id);
        return view('backend.sales.all_orders.edit', compact('order'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Update customer information only if provided
        if ($request->hasAny(['customer_name', 'customer_email', 'customer_phone', 'customer_address'])) {
            $shipping_address = json_decode($order->shipping_address, true);
            if ($shipping_address) {
                if ($request->has('customer_name')) {
                    $shipping_address['name'] = $request->customer_name;
                }
                if ($request->has('customer_email')) {
                    $shipping_address['email'] = $request->customer_email;
                }
                if ($request->has('customer_phone')) {
                    $shipping_address['phone'] = $request->customer_phone;
                }
                if ($request->has('customer_address')) {
                    $shipping_address['address'] = $request->customer_address;
                }
                $order->shipping_address = json_encode($shipping_address);
            }
        }
        
        // Update order status fields only if provided
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }
        if ($request->has('delivery_status')) {
            $order->delivery_status = $request->delivery_status;
        }
        if ($request->has('tracking_code')) {
            $order->tracking_code = $request->tracking_code;
        }
        if ($request->has('note')) {
            $order->notes = $request->note;
        }
        
        // Update order details (quantity, price, discount) only if provided
        $subtotal = 0;
        $shipping = 0;
        $subtotalUpdated = false;
        if ($request->has('order_details')) {
            foreach ($request->order_details as $orderDetailData) {
                $orderDetail = OrderDetail::find($orderDetailData['id']);
                if ($orderDetail) {
                    $quantity = (int) ($orderDetailData['quantity'] ?? $orderDetail->quantity);
                    $unitPrice = (float) ($orderDetailData['price'] ?? ($orderDetail->price / max($orderDetail->quantity, 1)));
                    $discount = (float) ($orderDetailData['discount'] ?? 0);
                    
                    // Update order detail
                    $orderDetail->quantity = $quantity;
                    $orderDetail->price = $unitPrice * $quantity - $discount;
                    $orderDetail->save();
                    
                    // Add to subtotal
                    $subtotal += $orderDetail->price;
                    $shipping += $orderDetail->shipping_cost;
                    $subtotalUpdated = true;
                }
            }
        }
        
        // Update order grand total only if order details were updated
        if ($subtotalUpdated) {
            $order->grand_total = $subtotal + ($shipping ?? 0) + ($order->tax ?? 0);
            $order->discount = $discount;
        }
        
        if ($order->save()) {
            flash(translate('Order has been updated successfully'))->success();
        } else {
            flash(translate('Something went wrong'))->error();
        }
        
        return redirect()->route('all_orders.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        if ($order != null) {
            foreach ($order->orderDetails as $key => $orderDetail) {
                try {

                    $product_stock = ProductStock::where('product_id', $orderDetail->product_id)->where('variant', $orderDetail->variation)->first();
                    if ($product_stock != null) {
                        $product_stock->qty += $orderDetail->quantity;
                        $product_stock->save();
                    }

                } catch (\Exception $e) {

                }

                $orderDetail->delete();
            }
            $order->delete();
            flash(translate('Order has been deleted successfully'))->success();
        } else {
            flash(translate('Something went wrong'))->error();
        }
        return back();
    }

    public function bulk_order_delete(Request $request)
    {
        if ($request->id) {
            foreach ($request->id as $order_id) {
                $this->destroy($order_id);
            }
        }

        return 1;
    }

    public function order_details(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $order->save();
        return view('frontend.user.seller.order_details_seller', compact('order'));
    }

    public function update_delivery_status(Request $request)
{
    // Begin database transaction
    DB::beginTransaction();
    
    try {
        
        $order = Order::findOrFail($request->order_id);
        $order->delivery_viewed = '0';
        $order->save();

        $shippingCharge = $order->orderDetails()->sum('shipping_cost');
        
        // Use 'status' parameter from the AJAX request
        $newStatus = $request->status;

        if ($newStatus === 'transfered') {
            // All transferable products (those that have b_product_id)
            $transferable = $order->orderDetails()->whereHas('product', function ($q) {
                $q->whereNotNull('b_product_id');
            })->get();

            $totalItems = $order->orderDetails()->count();

            // ---------------- CASE 1: All items transferable ----------------
            if ($transferable->count() === $totalItems) {
                $order->delivery_status = 'transfered';
                $order->save();

                // ---------------- API CALL for same order ----------------
                $appKey = get_setting('droploo_app_key', '');
                $appSecret = get_setting('droploo_app_secret', '');
                $userName = get_setting('droploo_username', '');
                $apiEndpoint = 'https://backend.droploo.com/api/product/create-order';

                $order_shipping_address = json_decode($order->shipping_address);
                
                // Add null check for shipping address
                if (!$order_shipping_address) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid shipping address data'
                    ]);
                }

                $payload = [
                    'invoice_number'        => ($order->code ?? $order->id),
                    'customer_name'         => $order_shipping_address->name ?? '',
                    'customer_phone'        => $order_shipping_address->phone ?? '',
                    'delivery_cost'         => (int) $shippingCharge,
                    'customer_address'      => $order_shipping_address->address ?? '',
                    'price'                 => (int) $order->grand_total,
                    'discount'              => 0,
                    'advance'               => 0,
                    'product_quantity'      => $order->orderDetails->sum('quantity'),
                    'delivery_charge_type'  => 'COD',
                    'payment_type'          => 'wallet',
                    'order_type'            => 'Dropshipping',
                    'special_notes'         => $order->notes ?? $request->note ?? "No notes provided",
                    'payment_gateway'       => $order->payment_type ?? 'N/A',
                    'transaction_id'        => $order->payment_details ?? null,
                    'products'              => $order->orderDetails->map(function ($detail) {
                        // Check if product exists and has b_product_id
                        if (!$detail->product || !isset($detail->product->b_product_id) || !$detail->product->b_product_id) {
                            return null;
                        }
                        return [
                            'id'    => $detail->product->b_product_id ?? null,
                            'price' => $detail->price / $detail->quantity,
                            'color' => $detail->variation ?? null,
                            'size'  => $detail->variation ?? null,
                            'qty'   => $detail->quantity,
                        ];
                    })->filter(fn($p) => $p !== null)->values()->all(),
                ];
                // Validate that we have products to transfer
                if (empty($payload['products'])) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'No valid products with b_product_id found for transfer'
                    ]);
                }

                // Add validation for required fields
                if (empty($appKey) || empty($appSecret) || empty($userName)) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'Missing Droploo API credentials'
                    ]);
                }

                try {
                    $response = Http::withHeaders([
                        'App-Secret' => $appSecret,
                        'App-Key'    => $appKey,
                        'Username'   => $userName,
                    ])->post($apiEndpoint, $payload);

                    if (!$response->successful()) {
                        $errorResponse = $response->json();
                        throw new \Exception($errorResponse['message'] ?? 'Unknown API error');
                    }
                } catch (\Exception $e) {
                    // Don't rollback here, let the outer catch handle it
                    throw $e;
                }
            }

            // ---------------- CASE 2: Some items transferable ----------------
            elseif ($transferable->count() > 0) {
                $newOrder = $order->replicate();
                $newOrder->delivery_status = 'transfered';
                $newOrder->save();

                $originalShipping = $shippingCharge;
                $originalTotal = $originalDiscount = $newOrderTotal = $newOrderDiscount = 0;

                foreach ($transferable as $line) {
                    // clone transferable line to new order
                    $newLine = $line->replicate();
                    $newLine->order_id = $newOrder->id;
                    $newLine->save();

                    // calculate new order totals
                    $newOrderTotal += $line->quantity * $line->price;
                    $newOrderDiscount += $order->coupon_discount ?? 0;

                    // remove from original order
                    $line->delete();
                }

                // recalc original order totals
                foreach ($order->orderDetails as $line) {
                    $originalTotal += $line->quantity * $line->price;
                    $originalDiscount += $order->coupon_discount ?? 0;
                }

                // update original order
                $order->grand_total = $originalTotal + $originalShipping - $originalDiscount;
                $order->coupon_discount = $originalDiscount;
                $order->status = 'pending';
                $order->save();

                // update new order
                $newOrder->grand_total = $newOrderTotal + $originalShipping - $newOrderDiscount;
                $newOrder->coupon_discount = $newOrderDiscount;
                $newOrder->save();

                // ---------------- API CALL for new order ----------------
                $appKey = get_setting('droploo_app_key', '');
                $appSecret = get_setting('droploo_app_secret', '');
                $userName = get_setting('droploo_username', '');
                $apiEndpoint = 'https://backend.droploo.com/api/product/create-order';

                $order_shipping_address = json_decode($newOrder->shipping_address);
                
                // Add null check for shipping address
                if (!$order_shipping_address) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid shipping address data for new order'
                    ]);
                }

                $payload = [
                    'invoice_number'        => ($newOrder->code ?? $newOrder->id),
                    'customer_name'         => $order_shipping_address->name ?? '',
                    'customer_phone'        => $order_shipping_address->phone ?? '',
                    'delivery_cost'         => (int) $originalShipping,
                    'customer_address'      => $order_shipping_address->address ?? '',
                    'price'                 => (int) $newOrder->grand_total,
                    'discount'              => 0,
                    'advance'               => 0,
                    'product_quantity'      => $newOrder->orderDetails->sum('quantity'),
                    'delivery_charge_type'  => 'COD',
                    'payment_type'          => 'wallet',
                    'order_type'            => 'Dropshipping',
                    'special_notes'         => $newOrder->notes ?? 'N/A',
                    'payment_gateway'       => $newOrder->payment_type ?? 'N/A',
                    'transaction_id'        => $newOrder->payment_details ?? null,
                    'products'              => $newOrder->orderDetails->map(function ($detail) {
                        // Check if product exists and has b_product_id
                        if (!$detail->product || !isset($detail->product->b_product_id) || !$detail->product->b_product_id) {
                            return null;
                        }
                        return [
                            'id'    => $detail->product->b_product_id ?? null,
                            'price' => $detail->price / $detail->quantity,
                            'color' => $detail->variation ?? null,
                            'size'  => $detail->variation ?? null,
                            'qty'   => $detail->quantity,
                        ];
                    })->filter(fn($p) => $p !== null)->values()->all(),
                ];

                // Validate that we have products to transfer
                if (empty($payload['products'])) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'No valid products with b_product_id found for transfer in new order'
                    ]);
                }

                // Add validation for required fields
                if (empty($appKey) || empty($appSecret) || empty($userName)) {
                    // Commit transaction before returning
                    DB::commit();
                    return response()->json([
                        'success' => false,
                        'message' => 'Missing Droploo API credentials for new order'
                    ]);
                }

                try {
                    $response = Http::withHeaders([
                        'App-Secret' => $appSecret,
                        'App-Key'    => $appKey,
                        'Username'   => $userName,
                    ])->post($apiEndpoint, $payload);

                    if (!$response->successful()) {
                        $errorResponse = $response->json();
                        throw new \Exception($errorResponse['message'] ?? 'Unknown API error');
                    }
                } catch (\Exception $e) {
                    // Don't rollback here, let the outer catch handle it
                    throw $e;
                }
            }
        }

        // ---------------- NON-TRANSFER STATUS ----------------
        else {
            $order->delivery_status = $request->status;
            $order->save();
        }

        // ---------------- WALLET REFUND ----------------
        if ($request->status == 'cancelled' && $order->payment_type == 'wallet') {
            $user = User::find($order->user_id);
            if ($user) {
                $user->balance += $order->grand_total;
                $user->save();
            }
        }

        // ---------------- PRODUCT STOCK / SELLER LOGIC ----------------
        if (Auth::user()->user_type == 'seller') {
            foreach ($order->orderDetails->where('seller_id', Auth::user()->id) as $orderDetail) {
                $orderDetail->delivery_status = $request->status;
                $orderDetail->save();

                if ($request->status == 'cancelled') {
                    $variant = $orderDetail->variation ?? '';
                    $product_stock = ProductStock::where('product_id', $orderDetail->product_id)
                        ->where('variant', $variant)
                        ->first();
                    if ($product_stock) {
                        $product_stock->qty += $orderDetail->quantity;
                        $product_stock->save();
                    }
                }
            }
        } else {
            foreach ($order->orderDetails as $orderDetail) {
                $orderDetail->delivery_status = $request->status;
                $orderDetail->save();

                if ($request->status == 'cancelled') {
                    $variant = $orderDetail->variation ?? '';
                    $product_stock = ProductStock::where('product_id', $orderDetail->product_id)
                        ->where('variant', $variant)
                        ->first();
                    if ($product_stock) {
                        $product_stock->qty += $orderDetail->quantity;
                        $product_stock->save();
                    }
                }
            }
        }

        // ---------------- OTP SYSTEM ----------------
        $smsTemplate = SmsTemplate::where('identifier', 'delivery_status_change')->first();
        if (addon_is_activated('otp_system') && $smsTemplate && $smsTemplate->status == 1) {
            try {
                $shipping_address = json_decode($order->shipping_address);
                if ($shipping_address && isset($shipping_address->phone)) {
                    SmsUtility::delivery_status_change($shipping_address->phone, $order);
                }
            } catch (\Exception $e) {}
        }

        // Commit transaction
        DB::commit();
        
        // Check if this is an AJAX request
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => translate('Delivery status has been updated')
            ]);
        }
        
        flash(translate('Order has been status update successfully'))->success();
        return back();
        
    } catch (\Exception $e) {
        // Rollback transaction on error
        DB::rollBack();
        
        // Check if this is an AJAX request
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        
        flash(translate('An error occurred while updating delivery status: ') . $e->getMessage())->error();
        return back();
    }
}

    public function send_to_steadfast(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        $shipping_address = json_decode($order->shipping_address);
        
        if (!$shipping_address) {
            return response()->json([
                'success' => false,
                'message' => translate('Invalid shipping address data')
            ]);
        }

        $phone = $shipping_address->phone ?? '';
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($phone) > 11) {
            $phone = substr($phone, -11);
        }

        $cod_amount = $order->grand_total;
        if ($order->payment_status == 'paid') {
            $cod_amount = 0;
        }

        $item_description = $order->orderDetails->map(function($detail){
            return ($detail->product->name ?? '') . ' x ' . $detail->quantity;
        })->implode(', ');

        $payload = [
            'invoice'           => $order->code,
            'recipient_name'    => substr($shipping_address->name ?? '', 0, 100),
            'recipient_phone'   => $phone,
            'recipient_address' => substr(($shipping_address->address ?? '') . ', ' . ($shipping_address->city ?? '') . ', ' . ($shipping_address->country ?? ''), 0, 250),
            'cod_amount'        => $cod_amount,
            'note'              => $order->notes ?? '',
            'item_description'  => substr($item_description, 0, 250),
        ];

        $response = SteadfastUtility::create_order($payload);

        if (isset($response['status']) && $response['status'] == 200) {
            $order->delivery_status = 'on_the_way';
            $order->tracking_code = $response['consignment']['tracking_code'] ?? null;
            $order->save();

            return response()->json([
                'success' => true,
                'message' => translate('Order has been sent to Steadfast Courier successfully.')
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $response['message'] ?? translate('Something went wrong with Steadfast API.')
            ]);
        }
    }

    public function get_steadfast_tracking_info(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        
        if (!$order->tracking_code) {
            return response()->json([
                'success' => false,
                'message' => translate('No tracking code available for this order')
            ]);
        }
        
        $tracking_response = SteadfastUtility::get_tracking_info($order->tracking_code);
        
        if (isset($tracking_response['status']) && $tracking_response['status'] == 200) {
            return response()->json([
                'success' => true,
                'tracking_data' => $tracking_response['data'] ?? [],
                'message' => translate('Tracking information retrieved successfully')
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $tracking_response['message'] ?? translate('Failed to retrieve tracking information')
            ]);
        }
    }
    
    public function cancel_steadfast_order(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        
        if (!$order->tracking_code) {
            return response()->json([
                'success' => false,
                'message' => translate('No tracking code available for this order')
            ]);
        }
        
        $cancel_response = SteadfastUtility::cancel_order($order->tracking_code);
        
        if (isset($cancel_response['status']) && $cancel_response['status'] == 200) {
            $order->delivery_status = 'cancelled';
            $order->save();
            
            return response()->json([
                'success' => true,
                'message' => translate('Order cancelled successfully')
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $cancel_response['message'] ?? translate('Failed to cancel order')
            ]);
        }
    }
    
    public function reschedule_steadfast_delivery(Request $request)
    {
        $order = Order::findOrFail($request->order_id);
        
        if (!$order->tracking_code) {
            return response()->json([
                'success' => false,
                'message' => translate('No tracking code available for this order')
            ]);
        }
        
        $reschedule_payload = [
            'tracking_code' => $order->tracking_code,
            'reschedule_date' => $request->reschedule_date,
            'reschedule_time' => $request->reschedule_time,
            'note' => $request->note
        ];
        
        $reschedule_response = SteadfastUtility::reschedule_delivery($reschedule_payload);
        
        if (isset($reschedule_response['status']) && $reschedule_response['status'] == 200) {
            return response()->json([
                'success' => true,
                'message' => translate('Delivery has been rescheduled successfully')
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $reschedule_response['message'] ?? translate('Failed to reschedule delivery')
            ]);
        }
    }
    
    public function update_tracking_code(Request $request) {
        try {
            $order = Order::findOrFail($request->order_id);
            $order->tracking_code = $request->tracking_code;
            $order->save();

            // Check if this is an AJAX request
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => translate('Order tracking code has been updated')
                ]);
            }
            
            return 1;
        } catch (\Exception $e) {
            // Check if this is an AJAX request
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }
            
            return 0;
        }
    }

    public function update_payment_status(Request $request)
    {
        try {
            $order = Order::findOrFail($request->order_id);
            $order->payment_status_viewed = '0';
            $order->save();

            if (Auth::user()->user_type == 'seller') {
                foreach ($order->orderDetails->where('seller_id', Auth::user()->id) as $key => $orderDetail) {
                    $orderDetail->payment_status = $request->status;
                    $orderDetail->save();
                }
            } else {
                foreach ($order->orderDetails as $key => $orderDetail) {
                    $orderDetail->payment_status = $request->status;
                    $orderDetail->save();
                }
            }

            $status = 'paid';
            foreach ($order->orderDetails as $key => $orderDetail) {
                if ($orderDetail->payment_status != 'paid') {
                    $status = 'unpaid';
                }
            }
            $order->payment_status = $status;
            $order->save();


            if ($order->payment_status == 'paid' && $order->commission_calculated == 0) {
                calculateCommissionAffilationClubPoint($order);
            }

            //sends Notifications to user
            NotificationUtility::sendNotification($order, $request->status);

            // Only process Firebase notification if user exists and has a device token
            if (get_setting('google_firebase') == 1 && $order->user && !empty($order->user->device_token)) {
                // Create a temporary object with required properties for Firebase notification
                $notificationData = new \stdClass();
                $notificationData->device_token = $order->user->device_token;
                $notificationData->title = "Order updated !";
                $status = str_replace("_", "", $order->payment_status);
                $notificationData->text = " Your order {$order->code} has been {$status}";

                $notificationData->type = "order";
                $notificationData->id = $order->id;
                $notificationData->user_id = $order->user->id;

                NotificationUtility::sendFirebaseNotification($notificationData);
            }


            $smsTemplate = SmsTemplate::where('identifier', 'payment_status_change')->first();
            if (addon_is_activated('otp_system') && $smsTemplate && $smsTemplate->status == 1) {
                try {
                    $shipping_address = json_decode($order->shipping_address);
                    if ($shipping_address && isset($shipping_address->phone)) {
                        SmsUtility::payment_status_change($shipping_address->phone, $order);
                    }
                } catch (\Exception $e) {

                }
            }
            
            // Check if this is an AJAX request
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => translate('Payment status has been updated')
                ]);
            }
            
            return 1;
        } catch (\Exception $e) {
            // Check if this is an AJAX request
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            }
            
            return 0;
        }
    }

    public function assign_delivery_boy(Request $request)
    {
        if (addon_is_activated('delivery_boy')) {

            $order = Order::findOrFail($request->order_id);
            $order->assign_delivery_boy = $request->delivery_boy;
            $order->delivery_history_date = date("Y-m-d H:i:s");
            $order->save();

            $delivery_history = \App\Models\DeliveryHistory::where('order_id', $order->id)
                ->where('delivery_status', $order->delivery_status)
                ->first();

            if (empty($delivery_history)) {
                $delivery_history = new \App\Models\DeliveryHistory;

                $delivery_history->order_id = $order->id;
                $delivery_history->delivery_status = $order->delivery_status;
                $delivery_history->payment_type = $order->payment_type;
            }
            $delivery_history->delivery_boy_id = $request->delivery_boy;

            $delivery_history->save();

            if (env('MAIL_USERNAME') != null && get_setting('delivery_boy_mail_notification') == '1') {
                $array['view'] = 'emails.invoice';
                $array['subject'] = translate('You are assigned to delivery an order. Order code') . ' - ' . $order->code;
                $array['from'] = env('MAIL_FROM_ADDRESS');
                $array['order'] = $order;

                try {
                    Mail::to($order->delivery_boy->email)->queue(new InvoiceEmailManager($array));
                } catch (\Exception $e) {

                }
            }

            $smsTemplate = SmsTemplate::where('identifier', 'assign_delivery_boy')->first();
            if (addon_is_activated('otp_system') && $smsTemplate && $smsTemplate->status == 1) {
                try {
                    SmsUtility::assign_delivery_boy($order->delivery_boy->phone, $order->code);
                } catch (\Exception $e) {

                }
            }
        }

        return 1;
    }
}
