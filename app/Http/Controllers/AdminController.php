<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use Artisan;
use Cache;
use CoreComponentRepository;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function admin_dashboard(Request $request)
    {
        CoreComponentRepository::initializeCache();
        $root_categories = Category::where('level', 0)->get();

        $cached_graph_data = Cache::remember('cached_graph_data', 86400, function() use ($root_categories){
            $num_of_sale_data = null;
            $qty_data = null;
            foreach ($root_categories as $key => $category){
                $category_ids = \App\Utility\CategoryUtility::children_ids($category->id);
                $category_ids[] = $category->id;

                $products = Product::with('stocks')->whereIn('category_id', $category_ids)->get();
                $qty = 0;
                $sale = 0;
                foreach ($products as $key => $product) {
                    $sale += $product->num_of_sale;
                    foreach ($product->stocks as $key => $stock) {
                        $qty += $stock->qty;
                    }
                }
                $qty_data .= $qty.',';
                $num_of_sale_data .= $sale.',';
            }
            $item['num_of_sale_data'] = $num_of_sale_data;
            $item['qty_data'] = $qty_data;

            return $item;
        });

        $todays_orders_count = Order::whereDate('created_at', today())->count();
        $pending_orders_count = Order::where('delivery_status', 'pending')->count();
        $cancelled_orders_count = Order::where('delivery_status', 'cancelled')->count();
        $delivered_orders_count = Order::where('delivery_status', 'delivered')->count();

        $low_stock_query = Product::select('products.*', DB::raw('SUM(product_stocks.qty) as total_stock'))
            ->join('product_stocks', 'product_stocks.product_id', '=', 'products.id')
            ->where('products.published', 1)
            ->where('products.low_stock_quantity', '>', 0)
            ->groupBy('products.id')
            ->havingRaw('SUM(product_stocks.qty) <= products.low_stock_quantity');

        $low_stock_products = (clone $low_stock_query)->orderBy('total_stock', 'asc')->limit(10)->get();
        $low_stock_products_count = (clone $low_stock_query)->get()->count();

        $dropship_products_count = Product::whereNotNull('b_product_id')->where('auction_product', 0)->count();
        $own_products_count = Product::whereNull('b_product_id')->where('auction_product', 0)->count();

        return view('backend.dashboard', compact(
            'root_categories',
            'cached_graph_data',
            'todays_orders_count',
            'pending_orders_count',
            'cancelled_orders_count',
            'delivered_orders_count',
            'low_stock_products',
            'low_stock_products_count',
            'dropship_products_count',
            'own_products_count',
        ));
    }

    function clearCache(Request $request)
    {
        Artisan::call('cache:clear');
        flash(translate('Cache cleared successfully'))->success();
        return back();
    }
}
