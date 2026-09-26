@extends('backend.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Landing Page Details')}}</h1>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{ $landingPage->title }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Title')}}:</strong></label>
                            <p>{{ $landingPage->title }}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Name')}}:</strong></label>
                            <p>{{ $landingPage->name }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Sub Title')}}:</strong></label>
                            <p>{{ $landingPage->sub_title }}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Deadline')}}:</strong></label>
                            <p>{{ $landingPage->deadline }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Video ID')}}:</strong></label>
                            <p>{{ $landingPage->video_id }}</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{translate('Banner Image')}}:</strong></label>
                            @if($landingPage->banner_image)
                                <div>
                                    <img src="{{ uploaded_asset($landingPage->banner_image) }}" alt="Banner" class="img-fluid">
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Features')}}:</strong></label>
                    <ul>
                        @for($i = 1; $i <= 8; $i++)
                            @if($landingPage->{'feature_'.$i})
                                <li>{{ $landingPage->{'feature_'.$i} }}</li>
                            @endif
                        @endfor
                    </ul>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Short Description')}}:</strong></label>
                    <p>{{ $landingPage->short_description }}</p>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Description')}}:</strong></label>
                    <div>{!! $landingPage->description !!}</div>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Products')}}:</strong></label>
                    <ul>
                        @foreach($landingPage->products as $product)
                            <li>{{ $product->name }}</li>
                        @endforeach
                    </ul>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Images')}}:</strong></label>
                    <div class="row">
                        @foreach($landingPage->images as $image)
                            <div class="col-md-3 mb-3">
                                <div class="card">
                                    <img src="{{ uploaded_asset($image->image) }}" alt="Image" class="img-fluid">
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Review Images')}}:</strong></label>
                    <div class="row">
                        @foreach($landingPage->reviews as $review)
                            <div class="col-md-3 mb-3">
                                <div class="card">
                                    <img src="{{ uploaded_asset($review->review_image) }}" alt="Review Image" class="img-fluid">
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="form-group">
                    <label><strong>{{translate('Copyright Text')}}:</strong></label>
                    <p>{{ $landingPage->copyright_text }}</p>
                </div>
                
                <div class="text-right">
                    <a href="{{ route('admin.landing-pages.edit', $landingPage->id) }}" class="btn btn-primary">{{ translate('Edit') }}</a>
                    <a href="{{ route('admin.landing-pages.index') }}" class="btn btn-secondary">{{ translate('Back') }}</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection