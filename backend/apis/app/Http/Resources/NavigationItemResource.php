<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'label'         => $this->label,
            'url'           => $this->url,
            'entity_type'   => $this->entity_type,
            'entity_id'     => $this->entity_id,
            'icon'          => $this->icon,
            'badge_text'    => $this->badge_text,
            'badge_color'   => $this->badge_color,
            'is_featured'   => $this->is_featured,
            'column_number' => $this->column_number,
            'sort_order'    => $this->sort_order,
            'is_active'     => $this->is_active,
            'opens_new_tab' => $this->opens_new_tab,
            'children'      => self::collection($this->whenLoaded('children')),
        ];
    }
}
