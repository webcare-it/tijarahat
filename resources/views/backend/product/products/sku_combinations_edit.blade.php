@if(isset($has_new_selections) && $has_new_selections)
{{-- Show new combinations when there are selections --}}
@if(count($combinations[0]) > 0)
@php
	// Reuse existing stock values when the variant already exists
	$stocksByVariant = isset($product) && $product->stocks ? $product->stocks->keyBy('variant') : collect();
@endphp
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
	@foreach ($combinations as $key => $combination)
		@php
			$sku = '';
			foreach (explode(' ', $product_name) as $key => $value) {
				$sku .= substr($value, 0, 1);
			}

			$str = '';
			foreach ($combination as $key => $item){
				if($key > 0 ){
					$str .= '-'.str_replace(' ', '', $item);
					$sku .='-'.str_replace(' ', '', $item);
				}
				else{
					if($colors_active == 1){
						$color_name = \App\Models\Color::where('code', $item)->first()->name;
						$str .= $color_name;
						$sku .='-'.$color_name;
					}
					else{
						$str .= str_replace(' ', '', $item);
						$sku .='-'.str_replace(' ', '', $item);
					}
				}
			}
			
			// FIX: Ensure the string is properly formatted for field names (replace dots with underscores)
			$field_str = str_replace('.', '_', $str);
			$field_str = str_replace('-', '_', $field_str);
			$field_str = str_replace(' ', '_', $field_str);

			$existingStock = $stocksByVariant->get($str);
		@endphp
		@if(strlen($str) > 0)
			<tr class="variant">
				<td>
					<label for="" class="control-label">{{ $str }}</label>
					<input type="hidden" name="variant_name_{{ $field_str }}" value="{{ $str }}">
					@if(!empty($existingStock))
						<input type="hidden" name="existing_stock_{{ $field_str }}" value="1">
						<input type="hidden" name="stock_id_{{ $field_str }}" value="{{ $existingStock->id }}">
					@endif
				</td>
				<td>
					<input type="number" lang="en" name="price_{{ $field_str }}" value="{{ $existingStock->price ?? $unit_price }}" min="0" step="0.01" class="form-control" required>
				</td>
				<td>
					<input type="text" name="sku_{{ $field_str }}" value="{{ $existingStock->sku ?? '' }}" class="form-control">
				</td>
				<td>
					<input type="number" lang="en" name="qty_{{ $field_str }}" value="{{ $existingStock->qty ?? 10 }}" min="0" step="1" class="form-control" required>
				</td>
				<td>
					<div class=" input-group " data-toggle="aizuploader" data-type="image">
						<div class="input-group-prepend">
							<div class="input-group-text bg-soft-secondary font-weight-medium">{{ translate('Browse') }}</div>
						</div>
						<div class="form-control file-amount text-truncate">{{ translate('Choose File') }}</div>
						<input type="hidden" name="img_{{ $field_str }}" class="selected-files" value="{{ $existingStock->image ?? '' }}">
					</div>
					<div class="file-preview box sm">
						@if(!empty($existingStock) && !empty($existingStock->image))
							<img src="{{ uploaded_asset($existingStock->image) }}" class="img-fit" style="max-height: 80px;">
						@endif
					</div>
				</td>
			</tr>
		@endif
	@endforeach
	</tbody>
</table>
@endif
@elseif(isset($product) && $product->stocks->count() > 0)
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
			
			// Ensure the string is properly formatted for field names (replace dots with underscores)
			$field_str = str_replace('.', '_', $str);
			$field_str = str_replace('-', '_', $field_str); // Also replace hyphens with underscores
			$field_str = str_replace(' ', '_', $field_str); // Also replace spaces with underscores
		@endphp
		@if(strlen($str) > 0)
			<tr class="variant">
				<td>
					<label for="" class="control-label">{{ $str }}</label>
					<input type="hidden" name="variant_name_{{ $field_str }}" value="{{ $str }}">
					<!-- Mark this as existing stock to prevent deletion -->
					<input type="hidden" name="existing_stock_{{ $field_str }}" value="1">
					<input type="hidden" name="stock_id_{{ $field_str }}" value="{{ $stock->id }}">
				</td>
				<td>
					<input type="number" lang="en" name="price_{{ $field_str }}" value="{{ $stock->price ?? $unit_price }}" min="0" step="0.01" class="form-control" required>
				</td>
				<td>
					<input type="text" name="sku_{{ $field_str }}" value="{{ $stock->sku }}" class="form-control">
				</td>
				<td>
					<input type="number" lang="en" name="qty_{{ $field_str }}" value="{{ $stock->qty ?? 10 }}" min="0" step="1" class="form-control" required>
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