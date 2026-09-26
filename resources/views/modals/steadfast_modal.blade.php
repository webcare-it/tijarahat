<!-- Steadfast confirmation modal -->
<div id="steadfast-modal" class="modal fade">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title h6">{{ translate('Steadfast Confirmation') }}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div class="modal-body text-center">
                <p class="mt-1">{{ translate('Are you sure you want to send this order to Steadfast Courier?') }}</p>
                <button type="button" class="btn btn-link mt-2" data-dismiss="modal">{{ translate('Cancel') }}</button>

                <form id="steadfast-form" method="POST" action="{{ route('orders.send_to_steadfast') }}">
                    @csrf
                    <input type="hidden" id="steadfast-order-id" name="order_id" value="{{ isset($order_id) ? $order_id : '' }}">
                    <button type="submit" id="steadfast-confirm-btn" class="btn btn-primary mt-2">{{ translate('Confirm') }}</button>
                </form>
            </div>
        </div>
    </div>
</div><!-- /.modal -->
