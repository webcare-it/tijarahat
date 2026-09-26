<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FraudCheckerController extends Controller 
{
    public function index(Request $request)
    {
        $phone = $request->query('phone');

        if (! $phone) {
            $queryString = $request->getQueryString();
            if ($queryString && ! str_contains($queryString, '=')) {
                $phone = $queryString;
            }
        }

        if ($phone) {
            $phone = strtr((string) $phone, [
                '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4',
                '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9',
            ]);

            $phone = preg_replace('/\D+/', '', $phone);

            if (strlen($phone) > 11 && str_starts_with($phone, '880') && strlen($phone) === 13) {
                $phone = substr($phone, 2);
            }
        }

        $result = null;
        $error = null;

        if ($phone) {
            $apiKey = get_setting('froud_checker_api_key');

            try {
                if ($apiKey) {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ])->timeout(15)->post('https://api.bdcourier.com/courier-check', [
                        'phone' => $phone,
                    ]);

                    $payload = $response->json();

                    if (is_array($payload) && (($payload['status'] ?? '') === 'error')) {
                        $error = $payload['message'] ?? __('BD Courier API returned an error response.');
                    } elseif ($response->successful() && is_array($payload)) {
                        $result = $payload;
                    } else {
                        $error = __('BD Courier API returned status :status.', ['status' => $response->status()]);
                    }
                } else {
                    $error = __('BD Courier API key is not configured.');
                }
            } catch (\Throwable $e) {
                $error = __('BD Courier API request failed.');
            }
        }

        return view('backend.fraudchecker.index', compact('phone', 'result', 'error'));
    }
}