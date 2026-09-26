<?php

/*
  |--------------------------------------------------------------------------
  | Admin Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register admin routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */use App\Http\Controllers\ProductController;

Route::post('/update', 'UpdateController@step0')->name('update');
Route::get('/update/step1', 'UpdateController@step1')->name('update.step1');
Route::get('/update/step2', 'UpdateController@step2')->name('update.step2');


Route::group(['prefix' => 'admin', 'middleware' => ['auth', 'admin']], function() {
    //Update Routes
    Route::get('/dashboard', 'AdminController@admin_dashboard')->name('admin.dashboard')->middleware(['auth', 'admin']);

    Route::get('/droploo/products', [ProductController::class, 'droplooProductList'])->name('droploo.products.all')->middleware(['auth', 'admin']);
    Route::get('/droploo/product/add/{id}', [ProductController::class, 'droplooProductAdd'])->name('droploo.products.add')->middleware(['auth', 'admin']);

    Route::resource('categories', 'CategoryController');
    Route::delete('/categories/{category}', 'CategoryController@destroy')->name('categories.destroy');
    Route::post('/categories/featured', 'CategoryController@updateFeatured')->name('categories.featured');
    Route::post('/bulk-category-delete', 'CategoryController@bulk_delete')->name('categories.bulk-delete');

    Route::resource('brands', 'BrandController');

    Route::get('/products/admin', 'ProductController@admin_products')->name('products.admin');
    Route::get('/products/all', 'ProductController@all_products')->name('products.all');
    Route::get('/products/own', 'ProductController@own_products')->name('products.own');
    Route::get('/products/dropshipping', 'ProductController@dropshipping_products')->name('products.dropshipping');
    Route::get('/products/create', 'ProductController@create')->name('products.create');
    Route::post('/products/store', 'ProductController@store')->name('products.store');
    Route::post('/products/{id}/update', 'ProductController@update')->name('products.update');
    Route::get('/products/admin/{id}/edit', 'ProductController@admin_product_edit')->name('products.admin.edit');
    Route::post('/products/edit', 'ProductController@edit')->name('products.edit');
    Route::post('/products/add-more-choice-option', 'ProductController@add_more_choice_option')->name('products.add-more-choice-option');
    Route::post('/products/sku-combination', 'ProductController@sku_combination')->name('products.sku_combination');
    Route::post('/products/sku-combination-edit', 'ProductController@sku_combination_edit')->name('products.sku_combination_edit');
    Route::get('/products/duplicate/{id}', 'ProductController@duplicate')->name('products.duplicate');
    Route::post('/products/published', 'ProductController@updatePublished')->name('products.published');
    Route::post('/products/todays_deal', 'ProductController@updateTodaysDeal')->name('products.todays_deal');
    Route::post('/products/featured', 'ProductController@updateFeatured')->name('products.featured');
    Route::post('/products/best_selling', 'ProductController@updateBestSelling')->name('products.best_selling');
    Route::post('/products/approved', 'ProductController@updateProductApproval')->name('products.approved');
    Route::post('/products/get_products_by_subcategory', 'ProductController@get_products_by_subcategory')->name('products.get_products_by_subcategory');
    Route::post('/bulk-product-delete', 'ProductController@bulk_product_delete')->name('bulk-product-delete');
    Route::delete('/products/{product}', 'ProductController@destroy')->name('admin.products.destroy');

    // Landing Pages
    Route::resource('landing-pages', 'Backend\LandingPageController', ['as' => 'admin']);
    Route::delete('/landing-pages/delete-image/{id}', 'Backend\LandingPageController@deleteImage')->name('admin.landing-pages.delete-image');
    Route::delete('/landing-pages/delete-review-image/{id}', 'Backend\LandingPageController@deleteReviewImage')->name('admin.landing-pages.delete-review-image');

    Route::resource('sellers', 'SellerController');
    Route::get('sellers_ban/{seller}', 'SellerController@ban')->name('sellers.ban');
    Route::post('/bulk-seller-delete', 'SellerController@bulk_seller_delete')->name('bulk-seller-delete');
    Route::get('/sellers/view/{id}/verification', 'SellerController@show_verification_request')->name('sellers.show_verification_request');
    Route::get('/sellers/approve/{id}', 'SellerController@approve_seller')->name('sellers.approve');
    Route::get('/sellers/reject/{id}', 'SellerController@reject_seller')->name('sellers.reject');
    Route::get('/sellers/login/{id}', 'SellerController@login')->name('sellers.login');
    Route::post('/sellers/payment_modal', 'SellerController@payment_modal')->name('sellers.payment_modal');
    Route::get('/seller/payments', 'PaymentController@payment_histories')->name('sellers.payment_histories');
    Route::get('/seller/payments/show/{id}', 'PaymentController@show')->name('sellers.payment_history');

    Route::resource('customers', 'CustomerController');
    Route::get('customers_ban/{customer}', 'CustomerController@ban')->name('customers.ban');
    Route::get('/customers/login/{customer}', 'CustomerController@login')->name('customers.login');
    Route::post('/bulk-customer-delete', 'CustomerController@bulk_customer_delete')->name('bulk-customer-delete');

    Route::get('/newsletter', 'NewsletterController@index')->name('newsletters.index');
    Route::post('/newsletter/send', 'NewsletterController@send')->name('newsletters.send');
    Route::post('/newsletter/test/smtp', 'NewsletterController@testEmail')->name('test.smtp');

    Route::resource('profile', 'ProfileController');

    Route::post('/business-settings/update', 'BusinessSettingsController@update')->name('business_settings.update');
    Route::post('/business-settings/update/activation', 'BusinessSettingsController@updateActivationSettings')->name('business_settings.update.activation');
    Route::get('/general-setting', 'BusinessSettingsController@general_setting')->name('general_setting.index');
    Route::get('/credentials', 'BusinessSettingsController@credentials')->name('general_setting.credentials');
    Route::get('/activation', 'BusinessSettingsController@activation')->name('activation.index');
    Route::get('/payment-method', 'BusinessSettingsController@payment_method')->name('payment_method.index');
    Route::get('/file_system', 'BusinessSettingsController@file_system')->name('file_system.index');
    Route::get('/social-login', 'BusinessSettingsController@social_login')->name('social_login.index');
    Route::get('/smtp-settings', 'BusinessSettingsController@smtp_settings')->name('smtp_settings.index');
    Route::get('/admin-email', 'BusinessSettingsController@admin_email')->name('admin_email.index');
    Route::get('/google-analytics', 'BusinessSettingsController@google_analytics')->name('google_analytics.index');
    Route::get('/google-recaptcha', 'BusinessSettingsController@google_recaptcha')->name('google_recaptcha.index');
    Route::get('/google-map', 'BusinessSettingsController@google_map')->name('google-map.index');
    Route::get('/google-firebase', 'BusinessSettingsController@google_firebase')->name('google-firebase.index');

    //Facebook Settings
    Route::get('/facebook-chat', 'BusinessSettingsController@facebook_chat')->name('facebook_chat.index');
    Route::post('/facebook_chat', 'BusinessSettingsController@facebook_chat_update')->name('facebook_chat.update');
    Route::get('/facebook-comment', 'BusinessSettingsController@facebook_comment')->name('facebook-comment');
    Route::post('/facebook-comment', 'BusinessSettingsController@facebook_comment_update')->name('facebook-comment.update');
    Route::post('/facebook_domain_verification', 'BusinessSettingsController@facebook_domain_verification_update')->name('facebook_domain_verification.update');

    Route::post('/env_key_update', 'BusinessSettingsController@env_key_update')->name('env_key_update.update');
    Route::post('/payment_method_update', 'BusinessSettingsController@payment_method_update')->name('payment_method.update');
    Route::post('/google_analytics', 'BusinessSettingsController@google_analytics_update')->name('google_analytics.update');
    Route::post('/google_recaptcha', 'BusinessSettingsController@google_recaptcha_update')->name('google_recaptcha.update');
    Route::post('/google-map', 'BusinessSettingsController@google_map_update')->name('google-map.update');
    Route::post('/google-firebase', 'BusinessSettingsController@google_firebase_update')->name('google-firebase.update');
    //Currency
    Route::get('/currency', 'CurrencyController@currency')->name('currency.index');
    Route::post('/currency/update', 'CurrencyController@updateCurrency')->name('currency.update');
    Route::post('/your-currency/update', 'CurrencyController@updateYourCurrency')->name('your_currency.update');
    Route::get('/currency/create', 'CurrencyController@create')->name('currency.create');
    Route::post('/currency/store', 'CurrencyController@store')->name('currency.store');
    Route::post('/currency/currency_edit', 'CurrencyController@edit')->name('currency.edit');
    Route::post('/currency/update_status', 'CurrencyController@update_status')->name('currency.update_status');

    //Tax
    Route::resource('tax', 'TaxController');
    Route::post('tax-status', 'TaxController@change_tax_status')->name('taxes.tax-status');


    Route::get('/verification/form', 'BusinessSettingsController@seller_verification_form')->name('seller_verification_form.index');
    Route::post('/verification/form', 'BusinessSettingsController@seller_verification_form_update')->name('seller_verification_form.update');
    Route::get('/vendor_commission', 'BusinessSettingsController@vendor_commission')->name('business_settings.vendor_commission');
    Route::post('/vendor_commission_update', 'BusinessSettingsController@vendor_commission_update')->name('business_settings.vendor_commission.update');

    // website setting
    Route::group(['prefix' => 'website'], function() {
        Route::get('/footer', 'WebsiteController@footer')->name('website.footer');
        Route::get('/header', 'WebsiteController@header')->name('website.header');
        Route::get('/appearance', 'WebsiteController@appearance')->name('website.appearance');
        Route::get('/pages', 'WebsiteController@pages')->name('website.pages');
        Route::resource('custom-pages', 'PageController');
    });

    Route::resource('roles', 'RoleController');

    Route::get('/fraud_checker', 'FraudCheckerController@index')->name('fraud_checker');


    Route::resource('staffs', 'StaffController');

    Route::resource('flash_deals', 'FlashDealController');
    Route::post('/flash_deals/update_status', 'FlashDealController@update_status')->name('flash_deals.update_status');
    Route::post('/flash_deals/update_featured', 'FlashDealController@update_featured')->name('flash_deals.update_featured');
    Route::post('/flash_deals/product_discount', 'FlashDealController@product_discount')->name('flash_deals.product_discount');
    Route::post('/flash_deals/product_discount_edit', 'FlashDealController@product_discount_edit')->name('flash_deals.product_discount_edit');

    //Subscribers
    Route::get('/subscribers', 'SubscriberController@index')->name('subscribers.index');
    Route::delete('/subscribers/{subscriber}', 'SubscriberController@destroy')->name('subscriber.destroy');

    // Route::get('/orders', 'OrderController@admin_orders')->name('orders.index.admin');
    // Route::get('/orders/{id}/show', 'OrderController@show')->name('orders.show');
    // Route::get('/sales/{id}/show', 'OrderController@sales_show')->name('sales.show');
    // Route::get('/sales', 'OrderController@sales')->name('sales.index');
    // All Orders
    Route::get('/all_orders', 'OrderController@all_orders')->name('all_orders.index');
    Route::get('/all_orders/{id}/show', 'OrderController@all_orders_show')->name('all_orders.show');

    // Droploo Product Sales
    Route::get('/droploo_orders', 'OrderController@droploo_orders')->name('droploo_orders.index');
    Route::get('/droploo_orders/{id}/show', 'OrderController@droploo_orders_show')->name('droploo_orders.show');

    // Own Product Sales
    Route::get('/own_orders', 'OrderController@own_orders')->name('own_orders.index');
    Route::get('/own_orders/{id}/show', 'OrderController@own_orders_show')->name('own_orders.show');

    // Manual Order
    Route::get('/manual-orders', 'ManualOrderController@index')->name('manual_orders.index');
    Route::get('/manual-orders/products', 'ManualOrderController@products')->name('manual_orders.products');
    Route::get('/manual-orders/shipping-costs', 'ManualOrderController@getShippingCosts')->name('manual_orders.shipping_costs');
    Route::get('/manual-orders/cart', 'ManualOrderController@cart')->name('manual_orders.cart.index');
    Route::post('/manual-orders/cart', 'ManualOrderController@addToCart')->name('manual_orders.cart.add');
    Route::post('/manual-orders/cart/{id}/quantity', 'ManualOrderController@updateQuantity')->name('manual_orders.cart.update_quantity');
    Route::delete('/manual-orders/cart/{id}', 'ManualOrderController@destroyCartItem')->name('manual_orders.cart.destroy');
    Route::post('/manual-orders/discount', 'ManualOrderController@applyDiscount')->name('manual_orders.discount');
    Route::post('/manual-orders/shipping', 'ManualOrderController@applyShipping')->name('manual_orders.shipping');
    Route::post('/manual-orders/coupon', 'ManualOrderController@applyCoupon')->name('manual_orders.coupon');
    Route::post('/manual-orders/place', 'ManualOrderController@placeOrder')->name('manual_orders.place');

    // Inhouse Orders
    Route::get('/inhouse-orders', 'OrderController@admin_orders')->name('inhouse_orders.index');
    Route::get('/inhouse-orders/{id}/show', 'OrderController@show')->name('inhouse_orders.show');

    // Seller Orders
    Route::get('/seller_orders', 'OrderController@seller_orders')->name('seller_orders.index');
    Route::get('/seller_orders/{id}/show', 'OrderController@seller_orders_show')->name('seller_orders.show');

    Route::post('/bulk-order-status', 'OrderController@bulk_order_status')->name('bulk-order-status');


    // Pickup point orders
    Route::get('orders_by_pickup_point', 'OrderController@pickup_point_order_index')->name('pick_up_point.order_index');
    Route::get('/orders_by_pickup_point/{id}/show', 'OrderController@pickup_point_order_sales_show')->name('pick_up_point.order_show');

    Route::delete('/orders/destroy/{id}', 'OrderController@destroy')->name('orders.destroy');
    Route::post('/bulk-order-delete', 'OrderController@bulk_order_delete')->name('bulk-order-delete');
    Route::post('/orders/send-to-steadfast', 'OrderController@send_to_steadfast')->name('orders.send_to_steadfast');
    Route::post('/orders/steadfast-tracking-info', 'OrderController@get_steadfast_tracking_info')->name('orders.steadfast_tracking_info');
    Route::post('/orders/cancel-steadfast-order', 'OrderController@cancel_steadfast_order')->name('orders.cancel_steadfast_order');
    Route::post('/orders/reschedule-steadfast-delivery', 'OrderController@reschedule_steadfast_delivery')->name('orders.reschedule_steadfast_delivery');
    Route::post('/orders/update-tracking-code', 'OrderController@update_tracking_code')->name('orders.update_tracking_code');
    Route::post('/orders/delivery-boy-assign', 'OrderController@assign_delivery_boy')->name('orders.delivery-boy-assign');
    Route::post('/orders/update-delivery-status', 'OrderController@update_delivery_status')->name('orders.update_delivery_status');
    Route::post('/orders/update-payment-status', 'OrderController@update_payment_status')->name('orders.update_payment_status');
    Route::get('/orders/{id}/edit', 'OrderController@edit')->name('orders.edit');
    Route::put('/orders/{id}/update', 'OrderController@update')->name('orders.update');
    Route::put('/orders/{id}', 'OrderController@update')->name('orders.update.put');
    Route::get('/invoice/download/{id}', 'InvoiceController@invoice_download')->name('invoice.download');

    Route::post('/pay_to_seller', 'CommissionController@pay_to_seller')->name('commissions.pay_to_seller');

    //Reports
    Route::get('/stock_report', 'ReportController@stock_report')->name('stock_report.index');
    Route::get('/in_house_sale_report', 'ReportController@in_house_sale_report')->name('in_house_sale_report.index');
    Route::get('/own_products_sale_report', 'ReportController@own_products_sale_report')->name('own_products_sale_report.index');
    Route::get('/seller_sale_report', 'ReportController@seller_sale_report')->name('seller_sale_report.index');
    Route::get('/wish_report', 'ReportController@wish_report')->name('wish_report.index');
    Route::get('/user_search_report', 'ReportController@user_search_report')->name('user_search_report.index');
    Route::get('/wallet-history', 'ReportController@wallet_transaction_history')->name('wallet-history.index');

    //Blog Section
    Route::resource('blog-category', 'BlogCategoryController');
    Route::delete('/blog-category/destroy/{id}', 'BlogCategoryController@destroy')->name('blog-category.destroy');
    Route::resource('blog', 'BlogController');
    Route::delete('/blog/destroy/{id}', 'BlogController@destroy')->name('blog.destroy');
    Route::post('/blog/change-status', 'BlogController@change_status')->name('blog.change-status');

    //Coupons
    Route::resource('coupon', 'CouponController');
    Route::delete('/coupon/destroy/{id}', 'CouponController@destroy')->name('coupon.destroy');
    Route::post('/coupon/get_coupon_form', 'CouponController@get_coupon_form')->name('coupon.get_coupon_form');
    Route::post('/coupon/get_coupon_form_edit', 'CouponController@get_coupon_form_edit')->name('coupon.get_coupon_form_edit');

    //Reviews
    Route::get('/reviews', 'ReviewController@index')->name('reviews.index');
    Route::post('/reviews/published', 'ReviewController@updatePublished')->name('reviews.published');

    //Support_Ticket
    Route::get('support_ticket/', 'SupportTicketController@admin_index')->name('support_ticket.admin_index');
    Route::get('support_ticket/{id}/show', 'SupportTicketController@admin_show')->name('support_ticket.admin_show');
    Route::post('support_ticket/reply', 'SupportTicketController@admin_store')->name('support_ticket.admin_store');

    //Pickup_Points
    Route::resource('pick_up_points', 'PickupPointController');
    Route::get('/pick_up_points/edit/{id}', 'PickupPointController@edit')->name('pick_up_points.edit');
    Route::delete('/pick_up_points/destroy/{id}', 'PickupPointController@destroy')->name('pick_up_points.destroy');

    //conversation of seller customer
    Route::get('conversations', 'ConversationController@admin_index')->name('conversations.admin_index');
    Route::get('conversations/{id}/show', 'ConversationController@admin_show')->name('conversations.admin_show');

    Route::post('/sellers/profile_modal', 'SellerController@profile_modal')->name('sellers.profile_modal');
    Route::post('/sellers/approved', 'SellerController@updateApproved')->name('sellers.approved');

    Route::resource('attributes', 'AttributeController');
    Route::get('/attributes/edit/{id}', 'AttributeController@edit')->name('attributes.edit');
    Route::delete('/attributes/destroy/{id}', 'AttributeController@destroy')->name('attributes.destroy');

    //Attribute Value
    Route::post('/store-attribute-value', 'AttributeController@store_attribute_value')->name('store-attribute-value');
    Route::get('/edit-attribute-value/{id}', 'AttributeController@edit_attribute_value')->name('edit-attribute-value');
    Route::post('/update-attribute-value/{id}', 'AttributeController@update_attribute_value')->name('update-attribute-value');
    Route::delete('/destroy-attribute-value/{id}', 'AttributeController@destroy_attribute_value')->name('destroy-attribute-value');

    //Colors
    Route::get('/colors', 'AttributeController@colors')->name('colors');
    Route::post('/colors/store', 'AttributeController@store_color')->name('colors.store');
    Route::get('/colors/edit/{id}', 'AttributeController@edit_color')->name('colors.edit');
    Route::post('/colors/update/{id}', 'AttributeController@update_color')->name('colors.update');
    Route::delete('/colors/destroy/{id}', 'AttributeController@destroy_color')->name('colors.destroy');

    Route::resource('addons', 'AddonController');
    Route::post('/addons/activation', 'AddonController@activation')->name('addons.activation');

    Route::get('/customer-bulk-upload/index', 'CustomerBulkUploadController@index')->name('customer_bulk_upload.index');
    Route::post('/bulk-user-upload', 'CustomerBulkUploadController@user_bulk_upload')->name('bulk_user_upload');
    Route::post('/bulk-customer-upload', 'CustomerBulkUploadController@customer_bulk_file')->name('bulk_customer_upload');
    Route::get('/user', 'CustomerBulkUploadController@pdf_download_user')->name('pdf.download_user');
    //Customer Package

    Route::resource('customer_packages', 'CustomerPackageController');

    //Classified Products
    Route::get('/classified_products', 'CustomerProductController@customer_product_index')->name('classified_products');
    Route::post('/classified_products/published', 'CustomerProductController@updatePublished')->name('classified_products.published');

    //Shipping Configuration
    Route::get('/shipping_configuration', 'BusinessSettingsController@shipping_configuration')->name('shipping_configuration.index');
    Route::post('/shipping_configuration/update', 'BusinessSettingsController@shipping_configuration_update')->name('shipping_configuration.update');

    Route::resource('shipping_costs', 'ShippingCostController')->except(['show']);

    // Route::resource('pages', 'PageController');
    // Route::get('/pages/destroy/{id}', 'PageController@destroy')->name('pages.destroy');

    Route::resource('countries', 'CountryController');
    Route::post('/countries/status', 'CountryController@updateStatus')->name('countries.status');

    Route::resource('states','StateController');
	Route::post('/states/status', 'StateController@updateStatus')->name('states.status');

    Route::resource('cities', 'CityController');
    Route::get('/cities/edit/{id}', 'CityController@edit')->name('cities.edit');
    Route::delete('/cities/destroy/{id}', 'CityController@destroy')->name('cities.destroy');
    Route::post('/cities/status', 'CityController@updateStatus')->name('cities.status');

    Route::view('/system/update', 'backend.system.update')->name('system_update');
    Route::view('/system/server-status', 'backend.system.server_status')->name('system_server');

    // uploaded files
    Route::any('/uploaded-files/file-info', 'AizUploadController@file_info')->name('uploaded-files.info');
    Route::resource('/uploaded-files', 'AizUploadController');
    Route::delete('/uploaded-files/destroy/{id}', 'AizUploadController@destroy')->name('uploaded-files.destroy');

    // Aiz Uploader
    Route::post('/aiz-uploader', 'AizUploadController@show_uploader')->name('aiz-uploader');
    Route::post('/aiz-uploader/upload', 'AizUploadController@upload')->name('aiz-uploader.upload');
    Route::get('/aiz-uploader/get_uploaded_files', 'AizUploadController@get_uploaded_files')->name('aiz-uploader.get_uploaded_files');
    Route::post('/aiz-uploader/get_file_by_ids', 'AizUploadController@get_file_by_ids')->name('aiz-uploader.get_file_by_ids');
    Route::delete('/aiz-uploader/destroy/{id}', 'AizUploadController@destroy')->name('aiz-uploader.destroy');

    Route::get('/all-notification', 'NotificationController@index')->name('admin.all-notification');

    Route::get('/cache-cache', 'AdminController@clearCache')->name('cache.clear');
});