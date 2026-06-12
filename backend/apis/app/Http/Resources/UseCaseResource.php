<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UseCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'icon'        => $this->icon,
            'sort_order'  => $this->sort_order,
            'industry'    => new IndustryResource($this->whenLoaded('industry')),
        ];
    }
}
