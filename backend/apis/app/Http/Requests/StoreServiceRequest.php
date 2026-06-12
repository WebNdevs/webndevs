<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:services,slug'],
            'category' => ['required', 'string', 'max:255'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:active,inactive'],
            'description' => ['nullable', 'string'],
            'availability_schedule' => ['nullable', 'array'],
            'availability_schedule.*.day' => ['required_with:availability_schedule', 'string', 'max:20'],
            'availability_schedule.*.start' => ['required_with:availability_schedule', 'date_format:H:i'],
            'availability_schedule.*.end' => ['required_with:availability_schedule', 'date_format:H:i'],
            'booking_enabled' => ['nullable', 'boolean'],
            'custom_attributes' => ['nullable', 'array'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'projects_completed' => ['nullable', 'integer', 'min:0'],
            'hero_image_url' => ['nullable', 'url', 'max:1000'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'array'],
            'meta_keywords.*' => ['string', 'max:100'],
            'canonical_url' => ['nullable', 'url', 'max:1000'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'distinct', 'exists:service_categories,id'],
            'primary_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'pricing_table' => ['nullable', 'array'],
            'pricing_table.*.plan_key' => ['required_with:pricing_table', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'pricing_table.*.name' => ['required_with:pricing_table', 'string', 'max:120'],
            'pricing_table.*.description' => ['nullable', 'string'],
            'pricing_table.*.price' => ['required_with:pricing_table', 'numeric', 'min:0'],
            'pricing_table.*.billing_cycle' => ['nullable', 'string', 'max:50'],
            'pricing_table.*.delivery_days' => ['nullable', 'integer', 'min:1'],
            'pricing_table.*.max_duration_days' => ['nullable', 'integer', 'min:1'],
            'pricing_table.*.is_popular' => ['nullable', 'boolean'],
            'pricing_table.*.is_featured' => ['nullable', 'boolean'],
            'pricing_table.*.features' => ['nullable', 'array'],
            'pricing_table.*.features.*' => ['string', 'max:255'],
            'pricing_table.*.custom_config' => ['nullable', 'array'],
            'pricing_table.*.max_revisions' => ['nullable', 'integer', 'min:0'],
            'pricing_table.*.comparison_points' => ['nullable', 'array'],
            'pricing_table.*.comparison_points.*' => ['string', 'max:255'],
            'pricing_table.*.parent_plan_id' => ['nullable', 'integer', 'min:1'],
            'pricing_table.*.parent_plan_key' => ['nullable', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/'],
            'pricing_table.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'pricing_table.*.display_order' => ['nullable', 'integer', 'min:0'],
            'pricing_table.*.is_active' => ['nullable', 'boolean'],
        ];
    }
}
