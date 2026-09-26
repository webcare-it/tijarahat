<?php

namespace App\Http\Resources\V2;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Review;
use App\Models\Attribute;

class ProductDetailCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($data) {
                try {
                    $precision = 2;
                    $calculable_price = home_discounted_base_price($data, false);
                    $calculable_price = number_format($calculable_price, $precision, '.', '');
                    $calculable_price = floatval($calculable_price);

                    // --- Photos ---
                    $photo_paths = get_images_path($data->photos);
                    $photos = [];
                    if (!empty($photo_paths)) {
                        foreach ($photo_paths as $path) {
                            if (!empty($path)) {
                                $photos[] = [
                                    'variant' => "",
                                    'path' => $path,
                                ];
                            }
                        }
                    }

                    foreach ($data->stocks as $stockItem) {
                        if (!empty($stockItem->image)) {
                            $photos[] = [
                                'variant' => $stockItem->variant,
                                'path' => api_asset($stockItem->image),
                            ];
                        }
                    }

                    // --- Brand ---
                    $brand = [
                        'id' => 0,
                        'name' => "",
                        'logo' => "",
                    ];

                    if ($data->brand) {
                        $brand = [
                            'id' => $data->brand->id,
                            'name' => $data->brand->name,
                            'logo' => api_asset($data->brand->logo),
                        ];
                    }

                    // --- Product name & description ---
                    $translatedName = $data->name;
                    $translatedDescription = $data->description;

                    // Get stock information
                    $firstStock = $data->stocks->first();
                    $sku = $firstStock ? $firstStock->sku : null;
                    $currentStock = $firstStock ? (integer)$firstStock->qty : 0;

                    return [
                        'id' => (integer)$data->id,
                        'name' => $translatedName,
                        'slug' => $data->slug,
                        'added_by' => $data->added_by,
                        'category_id' => $data->category ? $data->category->id : null,
                        'category_name' => $data->category ? $data->category->name : '',
                        'brand_id' => $data->brand ? $data->brand->id : null,
                        'seller_id' => $data->user ? $data->user->id : "",
                        'shop_id' => $data->added_by == 'admin' ? 0 : ($data->user && $data->user->shop ? $data->user->shop->id : ""),
                        'shop_name' => $data->added_by == 'admin' ? 'In House Product' : ($data->user && $data->user->shop ? $data->user->shop->name : ""),
                        'shop_logo' => $data->added_by == 'admin' ? api_asset(get_setting('header_logo')) : ($data->user && $data->user->shop ? api_asset($data->user->shop->logo) : ""),
                        'in_stock' => (boolean) $currentStock > 0 ? true : false,
                        'photos' => $photos,
                        'thumbnail_image' => api_asset($data->thumbnail_img),
                        'tags' => $data->tags ? explode(',', $data->tags) : [],
                        'price_high_low' => $this->formatPriceRange($data),
                        'unit_price' => (double)$data->unit_price,
                        'discount' => (double)$data->discount,
                        'discount_type' => $data->discount_type,
                        'tax' => (double)$data->tax,
                        'tax_type' => $data->tax_type,
                        'choice_options' => $this->convertToChoiceOptions($data->choice_options ? json_decode($data->choice_options) : null),
                        'colors' => $data->colors ? json_decode($data->colors) : [],
                        'has_discount' => home_base_price($data, false) != home_discounted_base_price($data, false),
                        'stroked_price' => home_base_price($data),
                        'main_price' => home_discounted_base_price($data),
                        'calculable_price' => $calculable_price,
                        'currency_symbol' => currency_symbol(),
                        'current_stock' => $currentStock,
                        'min_qty' => (integer)$data->min_qty,
                        'sku' => $sku,
                        'barcode' => $data->barcode ?? "",
                        'external_link' => $data->external_link ?? "",
                        'stock_visibility_state' => $data->stock_visibility_state,
                        'unit' => $data->unit,
                        'rating' => (double)$data->rating,
                        'rating_count' => (integer)Review::where(['product_id' => $data->id])->count(),
                        'earn_point' => (double)$data->earn_point,
                        'meta_title' => $data->meta_title ?? $translatedName,
                        'meta_description' => $data->meta_description ?? $translatedDescription,
                        'description' => $translatedDescription,
                        'video_provider' => $data->video_provider ?? "",
                        'video_link' => $data->video_link ?? "",
                        'brand' => $brand,
                        'pdf' => $data->pdf ? api_asset($data->pdf) : "",
                        'variants' => $this->getAllVariantPrices($data),
                        'is_digital' => (boolean)$data->digital,
                        'is_wholesale' => (boolean)$data->wholesale_product,
                        'is_featured' => (boolean)$data->featured,
                        'is_todays_deal' => (boolean)$data->todays_deal,
                        'published' => (boolean)$data->published,
                    ];
                } catch (\Exception $e) {
                    // Log the error for debugging
                    \Log::error('ProductDetailCollection error for product ID ' . ($data->id ?? 'unknown') . ': ' . $e->getMessage());
                    \Log::debug('Product data structure: ' . json_encode([
                        'id' => $data->id ?? null,
                        'name' => $data->name ?? null,
                        'has_category' => isset($data->category),
                        'has_brand' => isset($data->brand),
                        'has_user' => isset($data->user),
                        'has_stocks' => isset($data->stocks),
                        'stock_count' => $data->stocks->count() ?? 0,
                    ]));

                    // Return a comprehensive error response with available data
                    return [
                        'id' => (integer)($data->id ?? 0),
                        'name' => $data->name ?? 'Product',
                        'slug' => $data->slug ?? '',
                        'error' => 'Product data processing failed',
                        'error_message' => $e->getMessage(),
                        'error_code' => $e->getCode(),
                        'available_fields' => [
                            'basic_info' => isset($data->name) && isset($data->slug),
                            'pricing' => isset($data->unit_price),
                            'images' => isset($data->thumbnail_img),
                            'category' => isset($data->category),
                            'brand' => isset($data->brand),
                        ]
                    ];
                }
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

    // Updated to remove multilingual support
    protected function convertToChoiceOptions($data)
    {
        $result = [];
        if ($data && is_array($data)) {
            foreach ($data as $choice) {
                try {
                    $attribute = Attribute::find($choice->attribute_id ?? null);

                    $item['name'] = $choice->attribute_id ?? '';
                    $item['title'] = $attribute ? $attribute->name : '';
                    $item['options'] = $choice->values ?? [];
                    $result[] = $item;
                } catch (\Exception $e) {
                    // Skip invalid choice options
                    continue;
                }
            }
        }
        return $result;
    }

    protected function formatPriceRange($data)
    {
        try {
            $basePrice = home_discounted_base_price($data, false);
            $discountedPrice = home_discounted_price($data, false);

            // Handle cases where prices might not be in expected format
            $baseParts = explode('-', $basePrice);
            $discountedParts = explode('-', $discountedPrice);

            $baseMin = isset($baseParts[0]) ? (double)$baseParts[0] : 0;
            $discountedMin = isset($discountedParts[0]) ? (double)$discountedParts[0] : 0;
            $discountedMax = isset($discountedParts[1]) ? (double)$discountedParts[1] : $discountedMin;

            if ($baseMin == $discountedMin && $discountedMin == $discountedMax) {
                return format_price($discountedMin);
            } else {
                return "From " . format_price($discountedMin) . " to " . format_price($discountedMax);
            }
        } catch (\Exception $e) {
            return "Price unavailable";
        }
    }

    protected function getAllVariantPrices($product)
    {
        // (Keep your existing variant price logic)
        $variants = [];
        $color_codes = [];

        if (!empty($product->colors)) {
            $color_codes = \App\Models\Color::whereIn('code', json_decode($product->colors))
                ->get(['name', 'code'])
                ->mapWithKeys(fn($item) => [strtolower($item->name) => $item->code])
                ->toArray();
        }

        foreach ($product->stocks as $stock) {
            $price = $stock->price;
            $stockQuantity = $stock->qty;
            $image = $stock->image ? api_asset($stock->image) : "";
            $variantName = $stock->variant ?? "";

            $colorName = '';
            $sizeName = '';

            if (strpos($variantName, '-') !== false) {
                $parts = explode('-', $variantName);
                $colorName = trim($parts[0]);
                if (isset($parts[1])) $sizeName = trim($parts[1]);
            } else {
                if (isset($color_codes[strtolower($variantName)])) {
                    $colorName = trim($variantName);
                } else {
                    $sizeName = trim($variantName);
                }
            }

            $colorCode = $color_codes[strtolower($colorName)] ?? null;

            $discount_applicable = false;
            $now = strtotime(date('d-m-Y H:i:s'));

            if ($product->discount_start_date == null) {
                $discount_applicable = true;
            } elseif ($now >= $product->discount_start_date && $now <= $product->discount_end_date) {
                $discount_applicable = true;
            }

            if ($discount_applicable) {
                if ($product->discount_type == 'percent') {
                    $price -= ($price * $product->discount) / 100;
                } elseif ($product->discount_type == 'amount') {
                    $price -= $product->discount;
                }
            }

            if ($product->tax_type == 'percent') {
                $price += ($price * $product->tax) / 100;
            } elseif ($product->tax_type == 'amount') {
                $price += $product->tax;
            }

            $variants[] = [
                'variant_name' => $variantName,
                'color_name' => $colorName,
                'color_code' => $colorCode,
                'size_name' => $sizeName,
                'variant_price_without_discount' => format_price(convert_price($stock->price)),
                'variant_price' => (double)convert_price($price),
                'variant_price_string' => format_price(convert_price($price)),
                'variant_stock' => intval($stockQuantity),
                'variant_image' => $image,
            ];
        }

        return $variants;
    }
}
