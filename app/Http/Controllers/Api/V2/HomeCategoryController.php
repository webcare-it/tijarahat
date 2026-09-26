<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Resources\V2\ProductMiniCollection;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeCategoryController extends Controller
{
    public function index(Request $request)
    {
        // Since HomeCategory model doesn't exist, we'll get the data from BusinessSetting
        $business_settings = \App\Models\BusinessSetting::where('type', 'home_categories')->first();
        $category_ids = json_decode($business_settings->value);
        
        if (!is_array($category_ids)) {
            $category_ids = [];
        }
        
        // Get the actual categories with their data
        $categories = Category::whereIn('id', $category_ids)->get();
        
        // Transform the data to match what HomeCategoryCollection expects
        $groupedData = [];
        foreach ($categories as $category) {
            // Use category name directly without translation
            $categoryName = $category->name;
            
            $groupedData[] = [
                'name' => $categoryName,
                'banner' => $category->banner ? api_asset($category->banner) : null,
                'icon' => $category->icon ? api_asset($category->icon) : null,
                
            ];
        }
        
        // Return using the existing HomeCategoryCollection resource format
        return response()->json([
            'data' => $groupedData,
            'success' => true,
            'status' => 200
        ]);
    }


    public function homeCategoriesProducts(Request $request)
    {
        try {
            // Since HomeCategory model doesn't exist, we'll get the data from BusinessSetting
            $business_settings = \App\Models\BusinessSetting::where('type', 'home_categories')->first();
            
            // Handle case where business setting doesn't exist
            if (!$business_settings) {
                return response()->json([
                    'data' => [],
                    'success' => true,
                    'status' => 200
                ]);
            }
            
            $category_ids = json_decode($business_settings->value);
            
            if (!is_array($category_ids)) {
                $category_ids = [];
            }

            // Normalize and remove invalid values
            $category_ids = array_values(array_filter($category_ids, function ($id) {
                return $id !== null && $id !== '';
            }));

            // If no categories are configured, return empty success response
            if (empty($category_ids)) {
                return response()->json([
                    'data' => [],
                    'success' => true,
                    'status' => 200
                ]);
            }

            // Get categories with their products including subcategories and sub-subcategories
            $result = [];
            $categories = Category::whereIn('id', $category_ids)->orderByRaw("FIELD(id, " . implode(',', $category_ids) . ")")->get();
            
            foreach ($categories as $category) {
                // Get all subcategory IDs for this category (children categories)
                $subcategoryIds = Category::where('parent_id', $category->id)->pluck('id')->toArray();
                
                // Get all sub-subcategory IDs for the subcategories (grandchildren categories)
                $subSubcategoryIds = [];
                if (!empty($subcategoryIds)) {
                    $subSubcategoryIds = Category::whereIn('parent_id', $subcategoryIds)->pluck('id')->toArray();
                }
                
                // Combine all category IDs (main category + subcategories + sub-subcategories)
                $allCategoryIds = array_merge([$category->id], $subcategoryIds, $subSubcategoryIds);
                
                // Get products for all these categories
                $productsQuery = Product::whereIn('category_id', $allCategoryIds)
                    ->where('published', 1);
                
                if ($request->name != "" && $request->name != null) {
                    $productsQuery = $productsQuery->where('name', 'like', '%' . $request->name . '%');
                }
                
                $products = $productsQuery->latest()->paginate(6);
                
                // Use category name directly without translation
                $categoryName = $category->name;
                
                $result[] = [
                    'categoryId' => $category->id,
                    'name' => $categoryName,
                    'products' => new ProductMiniCollection($products)
                ];
            }
            
            return response()->json([
                'data' => $result,
                'success' => true,
                'status' => 200
            ]);
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            \Log::error('HomeCategoryController error: ' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine());
            
            return response()->json([
                'data' => [],
                'success' => false,
                'status' => 500,
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }
}