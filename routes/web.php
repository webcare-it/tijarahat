<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\FacebookCatalogController;

// Sitemap - dynamic, generated from DB
Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// Facebook Catalog CSV Feed - public, no auth required
Route::get('/facebook-catalog.csv', [FacebookCatalogController::class, 'generateCSV'])->name('facebook-catalog.csv');



// Robots.txt - dynamic per environment
// Robots.txt - always serve production bot rules
Route::get('/robots.txt', function () {
    $sitemapUrl = rtrim(config('app.url'), '/') . '/sitemap.xml';

    $content = "User-agent: facebookexternalhit\n"
             . "Allow: /\n\n"
             . "User-agent: Facebot\n"
             . "Allow: /\n\n"
             . "User-agent: *\n"
             . "Allow: /\n"
             . "Disallow: /dashboard/\n"
             . "Disallow: /cart/\n"
             . "Disallow: /checkout/\n"
             . "Disallow: /search\n"
             . "Disallow: /admin/\n"
             . "Disallow: /seller/\n"
             . "Disallow: /api/\n"
             . "\n"
             . "Sitemap: {$sitemapUrl}\n";

    return response($content, 200, ['Content-Type' => 'text/plain; charset=utf-8']);
});

// Homepage - Serve React App (but warn admin users about potential session conflicts)
Route::get('/', function() {
    // Optional: You can add a warning or prevent admin access if needed
    // For now, we allow access but admin should be aware of potential issues
    return serveReact('home');
})->name('home');

Auth::routes([
    'verify' => true,
    'login' => false,
]);

// Admin Login Routes - Use admin.web middleware for separate session cookie
Route::middleware(['guest'])->group(function () {
    Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/admin/login', [LoginController::class, 'login'])->name('login');
});

// Logout Route - Support both admin and frontend sessions
Route::middleware(['auth', 'web'])->group(function () {
    Route::match(['get', 'post'], '/logout', '\App\Http\Controllers\Auth\LoginController@logout')->name('logout');
});

// Admin Logout Route - Use admin.web middleware for separate session cookie
Route::middleware(['auth', 'admin'])->group(function () {
    Route::match(['get', 'post'], '/admin/logout', '\App\Http\Controllers\Auth\LoginController@admin_logout')->name('admin.logout');
});

// Invoice download route
Route::get('/invoice/download/{id}', 'InvoiceController@invoice_download')->name('invoice.download');

// Aiz Uploader routes for frontend (used by aiz-core.js)
Route::middleware(['auth'])->group(function () {
    Route::post('/aiz-uploader', 'AizUploadController@show_uploader')->name('aiz-uploader');
    Route::post('/aiz-uploader/upload', 'AizUploadController@upload')->name('aiz-uploader.upload');
    Route::get('/aiz-uploader/get_uploaded_files', 'AizUploadController@get_uploaded_files')->name('aiz-uploader.get_uploaded_files');
    Route::post('/aiz-uploader/get_file_by_ids', 'AizUploadController@get_file_by_ids')->name('aiz-uploader.get_file_by_ids');
    Route::delete('/aiz-uploader/destroy/{id}', 'AizUploadController@destroy')->name('aiz-uploader.destroy');
});

// React App Routes - Catch all for frontend SPA
// These routes serve the React app for all frontend pages
// MUST be after all API, admin, and asset routes

// React App Routes - serve the React SPA
// NOTE: 'dashboard' is intentionally excluded — admin also uses /dashboard
// All admin/* routes are excluded so Laravel handles them normally
$reactRoutes = [
    'signup', 'signin', 'forgot-password',
    'search', 'categories', 'brands', 'products',
    'product', 'flash-deal', 'wishlist', 'cart',
    'checkout', 'track-order', 'orders', 'pages',
    'campaign', '500', 'maintenance', 'complete',
];

// Register catch-all routes for React frontend
foreach ($reactRoutes as $route) {
    Route::get("/{$route}/{any?}", function (string $any = '') use ($route) {
        return serveReact($route, $any);
    })->where('any', '.*');
}

// Dashboard route — only serve React if NOT an admin/seller session
Route::get('/dashboard/{any?}', function (string $any = '') {
    if (auth()->check()) {
        $type = auth()->user()->user_type;
        if ($type === 'admin') {
            return redirect('/admin');
        } elseif ($type === 'seller') {
            return redirect('/seller/dashboard');
        }
    }
    return serveReact('dashboard', $any);
})->where('any', '.*');

// Final catch-all — NEVER intercept admin/* routes
Route::fallback(function () {
    // Let API 404s return JSON
    if (request()->is('api/*')) {
        return response()->json([
            'success' => false,
            'message' => 'API endpoint not found'
        ], 404);
    }

    // For admin/seller/customer routes that don't match — redirect to login or dashboard
    // Don't abort(404) here as it triggers error pages that may crash with null Auth::user()
    if (request()->is('admin/*')) {
        return auth()->check()
            ? redirect('/admin')
            : redirect('/admin/login');
    }

    if (request()->is('seller/*')) {
        return auth()->check()
            ? redirect('/seller/dashboard')
            : redirect('/admin/login');
    }

    if (request()->is('customer/*')) {
        return auth()->check()
            ? redirect('/customer/dashboard')
            : redirect('/');
    }

    // Serve React app for all other unknown routes
    if (file_exists(public_path('app/index.html'))) {
        return serveReact('404');
    }

    abort(404);
});
