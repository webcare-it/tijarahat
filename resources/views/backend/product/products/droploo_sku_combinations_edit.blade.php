@if(isset($product) && $product->stocks->count() > 0)
<table class="table table-bordered aiz-table">
	<thead>
		<tr>
			<td class="text-center">
				{{translate('Variant')}}
			</td>
			<td class="text-center">
				{{translate('Variant Price')}}
			</td>
			<td class="text-center" data-breakpoints="lg">
				{{translate('SKU')}}
			</td>
			<td class="text-center" data-breakpoints="lg">
				{{translate('Quantity')}}
			</td>
			<td class="text-center" data-breakpoints="lg">
				{{translate('Photo')}}
			</td>
		</tr>
	</thead>
	<tbody>
	@foreach ($product->stocks as $key => $stock)
		@php
			$str = $stock->variant;
			$sku = $stock->sku;
			
			// FIX: Ensure the string is properly formatted for field names (replace dots with underscores)
			$field_str = str_replace('.', '_', $str);
			$field_str = str_replace('-', '_', $field_str); // Also replace hyphens with underscores
			$field_str = str_replace(' ', '_', $field_str); // Also replace spaces with underscores
		@endphp
		@if(strlen($str) > 0)
			<tr class="variant">
				<td>
					<label for="" class="control-label">{{ $str }}</label>
					<input type="hidden" name="variant_name_{{ $field_str }}" value="{{ $str }}">
				</td>
				<td>
					<input type="number" lang="en" name="price_{{ $field_str }}" value="{{ $stock->price ?? 0 }}" min="0" step="0.01" class="form-control" required>
				</td>
				<td>
					<input type="text" name="sku_{{ $field_str }}" value="{{ $stock->sku }}" class="form-control">
				</td>
				<td>
					<input type="number" lang="en" name="qty_{{ $field_str }}" value="{{ $stock->qty ?? 0 }}" min="0" step="1" class="form-control" required>
				</td>
				<td>
					<div class="input-group" data-toggle="aizuploader" data-type="image">
						<div class="input-group-prepend">
							<div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse') }}</div>
						</div>
						<div class="form-control file-amount text-truncate">{{ translate('Choose File') }}</div>
						<input type="hidden" name="img_{{ $field_str }}" class="selected-files" value="{{ $stock->image ?? '' }}">
					</div>
					<div class="file-preview box sm">
						@if(!empty($stock->image))
							<img src="{{ uploaded_asset($stock->image) }}" class="img-fit" style="max-height: 80px;">
						@endif
					</div>
				</td>
			</tr>
		@endif
	@endforeach
	</tbody>
</table>
@endif