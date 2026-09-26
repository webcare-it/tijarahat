@extends('backend.layouts.app')

@section('content')
<div class="card border-0 shadow-sm rounded-lg mb-4">
    <div class="card-header bg-white py-3 border-bottom-0">
        <h5 class="mb-0 text-dark font-weight-bold">{{ translate('Courier Fraud Checker') }}</h5>
    </div>
    <div class="card-body pt-0">
        <form method="GET" action="{{ route('fraud_checker') }}" class="mb-4" id="fraudCheckerForm">
            <div class="form-row justify-content-center align-items-center">
                <div class="col-md-4">
                    <label for="phone" class="text-muted font-weight-bold">{{ translate('PHONE NUMBER') }} <span class="text-info">phone number will be 11 digits no bangla</span></label>
                    <input type="text" class="form-control form-control-lg border-2" id="phone" name="phone" value="{{ old('phone', $phone ?? '') }}" placeholder="01XXXXXXXXX" autocomplete="off" style="border-radius: 8px;">
                </div>
                <div class="col-auto d-flex gap-4 align-items-center mt-4">
                    <button type="submit" class="btn btn-primary px-4 btn-lg" id="fraudSearchBtn" style="border-radius: 8px; font-weight: 500;">
                        <span class="btn-text">{{ translate('Search') }}</span>
                        <span class="btn-loading d-none"><i class="las la-spinner la-spin"></i> {{ translate('Searching...') }}</span>
                    </button>
                    <button type="button" id="fraudResetBtn" class="btn btn-outline-secondary px-4 btn-lg" style="border-radius: 8px; margin-left: 10px;">{{ translate('Reset') }}</button>
                </div>
            </div>
        </form>

        @if(isset($error) && $error)
            <div class="alert alert-warning border-0 shadow-sm" style="border-radius: 8px;">{{ $error }}</div>
        @endif

        @if(isset($result) && $result)
            @php
                $status = strtolower($result['status'] ?? 'success');
                $riskLevel = strtolower($result['risk_level'] ?? $result['risk_verdict']['level'] ?? 'safe');
                $riskLabel = $result['risk_verdict']['label'] ?? ucfirst($riskLevel);
                $riskAction = $result['risk_verdict']['action'] ?? 'Review courier performance';
                $riskReasons = $result['risk_verdict']['reasons'] ?? [];

                $riskColor = match($riskLevel) {
                    'safe', 'excellent', 'excellent risk' => '#10b981',
                    'danger', 'high risk' => '#ef4444',
                    'warning', 'medium risk' => '#f59e0b',
                    default => '#6b7280',
                };

                $riskBg = match($riskLevel) {
                    'safe', 'excellent', 'excellent risk' => '#d1fae5',
                    'danger', 'high risk' => '#fee2e2',
                    'warning', 'medium risk' => '#fef3c7',
                    default => '#f3f4f6',
                };

                $summary = $result['data']['summary'] ?? [
                    'total_parcel' => 0,
                    'success_parcel' => 0,
                    'cancelled_parcel' => 0,
                    'success_ratio' => $result['success_ratio'] ?? 0,
                ];

                $providers = $result['data'] ?? [];
                $reports = $result['reports'] ?? [];
            @endphp

            <div class="row g-4 mt-2">
                
                <div class="col-lg-4 col-xl-3">
                    <div class="card h-100 border-0 shadow-sm py-4 text-center" style="border-radius: 16px; background: #fff;">
                        <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <div class="mb-4 font-weight-bold text-muted small tracking-wider" style="letter-spacing: 0.05em;">
                                <i class="las la-shield-alt text-success mr-1"></i> {{ translate('FRAUD CHECKER') }}
                            </div>
                            
                            <h6 class="text-dark font-weight-bold mb-4">{{ translate('Delivery Success Ratio') }}</h6>
                            
                            <div class="position-relative d-inline-flex align-items-center justify-content-center mb-4">
                                <svg width="160" height="160" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#e2e8f0" stroke-width="12"></circle>
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="{{ $riskColor }}" stroke-width="12" 
                                            stroke-dasharray="440" stroke-dashoffset="{{ 440 - (440 * min(100, max(0, $summary['success_ratio']))) / 100 }}" 
                                            stroke-linecap="round" transform="rotate(-90 80 80)"></circle>
                                </svg>
                                <div class="position-absolute text-center">
                                    <h2 class="mb-0 font-weight-bold text-dark" style="font-size: 1.8rem;">{{ $summary['success_ratio'] }}%</h2>
                                    <span class="text-muted text-uppercase small font-weight-bold" style="font-size: 0.65rem; letter-spacing: 0.5px;">{{ translate('Success Rate') }}</span>
                                </div>
                            </div>

                            <div class="px-4 py-2 mb-3 font-weight-bold d-inline-flex align-items-center gap-2" style="background-color: {{ $riskBg }}; color: {{ $riskColor }}; border-radius: 30px; font-size: 0.9rem;">
                                <i class="las la-check-circle"></i> {{ ucfirst($riskLabel) }}
                            </div>
                            
                            <p class="text-muted small px-3 mb-0">
                                {{ translate('This is verified against overall historical courier logs.') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8 col-xl-9">
                    
                    <div class="row g-3 mb-4">
                        <div class="col-6 col-sm-3">
                            <div class="card border-0 shadow-sm h-100 text-center py-3" style="border-radius: 12px;">
                                <div class="card-body p-2">
                                    <div class="d-inline-flex align-items-center justify-content-center bg-light text-primary rounded-circle mb-2" style="width: 45px; height: 45px;">
                                        <i class="las la-cart-arrow-down fs-5"></i>
                                    </div>
                                    <span class="text-muted text-uppercase d-block mb-1" style="font-size: 0.7rem; font-weight: 600;">{{ translate('Total Orders') }}</span>
                                    <h3 class="mb-0 font-weight-bold text-dark">{{ $summary['total_parcel'] }}</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-6 col-sm-3">
                            <div class="card border-0 shadow-sm h-100 text-center py-3" style="border-radius: 12px;">
                                <div class="card-body p-2">
                                    <div class="d-inline-flex align-items-center justify-content-center bg-light text-success rounded-circle mb-2" style="width: 45px; height: 45px;">
                                        <i class="las la-check-circle fs-5"></i>
                                    </div>
                                    <span class="text-muted text-uppercase d-block mb-1" style="font-size: 0.7rem; font-weight: 600;">{{ translate('Total Delivered') }}</span>
                                    <h3 class="mb-0 font-weight-bold text-dark">{{ $summary['success_parcel'] }}</h3>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-sm-3">
                            <div class="card border-0 shadow-sm h-100 text-center py-3" style="border-radius: 12px;">
                                <div class="card-body p-2">
                                    <div class="d-inline-flex align-items-center justify-content-center bg-light text-danger rounded-circle mb-2" style="width: 45px; height: 45px;">
                                        <i class="las la-times-circle fs-5"></i>
                                    </div>
                                    <span class="text-muted text-uppercase d-block mb-1" style="font-size: 0.7rem; font-weight: 600;">{{ translate('Total Cancelled') }}</span>
                                    <h3 class="mb-0 font-weight-bold text-dark">{{ $summary['cancelled_parcel'] }}</h3>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-sm-3">
                            <div class="card border-0 shadow-sm h-100 text-center py-3" style="border-radius: 12px;">
                                <div class="card-body p-2">
                                    <div class="d-inline-flex align-items-center justify-content-center bg-light text-info rounded-circle mb-2" style="width: 45px; height: 45px;">
                                        <i class="las la-chart-line fs-5"></i>
                                    </div>
                                    <span class="text-muted text-uppercase d-block mb-1" style="font-size: 0.7rem; font-weight: 600;">{{ translate('Success Rate') }}</span>
                                    <h3 class="mb-0 font-weight-bold text-dark">{{ $summary['success_ratio'] }}%</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm mb-4" style="border-radius: 16px;">
                        <div class="card-body p-4">
                            <h6 class="text-dark font-weight-bold mb-3">{{ translate('Risk verdict') }}</h6>
                            <div class="row g-3">
                                <div class="col-md-8">
                                    <div class="p-3 rounded" style="background-color: {{ $riskBg }}; color: {{ $riskColor }};">
                                        <strong>{{ $riskLabel }}</strong>
                                        <div class="small mt-1">{{ $riskAction }}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="p-3 rounded bg-light h-100">
                                        <div class="small text-muted text-uppercase font-weight-bold">{{ translate('Status') }}</div>
                                        <div class="font-weight-bold text-dark">{{ ucfirst($status) }}</div>
                                        @if(!empty($result['message']))
                                            <div class="small text-muted mt-1">{{ $result['message'] }}</div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            @if(!empty($riskReasons))
                                <ul class="mb-0 mt-3 ps-3 text-muted small">
                                    @foreach($riskReasons as $reason)
                                        <li>{{ $reason }}</li>
                                    @endforeach
                                </ul>
                            @endif
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm" style="border-radius: 16px;">
                        <div class="card-body p-4">
                            <h6 class="text-dark font-weight-bold mb-4">{{ translate('Courier Fraud Check Details') }}</h6>
                            <div class="table-responsive">
                                <table class="table table-borderless align-middle mb-0">
                                    <thead>
                                        <tr class="text-muted text-uppercase small" style="font-size: 0.75rem; background-color: #f8fafc;">
                                            <th class="py-3 ps-3" style="border-top-left-radius: 8px; border-bottom-left-radius: 8px;">{{ translate('Courier') }}</th>
                                            <th class="py-3 text-center">{{ translate('Orders') }}</th>
                                            <th class="py-3 text-center">{{ translate('Delivered') }}</th>
                                            <th class="py-3 text-center">{{ translate('Cancelled') }}</th>
                                            <th class="py-3 text-center pe-3" style="border-top-right-radius: 8px; border-bottom-right-radius: 8px;">{{ translate('Performance') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($providers as $key => $provider)
                                            {{-- Skip the generic summary array payload --}}
                                            @if($key !== 'summary' && is_array($provider) && isset($provider['name']))
                                                @php
                                                    $perfRatio = intval($provider['success_ratio'] ?? 0);
                                                    $perfBg = $perfRatio >= 70 ? '#e6f4ea' : ($perfRatio >= 40 ? '#fef3c7' : '#fce8e6');
                                                    $perfColor = $perfRatio >= 70 ? '#137333' : ($perfRatio >= 40 ? '#b06000' : '#c5221f');
                                                @endphp
                                                <tr class="border-bottom" style="border-color: #f1f5f9 !important;">
                                                    <td class="py-3 ps-3 font-weight-bold text-dark">{{ $provider['name'] ?? ucfirst($key) }}</td>
                                                    <td class="py-3 text-center">
                                                        <span class="badge px-3 py-2 text-dark bg-light font-weight-bold" style="font-size: 0.9rem; border-radius:6px;">{{ $provider['total_parcel'] ?? 0 }}</span>
                                                    </td>
                                                    <td class="py-3 text-center">
                                                        <span class="badge px-3 py-2 text-success font-weight-bold" style="background-color: #e6f4ea; font-size: 0.9rem; border-radius:6px;">{{ $provider['success_parcel'] ?? 0 }}</span>
                                                    </td>
                                                    <td class="py-3 text-center">
                                                        <span class="badge px-3 py-2 text-danger font-weight-bold" style="background-color: #fce8e6; font-size: 0.9rem; border-radius:6px;">{{ $provider['cancelled_parcel'] ?? 0 }}</span>
                                                    </td>
                                                    <td class="py-3 text-center pe-3">
                                                        <span class="badge px-3 py-2 font-weight-bold" style="background-color: {{ $perfBg }}; color: {{ $perfColor }}; font-size: 0.9rem; border-radius: 6px;">
                                                            {{ $provider['success_ratio'] ?? 0 }}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            @endif
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    @if(!empty($reports))
                        <div class="card border-0 shadow-sm mt-4" style="border-radius: 16px;">
                            <div class="card-body p-4">
                                <h6 class="text-dark font-weight-bold mb-3">{{ translate('Fraud reports') }}</h6>
                                <div class="row g-3">
                                    @foreach($reports as $report)
                                        <div class="col-md-6">
                                            <div class="border rounded p-3 h-100 bg-light">
                                                <div class="d-flex align-items-center justify-content-between mb-2">
                                                    <strong>{{ $report['name'] ?? translate('Report') }}</strong>
                                                    <span class="badge bg-white text-muted border">{{ $report['id'] ?? '-' }}</span>
                                                </div>
                                                <div class="small text-muted mb-1">{{ $report['details'] ?? '-' }}</div>
                                                <div class="small text-muted">{{ translate('Courier') }}: {{ $report['courierName'] ?? '-' }}</div>
                                                <div class="small text-muted">{{ translate('Created') }}: {{ $report['created_at'] ?? '-' }}</div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endif

                </div>
            </div>
        @elseif(isset($phone) && !isset($error))
            <div class="alert alert-info border-0 shadow-sm mt-4" style="border-radius: 8px;">
                <i class="las la-info-circle mr-1"></i> {{ translate('Phone number parsed. Click Search to view performance indicators.') }}
            </div>
        @endif
    </div>
</div>
@endsection

@section('script')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('fraudCheckerForm');
        const searchBtn = document.getElementById('fraudSearchBtn');
        const resetBtn = document.getElementById('fraudResetBtn');
        const phoneInput = document.getElementById('phone');
        const btnText = searchBtn ? searchBtn.querySelector('.btn-text') : null;
        const btnLoading = searchBtn ? searchBtn.querySelector('.btn-loading') : null;

        if (form && searchBtn && btnText && btnLoading && resetBtn) {
            form.addEventListener('submit', function () {
                searchBtn.disabled = true;
                resetBtn.disabled = true;
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
            });
        }

        if (resetBtn && phoneInput) {
            resetBtn.addEventListener('click', function () {
                if (resetBtn.disabled) return;
                phoneInput.value = '';
                window.location.href = '{{ route('fraud_checker') }}';
            });
        }
    });
</script>
@endsection