<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Resources\V2\CategoryCollection;
use App\Models\BusinessSetting;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\V2\BrandCollection;
use App\Models\Brand;
use App\Models\Search;
use App\Models\Shop;
use App\Models\Product;

class CategoryController extends Controller
{

    public function index(Request $request, $parent_id = 0)
    {
        // Remove language parameter and use default
        if ($request->has('parent_id') && is_numeric($request->get('parent_id'))) {
            $parent_id = $request->get('parent_id');
        }

        // Optimize query with eager loading and select only necessary fields
        $categories = Category::with(['children.children' => function($query) {
            $query->select('id', 'name', 'banner', 'icon', 'parent_id');
        }])
        ->where('parent_id', $parent_id)
        ->select('id', 'name', 'banner', 'icon', 'parent_id')
        ->orderBy('order_level', 'asc')
        ->get();

        return new CategoryCollection($categories);
    }

    private function getSearchList(Request $request)
    {
        $query_key = $request->query_key;
        $type = $request->type;

        $search_query  = Search::select('id', 'query', 'count');
        if ($query_key != "") {
            $search_query->where('query', 'like', "%{$query_key}%");
        }
        $searches = $search_query->orderBy('count', 'desc')->limit(10)->get();

        if ($type == "product") {
            $product_query = Product::query();
            if ($query_key != "") {
                $product_query->where('name', 'like', '%'.$query_key.'%');
            }

            $products = filter_products($product_query)->limit(3)->get();
        }

        if ($type == "brands") {
            $brand_query = Brand::query();
            if ($query_key != "") {
                $brand_query->where('name', 'like', "%$query_key%");
            }

            $brands = $brand_query->limit(3)->get();
        }

        if ($type == "sellers") {
            $shop_query = Shop::query();
            if ($query_key != "") {
                $shop_query->where('name', 'like', "%$query_key%");
            }

            $shops = $shop_query->limit(3)->get();
        }



        $items = [];

        //shop push
        if ($type == "sellers" &&  !empty($shops)) {
            foreach ($shops as  $shop) {
                $item = [];
                $item['id'] = $shop->id;
                $item['query'] = $shop->name;
                $item['count'] = 0;
                $item['type'] = "shop";
                $item['type_string'] = "Shop";

                $items[] = $item;
            }
        }

        //brand push
        if ($type == "brands" && !empty($brands)) {
            foreach ($brands as  $brand) {
                $item = [];
                $item['id'] = $brand->id;
                $item['query'] = $brand->name;
                $item['count'] = 0;
                $item['type'] = "brand";
                $item['type_string'] = "Brand";

                $items[] = $item;
            }
        }
    
        //product push
        if ($type == "product" &&  !empty($products)) {
            foreach ($products as  $product) {
                $item = [];
                $item['id'] = $product->id;
                $item['query'] = $product->name;
                $item['count'] = 0;
                $item['type'] = "product";
                $item['type_string'] = "Product";

                $items[] = $item;
            }
        }

        //search push
        if (!empty($searches)) {
            foreach ($searches as  $search) {
                $item = [];
                $item['id'] = $search->id;
                $item['query'] = $search->query;
                $item['count'] = intval($search->count);
                $item['type'] = "search";
                $item['type_string'] = "Search";

                $items[] = $item;
            }
        }

        return $items; 
    }

    public function all_utility(Request $request)
    {
        $brands = Brand::where('top', 1)->get();

        
       
        return [
            'message' => 'All Utilities fetched successfully.',
            'success' => true,
            'status' => 200,
            'data' => [
                'categories' => $this->index($request),
                'brands' => new BrandCollection($brands),
                'suggestions' => $this->getSearchList($request),
            ],
        ];
    }

    public function featured(Request $request)
    {
        // Optimize query with select only necessary fields
        $categories = Category::where('featured', 1)
            ->select('id', 'name', 'banner', 'icon')
            ->orderBy('order_level', 'asc')
            ->get();

        return new CategoryCollection($categories);
    }

    public function home(Request $request)
    {
        // Optimize query with select only necessary fields
        $homeCategoryIds = json_decode(get_setting('home_categories')) ?: [];
        $categories = Category::whereIn('id', $homeCategoryIds)
            ->select('id', 'name', 'banner', 'icon')
            ->orderBy('order_level', 'asc')
            ->get();

        return new CategoryCollection($categories);
    }

    public function top(Request $request)
    {
        // Optimize query with select only necessary fields
        $homeCategoryIds = json_decode(get_setting('home_categories')) ?: [];
        $categories = Category::whereIn('id', $homeCategoryIds)
            ->select('id', 'name', 'banner', 'icon')
            ->orderBy('order_level', 'asc')
            ->limit(20)
            ->get();

        return new CategoryCollection($categories);
    }
}