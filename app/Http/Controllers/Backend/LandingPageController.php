<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LandingPage;
use App\Models\LandingPageImage;
use App\Models\LandingPageReview;
use App\Models\Product;
use Illuminate\Support\Str;

class LandingPageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $landing_pages = LandingPage::all();
        return view('backend.landing_pages.index', compact('landing_pages'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $products = Product::all();
        return view('backend.landing_pages.create', compact('products'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'video_id' => 'nullable|string|max:255',
            'feature_1' => 'nullable|string',
            'feature_2' => 'nullable|string',
            'feature_3' => 'nullable|string',
            'feature_4' => 'nullable|string',
            'feature_5' => 'nullable|string',
            'feature_6' => 'nullable|string',
            'feature_7' => 'nullable|string',
            'feature_8' => 'nullable|string',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'copyright_text' => 'nullable|string|max:255',
            'regular_price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'products' => 'required|array|min:1',
            'products.*' => 'exists:products,id',
        ]);

        $landingPage = new LandingPage;
        $landingPage->title = $request->title;
        $landingPage->name = $request->name;
        $landingPage->slug = Str::slug($request->name);
        $landingPage->sub_title = $request->sub_title;
        $landingPage->deadline = $request->deadline;
        $landingPage->video_id = $request->video_id;
        $landingPage->feature_1 = $request->feature_1;
        $landingPage->feature_2 = $request->feature_2;
        $landingPage->description = $request->description;
        $landingPage->short_description = $request->short_description;
        $landingPage->copyright_text = $request->copyright_text;
        $landingPage->regular_price = $request->regular_price;
        $landingPage->discount_price = $request->discount_price;
        
        // Handle banner image (AIZ uploader sends file path directly)
        if ($request->banner_image) {
            $landingPage->banner_image = $request->banner_image;
        }
        
        $landingPage->save();

        // Attach products
        if ($request->has('products')) {
            $landingPage->products()->attach($request->products);
        }

        // Handle multiple images (AIZ uploader sends comma-separated string for multiple images)
        if ($request->images) {
            $this->handleMultipleImages($landingPage->id, $request->images, 'image');
        }

        // Handle multiple review images (AIZ uploader sends comma-separated string for multiple images)
        if ($request->review_images) {
            $this->handleMultipleImages($landingPage->id, $request->review_images, 'review_image');
        }

        flash(translate('Landing page created successfully'))->success();
        return redirect()->route('admin.landing-pages.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $landingPage = LandingPage::findOrFail($id);
        return view('backend.landing_pages.show', compact('landingPage'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $landingPage = LandingPage::findOrFail($id);
        $products = Product::all();
        $selectedProducts = $landingPage->products->pluck('id')->toArray();
        
        return view('backend.landing_pages.edit', compact('landingPage', 'products', 'selectedProducts'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'video_id' => 'nullable|string|max:255',
            'feature_1' => 'nullable|string',
            'feature_2' => 'nullable|string',
            'feature_3' => 'nullable|string',
            'feature_4' => 'nullable|string',
            'feature_5' => 'nullable|string',
            'feature_6' => 'nullable|string',
            'feature_7' => 'nullable|string',
            'feature_8' => 'nullable|string',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'copyright_text' => 'nullable|string|max:255',
            'regular_price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'products' => 'array',
            'products.*' => 'exists:products,id',
        ]);

        $landingPage = LandingPage::findOrFail($id);
        $landingPage->title = $request->title;
        $landingPage->name = $request->name;
        $landingPage->slug = Str::slug($request->name);
        $landingPage->sub_title = $request->sub_title;
        $landingPage->deadline = $request->deadline;
        $landingPage->video_id = $request->video_id;
        $landingPage->feature_1 = $request->feature_1;
        $landingPage->feature_2 = $request->feature_2;
        $landingPage->feature_3 = $request->feature_3;
        $landingPage->feature_4 = $request->feature_4;
        $landingPage->feature_5 = $request->feature_5;
        $landingPage->feature_6 = $request->feature_6;
        $landingPage->feature_7 = $request->feature_7;
        $landingPage->feature_8 = $request->feature_8;
        $landingPage->description = $request->description;
        $landingPage->short_description = $request->short_description;
        $landingPage->copyright_text = $request->copyright_text;
        $landingPage->regular_price = $request->regular_price;
        $landingPage->discount_price = $request->discount_price;
        
        // Handle banner image (AIZ uploader sends file path directly)
        if ($request->banner_image) {
            $landingPage->banner_image = $request->banner_image;
        }
        
        $landingPage->save();

        // Sync products
        if ($request->has('products')) {
            $landingPage->products()->sync($request->products);
        } else {
            $landingPage->products()->detach();
        }

        // Handle multiple images (AIZ uploader sends comma-separated string for multiple images)
        if ($request->images) {
            $this->handleMultipleImages($landingPage->id, $request->images, 'image');
        }

        // Handle multiple review images (AIZ uploader sends comma-separated string for multiple images)
        if ($request->review_images) {
            $this->handleMultipleImages($landingPage->id, $request->review_images, 'review_image');
        }

        flash(translate('Landing page updated successfully'))->success();
        return redirect()->route('admin.landing-pages.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $landingPage = LandingPage::findOrFail($id);
        
        // Delete related images and reviews
        $landingPage->images()->delete();
        $landingPage->reviews()->delete();
        
        // Detach products
        $landingPage->products()->detach();
        
        // Delete the landing page
        $landingPage->delete();

        flash(translate('Landing page deleted successfully'))->success();
        return redirect()->route('admin.landing-pages.index');
    }
    
    /**
     * Remove the specified image from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteImage($id)
    {
        $image = LandingPageImage::findOrFail($id);
        $image->delete();
        
        flash(translate('Image deleted successfully'))->success();
        return redirect()->back();
    }
    
    /**
     * Remove the specified review image from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteReviewImage($id)
    {
        $reviewImage = LandingPageReview::findOrFail($id);
        $reviewImage->delete();
        
        flash(translate('Review image deleted successfully'))->success();
        return redirect()->back();
    }
    
    /**
     * Handle multiple images from AIZ uploader
     *
     * @param  int  $landingPageId
     * @param  string  $imagesData
     * @param  string  $field
     * @return void
     */
    private function handleMultipleImages($landingPageId, $imagesData, $field)
    {
        // Split comma-separated string into array
        $imageIds = explode(',', $imagesData);
        
        foreach ($imageIds as $imageId) {
            // Trim whitespace and skip empty values
            $imageId = trim($imageId);
            if (!empty($imageId)) {
                if ($field === 'image') {
                    $landingPageImage = new LandingPageImage;
                    $landingPageImage->landing_page_id = $landingPageId;
                    $landingPageImage->image = $imageId;
                    $landingPageImage->save();
                } elseif ($field === 'review_image') {
                    $landingPageReview = new LandingPageReview;
                    $landingPageReview->landing_page_id = $landingPageId;
                    $landingPageReview->review_image = $imageId;
                    $landingPageReview->save();
                }
            }
        }
    }
}