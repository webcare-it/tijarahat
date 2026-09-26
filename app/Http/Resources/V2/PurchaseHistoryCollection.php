<?php

namespace App\Http\Resources\V2;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PurchaseHistoryCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($data) {
                return [
                    'id' => $data->id,
                    'order_code' => $data->code,
                    'user_id' => (int) $data->user_id,
                    'shipping_address' => json_decode($data->shipping_address),
                    'payment_method' => ucwords(str_replace('_', ' ', $data->payment_type)),
                    'shipping_type' => $data->shipping_type,
                    'shipping_type_string' => $data->shipping_type != null ? ucwords(str_replace('_', ' ', $data->shipping_type)) : "",
                    'payment_status' => $data->payment_status,
                    'payment_status_string' => ucwords(str_replace('_', ' ', $data->payment_status)),
                    'order_status' => $data->delivery_status,
                    'delivery_status_string' => $data->delivery_status == 'pending'
                        ? "Order Placed"
                        : ucwords(str_replace('_', ' ', $data->delivery_status)),
                    'grand_total' => format_price($data->grand_total),
                    'coupon_discount' => format_price($data->coupon_discount),
                    'shipping_cost' => format_price($data->orderDetails->sum('shipping_cost')),
                    'subtotal' => format_price($data->orderDetails->sum('price')),
                    'tax' => format_price($data->orderDetails->sum('tax')),
                    'order_date' => Carbon::createFromTimestamp($data->date)->format('d-m-Y'),
                    'cancel_request' => $data->cancel_request == 1,
                    'manually_payable' => $data->manual_payment && $data->manual_payment_data == null,

                    // Order items
                    'order_items' => $data->orderDetails->map(function ($item) {
                        $refund_section = false;
                        $refund_button = false;
                        $refund_label = '';
                        $refund_request_status = 99;

                        if (addon_is_activated('refund_request')) {
                            $refund_section = true;
                            $no_of_max_day = get_setting('refund_request_time');
                            $last_refund_date = $item->created_at->addDays($no_of_max_day);
                            $today_date = now();

                            if (
                                $item->product != null &&
                                $item->product->refundable != 0 &&
                                $item->refund_request == null &&
                                $today_date <= $last_refund_date &&
                                $item->payment_status == 'paid' &&
                                $item->delivery_status == 'delivered'
                            ) {
                                $refund_button = true;
                            } elseif ($item->refund_request != null && $item->refund_request->refund_status == 0) {
                                $refund_label = 'Pending';
                                $refund_request_status = $item->refund_request->refund_status;
                            } elseif ($item->refund_request != null && $item->refund_request->refund_status == 2) {
                                $refund_label = 'Rejected';
                                $refund_request_status = $item->refund_request->refund_status;
                            } elseif ($item->refund_request != null && $item->refund_request->refund_status == 1) {
                                $refund_label = 'Approved';
                                $refund_request_status = $item->refund_request->refund_status;
                            } elseif ($item->product && $item->product->refundable != 0) {
                                $refund_label = 'N/A';
                            } else {
                                $refund_label = 'Non-refundable';
                            }
                        }

                        return [
                            'id' => $item->id,
                            'product_id' => $item->product->id ?? null,
                            'product_name' => $item->product->name ?? null,
                            'product_thumbnail_image' => api_asset($item->product->thumbnail_img) ?? null,
                            'variation' => $item->variation,
                            'price' => format_price($item->price),
                            'tax' => format_price($item->tax),
                            'shipping_cost' => format_price($item->shipping_cost),
                            'coupon_discount' => format_price($item->coupon_discount),
                            'quantity' => (int) $item->quantity,
                            'payment_status' => $item->payment_status,
                            'payment_status_string' => ucwords(str_replace('_', ' ', $item->payment_status)),
                            'delivery_status' => $item->delivery_status,
                            'delivery_status_string' => $item->delivery_status == 'pending'
                                ? 'Order Placed'
                                : ucwords(str_replace('_', ' ', $item->delivery_status)),
                            'refund_section' => $refund_section,
                            'refund_button' => $refund_button,
                            'refund_label' => $refund_label,
                            'refund_request_status' => $refund_request_status,
                        ];
                    }),
                ];
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
}
