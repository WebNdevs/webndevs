<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'role',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'permissions' => 'array',
        ];
    }

    /**
     * Get available module permissions
     */
    public static function getAvailablePermissions(): array
    {
        return [
            'services.manage' => 'Services - Create, edit, delete',
            'blog.manage' => 'Blog Posts - Create, edit, delete',
            'case_studies.manage' => 'Case Studies - Create, edit, delete',
            'content.manage' => 'Content Pages - Create, edit, delete',
            'media.manage' => 'Media Library - Upload, delete',
            'settings.manage' => 'Settings - View and edit settings',
            'users.manage' => 'Users - Create, edit, delete users',
            'ai.use' => 'AI Generation - Use AI features',
            'tools.manage' => 'Tools - Create, edit, delete tools',
            'analytics.view' => 'Analytics - View analytics',
        ];
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        // Admins have all permissions
        if ($this->is_admin) {
            return true;
        }

        $permissions = $this->permissions ?? [];
        return in_array($permission, $permissions, true);
    }

    public function createdServices(): HasMany
    {
        return $this->hasMany(Service::class, 'created_by');
    }

    public function updatedContentPages(): HasMany
    {
        return $this->hasMany(ContentPage::class, 'updated_by');
    }

    public function createdBlogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'created_by');
    }

    public function updatedBlogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'updated_by');
    }

    public function updatedServicePlans(): HasMany
    {
        return $this->hasMany(ServicePlan::class, 'updated_by');
    }

    public function updatedContentSections(): HasMany
    {
        return $this->hasMany(ContentSection::class, 'updated_by');
    }

    public function updatedTemplateValues(): HasMany
    {
        return $this->hasMany(ServiceTemplateValue::class, 'updated_by');
    }

    public function updatedPageContents(): HasMany
    {
        return $this->hasMany(ServicePageContent::class, 'updated_by');
    }

    public function uploadedMediaAssets(): HasMany
    {
        return $this->hasMany(MediaAsset::class, 'uploaded_by');
    }

    public function createdPackageOffers(): HasMany
    {
        return $this->hasMany(PackageOffer::class, 'created_by');
    }

    public function updatedPackageOffers(): HasMany
    {
        return $this->hasMany(PackageOffer::class, 'updated_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
