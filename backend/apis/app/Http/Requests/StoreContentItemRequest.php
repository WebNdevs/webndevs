<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContentItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Note: content_section_id is derived from URL route, not request body
            'item_key' => ['nullable', 'string', 'max:80'],
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'url' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'results' => ['nullable', 'array'],
            'tags' => ['nullable', 'array'],
            'badge' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'string', 'max:500'],
            'client_name' => ['nullable', 'string', 'max:100'],
            'client_role' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'custom_fields' => ['nullable', 'array'],
            'external_id' => ['nullable', 'string', 'max:100'],
            
            // Q&A fields
            'question' => ['nullable', 'string'],
            'answer' => ['nullable', 'string'],
            
            // Project (Pro) fields
            'pro_name' => ['nullable', 'string', 'max:255'],
            'pro_category' => ['nullable', 'string', 'max:100'],
            'pro_url' => ['nullable', 'string', 'max:500'],
            'pro_description' => ['nullable', 'string'],
            'pro_results' => ['nullable', 'string'],
            'pro_tag' => ['nullable', 'string', 'max:255'],
            'pro_badge' => ['nullable', 'string', 'max:100'],
            
            // Testimonial (Test) fields
            'test_name' => ['nullable', 'string', 'max:255'],
            'test_company' => ['nullable', 'string', 'max:100'],
            'test_role' => ['nullable', 'string', 'max:100'],
            'test_description' => ['nullable', 'string'],
            'test_url' => ['nullable', 'string', 'max:500'],
            'test_rate' => ['nullable', 'integer', 'min:1', 'max:5'],
            
            // Data Tile fields
            'tile_name' => ['nullable', 'string', 'max:255'],
            'tile_url' => ['nullable', 'string', 'max:500'],
            'tile_description' => ['nullable', 'string'],
            
            // Service Card (Ser) fields
            'ser_name' => ['nullable', 'string', 'max:255'],
            'ser_url' => ['nullable', 'string', 'max:500'],
            'ser_description' => ['nullable', 'string'],
            'ser_icon' => ['nullable', 'string', 'max:100'],
            'ser_tag' => ['nullable', 'string', 'max:255'],
            
            // Choose Card (cc) fields
            'cc_name' => ['nullable', 'string', 'max:255'],
            'cc_description' => ['nullable', 'string'],
            'cc_icon' => ['nullable', 'string', 'max:100'],
            
            // Process Card (pc) fields
            'pc_name' => ['nullable', 'string', 'max:255'],
            'pc_number' => ['nullable', 'string', 'max:50'],
            'pc_description' => ['nullable', 'string'],
            'pc_icon' => ['nullable', 'string', 'max:100'],
            'pc_timeline' => ['nullable', 'string', 'max:100'],
        ];
    }
}