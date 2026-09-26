<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageTranslation extends Model
{
    protected $fillable = ['page_id', 'lang', 'title', 'content', 'meta_title', 'meta_description', 'keywords'];
    
    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}