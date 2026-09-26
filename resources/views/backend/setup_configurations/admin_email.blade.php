@extends('backend.layouts.app')

@section('content')
<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{translate('Admin Email Notification Settings')}}</h5>
            </div>
            <div class="card-body">
                <form class="form-horizontal" action="{{ route('env_key_update.update') }}" method="POST">
                    @csrf
                    <input type="hidden" name="types[]" value="ADMIN_EMAILS">
                    <div class="form-group row">
                        <div class="col-md-3">
                            <label class="col-from-label">{{translate('Admin Email(s)')}}</label>
                        </div>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="ADMIN_EMAILS" value="{{ env('ADMIN_EMAILS') }}" placeholder="{{ translate('admin@example.com,admin2@example.com') }}">
                            <small class="text-muted">{{ translate('Comma separated multiple email addresses supported. These emails will receive notification when a new order is placed.') }}</small>
                        </div>
                    </div>
                    <div class="form-group mb-0 text-right">
                        <button type="submit" class="btn btn-primary">{{translate('Save Configuration')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0 h6">{{translate('Instruction')}}</h5>
            </div>
            <div class="card-body">
                <p class="text-muted">{{ translate('Configure admin email addresses that will receive order notification emails.') }}</p>
                <ul class="list-group">
                    <li class="list-group-item text-dark">{{ translate('Admin email addresses are stored in the .env file, not in the database.') }}</li>
                    <li class="list-group-item text-dark">{{ translate('You can add multiple email addresses separated by commas.') }}</li>
                    <li class="list-group-item text-dark">{{ translate('Example: admin@example.com,support@example.com,owner@example.com') }}</li>
                    <li class="list-group-item text-dark">{{ translate('Make sure SMTP is configured correctly for emails to work.') }}</li>
                    <li class="list-group-item text-dark">{{ translate('Each admin email will receive a notification with order details whenever a new order is placed.') }}</li>
                </ul>
            </div>
        </div>
    </div>
</div>

@endsection
