<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNavigationItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'navigation_menu_id' => ['required', 'integer', 'exists:navigation_menus,id'],
            'parent_id' => ['nullable', 'integer', 'exists:navigation_items,id'],
            'label' => ['required', 'string', 'max:200'],
            'url' => ['nullable', 'string', 'max:500'],
            'entity_type' => ['nullable', 'string', 'max:100'],
            'entity_id' => ['nullable', 'integer', 'min:1'],
            'icon' => ['nullable', 'string', 'max:100'],
            'badge_text' => ['nullable', 'string', 'max:50'],
            'badge_color' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'column_number' => ['nullable', 'integer', 'min:1', 'max:4'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'opens_new_tab' => ['nullable', 'boolean'],
        ];
    }
}
