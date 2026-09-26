@extends('backend.layouts.app')

@section('content')
    <div class="row mt-4">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 h6">{{ translate('Shipping Cost List') }}</h5>
                    <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#addShippingCostModal">
                        <i class="las la-plus"></i> {{ translate('Add New') }}
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm mb-0">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>{{ translate('Name') }}</th>
                                <th>{{ translate('Cost') }}</th>
                                <th>{{ translate('Status') }}</th>
                                <th>{{ translate('Action') }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            @forelse($shipping_costs as $key => $cost)
                                <tr>
                                    <td>{{ $key+1 }}</td>
                                    <td>{{ $cost->name }}</td>
                                    <td>{{ single_price($cost->amount) }}</td>
                                    <td>
                                        @if($cost->status)
                                            <span class="badge badge-success">{{ translate('Active') }}</span>
                                        @else
                                            <span class="badge badge-secondary">{{ translate('Inactive') }}</span>
                                        @endif
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-info editShippingBtn"
                                            data-id="{{ $cost->id }}"
                                            data-name="{{ $cost->name }}"
                                            data-amount="{{ $cost->amount }}"
                                            data-status="{{ $cost->status }}"
                                            data-update-url="{{ route('shipping_costs.update', $cost->id) }}"
                                        >
                                            <i class="las la-edit"></i>
                                        </button>
                                        <form action="{{ route('shipping_costs.destroy', $cost->id) }}" method="POST" style="display:inline-block;" onsubmit="return confirm('{{ translate('Are you sure to delete this?') }}');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger">
                                                <i class="las la-trash"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">{{ translate('No shipping costs found.') }}</td>
                                </tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Shipping Cost Modal -->
    <div class="modal fade" id="editShippingCostModal" tabindex="-1" role="dialog" aria-labelledby="editShippingCostModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form id="editShippingCostForm" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="modal-header">
                        <h5 class="modal-title">{{ translate('Edit Shipping Cost') }}</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="id" id="edit_shipping_id">
                        <div class="form-group">
                            <label>{{ translate('Name') }}</label>
                            <input type="text" name="name" id="edit_shipping_name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>{{ translate('Cost') }}</label>
                            <input type="number" name="amount" id="edit_shipping_amount" step="0.01" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>{{ translate('Status') }}</label>
                            <select name="status" id="edit_shipping_status" class="form-control" required>
                                <option value="1">{{ translate('Active') }}</option>
                                <option value="0">{{ translate('Inactive') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-dismiss="modal">{{ translate('Cancel') }}</button>
                        <button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Shipping Cost Modal -->
    <div class="modal fade" id="addShippingCostModal" tabindex="-1" role="dialog" aria-labelledby="addShippingCostModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form action="{{ route('shipping_costs.store') }}" method="POST">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title" id="addShippingCostModalLabel">{{ translate('Add Shipping Cost') }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{{ translate('Name') }}</label>
                            <input type="text" name="name" class="form-control" required placeholder="{{ translate('e.g. Inside City') }}">
                        </div>
                        <div class="form-group">
                            <label>{{ translate('Cost') }}</label>
                            <input type="number" name="amount" step="0.01" class="form-control" required placeholder="{{ translate('e.g. 100') }}">
                        </div>
                        <div class="form-group">
                            <label>{{ translate('Status') }}</label>
                            <select name="status" class="form-control" required>
                                <option value="1">{{ translate('Active') }}</option>
                                <option value="0">{{ translate('Inactive') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-dismiss="modal">{{ translate('Cancel') }}</button>
                        <button type="submit" class="btn btn-primary">{{ translate('Save') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.editShippingBtn').forEach(button => {
                button.addEventListener('click', function () {
                    let id = this.dataset.id;
                    let name = this.dataset.name;
                    let amount = this.dataset.amount;
                    let status = this.dataset.status;
                    let updateUrl = this.dataset.updateUrl;

                    document.getElementById('edit_shipping_id').value = id;
                    document.getElementById('edit_shipping_name').value = name;
                    document.getElementById('edit_shipping_amount').value = amount;
                    document.getElementById('edit_shipping_status').value = status;
                    document.getElementById('editShippingCostForm').action = updateUrl;

                    var modal = new bootstrap.Modal(document.getElementById('editShippingCostModal'));
                    modal.show();
                });
            });
        });

        $(document).on('click', '.confirm-delete', function (e) {
            e.preventDefault();
            var form = $(this).closest('form');
            if (confirm("{{ translate('Are you sure to delete this?') }}")) {
                form.submit();
            }
        });
    </script>
@endsection





