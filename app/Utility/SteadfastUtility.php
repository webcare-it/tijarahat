<?php

namespace App\Utility;

use Illuminate\Support\Facades\Http;

class SteadfastUtility {
    public static function create_order($payload) {
        $api_key = get_setting('steadfast_api_key');
        $secret_key = get_setting('steadfast_secret_key');
        $base_url = 'https://portal.packzy.com/api/v1';

        if (!$api_key || !$secret_key) {
            return [
                'status' => 400,
                'message' => 'Steadfast API credentials are not configured.'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $api_key,
                'Secret-Key' => $secret_key,
                'Content-Type' => 'application/json'
            ])->post($base_url . '/create_order', $payload);

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Steadfast API error: ' . $e->getMessage()
            ];
        }
    }
    
    public static function get_tracking_info($tracking_code) {
        $api_key = get_setting('steadfast_api_key');
        $secret_key = get_setting('steadfast_secret_key');
        $base_url = 'https://portal.packzy.com/api/v1';

        if (!$api_key || !$secret_key) {
            return [
                'status' => 400,
                'message' => 'Steadfast API credentials are not configured.'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $api_key,
                'Secret-Key' => $secret_key,
                'Content-Type' => 'application/json'
            ])->get( 'https://www.steadfast.com.bd/t/' . $tracking_code);

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Steadfast API error: ' . $e->getMessage()
            ];
        }
    }
    
    public static function cancel_order($tracking_code) {
        $api_key = get_setting('steadfast_api_key');
        $secret_key = get_setting('steadfast_secret_key');
        $base_url = 'https://portal.packzy.com/api/v1';

        if (!$api_key || !$secret_key) {
            return [
                'status' => 400,
                'message' => 'Steadfast API credentials are not configured.'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $api_key,
                'Secret-Key' => $secret_key,
                'Content-Type' => 'application/json'
            ])->post($base_url . '/cancel_order', [
                'tracking_code' => $tracking_code
            ]);

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Steadfast API error: ' . $e->getMessage()
            ];
        }
    }
    
    public static function reschedule_delivery($payload) {
        $api_key = get_setting('steadfast_api_key');
        $secret_key = get_setting('steadfast_secret_key');
        $base_url = 'https://portal.packzy.com/api/v1';

        if (!$api_key || !$secret_key) {
            return [
                'status' => 400,
                'message' => 'Steadfast API credentials are not configured.'
            ];
        }

        try {
            $response = Http::withHeaders([
                'Api-Key' => $api_key,
                'Secret-Key' => $secret_key,
                'Content-Type' => 'application/json'
            ])->post($base_url . '/reschedule_order', $payload);

            return $response->json();
        } catch (\Exception $e) {
            return [
                'status' => 500,
                'message' => 'Steadfast API error: ' . $e->getMessage()
            ];
        }
    }
}
