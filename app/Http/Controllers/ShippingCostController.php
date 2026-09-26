<?php

namespace App\Http\Controllers;

use App\Models\ShippingCost;
use Illuminate\Http\Request;

class ShippingCostController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'status' => 'required|boolean'
        ]);

        ShippingCost::create([
            'name' => $request->name,
            'amount' => $request->amount,
            'status' => $request->status,
        ]);

        flash(translate('Shipping cost added successfully'))->success();
        return back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $shippingCost = ShippingCost::findOrFail($id);
        $shippingCost->update([
            'name' => $request->name,
            'amount' => $request->amount,
            'status' => $request->status,
        ]);

        flash(translate('Shipping cost updated successfully'))->success();
        return back();
    }

    public function destroy($id)
    {
        $shipping = ShippingCost::find($id);

        if (!$shipping) {
            return redirect()->back()->with('error', translate('Shipping cost not found.'));
        }

        try {
            $shipping->delete();
            return redirect()->back()->with('success', translate('Shipping cost deleted successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', translate('Something went wrong while deleting.'));
        }
    }
}
