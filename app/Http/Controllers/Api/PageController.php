<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;
use App\Http\Resources\PageResource;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pages = Page::all();
        return PageResource::collection($pages);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        // Map predefined slugs to actual page slugs
        $slugMap = [
            'about-us' => 'aboutus',
            'contact-us' => 'contactus',
            'privacy-policy' => 'privacypolicy',
            'terms-condition' => 'terms',
            'return-policy' => 'returnpolicy',
            'support-policy' => 'supportpolicy',
            'seller-policy' => 'sellerpolicy'
        ];
        
        // Get the actual slug from map or use the provided slug
        $actualSlug = $slugMap[$slug] ?? $slug;
        
        $page = Page::where('slug', $actualSlug)->firstOrFail();
        return new PageResource($page);
    }
}