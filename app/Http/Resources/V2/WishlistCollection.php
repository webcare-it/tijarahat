<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;

class WishlistCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($data) {
                $precision = 2;
                $calculable_price = home_discounted_base_price($data->product, false);
                $calculable_price = number_format($calculable_price, $precision, '.', '');
                $calculable_price = floatval($calculable_price);
                return [
                    'id' => (integer) $data->id,
                    'product' => [
                        'id' => $data->product->id,
                        'name' => $data->product->name,
                        'category_name' => $data->product->category->name,
                        'thumbnail_image' => api_asset($data->product->thumbnail_img),
                        'stroked_price' => home_base_price($data->product) ,
                        'main_price' => home_discounted_base_price($data->product),
                        'calculable_price' => $calculable_price ,
                        'rating' => (double) $data->product->rating,
                        'links' => [
                            'details' => route('products.show', $data->product->id),
                        ]
                    ]
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
