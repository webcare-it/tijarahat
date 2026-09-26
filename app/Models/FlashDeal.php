<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlashDeal extends Model
{
    // Removed the with clause for flash_deal_translations
    
    // Removed the getTranslation method since translation system is removed
    
    // Removed the flash_deal_translations relationship
    
    public function flash_deal_products()
    {
        return $this->hasMany(FlashDealProduct::class);
    }
}