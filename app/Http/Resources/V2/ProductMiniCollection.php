<?php

namespace App\Http\Resources\V2;

use App\Models\Review;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductMiniCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $fields = $request->get('fields', null);

        // Convert fields string to array if provided
        if ($fields) {
            $fields = explode(',', $fields);
        }

        return [
            'data' => $this->collection->map(function ($data) use ($request, $fields) {

                $precision = 2;
                $calculable_price = home_discounted_base_price($data, false);
                $calculable_price = number_format($calculable_price, $precision, '.', '');
                $calculable_price = (float) $calculable_price;

                $firstStock = $data->stocks->first();
                $currentStock = $firstStock ? (integer)$firstStock->qty : 0;

                $result = [
                    'id' => $data->id,
                    'category_name' => $data->category ? $data->category->name : '',
                    'name' => $data->name,
                    'thumbnail_image' => api_asset($data->thumbnail_img),
                    'has_discount' => home_base_price($data, false) != home_discounted_base_price($data, false),
                    'stroked_price' => home_base_price($data),
                    'main_price' => home_discounted_base_price($data),
                    'calculable_price' => $calculable_price,
                    'rating' => (double) $data->rating,
                    'rating_count' => (int) Review::where('product_id', $data->id)->count(),
                    'sales' => (int) $data->num_of_sale,
                    'variant_product' => (int) $data->variant_product,
                    'in_stock' => (boolean) $currentStock > 0 ? true : false,
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
            'status' => 200
        ];
    }
}
