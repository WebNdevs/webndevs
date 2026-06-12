<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStudyMetric extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'case_study_id',
        'label',
        'before_value',
        'after_value',
        'unit',
        'improvement',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
