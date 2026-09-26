@extends('backend.layouts.app')

@section('content')
<div class="aiz-titlebar mt-2 mb-4">
    <div class="row align-items-center">
        <div class="col-md-6">
            <h1 class="h3">{{translate('All Landing Pages')}}</h1>
        </div>
        <div class="col-md-6 text-right">
            <a href="{{ route('admin.landing-pages.create') }}" class="btn btn-primary">
                <span>{{translate('Add New Landing Page')}}</span>
            </a>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header row gutters-5">
                <div class="col text-center text-md-left">
                    <h5 class="mb-md-0 h6">{{ translate('Landing Pages') }}</h5>
                </div>
            </div>
            <div class="card-body">
                <table class="table aiz-table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{{translate('Title')}}</th>
                            <th>{{translate('Name')}}</th>
                            <th>{{translate('Products')}}</th>
                            <th>{{translate('Images')}}</th>
                            <th>{{translate('Reviews')}}</th>
                            <th>{{translate('Regular Price')}}</th>
                            <th>{{translate('Discount Price')}}</th>
                            <th class="text-right">{{translate('Actions')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($landing_pages as $key => $landing_page)
                            <tr>
                                <td>{{ $key+1 }}</td>
                                <td>{{ $landing_page->title }}</td>
                                <td>{{ $landing_page->name }}</td>
                                <td>{{ $landing_page->products->count() }}</td>
                                <td>{{ $landing_page->images->count() }}</td>
                                <td>{{ $landing_page->reviews->count() }}</td>
                                <td>{{ $landing_page->regular_price ?? 'N/A' }}</td>
                                <td>{{ $landing_page->discount_price ?? 'N/A' }}</td>
                                <td class="text-right">
                                    <a class="btn btn-soft-success btn-icon btn-circle btn-sm" target="_blank" href="{{ env('APP_URL').'campaign/'.$landing_page->slug }}" title="{{ translate('Edit') }}">
                                        <i class="las la-eye"></i>
                                    </a>
                                    <a class="btn btn-soft-primary btn-icon btn-circle btn-sm" href="{{route('admin.landing-pages.edit', $landing_page->id)}}" title="{{ translate('Edit') }}">
                                        <i class="las la-edit"></i>
                                    </a>
                                    <button type="button" class="btn btn-soft-danger btn-icon btn-circle btn-sm" title="{{ translate('Delete') }}" onclick="confirmDelete({{ $landing_page->id }})">
                                        <i class="las la-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="aiz-pagination">
                    
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('modal')
    <!-- Delete Modal -->
    @include('modals.delete_modal')
@endsection

@section('script')
    <script type="text/javascript">
        function confirmDelete(id) {
            $('#delete-modal').modal('show');
            document.getElementById('delete-form').action = '{{ route('admin.landing-pages.destroy', '') }}/' + id;
        }
    </script>
@endsection