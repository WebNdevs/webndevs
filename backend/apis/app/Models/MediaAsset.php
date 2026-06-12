<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'media_folder_id',
        'service_id',
        'service_category_id',
        'title',
        'alt_text',
        'caption',
        'file_name',
        'disk',
        'path',
        'url',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'tags',
        'optimization_meta',
        'is_optimized',
        'display_order',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'optimization_meta' => 'array',
            'is_optimized' => 'boolean',
            'size_bytes' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'display_order' => 'integer',
        ];
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'media_folder_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
