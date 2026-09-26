@extends('backend.layouts.app')

@section('content')
<div class="row">
    <div class="col-lg-9 mx-auto">
        <div class="card shadow-sm border-0 rounded-lg">
            <div class="card-header bg-white py-3 border-bottom-0">
                <div class="d-flex align-items-center">
                    <div class="icon-shape bg-soft-primary text-primary mr-3 rounded-circle p-2" style="background: rgba(0,123,255,0.1);">
                        <i class="las la-cog font-medium-3"></i>
                    </div>
                    <div>
                        <h5 class="mb-0 h5 text-dark font-weight-bold">{{ translate('General Settings') }}</h5>
                        <p class="text-muted mb-0 small">{{ translate('Manage external integration keys and API configurations') }}</p>
                    </div>
                </div>
            </div>

            <div class="card-body px-4 pb-4">

                <form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data" class="mb-5">
                    @csrf
                    <div class="mb-3">
                        <h6 class="text-primary font-weight-bold mb-1">{{ translate('Droploo API Credentials') }}</h6>
                        <p class="text-muted small mb-3">{{ translate('Configure your Droploo API connection settings') }}</p>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Droploo Username') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="droploo_username">
                            <input type="text" name="droploo_username" class="form-control bg-light-input" value="{{ get_setting('droploo_username') }}" placeholder="Enter Droploo Username">
                            <small class="form-text text-muted mt-1">{{ translate('Your Droploo account username') }}</small>
                        </div>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Droploo App Key') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="droploo_app_key">
                            <input type="text" name="droploo_app_key" class="form-control" value="{{ get_setting('droploo_app_key') }}" placeholder="Enter Droploo App Key">
                            <small class="form-text text-muted mt-1">{{ translate('API key provided by Droploo') }}</small>
                        </div>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Droploo App Secret') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="droploo_app_secret">
                            <div class="input-group shadow-sm-none">
                                <input type="password" name="droploo_app_secret" class="form-control border-right-0" value="{{ get_setting('droploo_app_secret') }}" placeholder="Enter Droploo App Secret" id="droploo_app_secret">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-light border-left-0 text-muted" style="border: 1px solid #ced4da;" onclick="togglePasswordVisibility('droploo_app_secret', 'toggleIconDroploo')">
                                        <i class="lar la-eye" id="toggleIconDroploo"></i>
                                    </button>
                                </div>
                            </div>
                            <small class="form-text text-muted mt-1">{{ translate('API secret provided by Droploo') }}</small>
                        </div>
                    </div>

                    <div class="alert alert-soft-info border-0 d-flex align-items-center mt-3" style="background-color: #e9f5fe; color: #31708f;" role="alert">
                        <i class="las la-info-circle mr-2 font-medium-3"></i>
                        <span class="small font-weight-medium">{{ translate('After updating these credentials, you can manage Droploo products from the Products section.') }}</span>
                    </div>

                    <div class="text-right mt-3">
                        <button type="submit" class="btn btn-primary px-4 shadow-sm">{{ translate('Update Droploo') }}</button>
                    </div>
                </form>

                <hr class="my-4" style="border-top: 1px solid #edf2f9;">

                <form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data" class="mb-5">
                    @csrf
                    <div class="mb-3">
                        <h6 class="text-primary font-weight-bold mb-1">{{ translate('Steadfast Courier API Credentials') }}</h6>
                        <p class="text-muted small mb-3">{{ translate('Configure your Steadfast Courier API connection settings') }}</p>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Steadfast API Key') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="steadfast_api_key">
                            <input type="text" name="steadfast_api_key" class="form-control" value="{{ get_setting('steadfast_api_key') }}" placeholder="Enter Steadfast API Key">
                            <small class="form-text text-muted mt-1">{{ translate('API Key provided by Steadfast Courier Ltd.') }}</small>
                        </div>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Steadfast Secret Key') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="steadfast_secret_key">
                            <div class="input-group">
                                <input type="password" name="steadfast_secret_key" class="form-control border-right-0" value="{{ get_setting('steadfast_secret_key') }}" placeholder="Enter Steadfast Secret Key" id="steadfast_secret_key">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-light border-left-0 text-muted" style="border: 1px solid #ced4da;" onclick="togglePasswordVisibility('steadfast_secret_key', 'toggleIconSteadfast')">
                                        <i class="lar la-eye" id="toggleIconSteadfast"></i>
                                    </button>
                                </div>
                            </div>
                            <small class="form-text text-muted mt-1">{{ translate('Secret Key provided by Steadfast Courier Ltd.') }}</small>
                        </div>
                    </div>

                    <div class="text-right mt-3">
                        <button type="submit" class="btn btn-primary px-4 shadow-sm">{{ translate('Update Steadfast') }}</button>
                    </div>
                </form>

                <hr class="my-4" style="border-top: 1px solid #edf2f9;">

                <form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="bg-white rounded-circle d-flex align-items-center justify-content-center mr-3"
                                style="width: 55px; height: 55px;">
                                <i class="las la-shield-alt text-danger" style="font-size: 28px;"></i>
                            </div>

                            <div>
                                <h5 class="mb-1 font-weight-bold">
                                    {{ translate('Fraud Checker API Credentials') }}
                                </h5>
                                <p class="mb-0">
                                    {{ translate('Protect orders with automated fraud detection and courier validation') }}
                                </p>
                            </div>
                        </div>

                        <a href="https://bdcourier.com/pricing"
                        target="_blank"
                        class="btn btn-light btn-sm shadow-sm">
                            <i class="las la-external-link-alt mr-1"></i>
                            {{ translate('View Pricing') }}
                        </a>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Fraud Checker URL') }}</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control bg-light text-muted border-dashed" readonly value="https://api.bdcourier.com/courier-check" style="border-style: dashed;">
                        </div>
                    </div>

                    <div class="form-group row align-items-center">
                        <label class="col-md-3 col-form-label font-weight-medium text-muted">{{ translate('Fraud Checker Secret Key') }}</label>
                        <div class="col-md-9">
                            <input type="hidden" name="types[]" value="froud_checker_api_key">
                            <div class="input-group">
                                <input type="password" name="froud_checker_api_key" class="form-control border-right-0" value="{{ get_setting('froud_checker_api_key') }}" placeholder="Enter Fraud Checker Secret Key" id="froud_checker_api_key">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-outline-light border-left-0 text-muted" style="border: 1px solid #ced4da;" onclick="togglePasswordVisibility('froud_checker_api_key', 'toggleIconFraudChecker')">
                                        <i class="lar la-eye" id="toggleIconFraudChecker"></i>
                                    </button>
                                </div>
                            </div>
                            <small class="form-text text-muted mt-1">{{ translate('Secret Key provided by Fraud Checker') }}</small>
                        </div>
                    </div>

                    <div class="text-right mt-3">
                        <button type="submit" class="btn btn-primary px-4 shadow-sm">{{ translate('Update Fraud Checker') }}</button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
<script type="text/javascript">
    function togglePasswordVisibility(inputId, iconId) {
        var passwordInput = document.getElementById(inputId);
        var toggleIcon = document.getElementById(iconId);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('lar', 'la-eye');
            toggleIcon.classList.add('las', 'la-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('las', 'la-eye-slash');
            toggleIcon.classList.add('lar', 'la-eye');
        }
    }
</script>
@endsection
