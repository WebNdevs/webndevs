<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ToolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'slug'                  => $this->slug,
            'tagline'               => $this->tagline,
            'logo_url'              => $this->logo_url,
            'website_url'           => $this->website_url,
            'docs_url'              => $this->docs_url,
            'overview'              => $this->overview,
            'key_points'            => $this->key_points,
            'pricing_model'         => $this->pricing_model,
            'is_featured'           => $this->is_featured,
            'is_active'             => $this->is_active,
            'status'                => $this->status,
            'published_at'          => $this->published_at?->toIso8601String(),
            'category'              => new ToolCategoryResource($this->whenLoaded('category')),
            'features'              => FeatureResource::collection($this->whenLoaded('features')),
            'solutions'             => SolutionResource::collection($this->whenLoaded('solutions')),
            'use_cases'             => UseCaseResource::collection($this->whenLoaded('useCases')),
            'process_steps'         => ProcessStepResource::collection($this->whenLoaded('processSteps')),
            'faqs'                  => FAQResource::collection($this->whenLoaded('faqs')),
            'testimonials'          => TestimonialResource::collection($this->whenLoaded('testimonials')),
            
            'cross_references'      => CrossReferencePageResource::collection($this->whenLoaded('crossReferences')),
            'case_studies'          => CaseStudyResource::collection($this->whenLoaded('caseStudies')),
            'seo'                   => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
            'cross_reference_count' => $this->when(
                isset($this->cross_reference_count),
                $this->cross_reference_count
            ),
        ];
    }
}
