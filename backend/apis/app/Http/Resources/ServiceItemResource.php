<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $itemData = is_array($this->data) ? $this->data : [];

        return [
            'id' => $this->id,
            'service_section_id' => $this->service_section_id,
            'sort_order' => $this->sort_order,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'data' => $itemData,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
