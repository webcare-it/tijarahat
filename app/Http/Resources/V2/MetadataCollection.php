<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MetadataCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($data) {
                // Since we're only using BusinessSetting now, we can simplify this
                // Handle meta image
                $metaImage = null;
                $metaImageUrl = null;
                if ($data->type === 'meta_image' && $data->value) {
                    $metaImage = $data->value;
                    $metaImageUrl = api_asset($metaImage);
                }
                
                // Map business settings to a consistent structure
                $mapping = [
                    'site_name' => 'site_name',
                    'system_logo_white' => 'logo',
                    'address' => 'address',
                    'description' => 'description',
                    'phone' => 'phone',
                    'email' => 'email',
                    'facebook' => 'facebook',
                    'twitter' => 'twitter',
                    'instagram' => 'instagram',
                    'youtube' => 'youtube',
                    'google_plus' => 'google_plus',
                    'site_motto' => 'site_motto',
                    'site_icon' => 'site_icon',
                    'meta_title' => 'meta_title',
                    'meta_description' => 'meta_description',
                    'meta_keywords' => 'meta_keywords',
                    'meta_image' => 'meta_image',
                    'default_currency' => 'default_currency',
                    'currency_symbol' => 'currency_symbol',
                    'show_currency_symbol' => 'show_currency_symbol'
                ];
                
                $key = $mapping[$data->type] ?? $data->type;
                
                return [
                    'type' => 'business_setting',
                    'setting_key' => $key,
                    'setting_type' => $data->type,
                    'value' => $data->value,
                    'meta_image' => $metaImage,
                    'meta_image_url' => $metaImageUrl
                ];
            })
        ];
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200
        ];
    }
}