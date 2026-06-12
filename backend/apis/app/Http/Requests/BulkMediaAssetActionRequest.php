<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkMediaAssetActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:delete,optimize,move'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:media_assets,id'],
            'media_folder_id' => ['required_if:action,move', 'nullable', 'integer', 'exists:media_folders,id'],
        ];
    }
}
