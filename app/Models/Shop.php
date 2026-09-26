<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\CacheService;

class Shop extends Model
{

  protected $with = ['user'];

  // Boot the model to add event listeners
  public static function boot()
  {
      parent::boot();

      // Clear cache when a shop is created, updated or deleted
      static::created(function ($model) {
          CacheService::clearShopCache();
      });

      static::updated(function ($model) {
          CacheService::clearShopCache();
          CacheService::clearShopSpecificCache($model->id);
      });

      static::deleted(function ($model) {
          CacheService::clearShopCache();
          CacheService::clearShopSpecificCache($model->id);
      });
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}