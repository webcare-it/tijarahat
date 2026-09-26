<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // Static routes
        $staticUrls = [
            ['loc' => $baseUrl . '/',             'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => $baseUrl . '/products',     'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => $baseUrl . '/categories',   'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => $baseUrl . '/brands',       'priority' => '0.7', 'changefreq' => 'weekly'],
        ];

      // Dynamic product URLs
        $products = Product::select('id', 'slug', 'updated_at')
            ->whereNotNull('slug')
            ->where('published', 1)
            ->get();

        $productUrls = $products->map(fn($p) => [
            'loc'        => $baseUrl . '/products/' . $p->id . '/' . $p->slug,
            'lastmod'    => $p->updated_at?->toAtomString(),
            'priority'   => '0.8',
            'changefreq' => 'weekly',
        ])->toArray();

        // Dynamic category URLs
        $categories = Category::select('id', 'slug', 'updated_at')
            ->whereNotNull('slug')
            ->get();

        $categoryUrls = $categories->map(fn($c) => [
            'loc'        => $baseUrl . '/categories/' . $c->id . '/' . $c->slug,
            'lastmod'    => $c->updated_at?->toAtomString(),
            'priority'   => '0.7',
            'changefreq' => 'weekly',
        ])->toArray();

        // Dynamic brand URLs
        $brands = Brand::select('id', 'slug', 'updated_at')
            ->whereNotNull('slug')
            ->get();

        $brandUrls = $brands->map(fn($b) => [
            'loc'        => $baseUrl . '/brands/' . $b->id . '/' . $b->slug,
            'lastmod'    => $b->updated_at?->toAtomString(),
            'priority'   => '0.6',
            'changefreq' => 'monthly',
        ])->toArray();
        $allUrls = array_merge($staticUrls, $productUrls, $categoryUrls, $brandUrls);

        $xml = $this->buildXml($allUrls);

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
            'X-Robots-Tag' => 'noindex',
        ]);
    }

    private function buildXml(array $urls): string
    {
        $items = '';
        foreach ($urls as $url) {
            $items .= "\n    <url>";
            $items .= "\n        <loc>" . htmlspecialchars($url['loc']) . "</loc>";
            if (!empty($url['lastmod'])) {
                $items .= "\n        <lastmod>" . $url['lastmod'] . "</lastmod>";
            }
            if (!empty($url['changefreq'])) {
                $items .= "\n        <changefreq>" . $url['changefreq'] . "</changefreq>";
            }
            if (!empty($url['priority'])) {
                $items .= "\n        <priority>" . $url['priority'] . "</priority>";
            }
            $items .= "\n    </url>";
        }

        return '<?xml version="1.0" encoding="UTF-8"?>' .
            "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' .
            $items .
            "\n" . '</urlset>';
    }
}
