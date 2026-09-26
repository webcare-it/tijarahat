<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuctionProductBidController extends Controller
{
    public function index()
    {
        $bids = \App\Models\AuctionProductBid::orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction_product_bids.index', compact('bids'));
    }

    public function create()
    {
        $auction_products = \App\Models\Product::where('auction_product', 1)->get();
        return view('backend.auction_product_bids.create', compact('auction_products'));
    }

    public function store(Request $request)
    {
        $bid = new \App\Models\AuctionProductBid();
        $bid->product_id = $request->product_id;
        $bid->user_id = auth()->user()->id;
        $bid->amount = $request->amount;
        $bid->save();
        
        return redirect()->route('auction_product_bids.index')->with('success', 'Bid placed successfully');
    }

    public function show($id)
    {
        $bid = \App\Models\AuctionProductBid::findOrFail($id);
        return view('backend.auction_product_bids.show', compact('bid'));
    }

    public function edit($id)
    {
        $bid = \App\Models\AuctionProductBid::findOrFail($id);
        $auction_products = \App\Models\Product::where('auction_product', 1)->get();
        return view('backend.auction_product_bids.edit', compact('bid', 'auction_products'));
    }

    public function update(Request $request, $id)
    {
        $bid = \App\Models\AuctionProductBid::findOrFail($id);
        $bid->product_id = $request->product_id;
        $bid->amount = $request->amount;
        $bid->save();
        
        return redirect()->route('auction_product_bids.index')->with('success', 'Bid updated successfully');
    }

    public function destroy($id)
    {
        $bid = \App\Models\AuctionProductBid::findOrFail($id);
        $bid->delete();
        return redirect()->route('auction_product_bids.index')->with('success', 'Bid deleted successfully');
    }
}