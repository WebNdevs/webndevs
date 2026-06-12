<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceInquiryRequest;
use App\Models\ServiceInquiry;

class ServiceInquiryController extends Controller
{
    public function store(StoreServiceInquiryRequest $request)
    {
        $inquiry = ServiceInquiry::query()->create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return $this->success($inquiry, 'Inquiry submitted successfully.', 201);
    }
}
