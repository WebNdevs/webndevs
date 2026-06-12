<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ProcessStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_type',
        'entity_id',
        'step_number',
        'title',
        'description',
        'icon',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'step_number' => 'integer',
        ];
    }

    public function entity(): MorphTo
    {
        return $this->morphTo('entity', 'entity_type', 'entity_id');
    }
}
