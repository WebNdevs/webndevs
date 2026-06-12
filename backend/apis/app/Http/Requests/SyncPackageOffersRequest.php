<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncPackageOffersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'offers' => ['required', 'array'],
            'offers.*.offer_key' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/'],
            'offers.*.plan_key' => ['nullable', 'string', 'max:80'],
            'offers.*.name' => ['required', 'string', 'max:255'],
            'offers.*.description' => ['nullable', 'string'],
            'offers.*.offer_type' => ['required', 'in:percentage_discount,fixed_discount,bundle'],
            'offers.*.discount_value' => ['nullable', 'numeric', 'min:0'],
            'offers.*.combo_plan_keys' => ['nullable', 'array'],
            'offers.*.combo_plan_keys.*' => ['string', 'max:50'],
            'offers.*.combo_price' => ['nullable', 'numeric', 'min:0'],
            'offers.*.conditions' => ['nullable', 'array'],
            'offers.*.starts_at' => ['nullable', 'date'],
            'offers.*.ends_at' => ['nullable', 'date'],
            'offers.*.is_active' => ['nullable', 'boolean'],
            'offers.*.display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
