<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandTranslation extends Model
{
    protected $fillable = ['brand_id', 'lang', 'name'];
    
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}