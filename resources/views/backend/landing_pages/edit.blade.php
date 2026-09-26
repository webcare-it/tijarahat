@extends('backend.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Edit Landing Page')}}</h1>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{translate('Landing Page Information')}}</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.landing-pages.update', $landingPage->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Title')}} <span class="text-danger">*</span></label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Title')}}" id="title" name="title" class="form-control" value="{{ $landingPage->title }}" required>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Name')}} <span class="text-danger">*</span></label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Name')}}" id="name" name="name" class="form-control" value="{{ $landingPage->name }}" required>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Sub Title')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Sub Title')}}" id="sub_title" name="sub_title" class="form-control" value="{{ $landingPage->sub_title }}">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Deadline')}}</label>
                        <div class="col-md-9">
                            <input type="date" placeholder="{{translate('Deadline')}}" id="deadline" name="deadline" class="form-control" value="{{ $landingPage->deadline ? date('Y-m-d', strtotime($landingPage->deadline)) : '' }}">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Banner Image')}}</label>
                        <div class="col-md-9">
                            <div class="input-group" data-toggle="aizuploader" data-type="image">
                                <div class="input-group-prepend">
                                    <div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse')}}</div>
                                </div>
                                <div class="form-control file-name">{{ translate('Choose File') }}</div>
                                <input type="hidden" name="banner_image" class="selected-files" value="{{ $landingPage->banner_image }}">
                            </div>
                            <div class="file-preview box sm">
                                @if($landingPage->banner_image)
                                    <div class="d-flex justify-content-between align-items-center mt-2 file-preview-item" data-id="{{ $landingPage->banner_image }}">
                                        <img src="{{ uploaded_asset($landingPage->banner_image) }}" alt="Banner Image" class="img-fit">
                                        <button type="button" class="btn btn-danger btn-sm" data-toggle="remove-parent" data-parent=".file-preview-item">
                                            <i class="las la-times"></i>
                                        </button>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Video ID')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Video ID')}}" id="video_id" name="video_id" class="form-control" value="{{ $landingPage->video_id }}">
                        </div>
                    </div>

                      
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Feature Title')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Feature Title')}}" value="{{ $landingPage->short_description }}" id="short_description" name="short_description" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Features')}}</label>
                        <div class="col-md-9">
                            @for($i = 1; $i <= 2; $i++)
                                <div class="form-group">
                                    <textarea placeholder="{{translate('Feature')}} {{$i}}" id="feature_{{$i}}" name="feature_{{$i}}" class="aiz-text-editor form-control">{{ $landingPage->{'feature_'.$i} }}</textarea>
                                </div>
                            @endfor
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Meta Description')}}</label>
                        <div class="col-md-9">
                            <textarea name="description" rows="6" class="form-control" placeholder="{{translate('Meta Description')}}">{!! $landingPage->description !!}</textarea>
                        </div>
                    </div>
                    
                    <!-- Regular Price and Discount Price Fields -->
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Regular Price')}}</label>
                        <div class="col-md-9">
                            <input type="number" step="0.01" placeholder="{{translate('Regular Price')}}" name="regular_price" class="form-control" value="{{ $landingPage->regular_price }}">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Discount Price')}}</label>
                        <div class="col-md-9">
                            <input type="number" step="0.01" placeholder="{{translate('Discount Price')}}" name="discount_price" class="form-control" value="{{ $landingPage->discount_price }}">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Products')}}</label>
                        <div class="col-md-9">
                            <select class="form-control aiz-selectpicker" name="products[]" id="products" data-live-search="true" data-selected-text-format="count" multiple>
                                @foreach($products as $product)
                                    <option value="{{ $product->id }}" @if(in_array($product->id, $selectedProducts)) selected @endif>{{ $product->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Images')}}</label>
                        <div class="col-md-9">
                            <div class="input-group" data-toggle="aizuploader" data-type="image" data-multiple="true">
                                <div class="input-group-prepend">
                                    <div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse')}}</div>
                                </div>
                                <div class="form-control file-name">{{ translate('Choose Files') }}</div>
                                <input type="hidden" name="images" class="selected-files">
                            </div>
                            <div class="file-preview box sm">
                            </div>
                            
                            <!-- Existing images -->
                            @if($landingPage->images->count() > 0)
                                <div class="mt-3">
                                    <label class="col-form-label">{{translate('Existing Images')}}</label>
                                    <div class="row">
                                        @foreach($landingPage->images as $image)
                                            <div class="col-md-3 mb-3">
                                                <div class="card">
                                                    <img src="{{ uploaded_asset($image->image) }}" alt="Image" class="img-fluid">
                                                    <div class="card-body p-2 text-center">
                                                        <a href="{{ route('admin.landing-pages.delete-image', $image->id) }}" class="btn btn-sm btn-danger confirm-delete">{{ translate('Delete') }}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Review Images')}}</label>
                        <div class="col-md-9">
                            <div class="input-group" data-toggle="aizuploader" data-type="image" data-multiple="true">
                                <div class="input-group-prepend">
                                    <div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse')}}</div>
                                </div>
                                <div class="form-control file-name">{{ translate('Choose Files') }}</div>
                                <input type="hidden" name="review_images" class="selected-files">
                            </div>
                            <div class="file-preview box sm">
                            </div>
                            
                            <!-- Existing review images -->
                            @if($landingPage->reviews->count() > 0)
                                <div class="mt-3">
                                    <label class="col-form-label">{{translate('Existing Review Images')}}</label>
                                    <div class="row">
                                        @foreach($landingPage->reviews as $review)
                                            <div class="col-md-3 mb-3">
                                                <div class="card">
                                                    <img src="{{ uploaded_asset($review->review_image) }}" alt="Review Image" class="img-fluid">
                                                    <div class="card-body p-2 text-center">
                                                        <a href="{{ route('admin.landing-pages.delete-review-image', $review->id) }}" class="btn btn-sm btn-danger confirm-delete">{{ translate('Delete') }}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Copyright Text')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Copyright Text')}}" id="copyright_text" name="copyright_text" class="form-control" value="{{ $landingPage->copyright_text }}">
                        </div>
                    </div>
                    
                    <div class="form-group mb-0 text-right">
                        <button type="submit" class="btn btn-primary">{{translate('Update')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script>
    // Initialize selectpicker
    $('.aiz-selectpicker').selectpicker();
    
    // Trigger AIZ core text editor initialization
    $(document).ready(function() {
        // The AIZ core already handles .aiz-text-editor initialization
        // We just need to make sure the DOM is ready
    });
    
    // Confirm delete
    $('.confirm-delete').on('click', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        $('#delete-modal').modal('show');
        document.getElementById('delete-form').action = url;
    });
</script>
@endsection

@section('modal')
    <!-- Delete Modal -->
    @include('modals.delete_modal')
@endsection