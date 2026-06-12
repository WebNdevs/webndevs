<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CrossReferencePageResource extends JsonResource
{
    /** Maps full model class names to the standardized entity_type strings used in the API. */
    private static array $typeMap = [
        'App\Models\Tool'              => 'tool',
        'App\Models\Industry'          => 'industry',
        'App\Models\Service'           => 'service',
        'App\Models\Solution'          => 'solution',
        'App\Models\CrossReferencePage'=> 'cross_reference',
        'App\Models\ComparisonPage'    => 'comparison',
        'App\Models\CaseStudy'         => 'case_study',
        'App\Models\BlogPost'          => 'blog_post',
    ];

    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'subtitle'         => $this->subtitle,
            'slug'             => $this->slug,
            'url_path'         => $this->url_path,
            'quick_answer'     => $this->quick_answer,
            'status'           => $this->status,
            'published_at'     => $this->published_at?->toIso8601String(),
            'entity_a'         => $this->resolveEntity(
                $this->entity_a_type,
                $this->entity_a_id,
                $this->whenLoaded('entityA')
            ),
            'entity_b'         => $this->resolveEntity(
                $this->entity_b_type,
                $this->entity_b_id,
                $this->whenLoaded('entityB')
            ),
            'entity_c'         => $this->entity_c_type ? $this->resolveEntity(
                $this->entity_c_type,
                $this->entity_c_id,
                $this->whenLoaded('entityC')
            ) : null,
            'sections'         => CrossRefSectionResource::collection($this->whenLoaded('sections')),
            'meta_title'       => $this->meta_title,
            'meta_description' => $this->meta_description,
            'og_image_url'     => $this->og_image_url,
            'seo'              => new SeoMetadataResource($this->whenLoaded('seoMetadata')),
        ];
    }

    private function resolveEntity(string $fqcn, int $id, mixed $loaded): array
    {
        $type = self::$typeMap[$fqcn] ?? $fqcn;

        // If the controller eager-loaded the entity, use it
        if ($loaded instanceof \Illuminate\Http\Resources\MissingValue === false && $loaded !== null) {
            $model = $loaded;
            return [
                'type'     => $type,
                'id'       => $id,
                'name'     => $model->name ?? '',
                'slug'     => $model->slug ?? '',
                'logo_url' => $model->logo_url ?? null,
                'tagline'  => $model->tagline ?? null,
            ];
        }

        // Fallback: minimal stub with just the normalized type + id
        return ['type' => $type, 'id' => $id];
    }
}
