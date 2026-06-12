<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStudyEntityPivot extends Model
{
    use HasFactory;

    protected $table = 'case_study_entity_pivot';

    public $timestamps = false;

    protected $fillable = [
        'case_study_id',
        'entity_type',
        'entity_id',
    ];
}
