<?php

namespace App\Http\Controllers\Api\V2;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriberController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result' => false,
                'status' => 200,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 200);
        }

        $subscriber = new Subscriber;
        $subscriber->email = $request->email;
        $subscriber->save();

        return response()->json([
            'result' => true,
            'status' => 201,
            'message' => 'You have subscribed successfully',
            'data' => [
                'id' => $subscriber->id,
                'email' => $subscriber->email,
            ]
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $subscriber = Subscriber::find($id);

        if (is_null($subscriber)) {
            return response()->json([
                'result' => false,
                'status' => 404,
                'message' => 'Subscriber not found'
            ], 404);
        }

        $subscriber->delete();

        return response()->json([
            'result' => true,
            'status' => 200,
            'message' => 'Subscriber has been deleted successfully'
        ], 200);
    }
}