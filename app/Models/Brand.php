<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App;
use App\Services\CacheService;

class Brand extends Model
{

  protected $with = ['brand_translations'];

  // Boot the model to add event listeners
  public static function boot()
  {
      parent::boot();

      // Clear cache when a brand is created, updated or deleted
      static::created(function ($model) {
          CacheService::clearBrandCache();
      });

      static::updated(function ($model) {
          CacheService::clearBrandCache();
      });

      static::deleted(function ($model) {
          CacheService::clearBrandCache();
      });
  }

  public function getTranslation($field = '', $lang = false){
      $lang = $lang == false ? App::getLocale() : $lang;
      $brand_translation = $this->brand_translations->where('lang', $lang)->first();
      return $brand_translation != null ? $brand_translation->$field : $this->$field;
  }

  public function brand_translations(){
    return $this->hasMany(BrandTranslation::class);
  }

    public function translations()
    {
        return $this->hasMany(BrandTranslation::class);
    }


}