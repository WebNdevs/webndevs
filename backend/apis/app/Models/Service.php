<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected $fillable = [
        'name',
        'slug',
        'category',
        'base_price',
        'duration_minutes',
        'status',
        'description',
        'availability_schedule',
        'pricing_table',
        'booking_enabled',
        'custom_attributes',
        'features',
        'projects_completed',
        'hero_image_url',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'base_price' => 'decimal:2',
            'duration_minutes' => 'integer',
            'availability_schedule' => 'array',
            'pricing_table' => 'array',
            'booking_enabled' => 'boolean',
            'custom_attributes' => 'array',
            'projects_completed' => 'integer',
            'meta_keywords' => 'array',
        ];
    }

    public function contentPages(): HasMany
    {
        return $this->hasMany(ContentPage::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(ServicePlan::class)->orderBy('display_order')->orderBy('id');
    }

    public function templateFields(): HasMany
    {
        return $this->hasMany(ServiceTemplateField::class)->orderBy('display_order')->orderBy('id');
    }

    public function templateValues(): HasMany
    {
        return $this->hasMany(ServiceTemplateValue::class);
    }

    public function packageRelations(): HasMany
    {
        return $this->hasMany(ServicePackageRelation::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ServiceCategory::class, 'service_category_service')
            ->withPivot(['is_primary'])
            ->withTimestamps();
    }

    public function pageContents(): HasMany
    {
        return $this->hasMany(ServicePageContent::class)->orderBy('display_order')->orderBy('id');
    }

    public function pageContentVersions(): HasMany
    {
        return $this->hasMany(ServicePageContentVersion::class)->orderByDesc('id');
    }

    public function packageOffers(): HasMany
    {
        return $this->hasMany(PackageOffer::class)->orderBy('display_order')->orderBy('id');
    }

    public function mediaAssets(): HasMany
    {
        return $this->hasMany(MediaAsset::class)->orderBy('display_order')->orderBy('id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class)->orderByDesc('id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
