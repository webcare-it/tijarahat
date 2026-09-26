<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPage extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title', 'name', 'slug', 'deadline', 'sub_title', 'banner_image', 
        'video_id', 'feature_1', 'feature_2', 'feature_3', 'feature_4', 
        'feature_5', 'feature_6', 'feature_7', 'feature_8', 'description', 
        'short_description', 'copyright_text', 'regular_price', 'discount_price'
    ];
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'landing_page_product');
    }
    
    public function images()
    {
        return $this->hasMany(LandingPageImage::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(LandingPageReview::class);
    }
}