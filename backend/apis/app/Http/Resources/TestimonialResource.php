<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'author_name'  => $this->author_name,
            'author_title' => $this->author_title,
            'company'      => $this->company,
            'content'      => $this->content,
            'rating'       => $this->rating,
            'photo_url'    => $this->photo_url,
            'is_featured'  => $this->is_featured,
            'sort_order'   => $this->sort_order,
        ];
    }
}
