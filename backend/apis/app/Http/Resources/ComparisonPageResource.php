<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComparisonPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'slug'            => $this->slug,
            'subtitle'        => $this->subtitle,
            'quick_verdict'   => $this->quick_verdict,
            'recommendation'  => $this->recommendation,
            'intro_content'   => $this->intro_content,
            'status'          => $this->status,
            'entities'        => $this->whenLoaded('entities', fn () =>
                $this->entities->map(fn ($e) => [
                    'id'          => $e->id,
                    'entity_type' => $e->entity_type,
                    'entity_id'   => $e->entity_id,
                    'position'    => $e->position,
                    'tag'         => $e->tag,
                ])
            ),
            'features'        => $this->whenLoaded('features', fn () =>
                $this->features->map(fn ($f) => [
                    'id'             => $f->id,
                    'feature_name'   => $f->feature_name,
                    'category'       => $f->category,
                    'values'         => $f->values,
                    'is_highlighted' => $f->is_highlighted,
                    'sort_order'     => $f->sort_order,
                ])
            ),
            'faqs'            => FAQResource::collection($this->whenLoaded('faqs')),
            'seo'             => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
        ];
    }
}
