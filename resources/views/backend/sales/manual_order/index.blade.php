@extends('backend.layouts.app')

@section('content')

<div class="row gutters-10">
    <div class="col-xl-8">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">{{ translate('Manual Order Builder') }}</h5>
            </div>
            <div class="card-body">
                <div class="row mb-4">
                    <div class="col-md-7 mb-2">
                        <input id="product-search" type="text" class="form-control" placeholder="{{ translate('Search products by name or code') }}">
                        <small id="search-status" class="text-muted" style="display:none;">{{ translate('Searching...') }}</small>
                    </div>
                    <div class="col-md-5 mb-2">
                        <select id="category-filter" class="form-control">
                            <option value="">{{ translate('All Categories') }}</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}">{{ $category->name }}</option>
                            @endforeach
                        </select>
                        <small id="category-status" class="text-muted" style="display:none;">{{ translate('Filtering...') }}</small>
                    </div>
                </div>
                <div id="loading-spinner" class="text-center" style="display:none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">{{ translate('Loading...') }}</span>
                    </div>
                </div>
                <div id="manual-products" class="row"></div>
                <div id="load-more-container" class="text-center mt-3" style="display:none;">
                    <button id="load-more-btn" class="btn btn-primary">{{ translate('Load More') }}</button>
                </div>
                <div id="manual-products-empty" class="text-center text-muted mt-3" style="display:none;">
                    <p>{{ translate('No products found for this search criteria.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-4">
        <div class="card" style="position: sticky; top: 80px;">
            <div class="card-header">
                <h5 class="mb-0">{{ translate('Cart & Order Details') }}</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">{{ translate('Customer Name') }}</label>
                    <input id="customer-name" type="text" class="form-control" value="" placeholder="{{ translate('Customer name') }}">
                </div>
                <div class="mb-3">
                    <label class="form-label">{{ translate('Customer Phone') }}</label>
                    <input id="customer-phone" type="text" class="form-control" value="" placeholder="{{ translate('Customer phone') }}">
                </div>
                <div class="mb-3">
                    <label class="form-label">{{ translate('Customer Email') }}</label>
                    <input id="customer-email" type="email" class="form-control" value="" placeholder="{{ translate('Customer email') }}">
                </div>
                <div class="mb-3">
                    <label class="form-label">{{ translate('Shipping Address') }}</label>
                    <textarea id="customer-address" rows="3" class="form-control" placeholder="{{ translate('Optional address for order') }}"></textarea>
                </div>
                <div class="mb-3">
                    <h6 class="mb-2">{{ translate('Cart Items') }}</h6>
                    <div id="manual-cart-items" class="list-group"></div>
                    <div id="manual-cart-empty" class="text-center text-muted mt-3" style="display:none;">
                        <p>{{ translate('No products added to cart yet.') }}</p>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="row gutters-5" style="font-size: 18px;">
                        
                        <div class="col-6 text-muted">{{ translate('Items count') }}</div>
                        <div class="col-6 text-right fw-semibold" id="summary-item-count">0</div>

                        <div class="col-6 text-muted">{{ translate('Subtotal') }}</div>
                        <div class="col-6 text-right fw-semibold" id="summary-sub-total">{{ single_price(0) }}</div>

                        <div class="col-6 text-muted">{{ translate('Tax') }}</div>
                        <div class="col-6 text-right fw-semibold" id="summary-tax">{{ single_price(0) }}</div>

                        <div class="col-6 text-muted">{{ translate('Discount') }}</div>
                        <div class="col-6 text-right fw-semibold text-danger" id="summary-discount">{{ single_price(0) }}</div>

                        <div class="col-6 text-muted">{{ translate('Coupon') }}</div>
                        <div class="col-6 text-right fw-semibold text-danger" id="summary-coupon">{{ single_price(0) }}</div>

                        <div class="col-6 text-muted">{{ translate('Shipping') }}</div>
                        <div class="col-6 text-right fw-semibold" id="summary-shipping">{{ single_price(0) }}</div>

                        <!-- Grand Total - Stronger Highlight -->
                        <div class="col-6 fw-bold border-top pt-3">{{ translate('Grand Total') }}</div>
                        <div class="col-6 text-right fw-bold text-primary border-top pt-3" id="summary-grand-total" style="font-size: 22px;">
                            {{ single_price(0) }}
                        </div>
                    </div>
                </div>
                <div class="mb-3 d-flex flex-wrap gap-4">
                    <button type="button" class="btn btn-soft-primary btn-sm" id="discount-button">{{ translate('Manual Discount') }}</button>
                    <button type="button" class="btn btn-soft-primary btn-sm" style="margin-left: 4px; margin-right: 4px;" id="shipping-button">{{ translate('Shipping Cost') }}</button>
                    <button type="button" class="btn btn-soft-primary btn-sm" id="coupon-button">{{ translate('Apply Coupon') }}</button>
                </div>
                <div class="text-right">
                    <button type="button" class="btn btn-primary" id="place-order-button">{{ translate('Place Order') }}</button>
                </div>
                <div id="manual-order-message" class="alert alert-success mt-3" role="alert" style="display:none;"></div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="manual-discount-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ translate('Apply Manual Discount') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">{{ translate('Discount Type') }}</label>
                    <select id="manual-discount-type" class="form-control">
                        <option value="flat">{{ translate('Flat Amount') }}</option>
                        <option value="percentage">{{ translate('Percentage') }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" id="discount-label">{{ translate('Discount Amount') }}</label>
                    <input type="number" min="0" step="0.01" id="manual-discount-value" class="form-control" placeholder="{{ translate('Enter discount amount') }}">
                    <small class="text-muted" id="discount-help">{{ translate('Enter flat amount (e.g., 10.00)') }}</small>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Close') }}</button>
                <button type="button" class="btn btn-primary" id="save-discount">{{ translate('Save') }}</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="manual-shipping-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ translate('Select Shipping Cost') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="shipping-costs-container">
                    <div class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">{{ translate('Loading...') }}</span>
                        </div>
                        <p class="mt-2">{{ translate('Loading shipping options...') }}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Cancel') }}</button>
                <button type="button" class="btn btn-primary" id="save-shipping" disabled>{{ translate('Select Shipping') }}</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="manual-coupon-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ translate('Apply Coupon') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" id="manual-coupon-value" class="form-control" placeholder="{{ translate('Coupon code') }}">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ translate('Close') }}</button>
                <button type="button" class="btn btn-primary" id="save-coupon">{{ translate('Apply') }}</button>
            </div>
        </div>
    </div>
</div>

@endsection

@section('style')
<style>
.cart-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
}

#manual-cart-items {
    position: relative;
    min-height: 50px;
}

.product-card {
    transition: all 0.2s ease;
}

.product-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.add-to-cart-button:disabled,
.qty-decrease:disabled,
.qty-increase:disabled,
.remove-cart-item:disabled,
#save-discount:disabled,
#save-shipping:disabled,
#save-coupon:disabled,
#place-order-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.shipping-options .form-check {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
}

.shipping-options .form-check:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
}

.shipping-options .form-check-input:checked ~ .form-check-label {
    color: #007bff;
    font-weight: 600;
}

.shipping-options .form-check-label {
    cursor: pointer;
    margin-bottom: 0;
}
</style>
@endsection

@section('script')
<script type="text/javascript">
    const manualProductsUrl = '{{ route('manual_orders.products') }}';
    const manualCartUrl = '{{ route('manual_orders.cart.index') }}';
    const manualAddToCartUrl = '{{ route('manual_orders.cart.add') }}';
    const manualUpdateQuantityUrl = '{{ url('admin/manual-orders/cart') }}';
    const manualDeleteCartUrl = '{{ url('admin/manual-orders/cart') }}';
    const manualDiscountUrl = '{{ route('manual_orders.discount') }}';
    const manualShippingUrl = '{{ route('manual_orders.shipping') }}';
    const manualShippingCostsUrl = '{{ route('manual_orders.shipping_costs') }}';
    const manualCouponUrl = '{{ route('manual_orders.coupon') }}';
    const manualPlaceOrderUrl = '{{ route('manual_orders.place') }}';
    const appUrl = '{{ env('APP_URL') }}';

    let currentPage = 1;
    let isLoading = false;
    let hasMoreProducts = true;
    let searchTimeout;
    let selectedShippingId = null;



    function showLoading() {
        $('#loading-spinner').show();
        isLoading = true;
    }

    function hideLoading() {
        $('#loading-spinner').hide();
        isLoading = false;
    }

    function renderProducts(products, append = false) {
        const container = $('#manual-products');

        if (!append) {
            container.empty();
            currentPage = 1;
        }

        if (products.length === 0 && !append) {
            $('#manual-products-empty').show();
            $('#load-more-container').hide();
            hasMoreProducts = false;
            return;
        }

        $('#manual-products-empty').hide();

        products.forEach(product => {
            const hasVariant = product.variant_product === 1;

            const variantHtml = hasVariant ? `
                <div class="me-2 flex-grow-1 mb-2">
                    <select class="form-control form-control-sm variant-select" data-product-id="${product.id}">
                        <option value="">{{ translate('Select variant') }}</option>
                        ${product.variants.map(variant => `<option value="${variant}">${variant}</option>`).join('')}
                    </select>
                </div>
            ` : '';

            const card = `
                <div class="col-lg-6 col-md-12" style="margin-bottom: 20px;">
                    <div class="card h-auto product-card" style="margin-bottom: 0px; border-radius: 8px;">
                        <div class="d-flex">
                            <!-- Left: Image -->
                            <div class="flex-shrink-0">
                                <img src="${product.thumbnail}" 
                                     class="product-image" 
                                     style="width: 130px; height: 150px; object-fit: inherit; overflow: hidden; border-top-left-radius: 8px; border-bottom-left-radius: 8px;" 
                                     alt="${product.name}">
                            </div>

                            <!-- Right: Content -->
                            <div class="flex-grow-1 p-2 d-flex flex-column">
                                <a  href="${appUrl}products/${product.id}/${product.name}" target="_blank" title="{{ translate('View') }}">
                                   <h6 class="mb-1" style="color: gray;">${product.name}</h6>
                                </a>
                               

                                <p class="font-weight-bold text-primary">${product.price}</p>

                                ${hasVariant ? `<span class="badge badge-info" style="width: 25%; margin-bottom: 10px">Variant Product</span>` : ''}

                            <!-- Bottom: Variant + Quantity -->
                            <div class="mt-auto">
                                ${variantHtml}
                                <div class="${hasVariant ? 'flex-shrink-0' : 'flex-grow-1'}">
                                    <div class="input-group input-group-sm">
                                        <input type="number" min="1" value="1" 
                                            class="form-control product-quantity" 
                                            data-product-id="${product.id}">
                                        <button type="button" 
                                                class="btn btn-sm btn-primary add-to-cart-button" 
                                                data-product-id="${product.id}">
                                            {{ translate('Add') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.append(card);
        });
    }

    function renderCart(cart) {
        const container = $('#manual-cart-items');
        container.empty();

        if (cart.items.length === 0) {
            $('#manual-cart-empty').show();
        } else {
            $('#manual-cart-empty').hide();
        }

        cart.items.forEach(item => {
            const variantText = item.variation ? `<div class="text-muted small">Variant: ${item.variation}</div>` : '';

            const line = `
                <div class="list-group-item">
                    <div class="d-flex align-items-center">
                        <img src="${item.thumbnail}" class="mr-3" style="width:54px;height:54px;object-fit:cover;" alt="${item.name}">
                        <div class="flex-grow-1">
                        <a href="${appUrl}products/${item.product_id}/${item.name}" target="_blank" title="{{ translate('View') }}">
                            <strong style="color: gray">${item.name}</strong>
                        </a>
                            ${variantText}
                            <div>Price: ৳${item.price}</div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <div class="input-group input-group-sm" style="width:120px;">
                            <div class="input-group-prepend">
                                <button type="button" class="btn btn-outline-secondary qty-decrease" data-id="${item.id}">-</button>
                            </div>
                            <input type="number" min="1" class="form-control quantity-input" data-id="${item.id}" value="${item.quantity}">
                            <div class="input-group-append">
                                <button type="button" class="btn btn-outline-secondary qty-increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-soft-danger btn-sm remove-cart-item" data-id="${item.id}">{{ translate('Delete') }}</button>
                        </div>
                    </div>
                </div>
            `;
            container.append(line);
        });

        selectedShippingId = cart.shipping_id || null;
        $('#summary-item-count').text(cart.item_count);
        $('#summary-sub-total').text(formatPrice(cart.sub_total));
        $('#summary-tax').text(formatPrice(cart.tax));
        
        // Display discount with type indication
        const discountText = cart.discount_type === 'percentage' && cart.sub_total > 0 ? 
            formatPrice(cart.discount) + ' (' + (cart.discount / cart.sub_total * 100).toFixed(1) + '%)' : 
            formatPrice(cart.discount);
        $('#summary-discount').text(discountText);
        
        // Display shipping with name if available
        const shippingText = cart.shipping_name ? 
            cart.shipping_name + ' - ' + formatPrice(cart.shipping_cost) : 
            formatPrice(cart.shipping_cost);
        $('#summary-shipping').text(shippingText);
        
        $('#summary-coupon').text(formatPrice(cart.coupon_discount));
        $('#summary-grand-total').text(formatPrice(cart.grand_total));
    }

    function formatPrice(value) {
        return '{{ currency_symbol() }}' + parseFloat(value).toFixed(2);
    }

    function loadProducts(append = false, page = 1) {
        if (isLoading) return;

        const search = $('#product-search').val();
        const categoryId = $('#category-filter').val();

        // Reset pagination for new searches
        if (!append) {
            currentPage = 1;
            hasMoreProducts = true;
        }

        showLoading();

        const ajaxData = {
            search: search,
            category_id: categoryId,
            page: page,
            per_page: 12
        };


        $.get(manualProductsUrl, ajaxData, function(response) {
            renderProducts(response.products, append);
            hasMoreProducts = response.has_more;
            if (hasMoreProducts) {
                $('#load-more-container').show();
            } else {
                $('#load-more-container').hide();
            }
            hideLoading();
            $('#search-status').hide();
            $('#category-status').hide();
        }).fail(function(xhr, status, error) {
            hideLoading();
            AIZ.plugins.notify('danger', '{{ translate('Error loading products') }}');
        });
    }

    function debouncedLoadProducts() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadProducts(false);
        }, 300); // 300ms delay
    }

    function loadShippingCosts() {
        $.get(manualShippingCostsUrl, function(response) {
            const container = $('#shipping-costs-container');
            container.empty();

            if (response.shipping_costs.length === 0) {
                container.html('<div class="text-center text-muted"><p>{{ translate('No shipping options available') }}</p></div>');
                $('#save-shipping').prop('disabled', true);
                return;
            }

            let html = '<div class="shipping-options">';
            response.shipping_costs.forEach(cost => {
                html += `
                    <div class="form-check mb-3">
                        <div class="d-flex align-items-center">
                            <!-- Bigger Radio Button -->
                            <input class="form-check-input" 
                                type="radio" 
                                name="shipping_cost" 
                                id="shipping_${cost.id}" 
                                value="${cost.id}"
                                style="width: 20px; height: 20px; cursor: pointer;">

                            <!-- Label with better alignment -->
                            <label class="form-check-label flex-grow-1 d-flex align-items-center justify-content-between" 
                                for="shipping_${cost.id}"
                                style="cursor: pointer;">
                                
                                <span class="fw-semibold mt-2" style="margin-left: 4px;">${cost.name}</span>
                                
                                <span class="text-primary fw-bold">${cost.formatted_amount}</span>
                            </label>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            container.html(html);
            $('#save-shipping').prop('disabled', false);
        }).fail(function() {
            $('#shipping-costs-container').html('<div class="text-center text-danger"><p>{{ translate('Failed to load shipping options') }}</p></div>');
            $('#save-shipping').prop('disabled', true);
        });
    }

    function loadCart() {
        $.get(manualCartUrl, function(response) {
            renderCart(response.cart);
        }).fail(function() {
            AIZ.plugins.notify('danger', '{{ translate('Error loading cart') }}');
        });
    }

    function addToCart(productId) {
        const quantity = parseInt($(`.product-quantity[data-product-id='${productId}']`).val() || 1, 10);
        const variant = $(`.variant-select[data-product-id='${productId}']`).val() || '';

        $.ajax({
            url: manualAddToCartUrl,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                id: productId,
                quantity,
                variant
            },
            success: function(response) {
                AIZ.plugins.notify('success', response.message);
                renderCart(response.cart);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to add product to cart') }}');
            }
        });
    }

    function updateCartQuantity(cartId, quantity) {
        $.ajax({
            url: `${manualUpdateQuantityUrl}/${cartId}/quantity`,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                quantity
            },
            success: function(response) {
                renderCart(response.cart);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to update cart') }}');
            }
        });
    }

    function deleteCartItem(cartId) {
        $.ajax({
            url: `${manualDeleteCartUrl}/${cartId}`,
            method: 'DELETE',
            data: {
                _token: '{{ csrf_token() }}'
            },
            success: function(response) {
                renderCart(response.cart);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to remove item') }}');
            }
        });
    }

    function applyDiscount() {
        const discount = parseFloat($('#manual-discount-value').val() || 0);
        const discountType = $('#manual-discount-type').val();
        
        $.ajax({
            url: manualDiscountUrl,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                discount,
                discount_type: discountType
            },
            success: function(response) {
                $('#manual-discount-modal').modal('hide');
                renderCart(response.cart);
                AIZ.plugins.notify('success', response.message);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to apply discount') }}');
            }
        });
    }

    function applyShipping() {
        const selectedShipping = $('input[name="shipping_cost"]:checked');
        if (!selectedShipping.length) {
            AIZ.plugins.notify('danger', '{{ translate('Please select a shipping option') }}');
            return;
        }

        const shippingCostId = selectedShipping.val();
        
        $.ajax({
            url: manualShippingUrl,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                shipping_cost_id: shippingCostId
            },
            success: function(response) {
                $('#manual-shipping-modal').modal('hide');
                renderCart(response.cart);
                AIZ.plugins.notify('success', response.message);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to apply shipping cost') }}');
            }
        });
    }

    function applyCoupon() {
        const couponCode = $('#manual-coupon-value').val().trim();
        $.ajax({
            url: manualCouponUrl,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                coupon_code: couponCode
            },
            success: function(response) {
                $('#manual-coupon-modal').modal('hide');
                renderCart(response.cart);
                AIZ.plugins.notify('success', response.message);
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to apply coupon') }}');
            }
        });
    }

    function placeOrder() {
        const customerName = $('#customer-name').val().trim();
        const customerPhone = $('#customer-phone').val().trim();
        const customerEmail = $('#customer-email').val().trim();
        const customerAddress = $('#customer-address').val().trim();

        if (!selectedShippingId) {
            AIZ.plugins.notify('danger', '{{ translate('Please select a shipping cost before placing the order') }}');
            return;
        }

        $.ajax({
            url: manualPlaceOrderUrl,
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_address: customerAddress
            },
            success: function(response) {
                AIZ.plugins.notify('success', response.message);
                window.location.href = response.redirect_url || '{{ route('all_orders.index') }}';
            },
            error: function(xhr) {
                AIZ.plugins.notify('danger', xhr.responseJSON?.message || '{{ translate('Unable to place order') }}');
            }
        });
    }

    $(document).ready(function() {
        loadProducts();
        loadCart();

        $('#product-search').on('input', function() {
            $('#search-status').show();
            debouncedLoadProducts();
        });

        $('#category-filter').on('change', function() {
            $('#category-status').show();
            loadProducts(false);
        });

        $('#load-more-btn').on('click', function() {
            if (hasMoreProducts && !isLoading) {
                currentPage++;
                loadProducts(true, currentPage);
            }
        });

        $(document).on('click', '.add-to-cart-button', function() {
            const productId = $(this).data('product-id');
            addToCart(productId);
        });

        $(document).on('click', '.qty-decrease', function() {
            const id = $(this).data('id');
            const input = $(`.quantity-input[data-id='${id}']`);
            const value = parseInt(input.val() || 1, 10);
            if (value > 1) {
                input.val(value - 1);
                updateCartQuantity(id, value - 1);
            }
        });

        $(document).on('click', '.qty-increase', function() {
            const id = $(this).data('id');
            const input = $(`.quantity-input[data-id='${id}']`);
            const value = parseInt(input.val() || 1, 10) + 1;
            input.val(value);
            updateCartQuantity(id, value);
        });

        $(document).on('change', '.quantity-input', function() {
            const id = $(this).data('id');
            const value = parseInt($(this).val() || 1, 10);
            updateCartQuantity(id, value);
        });

        $(document).on('click', '.remove-cart-item', function() {
            const id = $(this).data('id');
            deleteCartItem(id);
        });

        $('#discount-button').on('click', function() {
            // Reset form to defaults
            $('#manual-discount-type').val('flat');
            $('#manual-discount-value').val('');
            $('#discount-label').text('{{ translate('Discount Amount') }}');
            $('#manual-discount-value').attr('placeholder', '{{ translate('Enter flat amount (e.g., 10.00)') }}');
            $('#discount-help').text('{{ translate('Enter flat amount (e.g., 10.00)') }}');
            $('#manual-discount-value').removeAttr('max');
            $('#manual-discount-modal').modal('show');
        });
        
        // Handle discount type change
        $('#manual-discount-type').on('change', function() {
            const type = $(this).val();
            if (type === 'percentage') {
                $('#discount-label').text('{{ translate('Discount Percentage') }}');
                $('#manual-discount-value').attr('placeholder', '{{ translate('Enter percentage (e.g., 10)') }}');
                $('#discount-help').text('{{ translate('Enter percentage (0-100)') }}');
                $('#manual-discount-value').attr('max', '100');
            } else {
                $('#discount-label').text('{{ translate('Discount Amount') }}');
                $('#manual-discount-value').attr('placeholder', '{{ translate('Enter flat amount (e.g., 10.00)') }}');
                $('#discount-help').text('{{ translate('Enter flat amount (e.g., 10.00)') }}');
                $('#manual-discount-value').removeAttr('max');
            }
        });
        
        $('#shipping-button').on('click', function() {
            $('#manual-shipping-modal').modal('show');
            loadShippingCosts();
        });
        $('#coupon-button').on('click', function() {
            $('#manual-coupon-modal').modal('show');
        });

        $('#save-discount').on('click', applyDiscount);
        $('#save-shipping').on('click', applyShipping);
        $('#save-coupon').on('click', applyCoupon);
        $('#place-order-button').on('click', placeOrder);
    });
</script>
@endsection
