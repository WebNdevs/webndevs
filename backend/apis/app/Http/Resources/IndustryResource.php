<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndustryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'icon'             => $this->icon,
            'tagline'          => $this->tagline,
            'description'      => $this->description,
            'hero_image_url'   => $this->hero_image_url,
            'pain_points'      => $this->pain_points,
            'key_stats'        => $this->key_stats,
            'is_featured'      => $this->is_featured,
            'status'           => $this->status,
            'tools'            => ToolResource::collection($this->whenLoaded('tools')),
            'solutions'        => SolutionResource::collection($this->whenLoaded('solutions')),
            'use_cases'        => UseCaseResource::collection($this->whenLoaded('useCases')),
            'faqs'             => FAQResource::collection($this->whenLoaded('faqs')),
            'case_studies'     => CaseStudyResource::collection($this->whenLoaded('caseStudies')),
            'cross_references' => CrossReferencePageResource::collection($this->whenLoaded('crossReferences')),
            'seo'              => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
            'tools_count'      => $this->when(isset($this->tools_count), $this->tools_count),
            'solutions_count'  => $this->when(isset($this->solutions_count), $this->solutions_count),
        ];
    }
}
