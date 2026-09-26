<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Resources\V2\MetadataCollection;
use App\Models\BusinessSetting;
use App\Models\Product;
use Illuminate\Http\Request;

class MetadataController extends Controller
{
    public function index(Request $request)
    {
        // Get key business settings for metadata
        $settings = BusinessSetting::whereIn('type', [
            'system_logo_white',
            'system_logo_black',
            'site_name',
            'site_motto',
            'site_icon',
            'meta_title',
            'meta_description',
            'meta_keywords',
            'meta_image',
            'default_currency',
            'currency_symbol',
            'show_currency_symbol'
        ])->get();
        
        // Convert settings to associative array for easier access
        $settingsArray = [];
        foreach ($settings as $setting) {
            $settingsArray[$setting->type] = $setting->value;
        }
        
        $metaImage = $settingsArray['meta_image'] ?? null;
        $metaImageUrl = $metaImage ? api_asset($metaImage) : null;
        $favicon = $settingsArray['site_icon'] ? api_asset($settingsArray['site_icon']) : null;
        $logo = $settingsArray['system_logo_white'] ? api_asset($settingsArray['system_logo_white']) : null;
        
        $metadata = [
            'name' => $settingsArray['site_name'] ?? null,
            'motto' => $settingsArray['site_motto'] ?? null,
            'logo' => $logo,
            'favicon' => $favicon,
            'description' => $settingsArray['meta_description'] ?? null,
            'keywords' => $settingsArray['meta_keywords'] ?? null,
            'currency' => $settingsArray['default_currency'] ?? null,
            'currency_symbol' => $settingsArray['currency_symbol'] ?? null,
            'meta_image' => $metaImage,
            'meta_image_url' => $metaImageUrl,
            'meta_title' => $settingsArray['meta_title'] ?? null
        ];
        
        return response()->json([
            'data' => $metadata,
            'success' => true,
            'status' => 200
        ]);
    }
    
    public function getSiteInfo(Request $request)
    {
        $metaImage = get_setting('meta_image');
        $metaImageUrl = $metaImage ? api_asset($metaImage) : null;
        
        $siteInfo = [
            'name' => get_setting('site_name'),
            'motto' => get_setting('site_motto'),
            'logo' => get_setting('system_logo_white'),
            'favicon' => get_setting('site_icon'),
            'description' => get_setting('meta_description'),
            'keywords' => get_setting('meta_keywords'),
            'currency' => get_setting('default_currency'),
            'currency_symbol' => get_setting('currency_symbol'),
            'meta_image' => $metaImage,
            'meta_image_url' => $metaImageUrl
        ];
        
        return response()->json([
            'data' => $siteInfo,
            'success' => true,
            'status' => 200
        ]);
    }
    
    public function getMetaImage(Request $request)
    {
        $metaImage = get_setting('meta_image');
        $metaImageUrl = $metaImage ? api_asset($metaImage) : null;
        
        $metaData = [
            'meta_image' => $metaImage,
            'meta_image_url' => $metaImageUrl,
            'meta_title' => get_setting('meta_title'),
            'meta_description' => get_setting('meta_description'),
            'meta_keywords' => get_setting('meta_keywords')
        ];
        
        return response()->json([
            'data' => $metaData,
            'success' => true,
            'status' => 200
        ]);
    }
    
    public function productMetadata($id)
    {
        $product = Product::where('published', 1)->findOrFail($id);
        
        $metaData = [
            'meta_title' => $product->meta_title ?? $product->name,
            'meta_description' => $product->meta_description ?? strip_tags($product->description),
            'meta_image' => $product->meta_img ? api_asset($product->meta_img) : api_asset($product->thumbnail_img),
        ];
        
        return response()->json([
            'data' => $metaData,
            'success' => true,
            'status' => 200
        ]);
    }
}