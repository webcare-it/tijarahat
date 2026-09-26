<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\CacheService;

class BusinessSetting extends Model
{
    // Boot the model to add event listeners
    public static function boot()
    {
        parent::boot();

        // Clear cache when a business setting is updated
        static::updated(function ($model) {
            CacheService::clearSettingsCache();
        });
    }
}