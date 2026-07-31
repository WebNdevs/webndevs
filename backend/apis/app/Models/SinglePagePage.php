<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SinglePagePage extends Model
{
    use HasFactory;

    protected $table = 'singlepage_pages';

    protected $fillable = [
        'title',
        'slug',
        'category_slug',
        'status',
        'seo_title',
        'seo_description',
        'meta_keywords',
        'sections',
        'updated_by',
        'service_id',
    ];

    protected function casts(): array
    {
        return [
            'sections' => 'array',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function sectionItems(): HasMany
    {
        return $this->hasMany(SinglePageSection::class, 'singlepage_page_id')->orderBy('sort_order')->orderBy('id');
    }
}
