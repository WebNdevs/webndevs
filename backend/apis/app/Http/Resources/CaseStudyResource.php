<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseStudyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'slug'                => $this->slug,
            'client_name'         => $this->client_name,
            'client_industry'     => $this->client_industry,
            'client_logo_url'     => $this->client_logo_url,
            'challenge'           => $this->challenge,
            'solution'            => $this->solution,
            'results_summary'     => $this->results_summary,
            'timeline'            => $this->timeline,
            'featured_image_url'  => $this->featured_image_url,
            'is_featured'         => $this->is_featured,
            'status'              => $this->status,
            'published_at'        => $this->published_at?->toIso8601String(),
            'metrics'             => $this->whenLoaded('metrics', fn () =>
                $this->metrics->map(fn ($m) => [
                    'label'       => $m->label,
                    'before_value'=> $m->before_value,
                    'after_value' => $m->after_value,
                    'unit'        => $m->unit,
                    'improvement' => $m->improvement,
                    'sort_order'  => $m->sort_order,
                ])
            ),
            'testimonial'         => new TestimonialResource($this->whenLoaded('testimonial')),
            'seo'                 => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
        ];
    }
}
