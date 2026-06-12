<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Model attribute casting already converts JSON strings to arrays
        // Just pass through the values
        $proResults = $this->pro_results ?? [];
        $proTag = $this->pro_tag ?? [];

        return [
            'id' => $this->id,
            'item_key' => $this->item_key,
            'title' => $this->title,
            'content' => $this->content,
            'category' => $this->category,
            'url' => $this->url,
            'description' => $this->description,
            'results' => $this->results,
            'tags' => $this->tags,
            'badge' => $this->badge,
            'avatar' => $this->avatar,
            'client_name' => $this->client_name,
            'client_role' => $this->client_role,
            'company' => $this->company,
            'rating' => $this->rating,
            'duration' => $this->duration,
            'sort_order' => $this->sort_order,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'custom_fields' => $this->custom_fields,
            'external_id' => $this->external_id,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            
            // Q&A fields
            'question' => $this->question,
            'answer' => $this->answer,
            
            // Project (Pro) fields - convert arrays to strings
            'pro_name' => $this->pro_name,
            'pro_category' => $this->pro_category,
            'pro_url' => $this->pro_url,
            'pro_description' => $this->pro_description,
            'pro_results' => $proResults,
            'pro_tag' => $proTag,
            'pro_badge' => $this->pro_badge,
            
            // Testimonial (Test) fields
            'test_name' => $this->test_name,
            'test_company' => $this->test_company,
            'test_role' => $this->test_role,
            'test_description' => $this->test_description,
            'test_url' => $this->test_url,
            'test_rate' => $this->test_rate,
            
            // Data Tile fields
            'tile_name' => $this->tile_name,
            'tile_url' => $this->tile_url,
            'tile_description' => $this->tile_description,
            
            // Service Card (Ser) fields
            'ser_name' => $this->ser_name,
            'ser_url' => $this->ser_url,
            'ser_description' => $this->ser_description,
            'ser_icon' => $this->ser_icon,
            'ser_tag' => $this->ser_tag,
            
            // Choose Card (cc) fields
            'cc_name' => $this->cc_name,
            'cc_description' => $this->cc_description,
            'cc_icon' => $this->cc_icon,
            
            // Process Card (pc) fields
            'pc_name' => $this->pc_name,
            'pc_number' => $this->pc_number,
            'pc_description' => $this->pc_description,
            'pc_icon' => $this->pc_icon,
            'pc_timeline' => $this->pc_timeline,
        ];
    }
}
