<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'location'  => $this->location,
            'name'      => $this->name,
            'is_active' => $this->is_active,
            'items'     => NavigationItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
