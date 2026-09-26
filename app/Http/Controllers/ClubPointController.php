<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClubPointController extends Controller
{
    public function configure_index()
    {
        $club_point_config = \App\Models\BusinessSetting::where('type', 'club_point_config')->first();
        return view('backend.club_points.configs', compact('club_point_config'));
    }

    public function index()
    {
        $club_points = \App\Models\ClubPoint::orderBy('created_at', 'desc')->paginate(15);
        return view('backend.club_points.index', compact('club_points'));
    }

    public function set_point()
    {
        return view('backend.club_points.set_point');
    }

    public function set_products_point(Request $request)
    {
        foreach ($request->product_ids as $product_id) {
            $product = \App\Models\Product::findOrFail($product_id);
            $product->club_point = $request->club_point;
            $product->save();
        }
        return redirect()->back()->with('success', 'Club points set successfully');
    }

    public function set_all_products_point(Request $request)
    {
        \App\Models\Product::where('published', 1)->update(['club_point' => $request->club_point]);
        return redirect()->back()->with('success', 'Club points set for all products successfully');
    }

    public function set_point_edit($id)
    {
        $product = \App\Models\Product::findOrFail($id);
        return view('backend.club_points.edit_point', compact('product'));
    }

    public function club_point_detail($id)
    {
        $user = \App\Models\User::findOrFail($id);
        $club_points = \App\Models\ClubPoint::where('user_id', $id)->paginate(15);
        return view('backend.club_points.user_details', compact('user', 'club_points'));
    }

    public function update_product_point(Request $request, $id)
    {
        $product = \App\Models\Product::findOrFail($id);
        $product->club_point = $request->club_point;
        $product->save();
        return redirect()->back()->with('success', 'Club point updated successfully');
    }

    public function convert_rate_store(Request $request)
    {
        \App\Models\BusinessSetting::where('type', 'club_point_convert_rate')->update(['value' => $request->convert_rate]);
        return redirect()->back()->with('success', 'Convert rate updated successfully');
    }

    public function userpoint_index()
    {
        $users = \App\Models\User::where('user_type', 'customer')->paginate(15);
        return view('backend.club_points.user_points', compact('users'));
    }

    public function convert_point_into_wallet(Request $request)
    {
        $user = \App\Models\User::findOrFail($request->user_id);
        $convert_rate = \App\Models\BusinessSetting::where('type', 'club_point_convert_rate')->first()->value;
        
        $point_to_convert = $request->point;
        $amount = $point_to_convert * $convert_rate;
        
        if ($user->club_points >= $point_to_convert) {
            $user->club_points -= $point_to_convert;
            $user->balance += $amount;
            $user->save();
            
            // Add to club point history
            $club_point = new \App\Models\ClubPoint();
            $club_point->user_id = $user->id;
            $club_point->points = -$point_to_convert;
            $club_point->details = 'Converted to wallet';
            $club_point->save();
            
            return redirect()->back()->with('success', 'Points converted to wallet successfully');
        }
        
        return redirect()->back()->with('error', 'Insufficient points');
    }
}