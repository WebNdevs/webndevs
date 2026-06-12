<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CrossRefSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'section_key'  => $this->section_key,
            'title'        => $this->title,
            'content'      => $this->content,
            'data'         => $this->data,
            'sort_order'   => $this->sort_order,
            'is_visible'   => $this->is_visible,
            'ai_generated' => $this->ai_generated,
        ];
    }
}
