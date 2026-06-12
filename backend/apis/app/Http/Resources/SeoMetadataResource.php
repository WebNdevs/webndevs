<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeoMetadataResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'meta_title'          => $this->meta_title,
            'meta_description'    => $this->meta_description,
            'og_title'            => $this->og_title,
            'og_description'      => $this->og_description,
            'og_image_url'        => $this->og_image_url,
            'twitter_card'        => $this->twitter_card,
            'canonical_url'       => $this->canonical_url,
            'schema_type'         => $this->schema_type,
            'schema_data'         => $this->schema_data,
            'robots_directive'    => $this->robots_directive,
            'focus_keyword'       => $this->focus_keyword,
            'secondary_keywords'  => $this->secondary_keywords,
            'seo_score'           => $this->seo_score,
        ];
    }
}
