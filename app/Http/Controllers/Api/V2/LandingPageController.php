<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LandingPage;
use App\Http\Resources\V2\LandingPage\LandingPageCollection;
use App\Http\Resources\V2\LandingPage\LandingPageDetailCollection;

class LandingPageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $landingPages = LandingPage::with(['products', 'images', 'reviews'])->select('*')->latest()->paginate(10);
        return new LandingPageCollection($landingPages);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $landingPage = LandingPage::with(['products', 'images', 'reviews'])->select('*')->where('id', $id)->get();
        return new LandingPageDetailCollection($landingPage);
    }

    /**
     * Display the specified resource by slug.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function showBySlug($slug)
    {
         $landingPage = LandingPage::with(['products', 'images', 'reviews'])->select('*')->where('slug', $slug)->get();
        return new LandingPageDetailCollection($landingPage);
    }
}