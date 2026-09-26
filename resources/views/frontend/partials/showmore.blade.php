@extends('frontend.layouts.app')

@section('content')
<section class="pt-4 mb-4">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 text-center text-lg-left">
                <h1 class="fw-600 h4">{{ translate('All Product') }}</h1>
            </div>
            <div class="col-lg-6">
                
            </div>
        </div>
    </div>
</section>

@php
    $featured_productsss = \App\Models\Product::all();
@endphp

<section class="mb-4">
    <div class="container">
         <div class="px-2 py-4 px-md-4 py-md-3 bg-white shadow-sm rounded">
              <div class="d-flex mb-3 align-items-baseline border-bottom">
                    <h3 class="h5 fw-700 mb-0">
                        <span class="border-bottom border-primary border-width-2 pb-3 d-inline-block">{{ translate('Products') }}</span>
                    </h3>
                </div>
  
       
       <div class="row">

                    @foreach ($featured_productsss as $key => $product)
                    <div class="col-md-6 col-sm-8 col-xs-2 col-lg-3 col-6">
                       <div class="carousel-box">
                        @include('frontend.partials.product_box_1',['product' => $product])
                        </div>
              
                      </div>
                    @endforeach
              
            
            
            
            
       </div>
       
       
      
       </div>
    
   

</div>
         
</section>   

@endsection