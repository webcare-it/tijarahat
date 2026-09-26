<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuctionController extends Controller
{
    public function index()
    {
        $auctions = \App\Models\Auction::orderBy('created_at', 'desc')->paginate(15);
        return view('backend.auction.index', compact('auctions'));
    }

    public function create()
    {
        $products = \App\Models\Product::where('published', 1)->get();
        return view('backend.auction.create', compact('products'));
    }

    public function store(Request $request)
    {
        $auction = new \App\Models\Auction();
        $auction->product_id = $request->product_id;
        $auction->start_date = strtotime($request->start_date);
        $auction->end_date = strtotime($request->end_date);
        $auction->starting_bid = $request->starting_bid;
        $auction->reserve_price = $request->reserve_price;
        $auction->status = 'published';
        $auction->save();
        
        return redirect()->route('auction.index')->with('success', 'Auction created successfully');
    }

    public function show($id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $bids = \App\Models\AuctionBid::where('auction_id', $id)->orderBy('amount', 'desc')->get();
        return view('backend.auction.show', compact('auction', 'bids'));
    }

    public function edit($id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $products = \App\Models\Product::where('published', 1)->get();
        return view('backend.auction.edit', compact('auction', 'products'));
    }

    public function update(Request $request, $id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $auction->product_id = $request->product_id;
        $auction->start_date = strtotime($request->start_date);
        $auction->end_date = strtotime($request->end_date);
        $auction->starting_bid = $request->starting_bid;
        $auction->reserve_price = $request->reserve_price;
        $auction->save();
        
        return redirect()->route('auction.index')->with('success', 'Auction updated successfully');
    }

    public function destroy($id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $auction->delete();
        return redirect()->route('auction.index')->with('success', 'Auction deleted successfully');
    }

    public function bid(Request $request, $id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $current_highest_bid = \App\Models\AuctionBid::where('auction_id', $id)->max('amount');
                
        if ($request->amount > ($current_highest_bid ?? $auction->starting_bid)) {
            $bid = new \App\Models\AuctionBid();
            $bid->auction_id = $id;
            $bid->user_id = auth()->user()->id;
            $bid->amount = $request->amount;
            $bid->save();
            
            return response()->json(['status' => 'success', 'message' => 'Bid placed successfully']);
        }
        
        return response()->json(['status' => 'error', 'message' => 'Bid amount must be higher than current bid']);
    }

    public function bids($id)
    {
        $bids = \App\Models\AuctionBid::where('auction_id', $id)->orderBy('amount', 'desc')->get();
        return response()->json($bids);
    }

    public function winner($id)
    {
        $auction = \App\Models\Auction::findOrFail($id);
        $winner_bid = \App\Models\AuctionBid::where('auction_id', $id)->orderBy('amount', 'desc')->first();
        
        if ($winner_bid && $winner_bid->amount >= $auction->reserve_price) {
            return response()->json(['winner' => $winner_bid->user, 'amount' => $winner_bid->amount]);
        }
        
        return response()->json(['winner' => null, 'message' => 'No winner found']);
    }
}