<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Utility\CategoryUtility;

class CategoryCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $fields = $request->get('fields', null);
        // Check if we need to calculate number of children
        $withChildrenCount = $request->get('with_children_count', false);
        
        // Convert fields string to array if provided
        if ($fields) {
            $fields = explode(',', $fields);
        }

        return [
            'data' => $this->collection->map(function ($category) use ($fields, $withChildrenCount) {
                return $this->formatCategory($category, $fields, $withChildrenCount);
            }),
        ];
    }

    private function formatCategory($category, $fields = null, $withChildrenCount = false)
    {
        $result = [
            'id' => $category->id,
            'name' => $category->name,
            'banner' => api_asset($category->banner),
            'icon' => api_asset($category->icon),
            'number_of_children' => $withChildrenCount ? CategoryUtility::get_immediate_children_count($category->id) : 0,
            'sub_categories' => $category->children
                ? $category->children->map(function ($subCategory) use ($fields, $withChildrenCount) {
                    return [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                        'banner' => api_asset($subCategory->banner),
                        'icon' => api_asset($subCategory->icon),
                        'number_of_children' => $withChildrenCount ? CategoryUtility::get_immediate_children_count($subCategory->id) : 0,
                        'sub_sub_categories' => $subCategory->children
                            ? $subCategory->children->map(function ($subSubCategory) use ($fields, $withChildrenCount) {
                                return [
                                    'id' => $subSubCategory->id,
                                    'name' => $subSubCategory->name,
                                    'banner' => api_asset($subSubCategory->banner),
                                    'icon' => api_asset($subSubCategory->icon),
                                    'number_of_children' => $withChildrenCount ? CategoryUtility::get_immediate_children_count($subSubCategory->id) : 0,
                                ];
                            })
                            : [],
                    ];
                })
                : [],
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
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200,
        ];
    }
}