<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App;
use App\Services\CacheService;

class Product extends Model {

    protected $fillable = [
        'name', 'added_by', 'user_id', 'category_id', 'brand_id', 'video_provider', 'video_link', 'unit_price',
        'purchase_price', 'unit', 'slug', 'colors', 'choice_options', 'variations', 'thumbnail_img', 'meta_title', 'meta_description','shortdescription'
    ];

    protected $with = ['product_translations', 'taxes'];

    // Boot the model to add event listeners
    public static function boot()
    {
        parent::boot();

        // Clear cache when a product is created, updated or deleted
        static::created(function ($model) {
            self::clearProductCache();
        });

        static::updated(function ($model) {
            self::clearProductCache();
            CacheService::clearRelatedProductCache($model->id);
            CacheService::clearShopSpecificCache($model->user_id);
        });

        static::deleted(function ($model) {
            self::clearProductCache();
            CacheService::clearRelatedProductCache($model->id);
            CacheService::clearShopSpecificCache($model->user_id);
        });
    }

    // Clear product-related caches
    protected static function clearProductCache()
    {
        CacheService::clearProductCache();
        CacheService::clearCategoryCache();
        CacheService::clearBrandCache();
        CacheService::clearFlashDealCache();
    }

    public function getTranslation($field = '', $lang = false) {
        $lang = $lang == false ? App::getLocale() : $lang;
        $product_translations = $this->product_translations->where('lang', $lang)->first();
        return $product_translations != null ? $product_translations->$field : $this->$field;
    }

    public function translations()
    {
        return $this->hasMany(ProductTranslation::class);
    }

    public function product_translations() {
        return $this->hasMany(ProductTranslation::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function orderDetails() {
        return $this->hasMany(OrderDetail::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class)->where('status', 1);
    }

    public function wishlists() {
        return $this->hasMany(Wishlist::class);
    }

    public function stocks() {
        return $this->hasMany(ProductStock::class);
    }

    public function taxes() {
        return $this->hasMany(ProductTax::class);
    }

    public function flash_deal_product() {
        return $this->hasOne(FlashDealProduct::class);
    }

    public function bids() {
        return $this->hasMany(AuctionProductBid::class);
    }

}