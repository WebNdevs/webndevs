<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentGenerationJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_type',
        'entity_id',
        'section_key',
        'prompt_template',
        'prompt_used',
        'generated_content',
        'tokens_input',
        'tokens_output',
        'model_used',
        'status',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'tokens_input' => 'integer',
            'tokens_output' => 'integer',
        ];
    }
}
