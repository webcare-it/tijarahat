<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;

class BrandCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $fields = $request->get('fields', null);
        
        // Convert fields string to array if provided
        if ($fields) {
            $fields = explode(',', $fields);
        }

        return [
            'data' => $this->collection->map(function ($brand) use ($fields) {
                $result = [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'logo' => api_asset($brand->logo),
                    'links' => [
                        'products' => route('api.products.brand', $brand->id)
                    ],
                ];

                // Return only requested fields if specified
                if ($fields) {
                    $filtered = [];
                    foreach ($fields as $field) {
                        if (isset($result[$field])) {
                            $filtered[$field] = $result[$field];
                        }
                    }
                    return $filtered;
                }

                return $result;
            }),
        ];
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200,
        ];
    }
}