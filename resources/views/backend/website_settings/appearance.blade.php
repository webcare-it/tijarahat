@extends('backend.layouts.app')

@section('content')

    <div class="row">
    	<div class="col-lg-8 mx-auto">
    		<div class="card">
    			<div class="card-header">
    				<h6 class="fw-600 mb-0">{{ translate('General') }}</h6>
    			</div>
    			<div class="card-body">
    				<form action="{{ route('business_settings.update') }}" method="POST">
    					@csrf
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Frontend Website Name')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="website_name">
        	                    <input type="text" name="website_name" class="form-control" placeholder="{{ translate('Website Name') }}" value="{{ get_setting('website_name') }}">
                            </div>
                        </div>
    	                <div class="form-group row">
    	                    <label class="col-md-3 col-from-label">{{translate('Site Motto')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="site_motto">
        	                    <input type="text" name="site_motto" class="form-control" placeholder="{{ translate('Best eCommerce Website') }}" value="{{  get_setting('site_motto') }}">
                            </div>
    	                </div>
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Site Icon') }}</label>
                            <div class="col-md-8">
        						<div class="input-group " data-toggle="aizuploader" data-type="image">
        							<div class="input-group-prepend">
        								<div class="input-group-text bg-soft-secondary">{{ translate('Browse') }}</div>
        							</div>
        							<div class="form-control file-amount">{{ translate('Choose File') }}</div>
                                    <input type="hidden" name="types[]" value="site_icon">
        							<input type="hidden" name="site_icon" value="{{ get_setting('site_icon') }}" class="selected-files">
        						</div>
        						<div class="file-preview box"></div>
        						<small class="text-muted">{{ translate('Website favicon. 32x32 .png') }}</small>
                            </div>
    					</div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{ translate('Website Base Color') }}</label>
                            <div class="col-md-8 d-flex align-items-center gap-2">
                                <input type="hidden" name="types[]" value="base_color">
                                <input type="color" id="base_color_picker" class="form-control form-control-color" value="{{ get_setting('base_color') ?? '#f04d6e' }}" title="Choose color">
                                <input type="text" name="base_color" id="base_color_input" class="form-control" placeholder="#f04d6e" value="{{ get_setting('base_color') ?? '#f04d6e' }}">
                            </div>
                            <small class="text-muted offset-md-3 col-md-8">{{ translate('Hex Color Code') }}</small>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{ translate('Website Base Font Color') }}</label>
                            <div class="col-md-8 d-flex align-items-center gap-2">
                                <input type="hidden" name="types[]" value="base_hov_color">
                                <input type="color" id="base_hov_color_picker" class="form-control form-control-color" value="{{ get_setting('base_hov_color') ?? '#f04d6e' }}" title="Choose color">
                                <input type="text" name="base_hov_color" id="base_hov_color_input" class="form-control" placeholder="#f04d6e" value="{{ get_setting('base_hov_color') ?? '#f04d6e' }}">
                            </div>
                            <small class="text-muted offset-md-3 col-md-8">{{ translate('Hex Color Code') }}</small>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Bkash Number')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="bkash_number">
        	                    <input type="text" name="bkash_number" class="form-control" placeholder="{{ translate('Bkash Number') }}" value="{{ get_setting('bkash_number') }}">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Facebook Page Username')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="fb_page_username">
        	                    <input type="text" name="fb_page_username" class="form-control" placeholder="{{ translate('ExampleBD') }}" value="{{ get_setting('fb_page_username') }}" oninput="this.value = this.value.replace(/[^a-zA-Z0-9._]/g, '')">
								 <small class="text-info fw-medium" style="font-size: 13px">
                                    Only accepted usernames no url. Example: <strong>yourpageusername</strong>
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Whatsapp Number')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="whatsapp_number">
        	                    <input type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" name="whatsapp_number" class="form-control" placeholder="{{ translate('Whatsapp Number') }}" value="{{ get_setting('whatsapp_number') }}">

                                <small class="text-info fw-medium" style="font-size: 13px">
                                    WhatsApp number must include the country code. Example: <strong>8801300000000</strong>
                                </small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Product Details Whatsapp Message')}}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="details_whatsapp_message">
        	                    <input type="text" name="details_whatsapp_message" class="form-control" placeholder="{{ translate('Product Details Whatsapp Message') }}" value="{{ get_setting('details_whatsapp_message') }}">
                            </div>
                        </div>

                        <script>
                            document.addEventListener('DOMContentLoaded', function() {
                                // Base color sync
                                const basePicker = document.getElementById('base_color_picker');
                                const baseInput = document.getElementById('base_color_input');
                                basePicker.addEventListener('input', () => baseInput.value = basePicker.value);
                                baseInput.addEventListener('input', () => basePicker.value = baseInput.value);

                                // Hover color sync
                                const hovPicker = document.getElementById('base_hov_color_picker');
                                const hovInput = document.getElementById('base_hov_color_input');
                                hovPicker.addEventListener('input', () => hovInput.value = hovPicker.value);
                                hovInput.addEventListener('input', () => hovPicker.value = hovInput.value);
                            });
                        </script>
                        <div class="text-right">
    						<button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
    					</div>
                    </form>
    			</div>
    		</div>
    		<div class="card">
    			<div class="card-header">
    				<h6 class="fw-600 mb-0">{{ translate('Global SEO') }}</h6>
    			</div>
    			<div class="card-body">
    				<form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data">
    					@csrf
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Meta Title') }}</label>
                            <div class="col-md-8">
        						<input type="hidden" name="types[]" value="meta_title">
        						<input type="text" class="form-control" placeholder="{{translate('Title')}}" name="meta_title" value="{{ get_setting('meta_title') }}">
                            </div>
    					</div>
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Meta description') }}</label>
                            <div class="col-md-8">
        						<input type="hidden" name="types[]" value="meta_description">
        						<textarea class="resize-off form-control" placeholder="{{translate('Description')}}" name="meta_description">{{  get_setting('meta_description') }}</textarea>
                            </div>
    					</div>
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Keywords') }}</label>
                            <div class="col-md-8">
        						<input type="hidden" name="types[]" value="meta_keywords">
        						<textarea class="resize-off form-control" placeholder="{{translate('Keyword, Keyword')}}" name="meta_keywords">{{ get_setting('meta_keywords') }}</textarea>
        						<small class="text-muted">{{ translate('Separate with coma') }}</small>
                            </div>
    					</div>
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Meta Image') }}</label>
                            <div class="col-md-8">
        						<div class="input-group " data-toggle="aizuploader" data-type="image">
        							<div class="input-group-prepend">
        								<div class="input-group-text bg-soft-secondary">{{ translate('Browse') }}</div>
        							</div>
        							<div class="form-control file-amount">{{ translate('Choose File') }}</div>
        							<input type="hidden" name="types[]" value="meta_image">
        							<input type="hidden" name="meta_image" value="{{ get_setting('meta_image') }}" class="selected-files">
        						</div>
        						<div class="file-preview box"></div>
                            </div>
    					</div>
    					<div class="text-right">
    						<button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
    					</div>
    				</form>
    			</div>
    		</div>
            {{-- <div class="card">
    			<div class="card-header">
    				<h6 class="fw-600 mb-0">{{ translate('Cookies Agreement') }}</h6>
    			</div>
    			<div class="card-body">
    				<form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data">
    					@csrf
    					<div class="form-group row">
    						<label class="col-md-3 col-from-label">{{ translate('Cookies Agreement Text') }}</label>
                            <div class="col-md-8">
        						<input type="hidden" name="types[]" value="cookies_agreement_text">
        						<textarea name="cookies_agreement_text" rows="4" class="aiz-text-editor form-control" data-buttons='[["font", ["bold"]],["insert", ["link"]]]'>{{ get_setting('cookies_agreement_text') }}</textarea>
                            </div>
    					</div>
                        <div class="form-group row">
    						<label class="col-md-3 col-from-label">{{translate('Show Cookies Agreement?')}}</label>
    						<div class="col-md-8">
    							<label class="aiz-switch aiz-switch-success mb-0">
    								<input type="hidden" name="types[]" value="show_cookies_agreement">
    								<input type="checkbox" name="show_cookies_agreement" @if( get_setting('show_cookies_agreement') == 'on') checked @endif>
    								<span></span>
    							</label>
    						</div>
    					</div>
    					<div class="text-right">
    						<button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
    					</div>
    				</form>
    			</div>
    		</div> --}}
            {{-- <div class="card">
    			<div class="card-header">
    				<h6 class="fw-600 mb-0">{{ translate('Website Popup') }}</h6>
    			</div>
    			<div class="card-body">
    				<form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data">
    					@csrf
    					<div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Show website popup?')}}</label>
                            <div class="col-md-8">
                                <label class="aiz-switch aiz-switch-success mb-0">
                                    <input type="hidden" name="types[]" value="show_website_popup">
                                    <input type="checkbox" name="show_website_popup" @if( get_setting('show_website_popup') == 'on') checked @endif>
                                    <span></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{ translate('Popup content') }}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="website_popup_content">
                                <textarea name="website_popup_content" rows="4" class="aiz-text-editor form-control" >{{ get_setting('website_popup_content') }}</textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{translate('Show Subscriber form?')}}</label>
                            <div class="col-md-8">
                                <label class="aiz-switch aiz-switch-success mb-0">
                                    <input type="hidden" name="types[]" value="show_subscribe_form">
                                    <input type="checkbox" name="show_subscribe_form" @if( get_setting('show_subscribe_form') == 'on') checked @endif>
                                    <span></span>
                                </label>
                            </div>
                        </div>
    					<div class="text-right">
    						<button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
    					</div>
    				</form>
    			</div>
    		</div> --}}
            {{-- <div class="card">
                <div class="card-header">
                    <h6 class="fw-600 mb-0">{{ translate('Custom Script') }}</h6>
                </div>
                <div class="card-body">
                    <form action="{{ route('business_settings.update') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{ translate('Header custom script - before </head>') }}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="header_script">
                                <textarea name="header_script" rows="4" class="form-control" placeholder="<script>&#10;...&#10;</script>">{{ get_setting('header_script') }}</textarea>
                                <small>{{ translate('Write script with <script> tag') }}</small>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-3 col-from-label">{{ translate('Footer custom script - before </body>') }}</label>
                            <div class="col-md-8">
                                <input type="hidden" name="types[]" value="footer_script">
                                <textarea name="footer_script" rows="4" class="form-control" placeholder="<script>&#10;...&#10;</script>">{{ get_setting('footer_script') }}</textarea>
                                <small>{{ translate('Write script with <script> tag') }}</small>
                            </div>
                        </div>
                        <div class="text-right">
                            <button type="submit" class="btn btn-primary">{{ translate('Update') }}</button>
                        </div>
                    </form>
                </div>
            </div> --}}
    	</div>
    </div>

@endsection
