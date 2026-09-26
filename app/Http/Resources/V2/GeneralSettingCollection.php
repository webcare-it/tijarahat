<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;

class GeneralSettingCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($data) {
                // Handle meta image
                $metaImage = null;
                $metaImageUrl = null;
                if (isset($data->meta_image)) {
                    $metaImage = $data->meta_image;
                    $metaImageUrl = $metaImage ? api_asset($metaImage) : null;
                }
                
                return [
                    'logo' => $data->logo,
                    'site_name' => $data->site_name,
                    'address' => $data->address,
                    'description' => $data->description,
                    'phone' => $data->phone,
                    'email' => $data->email,
                    'facebook' => $data->facebook,
                    'twitter' => $data->twitter,
                    'instagram' => $data->instagram,
                    'youtube' => $data->youtube,
                    'google_plus' => $data->google_plus,
                    'meta_image' => $metaImage,
                    'meta_image_url' => $metaImageUrl,
                    'meta_title' => $data->meta_title ?? null,
                    'meta_keywords' => $data->meta_keywords ?? null
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
