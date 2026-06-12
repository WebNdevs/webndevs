<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComparisonFeature extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'comparison_page_id',
        'feature_name',
        'category',
        'values',
        'is_highlighted',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'values' => 'array',
            'is_highlighted' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
