<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_section_id',
        'item_key',
        'title',
        'content',
        'category',
        'url',
        'description',
        'results',
        'tags',
        'badge',
        'avatar',
        'client_name',
        'client_role',
        'company',
        'rating',
        'duration',
        'sort_order',
        'is_featured',
        'is_active',
        'custom_fields',
        'external_id',
        'updated_by',
        
        // Project (Pro) fields
        'pro_name',
        'pro_category',
        'pro_url',
        'pro_description',
        'pro_results',
        'pro_tag',
        'pro_badge',
        
        // Testimonial (Test) fields
        'test_name',
        'test_company',
        'test_role',
        'test_description',
        'test_url',
        'test_rate',
        
        // Data Tile fields
        'tile_name',
        'tile_url',
        'tile_description',
        
        // Service Card (Ser) fields
        'ser_name',
        'ser_url',
        'ser_description',
        'ser_icon',
        'ser_tag',
        
        // Choose Card (cc) fields
        'cc_name',
        'cc_description',
        'cc_icon',
        
        // Process Card (pc) fields
        'pc_name',
        'pc_number',
        'pc_description',
        'pc_icon',
        'pc_timeline',
        
        // Q&A fields (question/answer pattern)
        'question',
        'answer',
    ];

    protected function casts(): array
    {
        return [
            'results' => 'array',
            'tags' => 'array',
            'custom_fields' => 'array',
            'sort_order' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'pro_results' => 'array',
            'pro_tag' => 'array',
            'test_rate' => 'integer',
        ];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(ContentSection::class, 'content_section_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
