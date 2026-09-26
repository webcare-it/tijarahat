
<html lang="en">
<head>
    
 <!--   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>-->
	<!--<script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js"></script>-->
	
	<script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
  <style>

/*.wrapper {*/
/*    width: 705px;*/
/*    margin: 20px auto;*/
/*    padding: 20px;*/
/*}*/

.clear {
    clear: both;
}
.items {
    display: block;
    margin: 20px 0;
}
.item {
    background-color: #fff;
    float: left;
    margin: 0 10px 10px 0;
    width: 205px;
    padding: 10px;
    height: 290px;
}
.item img {
    display: block;
    margin: auto;
}
/*.h2 {*/
/*    font-size: 16px;*/
/*    display: block;*/
/*    border-bottom: 1px solid #ccc;*/
/*    margin: 0 0 10px 0;*/
/*    padding: 0 0 5px 0;*/
/*}*/
.sty {
    border: 1px solid #722A1B;
    padding: 2px 9px;
    background-color: #fff;
    color: #722A1B;
    text-transform: uppercase;
    float: right;
    margin: 2px 37px;
    font-weight: bold;
    cursor: pointer;
}

  </style>
</head>
<body>
  <!-- wrapper -->
<div class="wrapper">
 <div class="clear"></div>
 <!-- items -->
 <div class="items">
     <!-- single item -->
    
     <form>
    @csrf
     <div class="item">
         
         <a href="{{ route('product', $product->slug) }}" class="d-block">
            <img
                class="img-fit lazyload mx-auto h-140px h-md-210px"
                src="{{ static_asset('assets/img/placeholder.jpg') }}"
                data-src="{{ uploaded_asset($product->thumbnail_img) }}"
                alt="{{  $product->getTranslation('name')  }}"
                onerror="this.onerror=null;this.src='{{ static_asset('assets/img/placeholder.jpg') }}';"
            >
        </a>

         <div class="fs-15">
            @if(home_base_price($product) != home_discounted_base_price($product))
                <del class="fw-600 opacity-50 mr-1">{{ home_base_price($product) }}</del>
            @endif
            <span class="fw-700 text-primary">{{ home_discounted_base_price($product) }}</span>
        </div>
            
             <h3 class="fw-600 fs-13 text-truncate-2 lh-1-4 mb-0 h-35px">
            <a href="{{ route('product', $product->slug) }}" class="d-block text-reset">{{  $product->getTranslation('name')  }}</a>
        </h3>
                    <input type="hidden" name="id" value="{{$product->id}}">
                    <input type="hidden" id="qty" name="quantity" class="col border-0 text-center flex-grow-1 fs-16 input-number" placeholder="1" value="{{ $product->min_qty }}" min="{{ $product->min_qty }}" max="10">
                     <button type="button" class="add-to-carts sty" onclick="buyNows({{$product->id}})"> Add to cart</button>
      
     </div>
     
      </form>
    
     <!--/ single item -->
 </div>
 <!--/ items -->
 
  
                
                    
                   
</div>
<!--/ wrapper -->

<script>
  

$('.add-to-carts').on('click', function () {
        var cart = $('#cart_items');
        var imgtodrag = $(this).parent('.item').find("img").eq(0);
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
                .css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '120px',
                    'width': '120px',
                    'z-index': '100'
            })
                .appendTo($('body'))
                .animate({
                'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 3000,'easeInOutExpo');
            
            // setTimeout(function () {
            //     cart.effect("shake", {
            //         times:2
            //     }, 200);
            // },1500);

            imgclone.animate({
                'width': 0,
                    'height': 0
            }, function () {
                $(this).detach()
            });
        }
    });
    
    
    
          function buyNows(id){
            if(checkAddToCartValidity()) {

                var quantity=$('#qty').val();
                   $.ajax({
                   type:"POST",
                   url: '{{ route('cart.addToCart') }}',
                   data: { "_token": "{{ csrf_token() }}",id:id,quantity:quantity },
                   success: function(data){
                       if(data.status == 1){
                           
                            updateNavCart(data.nav_cart_view,data.cart_count);

                       }
                       else{
                            
                       }
                   }
               });
            }
            else{
                AIZ.plugins.notify('warning', "{{ translate('Please choose all the options') }}");
            }
        }
</script>
</body>
</html>