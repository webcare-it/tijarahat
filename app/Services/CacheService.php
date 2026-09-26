<?php

namespace App\Services;

use Cache;
use App\Models\BusinessSetting;
use App\Models\AppSettings;
use App\Models\Page;
use App\Models\LandingPage;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;

class CacheService
{
    /**
     * Clear all application caches
     */
    public static function clearAll()
    {
        Cache::flush();
    }

    /**
     * Clear specific cache tags
     */
    public static function clearTags($tags)
    {
        if (is_array($tags)) {
            Cache::tags($tags)->flush();
        } else {
            Cache::tags([$tags])->flush();
        }
    }

    /**
     * Clear product-related caches
     */
    public static function clearProductCache()
    {
        // Clear product-related cache keys
        $keys = [
            'app.products_latest',
            'app.products_admin',
            'app.featured_products',
            'app.best_selling_products',
            'app.products_home_en_newest',
            'app.products_home_en_oldest',
            'app.products_home_en_price_low_to_high',
            'app.products_home_en_price_high_to_low'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        
        // Clear search cache
        self::clearSearchCache();
    }

    /**
     * Clear category-related caches
     */
    public static function clearCategoryCache()
    {
        // Clear category-related cache keys
        $keys = [
            'app.categories_0_en',
            'app.featured_categories_en',
            'app.home_categories_en',
            'app.top_categories_en'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear brand-related caches
     */
    public static function clearBrandCache()
    {
        // Clear brand-related cache keys
        $keys = [
            'app.top_brands_en',
            'app.brands_en'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear shop-related caches
     */
    public static function clearShopCache()
    {
        // Clear shop-related cache keys
        $keys = [
            'app.shops_en'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear search-related caches
     */
    public static function clearSearchCache()
    {
        // We can't easily clear all search caches since they're dynamically named
        // In a production environment, you might want to implement a more sophisticated
        // approach using cache tags or a search cache prefix
    }

    /**
     * Clear settings-related caches
     */
    public static function clearSettingsCache()
    {
        $keys = [
            'app.business_settings',
            'app.general_settings',
            'app.settings'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear policy-related caches
     */
    public static function clearPolicyCache()
    {
        $keys = [
            'app.seller_policy',
            'app.support_policy',
            'app.return_policy'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear page-related caches
     */
    public static function clearPageCache()
    {
        $keys = [
            'app.pages'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear landing page-related caches
     */
    public static function clearLandingPageCache()
    {
        $keys = [
            'app.landing_pages'
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear flash deal caches
     */
    public static function clearFlashDealCache()
    {
        Cache::forget('app.flash_deals');
    }

    /**
     * Clear related product caches when a product is updated
     */
    public static function clearRelatedProductCache($productId)
    {
        Cache::forget("app.related_products-$productId");
    }

    /**
     * Clear shop-specific caches when a shop is updated
     */
    public static function clearShopSpecificCache($shopId)
    {
        $keys = [
            "app.shop_info_$shopId",
            "app.shop_of_user_$shopId",
            "app.shop_all_products_$shopId",
            "app.top_selling_products-$shopId",
            "app.featured_products-$shopId",
            "app.new_products-$shopId"
        ];
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear banner and slider caches
     */
    public static function clearBannerCache()
    {
        Cache::forget('app.home_banner_images');
        Cache::forget('app.home_slider_images');
    }

    /**
     * Preload common caches to improve initial load times
     */
    public static function preloadCommonCaches()
    {
        // Preload home page data
        // This would typically be called during deployment or maintenance
    }
}