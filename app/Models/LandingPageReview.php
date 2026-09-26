<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageReview extends Model
{
    use HasFactory;
    
    protected $fillable = ['landing_page_id', 'review_image'];
    
    public function landingPage()
    {
        return $this->belongsTo(LandingPage::class);
    }
}