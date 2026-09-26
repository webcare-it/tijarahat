<?php

namespace App\Http\Resources\V2\LandingPage;

use Illuminate\Http\Resources\Json\ResourceCollection;

class LandingPageDetailCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($data) {
                return [
                    'id' => $data->id,
                    'title' => $data->title,
                    'name' => $data->name,
                    'slug' => $data->slug,
                    'sub_title' => $data->sub_title,
                    'deadline' => $data->deadline,
                    'banner_image' => api_asset($data->banner_image),
                    'video_id' => $data->video_id,
                    'feature_1' => $data->feature_1,
                    'feature_2' => $data->feature_2,
                    'feature_3' => $data->feature_3,
                    'feature_4' => $data->feature_4,
                    'feature_5' => $data->feature_5,
                    'feature_6' => $data->feature_6,
                    'feature_7' => $data->feature_7,
                    'feature_8' => $data->feature_8,
                    'description' => $data->description,
                    'short_description' => $data->short_description,
                    'copyright_text' => $data->copyright_text,
                    'regular_price' => $data->regular_price,
                    'discount_price' => $data->discount_price,
                    'products' => new \App\Http\Resources\V2\ProductDetailCollection($data->products),
                    'images' => $this->formatImages($data->images),
                    'reviews' => $this->formatReviews($data->reviews),
                    'created_at' => $data->created_at,
                    'updated_at' => $data->updated_at
                ];
            })
        ];
    }

    private function formatImages($images)
    {
        return $images->map(function($image) {
            return [
                'id' => $image->id,
                'image' => api_asset($image->image)
            ];
        });
    }

    private function formatReviews($reviews)
    {
        return $reviews->map(function($review) {
            return [
                'id' => $review->id,
                'review_image' => api_asset($review->review_image)
            ];
        });
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200
        ];
    }
}