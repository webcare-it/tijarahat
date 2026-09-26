<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App;
use App\Services\CacheService;

class Category extends Model
{
    // Remove the default with clause to avoid loading translations unnecessarily
    // protected $with = ['category_translations'];

    // Boot the model to add event listeners
    public static function boot()
    {
        parent::boot();

        // Clear cache when a category is created, updated or deleted
        static::created(function ($model) {
            CacheService::clearCategoryCache();
        });

        static::updated(function ($model) {
            CacheService::clearCategoryCache();
        });

        static::deleted(function ($model) {
            CacheService::clearCategoryCache();
        });
    }

    public function getTranslation($field = '', $lang = false){
        $lang = $lang == false ? App::getLocale() : $lang;
        $category_translation = $this->category_translations->where('lang', $lang)->first();
        return $category_translation != null ? $category_translation->$field : $this->$field;
    }

    public function category_translations(){
    	return $this->hasMany(CategoryTranslation::class);
    }

    public function translations(){
    	return $this->hasMany(CategoryTranslation::class);
    }

    public function products(){
    	return $this->hasMany(Product::class);
    }

    public function classified_products(){
    	return $this->hasMany(CustomerProduct::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function childrenCategories()
    {
        return $this->hasMany(Category::class, 'parent_id')->with('categories');
    }

    public function parentCategory()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class);
    }
}