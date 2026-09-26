<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\BusinessSetting;
use Illuminate\Http\Request;

class GeneralSettingController extends Controller
{
    public function index()
    {
        // Get all business settings instead of general settings
        $settings = BusinessSetting::all();
        
        // Convert to the format expected by the frontend
        $formattedSettings = $settings->map(function ($setting) {
            return [
                'name' => $setting->type,
                'logo' => $setting->type === 'system_logo_white' ? $setting->value : null,
                'site_name' => $setting->type === 'site_name' ? $setting->value : null,
                'address' => $setting->type === 'address' ? $setting->value : null,
                'description' => $setting->type === 'meta_description' ? $setting->value : null,
                'phone' => $setting->type === 'phone' ? $setting->value : null,
                'email' => $setting->type === 'email' ? $setting->value : null,
                'facebook' => $setting->type === 'facebook' ? $setting->value : null,
                'twitter' => $setting->type === 'twitter' ? $setting->value : null,
                'instagram' => $setting->type === 'instagram' ? $setting->value : null,
                'youtube' => $setting->type === 'youtube' ? $setting->value : null,
                'google_plus' => $setting->type === 'google_plus' ? $setting->value : null,
                // Add other fields as needed
                'value' => $setting->value,
            ];
        });
        
        return response()->json([
            'data' => $formattedSettings,
            'success' => true,
            'status' => 200
        ]);
    }

    public function imagePath($id)
    {
        $upload = \App\Models\Upload::find($id);

        if (!$upload) {
            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'id' => $upload->id,
            'file_original_name' => $upload->file_original_name,
            'file_name' => $upload->file_name,
            'url' => uploaded_asset($upload->id),
        ]);
    }
}