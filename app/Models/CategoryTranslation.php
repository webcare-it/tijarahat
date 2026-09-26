<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryTranslation extends Model
{
    protected $fillable = ['category_id', 'lang', 'name'];
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}