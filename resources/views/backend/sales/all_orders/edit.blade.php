@extends('backend.layouts.app')

@section('content')

<div class="card">
    <div class="card-header">
        <h5 class="mb-0 h6">{{ translate('Edit Order') }}</h5>
    </div>
    <div class="card-body">
        <form action="{{ route('orders.update', $order->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <!-- Customer Information -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{ translate('Customer Information') }}</h5>
                </div>
                <div class="card-body">
                    @php
                        $shipping_address = json_decode($order->shipping_address);
                    @endphp
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="customer_name">{{ translate('Customer Name') }}</label>
                                <input type="text" class="form-control" id="customer_name" name="customer_name" value="{{ $shipping_address->name ?? '' }}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="customer_email">{{ translate('Customer Email') }}</label>
                                <input type="email" class="form-control" id="customer_email" name="customer_email" value="{{ $shipping_address->email ?? '' }}">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="customer_phone">{{ translate('Customer Phone') }}</label>
                                <input type="text" class="form-control" id="customer_phone" name="customer_phone" value="{{ $shipping_address->phone ?? '' }}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="customer_address">{{ translate('Customer Address') }}</label>
                                <input type="text" class="form-control" id="customer_address" name="customer_address" value="{{ $shipping_address->address ?? '' }}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Order Details -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{ translate('Order Details') }}</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="code">{{ translate('Order Code') }}</label>
                                <input type="text" class="form-control" id="code" name="code" value="{{ $order->code }}" readonly>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="payment_status">{{ translate('Payment Status') }}</label>
                                <select class="form-control aiz-selectpicker" name="payment_status" id="payment_status">
                                    <option value="unpaid" @if($order->payment_status == 'unpaid') selected @endif>{{ translate('Unpaid') }}</option>
                                    <option value="paid" @if($order->payment_status == 'paid') selected @endif>{{ translate('Paid') }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Order Items -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{ translate('Order Items') }}</h5>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>{{ translate('Product') }}</th>
                                <th>{{ translate('Quantity') }}</th>
                                <th>{{ translate('Unit Price') }}</th>
                                <th>{{ translate('Discount') }}</th>
                                <th>{{ translate('Discounted Amount') }}</th>
                                <th>{{ translate('Total') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($order->orderDetails as $key => $orderDetail)
                            <tr>
                                <td>
                                    @if ($orderDetail->product)
                                        {{ $orderDetail->product->getTranslation('name') }}
                                    @else
                                        {{ translate('Product Unavailable') }}
                                    @endif
                                    <input type="hidden" name="order_details[{{ $key }}][id]" value="{{ $orderDetail->id }}">
                                </td>
                                <td>
                                    <input type="number" class="form-control" name="order_details[{{ $key }}][quantity]" value="{{ $orderDetail->quantity }}" min="1">
                                </td>
                                <td>
                                    <input type="number" class="form-control" name="order_details[{{ $key }}][price]" value="{{ $orderDetail->price / $orderDetail->quantity }}" step="0.01">
                                </td>
                                <td>
                                    <input type="number" class="form-control" name="order_details[{{ $key }}][discount]" value="{{ 0 }}" step="0.01">
                                </td>
                                <td>
                                    <input type="number" readonly class="form-control" name="" value="{{ $order->discount ?? 0 }}" step="0.01">
                                </td>
                                <td>
                                    {{ single_price($orderDetail->price) }}
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="form-group">
                <label for="note">{{ translate('Order Note') }}</label>
                <textarea class="form-control" id="note" name="note" rows="3">{{ $order->notes }}</textarea>
            </div>
            
            <div class="form-group mb-0 text-right">
                <button type="submit" class="btn btn-primary">{{ translate('Update Order') }}</button>
                <a href="{{ route('all_orders.index') }}" class="btn btn-secondary">{{ translate('Cancel') }}</a>
            </div>
        </form>
    </div>
</div>

@endsection