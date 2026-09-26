@extends('backend.layouts.app')

@section('content')
    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0 h6">{{ translate('Facebook Domain Verification') }}</h5>
                </div>
                <div class="card-body">
                    <form class="form-horizontal" action="{{ route('facebook_domain_verification.update') }}" method="POST">
                        @csrf
                        <div class="form-group row">
                            <div class="col-lg-3">
                                <label class="col-from-label">{{ translate('Facebook Domain Verification') }}</label>
                            </div>
                            <div class="col-md-7">
                                <label class="aiz-switch aiz-switch-success mb-0">
                                    <input value="1" name="facebook_domain_verification" type="checkbox" @if (get_setting('facebook_domain_verification') == 1)
                                        checked
                                    @endif>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <input type="hidden" name="types[]" value="fb_domain_code">
                            <div class="col-lg-3">
                                <label class="col-from-label">{{ translate('Facebook Domain Verification Code') }}</label>
                            </div>
                            <div class="col-md-7">
                                <input 
                                    type="text" class="form-control" name="fb_domain_code" value="{{  get_setting('fb_domain_code') }}" placeholder="{{ translate('Facebook Domain Verification Code') }}"
                                    pattern="^[a-zA-Z0-9]+$"
                                    title="Enter a valid Facebook Domain Verification Code consisting of alphanumeric characters only."
                                    required
                                    >
                                    <small class="form-text text-info">
                                        {{ translate('Enter the Facebook Domain Verification Code provided by Facebook. This code is used to verify your domain ownership for Facebook services.') }}
                                        <strong>Examples: eu2xxxxxxxxxx</strong>
                                    </small>
                            </div>
                        </div>
                        <div class="form-group mb-0 text-right">
                            <button type="submit" class="btn btn-sm btn-primary">{{translate('Save')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                    <h5 class="mb-0 h6">{{translate('Google Tag Manager Setting')}}</h5>
                </div>
                <div class="card-body">
                    <form class="form-horizontal" action="{{ route('google_analytics.update') }}" method="POST">
                        @csrf
                        <div class="form-group row">
                            <div class="col-lg-3">
                                <label class="col-from-label">{{translate('Google Tag Manager')}}</label>
                            </div>
                            <div class="col-md-7">
                                <label class="aiz-switch aiz-switch-success mb-0">
                                    <input value="1" name="google_analytics" type="checkbox" @if (get_setting('google_analytics') == 1)
                                        checked
                                    @endif>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <input type="hidden" name="types[]" value="TRACKING_ID">
                            <div class="col-lg-3">
                                <label class="col-from-label">{{translate('Tracking ID')}}</label>
                            </div>
                            <div class="col-md-7">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="TRACKING_ID"
                                    value="{{ env('TRACKING_ID') }}"
                                    placeholder="{{ translate('Tracking ID') }}"
                                    pattern="^(GTM-[A-Z0-9]+|G-[A-Z0-9]+|UA-[0-9\-]+)$"
                                    title="Enter a valid Google Tracking ID (e.g., GTM-XXXXXX, G-XXXXXX, UA-XXXXXX-X)"
                                    required
                                >
                                <small class="form-text text-info">
                                    {{ translate('Enter a valid Google Tag Manager or Google Analytics Tracking ID.') }}
                                        <strong>Examples: GTM-XXXXXX, G-XXXXXX</strong>
                                </small>
                            </div>
                        </div>
                        <div class="form-group mb-0 text-right">
                            <button type="submit" class="btn btn-sm btn-primary">{{translate('Save')}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

@endsection
