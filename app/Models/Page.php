<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\CacheService;

class Page extends Model
{
    protected $fillable = [
        'type',
        'title',
        'slug',
        'content',
        'meta_title',
        'meta_description',
        'keywords',
        'meta_image'
    ];

    // Boot the model to add event listeners
    public static function boot()
    {
        parent::boot();

        // Clear cache when a page is created, updated or deleted
        static::created(function ($model) {
            CacheService::clearPageCache();
            CacheService::clearPolicyCache();
        });

        static::updated(function ($model) {
            CacheService::clearPageCache();
            CacheService::clearPolicyCache();
        });

        static::deleted(function ($model) {
            CacheService::clearPageCache();
            CacheService::clearPolicyCache();
        });
    }
}