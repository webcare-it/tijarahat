@extends('backend.layouts.app')

@section('content')

    @php
        CoreComponentRepository::instantiateShopRepository();
        CoreComponentRepository::initializeCache();
    @endphp

    <div class="aiz-titlebar text-left mt-2 mb-3">
        <div class="row align-items-center">
            <div class="col-auto">
                <h1 class="h3">{{translate('Droploo All products')}}</h1>
            </div>
        </div>
    </div>
    
    <!-- API Connection Information -->
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{ translate('API Connection Information') }}</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <p><strong>{{ translate('Username') }}:</strong> {{ get_setting('droploo_username', 'Not configured') }}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>{{ translate('App Key') }}:</strong> {{ get_setting('droploo_app_key', 'Not configured') }}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>{{ translate('App Secret') }}:</strong> {{ get_setting('droploo_app_secret', 'Not configured') }}</p>
                        </div>
                    </div>
                    @if(!get_setting('droploo_username') || !get_setting('droploo_app_key') || !get_setting('droploo_app_secret'))
                        <div class="alert alert-warning">
                            {{ translate('Please configure your Droploo API credentials in Business Settings') }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
    <br>

    <div class="card">
        <form class="" id="sort_products" action="{{ route('droploo.products.all') }}" method="GET">
            <div class="card-header row gutters-5">
                <div class="col">
                    <h5 class="mb-md-0 h6">{{ translate('Droploo All Product') }}</h5>
                </div>
                <div class="col-auto">
                    <div class="form-group mb-0">
                        <input type="text" class="form-control" id="search" name="search" @isset($sort_search) value="{{ $sort_search }}" @endisset placeholder="{{ translate('Search by product name') }}">
                    </div>
                </div>
                <div class="col-auto">
                    <div class="form-group mb-0">
                        <button type="submit" class="btn btn-primary">{{ translate('Search') }}</button>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <table class="table aiz-table mb-0">
                    <thead>
                    <tr>
                        <th width="5%">SL</th>
                        <th width="5%">Image</th>
                        <th width="20%">Name</th>
                        <th width="8%">Whole Sale Price</th>
                        <th width="10%">Status</th>
                        <th width="5%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($products as $product)
                        @php
                            $added = \App\Models\Product::where('b_product_id', $product['id'])->first();
                        @endphp
                        <tr>
                            <td>{{ $loop->index+1 }}</td>
                            <td>
                                <img src="{{$imagePath.$product['image']}}" height="50" width="50" />
                            </td>
                            <td>
                                {{ $product['name']}}
                            </td>
                            <td>{{ $product['wholesale_price'] }} Tk.</td>
                            <td>
                                @if($added)
                                    <span class="badge badge-inline badge-success">{{ translate('Added') }}</span>
                                @else
                                    <span class="badge badge-inline badge-secondary">{{ translate('Not Added') }}</span>
                                @endif
                            </td>
                            <td>
                                @if($added)
                                    <span class="btn btn-soft-secondary btn-icon btn-circle btn-sm" title="{{ translate('Already Added') }}">
                                        <i class="las la-check"></i>
                                    </span>
                                @else
                                    <a class="btn btn-soft-success btn-icon btn-circle btn-sm"  href="{{route('droploo.products.add', ['id' => $product['id']])}}" title="{{ translate('ADD') }}">
                                        <i class="las la-plus"></i>
                                    </a>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="aiz-pagination">
                {{ $products->links() }}
            </div>
            </div>
        </form>
    </div>

@endsection


@section('script')
    <script type="text/javascript">

        $(document).on("change", ".check-all", function() {
            if(this.checked) {
                // Iterate each checkbox
                $('.check-one:checkbox').each(function() {
                    this.checked = true;
                });
            } else {
                $('.check-one:checkbox').each(function() {
                    this.checked = false;
                });
            }

        });

        $(document).ready(function(){
            //$('#container').removeClass('mainnav-lg').addClass('mainnav-sm');
        });

        function update_todays_deal(el){
            if(el.checked){
                var status = 1;
            }
            else{
                var status = 0;
            }
            $.post('{{ route('products.todays_deal') }}', {_token:'{{ csrf_token() }}', id:el.value, status:status}, function(data){
                if(data == 1){
                    AIZ.plugins.notify('success', '{{ translate('Todays Deal updated successfully') }}');
                }
                else{
                    AIZ.plugins.notify('danger', '{{ translate('Something went wrong') }}');
                }
            });
        }

        function update_published(el){
            if(el.checked){
                var status = 1;
            }
            else{
                var status = 0;
            }
            $.post('{{ route('products.published') }}', {_token:'{{ csrf_token() }}', id:el.value, status:status}, function(data){
                if(data == 1){
                    AIZ.plugins.notify('success', '{{ translate('Published products updated successfully') }}');
                }
                else{
                    AIZ.plugins.notify('danger', '{{ translate('Something went wrong') }}');
                }
            });
        }

        function update_approved(el){
            if(el.checked){
                var approved = 1;
            }
            else{
                var approved = 0;
            }
            $.post('{{ route('products.approved') }}', {
                _token      :   '{{ csrf_token() }}',
                id          :   el.value,
                approved    :   approved
            }, function(data){
                if(data == 1){
                    AIZ.plugins.notify('success', '{{ translate('Product approval update successfully') }}');
                }
                else{
                    AIZ.plugins.notify('danger', '{{ translate('Something went wrong') }}');
                }
            });
        }

        function update_featured(el){
            if(el.checked){
                var status = 1;
            }
            else{
                var status = 0;
            }
            $.post('{{ route('products.featured') }}', {_token:'{{ csrf_token() }}', id:el.value, status:status}, function(data){
                if(data == 1){
                    AIZ.plugins.notify('success', '{{ translate('Featured products updated successfully') }}');
                }
                else{
                    AIZ.plugins.notify('danger', '{{ translate('Something went wrong') }}');
                }
            });
        }

        function sort_products(el){
            $('#sort_products').submit();
        }

        function bulk_delete() {
            var data = new FormData($('#sort_products')[0]);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "{{route('bulk-product-delete')}}",
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    if(response == 1) {
                        location.reload();
                    }
                }
            });
        }

    </script>
@endsection