<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\OtpConfiguration;
use App\Utility\SendSMSUtility;
use App\Models\Models\GuestOtpCode;
use Carbon\Carbon;

class OrderOtpController extends Controller
{
    /**
     * Send OTP for order placement
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendOtp(Request $request)
    {
        // Check if OTP for order is enabled
        if (BusinessSetting::where('type', 'otp_for_order')->first()->value != 1) {
            return response()->json([
                'result' => false,
                'message' => translate('OTP for order is not enabled')
            ]);
        }

        // Validate request
        $request->validate([
            'phone' => 'required|string',
        ]);

        // Generate OTP code
        $otp_code = rand(100000, 999999);

        // Store OTP code in user record (or create a temporary record if guest)
        $user = User::where('phone', $request->phone)->first();
        if ($user) {
            $user->verification_code = $otp_code;
            $user->save();
        } else {
            // For guest users, store the OTP in the guest_otp_codes table
            $expires_at = Carbon::now()->addMinutes(10); // OTP expires in 10 minutes
            
            GuestOtpCode::updateOrCreate(
                ['phone' => $request->phone],
                [
                    'otp_code' => $otp_code,
                    'expires_at' => $expires_at
                ]
            );
        }

        // Send OTP via SMS
        $message = "Your order verification code is: " . $otp_code;
        $response = SendSMSUtility::sendSMS($request->phone, env('APP_NAME'), $message, null);

        return response()->json([
            'result' => true,
            'message' => translate('OTP has been sent to your phone')
        ]);
    }

    /**
     * Verify OTP for order placement
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verifyOtp(Request $request)
    {
        // Check if OTP for order is enabled
        if (OtpConfiguration::where('type', 'otp_for_order')->first()->value != 1) {
            return response()->json([
                'result' => false,
                'message' => translate('OTP for order is not enabled')
            ]);
        }

        // Validate request
        $request->validate([
            'phone' => 'required|string',
            'otp_code' => 'required|integer'
        ]);

        // Check if user exists
        $user = User::where('phone', $request->phone)->first();

        // Verify OTP
        if ($user && $user->verification_code == $request->otp_code) {
            // Clear the OTP code after successful verification
            $user->verification_code = null;
            $user->save();

            return response()->json([
                'result' => true,
                'message' => translate('OTP verified successfully')
            ]);
        } elseif (!$user) {
            // For guest users, check the OTP in the guest_otp_codes table
            $guestOtp = GuestOtpCode::where('phone', $request->phone)
                ->where('otp_code', $request->otp_code)
                ->where('expires_at', '>', Carbon::now())
                ->first();

            if ($guestOtp) {
                // Delete the OTP record after successful verification
                $guestOtp->delete();

                return response()->json([
                    'result' => true,
                    'message' => translate('OTP verified successfully')
                ]);
            } else {
                return response()->json([
                    'result' => false,
                    'message' => translate('Invalid or expired OTP code')
                ]);
            }
        } else {
            return response()->json([
                'result' => false,
                'message' => translate('Invalid OTP code')
            ]);
        }
    }
}