<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkPackageOfferActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:activate,deactivate,delete'],
            'offer_keys' => ['required', 'array', 'min:1'],
            'offer_keys.*' => ['string', 'distinct', 'max:80'],
        ];
    }
}
