<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\City;
use App\Models\Country;
use App\Http\Resources\V2\AddressCollection;
use App\Models\Address;
use App\Http\Resources\V2\CitiesCollection;
use App\Http\Resources\V2\CountriesCollection;
use App\Models\Order;
use App\Models\Upload;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use App\Models\Cart;
use Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Storage;

class ProfileController extends Controller
{
    public function counters($user_id)
    {
        return response()->json([
            'cart_item_count' => Cart::where('user_id', $user_id)->count(),
            'wishlist_item_count' => Wishlist::where('user_id', $user_id)->count(),
            'order_count' => Order::where('user_id', $user_id)->count(),
        ]);
    }

    public function update(Request $request)
    {
        $user = User::find($request->id);

        // Check if user exists
        if (!$user) {
            return response()->json([
                'result' => false,
                'message' => translate("User not found")
            ], 404);
        }

        // Check old password if provided
        if ($request->filled('old_password')) {
            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json([
                    'result' => false,
                    'message' => translate("Old password does not match")
                ], 400);
            }
        }

        if ($request->name)
        {
            $user->name = $request->name;
        }

        // Update password if new one provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'result' => true,
            'message' => translate("Profile information updated successfully")
        ]);
    }

    public function update_device_token(Request $request)
    {
        $user = User::find($request->id);

        $user->device_token = $request->device_token;


        $user->save();

        return response()->json([
            'result' => true,
            'message' => translate("device token updated")
        ]);
    }

    public function updateImage(Request $request)
    {
        try {
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'];

                if (!in_array($extension, $allowedExtensions)) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Only images are allowed',
                        'path' => '',
                    ]);
                }

                // Define upload directory
                $dir = public_path('uploads/all');
                $filename = time() . '.' . $extension;

                // Move file to upload directory
                $file->move($dir, $filename);

                // Retrieve the user
                $user = User::find($request->id);
                $slug = Str::slug($user->name);

                // Create the upload record
                $upload = new Upload();
                $upload->file_original_name = Str::limit($slug, 200) . '-' . time();
                $upload->extension = $extension;
                $upload->file_name = "uploads/all/$filename";
                $upload->user_id = $request->id;
                $upload->type = 'image';
                $upload->file_size = filesize("$dir/$filename");
                $upload->save();

                // Save the uploaded image reference to user
                $user->avatar_original = $upload->id;
                $user->save();

                return response()->json([
                    'result' => true,
                    'message' => 'Image updated',
                    'path' => api_asset($upload->id),
                ]);
            } else {
                return response()->json([
                    'result' => false,
                    'message' => 'No image file found',
                    'path' => '',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'result' => false,
                'message' => $e->getMessage(),
                'path' => '',
            ]);
        }
    }


    // not user profile image but any other base 64 image through uploader
    public function imageUpload(Request $request)
    {
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'];
        $dir = public_path('uploads/all');
        $filename = pathinfo($request->filename, PATHINFO_FILENAME);
        $extension = pathinfo($request->filename, PATHINFO_EXTENSION);

        if (!in_array($extension, $allowedExtensions)) {
            return response()->json([
                'result' => false,
                'message' => "Only images are allowed",
                'path' => "",
                'upload_id' => 0
            ]);
        }

        try {
            // Decode the base64 image
            $image = base64_decode($request->image);
            $fullPath = "$dir/$filename.$extension";

            // Save the decoded image
            $filePut = file_put_contents($fullPath, $image);
            if ($filePut === false) {
                return response()->json([
                    'result' => false,
                    'message' => "File uploading error",
                    'path' => "",
                    'upload_id' => 0
                ]);
            }

            // Create upload record in the database
            $upload = new Upload();
            $upload->file_original_name = $filename;
            $upload->extension = $extension;
            $upload->file_name = "uploads/all/$filename.$extension";
            $upload->user_id = $request->id;
            $upload->type = 'image';
            $upload->file_size = filesize($fullPath);
            $upload->save();

            // Optionally, if using S3 storage
            if (env('FILESYSTEM_DRIVER') == 's3') {
                $s3Path = $upload->file_name;
                Storage::disk('s3')->put($s3Path, file_get_contents($fullPath));
                unlink($fullPath); // Remove local file after uploading to S3
            }

            return response()->json([
                'result' => true,
                'message' => "Image updated",
                'path' => api_asset($upload->id),
                'upload_id' => $upload->id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'result' => false,
                'message' => $e->getMessage(),
                'path' => "",
                'upload_id' => 0
            ]);
        }
    }


    public function checkIfPhoneAndEmailAvailable(Request $request)
    {


        $phone_available = false;
        $email_available = false;
        $phone_available_message = translate("User phone number not found");
        $email_available_message = translate("User email  not found");

        $user = User::find($request->user_id);

        if ($user->phone != null || $user->phone != "") {
            $phone_available = true;
            $phone_available_message = translate("User phone number found");
        }

        if ($user->email != null || $user->email != "") {
            $email_available = true;
            $email_available_message = translate("User email found");
        }
        return response()->json(
            [
                'phone_available' => $phone_available,
                'email_available' => $email_available,
                'phone_available_message' => $phone_available_message,
                'email_available_message' => $email_available_message,
            ]
        );
    }
}
