@extends('backend.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('Add New Landing Page')}}</h1>
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
                <form action="{{ route('admin.landing-pages.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Title')}} <span class="text-danger">*</span></label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Title')}}" id="title" name="title" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Name')}} <span class="text-danger">*</span></label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Name')}}" id="name" name="name" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Sub Title')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Sub Title')}}" id="sub_title" name="sub_title" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Deadline')}}</label>
                        <div class="col-md-9">
                            <input type="date" placeholder="{{translate('Deadline')}}" id="deadline" name="deadline" class="form-control">
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
                                <input type="hidden" name="banner_image" class="selected-files">
                            </div>
                            <div class="file-preview box sm">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Video ID')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Video ID')}}" id="video_id" name="video_id" class="form-control">
                        </div>
                    </div>

                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Feature Title')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Feature Title')}}" id="short_description" name="short_description" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Features')}}</label>
                        <div class="col-md-9">
                            @for($i = 1; $i <= 2; $i++)
                                <div class="form-group">
                                    <textarea placeholder="{{translate('Feature')}} {{$i}}" id="feature_{{$i}}" name="feature_{{$i}}" class="aiz-text-editor form-control"></textarea>
                                </div>
                            @endfor
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Meta Description')}}</label>
                        <div class="col-md-9">
                            <textarea name="description" rows="6" class="form-control" placeholder="{{translate('Meta Description')}}"></textarea>
                        </div>
                    </div>
                    

                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Regular Price')}}</label>
                        <div class="col-md-9">
                            <input type="number" step="0.01" placeholder="{{translate('Regular Price')}}" name="regular_price" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Discount Price')}}</label>
                        <div class="col-md-9">
                            <input type="number" step="0.01" placeholder="{{translate('Discount Price')}}" name="discount_price" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">
                            {{translate('Products')}} <span class="text-danger">*</span>
                        </label>
                        <div class="col-md-9">
                            <select class="form-control aiz-selectpicker" name="products[]" id="products" data-live-search="true" data-selected-text-format="count" multiple required>
                                @foreach($products as $product)
                                    <option value="{{ $product->id }}">{{ $product->name }}</option>
                                @endforeach
                            </select>
                            @error('products')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
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
                        </div>
                    </div>
                    
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label">{{translate('Copyright Text')}}</label>
                        <div class="col-md-9">
                            <input type="text" placeholder="{{translate('Copyright Text')}}" id="copyright_text" name="copyright_text" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group mb-0 text-right">
                        <button type="submit" class="btn btn-primary">{{translate('Save')}}</button>
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
</script>
@endsection