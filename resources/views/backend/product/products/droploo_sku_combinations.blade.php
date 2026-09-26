@if(isset($product_images) && count($product_images) > 0)
<table class="table table-bordered aiz-table">
	<thead>
		<tr>
			<td class="text-center">
				{{translate('Variant')}}
			</td>
			<td class="text-center">
				{{translate('Wholesale Price')}}
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
	@foreach ($product_images as $key => $variant)
		@php
			$sku = '';
			foreach (explode(' ', $product_name) as $k => $value) {
				$sku .= substr($value, 0, 1);
			}

			// Create variant string from color and size
			$str = '';
			if(!empty($variant['color'])) {
				$str .= str_replace(' ', '', $variant['color']);
				$sku .= '-'.str_replace(' ', '', $variant['color']);
			}
			if(!empty($variant['size'])) {
				if($str != '') {
					$str .= '-';
					$sku .= '-';
				}
				$str .= str_replace(' ', ' ', $variant['size']);
				$sku .= str_replace(' ', '', $variant['size']);
			}
			
			// FIX: Ensure the string is properly formatted for field names (replace dots with underscores)
			$field_str = str_replace('.', '_', $str);
			$field_str = str_replace('-', '_', $field_str); // Also replace hyphens with underscores
			$field_str = str_replace(' ', '_', $field_str); // Also replace spaces with underscores
		@endphp
		@if(strlen($str) > 0)
			<tr class="variant">
				<td>
					<label for="" class="control-label">
						{{ $str }}
					</label>
					<input type="hidden" name="variant_name_{{ $field_str }}" value="{{ $str }}">
				</td>
				<td>
					<input type="number" lang="en" name="wholesale_price_{{ $field_str }}" value="{{ $variant['wholesale_price'] ?? 0 }}" min="0" step="0.01" class="form-control" readonly>
				</td>
				<td>
					<input type="number" lang="en" name="price_{{ $field_str }}" value="{{ $variant['price'] ?? 0 }}" min="0" step="0.01" class="form-control" required>
				</td>
				<td>
					<input type="text" name="sku_{{ $field_str }}" value="" class="form-control">
				</td>
				<td>
					<input type="number" lang="en" name="qty_{{ $field_str }}" value="10" min="0" step="1" class="form-control" required>
				</td>
				<td>
					<div class="input-group" data-toggle="aizuploader" data-type="image">
						<div class="input-group-prepend">
							<div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse') }}</div>
						</div>
						<div class="form-control file-amount text-truncate">{{ translate('Choose File') }}</div>
						<input type="hidden" name="img_{{ $field_str }}" class="selected-files" value="">
					</div>
					<div class="file-preview box sm">
						@if(!empty($variant['imageUrl']))
							<img src="" class="img-fit" style="max-height: 80px;">
						@endif
					</div>
				</td>
			</tr>
		@endif
	@endforeach
	</tbody>
</table>
@endif