<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Solution extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'industry_id',
        'business_size_id',
        'name',
        'slug',
        'tagline',
        'problem_statement',
        'solution_summary',
        'workflow_description',
        'key_benefits',
        'technical_requirements',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'key_benefits' => 'array',
        ];
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function businessSize(): BelongsTo
    {
        return $this->belongsTo(BusinessSize::class);
    }

    public function tools(): BelongsToMany
    {
        return $this->belongsToMany(Tool::class, 'solution_tool_pivot')
            ->withPivot(['tool_role', 'sort_order', 'notes']);
    }
}
