<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncServicePlansRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plans' => ['required', 'array', 'min:1'],
            'plans.*.plan_key' => ['required', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'plans.*.name' => ['required', 'string', 'max:255'],
            'plans.*.price' => ['required', 'numeric', 'min:0'],
            'plans.*.billing_cycle' => ['required', 'in:one_time,monthly'],
            'plans.*.delivery_days' => ['nullable', 'integer', 'min:1'],
            'plans.*.max_duration_days' => ['nullable', 'integer', 'min:1'],
            'plans.*.description' => ['nullable', 'string'],
            'plans.*.features' => ['nullable', 'array'],
            'plans.*.features.*' => ['string', 'max:255'],
            'plans.*.custom_config' => ['nullable', 'array'],
            'plans.*.max_revisions' => ['nullable', 'integer', 'min:0'],
            'plans.*.comparison_points' => ['nullable', 'array'],
            'plans.*.comparison_points.*' => ['string', 'max:255'],
            'plans.*.parent_plan_id' => ['nullable', 'integer', 'min:1'],
            'plans.*.parent_plan_key' => ['nullable', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'plans.*.is_featured' => ['sometimes', 'boolean'],
            'plans.*.is_active' => ['sometimes', 'boolean'],
            'plans.*.display_order' => ['sometimes', 'integer', 'min:0'],
            'relations' => ['nullable', 'array'],
            'relations.*.from_plan_id' => ['nullable', 'integer', 'min:1'],
            'relations.*.to_plan_id' => ['nullable', 'integer', 'min:1'],
            'relations.*.from_plan_key' => ['nullable', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'relations.*.to_plan_key' => ['nullable', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'relations.*.relation_type' => ['required_with:relations', 'in:upgrade,downgrade,alternative'],
            'sync_token' => ['nullable', 'string', 'max:100'],
        ];
    }
}
