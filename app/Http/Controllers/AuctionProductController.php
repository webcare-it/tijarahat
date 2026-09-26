<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuctionProductController extends Controller
{
    public function all_auction_product_list()
    {
        $products = \App\Models\Product::where('auction_product', 1)->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.all_products', compact('products'));
    }

    public function inhouse_auction_products()
    {
        $products = \App\Models\Product::where('auction_product', 1)->where('added_by', 'admin')->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.inhouse_products', compact('products'));
    }

    public function seller_auction_products()
    {
        $products = \App\Models\Product::where('auction_product', 1)->where('added_by', 'seller')->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.seller_products', compact('products'));
    }

    public function admin_auction_product_orders()
    {
        $orders = \App\Models\Order::where('auction_order', 1)->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.orders', compact('orders'));
    }

    public function auction_product_list_seller()
    {
        $seller_id = auth()->user()->id;
        $products = \App\Models\Product::where('auction_product', 1)->where('user_id', $seller_id)->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.seller_index', compact('products'));
    }

    public function seller_auction_product_orders()
    {
        $seller_id = auth()->user()->id;
        $orders = \App\Models\Order::where('auction_order', 1)->whereHas('orderDetails.product', function($query) use ($seller_id) {
            $query->where('user_id', $seller_id);
        })->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.seller_orders', compact('orders'));
    }

    public function index()
    {
        $products = \App\Models\Product::where('auction_product', 1)->orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_products.index', compact('products'));
    }

    public function create()
    {
        $categories = \App\Models\Category::all();
        $brands = \App\Models\Brand::all();
        return view('backend.auction_products.create', compact('categories', 'brands'));
    }

    public function store(Request $request)
    {
        $product = new \App\Models\Product();
        $product->name = $request->name;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->unit_price = $request->unit_price;
        $product->description = $request->description;
        $product->auction_product = 1;
        $product->added_by = 'admin';
        $product->user_id = auth()->user()->id;
        $product->save();
        
        return redirect()->route('auction_products.index')->with('success', 'Auction product created successfully');
    }

    public function show($id)
    {
        $product = \App\Models\Product::findOrFail($id);
        return view('backend.auction_products.show', compact('product'));
    }

    public function edit($id)
    {
        $product = \App\Models\Product::findOrFail($id);
        $categories = \App\Models\Category::all();
        $brands = \App\Models\Brand::all();
        return view('backend.auction_products.edit', compact('product', 'categories', 'brands'));
    }

    public function update(Request $request, $id)
    {
        $product = \App\Models\Product::findOrFail($id);
        $product->name = $request->name;
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->unit_price = $request->unit_price;
        $product->description = $request->description;
        $product->save();
        
        return redirect()->route('auction_products.index')->with('success', 'Auction product updated successfully');
    }

    public function destroy($id)
    {
        $product = \App\Models\Product::findOrFail($id);
        $product->delete();
        return redirect()->route('auction_products.index')->with('success', 'Auction product deleted successfully');
    }

    public function purchase_history_user()
    {
        $user_id = auth()->user()->id;
        $orders = \App\Models\Order::where('user_id', $user_id)->where('auction_order', 1)->orderBy('created_at', 'desc')->paginate(15);
        return view('frontend.auction.purchase_history', compact('orders'));
    }

    public function auction_product_details($slug)
    {
        $product = \App\Models\Product::where('slug', $slug)->where('auction_product', 1)->firstOrFail();
        return view('frontend.auction.product_details', compact('product'));
    }

    public function all_auction_products()
    {
        $products = \App\Models\Product::where('auction_product', 1)->where('published', 1)->orderBy('created_at', 'desc')->paginate(15);
        return view('frontend.auction.all_products', compact('products'));
    }
}