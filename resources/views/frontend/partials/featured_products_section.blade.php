
@php
    $featured_productss = \App\Models\Product::skip(0)->take(20)->get();
@endphp


<section class="mb-4">
    <div class="container">
         <div class="px-2 py-4 px-md-4 py-md-3 bg-white shadow-sm rounded">
              <div class="d-flex mb-3 align-items-baseline border-bottom">
                    <h3 class="h5 fw-700 mb-0">
                        <span class="border-bottom border-primary border-width-2 pb-3 d-inline-block">{{ translate('Products') }}</span>
                    </h3>
                </div>
                
                
                 <!--<div class="row gutters-5 row-cols-xxl-4 row-cols-xl-3 row-cols-lg-4 row-cols-md-3 row-cols-2">-->
                 <!--           @foreach ($featured_productss as $key => $product)-->
                 <!--               <div class="col">-->
                 <!--                   @include('frontend.partials.product_box_1',['product' => $product])-->
                 <!--               </div>-->
                 <!--           @endforeach-->
                 <!--       </div>-->
  
       
       <div class="row">

                    @foreach ($featured_productss as $key => $product)
                    <div class="col-md-6 col-sm-6 col-xs-6 col-lg-3  ">
                       <div class="carousel-box">
                        @include('frontend.partials.product_box_1',['product' => $product])
                        </div>
              
                      </div>
                    @endforeach
                    
                    </div
              
            
            
            
            

       
       
        <!-- Show More Start -->
             <div class="row">
           
               <div class="col-md-4"></div>
               <div class="col-md-4">
    <div class=" col text-center">
     
      <a href="{{route('home.section.showmore')}}" class=" btn btn-primary btn-sm"  >Show More </a>
    </div>
                 <!--<a href="{{route('home.section.showmore')}}" class="ml-5 btn btn-primary btn-sm" tabindex="-1" role="button" aria-disabled="true" >Show More Products</a>-->
               </div>
               <div class="col-md-4"></div>
              
               
           
           </div>
          <!--Show More Ends -->
       </div>
    
   

</div>
         
</section>   
  