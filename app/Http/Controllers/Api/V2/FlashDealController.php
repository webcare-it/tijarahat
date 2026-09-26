<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Resources\V2\FlashDealCollection;
use App\Http\Resources\V2\ProductCollection;
use App\Http\Resources\V2\ProductMiniCollection;
use App\Models\FlashDeal;
use App\Models\Product;
use Illuminate\Http\Request;

class FlashDealController extends Controller
{
    public function index()
    {
        $flash_deals = FlashDeal::where('status', 1)->where('start_date', '<=', strtotime(date('d-m-Y')))->where('end_date', '>=', strtotime(date('d-m-Y')))->get();
        return new FlashDealCollection($flash_deals);
    }

    public function products($id){
        $flash_deal = FlashDeal::with('flash_deal_products.product')->find($id);
        
        // Return both flash deal data and products data
        $flashDealData = new FlashDealCollection(collect([$flash_deal]));
        $products = collect();
        
        if ($flash_deal && $flash_deal->flash_deal_products) {
            foreach ($flash_deal->flash_deal_products as $flash_deal_product) {
                if ($flash_deal_product->product) {
                    $products->push($flash_deal_product->product);
                }
            }
        }
        
        $productsData = new ProductMiniCollection($products);
        
        return response()->json([
            'flash_deal' => $flashDealData,
            'products' => $productsData
        ]);
    }
}