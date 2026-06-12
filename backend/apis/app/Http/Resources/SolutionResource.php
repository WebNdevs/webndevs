<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'name'                    => $this->name,
            'slug'                    => $this->slug,
            'tagline'                 => $this->tagline,
            'problem_statement'       => $this->problem_statement,
            'solution_summary'        => $this->solution_summary,
            'workflow_description'    => $this->workflow_description,
            'key_benefits'            => $this->key_benefits,
            'technical_requirements'  => $this->technical_requirements,
            'status'                  => $this->status,
            'industry'                => new IndustryResource($this->whenLoaded('industry')),
            'tools'                   => ToolResource::collection($this->whenLoaded('tools')),
            'process_steps'           => ProcessStepResource::collection($this->whenLoaded('processSteps')),
            'use_cases'               => UseCaseResource::collection($this->whenLoaded('useCases')),
            'faqs'                    => FAQResource::collection($this->whenLoaded('faqs')),
            'case_studies'            => CaseStudyResource::collection($this->whenLoaded('caseStudies')),
            'seo'                     => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
        ];
    }
}
