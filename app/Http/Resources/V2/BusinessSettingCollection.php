<?php

namespace App\Http\Resources\V2;

// use App\Models\Language;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BusinessSettingCollection extends ResourceCollection
{
    public function toArray($request)
{
    $formattedData = $this->collection->map(function ($item) {
        $value = $item->type === 'verification_form'
            ? json_decode($item->value, true)
            : $item->value;

        if ($this->isImageType($item->type)) {
            if (is_numeric($value) && !$this->isJsonArray($value)) {
                $value = api_asset($value);
            } elseif ($this->isJsonArray($value)) {
                $decoded = json_decode($value, true);
                if (is_array($decoded)) {
                    $value = array_map(function($id) {
                        return is_numeric($id) ? api_asset($id) : $id;
                    }, $decoded);
                }
            }
        }

        return [
            'type'   => $item->type,
            'value' => $value
        ];
    })->values();

    $formattedData->push([
        'type'   => 'gtm_id',
        'value' => env('TRACKING_ID') 
    ]);

    return [
        'data'    => $formattedData,
        'google_client_id' => env('GOOGLE_CLIENT_ID'),
        // 'languages' => new LanguageCollection(Language::all()),  // Removed language system
        'success' => true,
        'status'  => 200,
    ];
}

    // Helper method to determine if a setting type is an image
    private function isImageType($type)
    {
        $imageTypes = [
            'header_logo',
            'footer_logo',
            'admin_logo',
            'favicon',
            'mobile_logo',
            'sticky_header_logo',
            'login_page_banner',
            'home_slider_images',
            'home_banner1_images',
            'home_banner2_images',
            'home_banner3_images',
            'home_categories_images',
            'payment_method_images',
            'system_logo_white',
            'system_logo_black',
            'site_icon'
        ];
        
        return in_array($type, $imageTypes);
    }

    // Helper method to determine if a value is a JSON array string
    private function isJsonArray($value)
    {
        if (!is_string($value)) {
            return false;
        }
        
        $decoded = json_decode($value, true);
        return is_array($decoded);
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200,
        ];
    }
}