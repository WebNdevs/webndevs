<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrossRefSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'cross_reference_page_id',
        'section_key',
        'title',
        'content',
        'data',
        'sort_order',
        'is_visible',
        'ai_generated',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
            'ai_generated' => 'boolean',
        ];
    }
}
