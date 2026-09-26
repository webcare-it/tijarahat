<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Product;

class FacebookCatalogController extends Controller
{
    public function generateCSV()
    {
        try {
            $products = Product::with(['stocks', 'category', 'brand', 'product_translations'])
                ->where('published', 1)
                ->where('approved', 1)
                ->where('auction_product', 0)
                ->get();

            $baseUrl = rtrim(config('app.url', ''), '/');

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="facebook-catalog.csv"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ];

            $callback = function () use ($products, $baseUrl) {
            $file = fopen('php://output', 'w');

            // Facebook Catalog CSV headers
            fputcsv($file, [
                'id',
                'title',
                'description',
                'availability',
                'condition',
                'price',
                'link',
                'image_link',
                'brand',
                'sale_price',
                'item_group_id',
                'status',
            ]);

            foreach ($products as $product) {
                $availability = $this->getAvailability($product);
                $price = $this->getFormattedPrice($product);
                $salePrice = $this->getSalePrice($product);
                $link = $baseUrl . '/products/' . $product->id . '/' . $product->slug;
                $imageLink = $this->getImageUrl($product);
                $brand = $product->brand ? $product->brand->name : '';
                $status = $product->published ? 'active' : 'inactive';

                fputcsv($file, [
                    $product->id,
                    $this->cleanCsvField($product->getTranslation('name')),
                    $this->cleanCsvField(strip_tags((string) ($product->getTranslation('description') ?? ''))),
                    $availability,
                    'new',
                    $price,
                    $link,
                    $imageLink,
                    $this->cleanCsvField($brand),
                    $salePrice,
                    'group_' . $product->id,
                    $status,
                ]);

                // For variant products, also add each stock variant
                if ($product->variant_product && $product->stocks->count() > 0) {
                    foreach ($product->stocks as $stock) {
                        $variantPrice = $this->getFormattedPrice($product, $stock->price);
                        $variantSalePrice = $this->getSalePrice($product, $stock->price);
                        $variantImage = $stock->image ? $this->getImageUrlById($stock->image) : $imageLink;

                        fputcsv($file, [
                            $product->id . '_' . $stock->id,
                            $this->cleanCsvField((string) ($product->getTranslation('name') ?? '') . ' - ' . ($stock->variant ?? '')),
                            $this->cleanCsvField(strip_tags((string) ($product->getTranslation('description') ?? ''))),
                            $stock->qty > 0 ? 'in stock' : 'out of stock',
                            'new',
                            $variantPrice,
                            $link,
                            $variantImage,
                            $this->cleanCsvField($brand),
                            $variantSalePrice,
                            'group_' . $product->id,
                            $status,
                        ]);
                    }
                }
            }

            fclose($file);
        };

            return response()->stream($callback, 200, $headers);
        } catch (\Exception $e) {
            \Log::error('Facebook Catalog CSV Error: ' . $e->getMessage());
            $errorCallback = function () {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['error', 'Failed to generate catalog. Please try again later.']);
                fclose($file);
            };
            return response()->stream($errorCallback, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="facebook-catalog.csv"',
            ]);
        }
    }

    private function getAvailability($product)
    {
        $qty = 0;
        if ($product->variant_product) {
            foreach ($product->stocks as $stock) {
                $qty += $stock->qty;
            }
        } else {
            $qty = optional($product->stocks->first())->qty ?? 0;
        }

        if ($qty > 0) {
            return 'in stock';
        }

        return 'out of stock';
    }

    private function getFormattedPrice($product, $overridePrice = null)
    {
        $price = $overridePrice ?? $product->unit_price;

        // Apply discount
        $discountApplicable = false;
        if (empty($product->discount_start_date)) {
            $discountApplicable = true;
        } elseif (
            now()->timestamp >= strtotime($product->discount_start_date) &&
            now()->timestamp <= strtotime($product->discount_end_date)
        ) {
            $discountApplicable = true;
        }

        if ($discountApplicable) {
            if ($product->discount_type == 'percent') {
                $price -= ($price * $product->discount) / 100;
            } elseif ($product->discount_type == 'amount') {
                $price -= $product->discount;
            }
        }

        // Add taxes
        foreach ($product->taxes as $productTax) {
            if ($productTax->tax_type == 'percent') {
                $price += ($price * $productTax->tax) / 100;
            } elseif ($productTax->tax_type == 'amount') {
                $price += $productTax->tax;
            }
        }

        $currency = $this->getCurrencyCode();
        return number_format(max(0, $price), 2) . ' ' . $currency;
    }

    private function getSalePrice($product, $overridePrice = null)
    {
        $hasDiscount = false;
        $price = $overridePrice ?? $product->unit_price;

        $discountApplicable = false;
        if (empty($product->discount_start_date)) {
            $discountApplicable = true;
        } elseif (
            now()->timestamp >= strtotime($product->discount_start_date) &&
            now()->timestamp <= strtotime($product->discount_end_date)
        ) {
            $discountApplicable = true;
        }

        if ($discountApplicable && $product->discount > 0) {
            $hasDiscount = true;
            if ($product->discount_type == 'percent') {
                $price -= ($price * $product->discount) / 100;
            } elseif ($product->discount_type == 'amount') {
                $price -= $product->discount;
            }
        }

        if (!$hasDiscount) {
            return '';
        }

        // Add taxes
        foreach ($product->taxes as $productTax) {
            if ($productTax->tax_type == 'percent') {
                $price += ($price * $productTax->tax) / 100;
            } elseif ($productTax->tax_type == 'amount') {
                $price += $productTax->tax;
            }
        }

        $currency = $this->getCurrencyCode();
        return number_format(max(0, $price), 2) . ' ' . $currency;
    }

    private function getImageUrl($product)
    {
        if ($product->thumbnail_img) {
            return uploaded_asset($product->thumbnail_img) ?? '';
        }

        if ($product->photos && is_array($product->photos) && count($product->photos) > 0) {
            return uploaded_asset($product->photos[0]) ?? '';
        }

        return '';
    }

    private function getImageUrlById($id)
    {
        return uploaded_asset($id) ?? '';
    }

    private function getCurrencyCode()
    {
        $currency = \App\Models\Currency::find(get_setting('system_default_currency'));
        return $currency ? $currency->code : 'BDT';
    }

    private function cleanCsvField($value)
    {
        $value = (string) ($value ?? '');
        $value = str_replace(['\\', "\n", "\r"], ['\\\\', ' ', ' '], $value);
        $value = strip_tags($value);
        $value = mb_substr($value, 0, 5000);
        return $value;
    }
}
