<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    // Removed translation relationship and methods
    
    // Direct access to attributes without translation
    public function getNameAttribute($value)
    {
        return $value;
    }
    
    // Fallback method that returns the field directly
    public function getTranslation($field = '', $lang = false){
        return $this->$field;
    }
}