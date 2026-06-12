<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_key',
        'value',
        'updated_by',
        'is_public',
        'category',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
            'is_public' => 'boolean',
        ];
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeByGroup(Builder $query, string $groupKey): Builder
    {
        return $query->where('group_key', $groupKey);
    }

    // Helper to get a single setting value
    public static function getValue(string $groupKey, string $key, $default = null)
    {
        $setting = self::where('group_key', $groupKey)->first();
        
        if (!$setting || !isset($setting->value[$key])) {
            return $default;
        }

        return $setting->value[$key];
    }

    // Helper to set a single setting value
    public static function setValue(string $groupKey, string $key, mixed $value, ?int $userId = null): void
    {
        $setting = self::where('group_key', $groupKey)->first();
        
        if ($setting) {
            $currentValue = $setting->value;
            $currentValue[$key] = $value;
            $setting->value = $currentValue;
            $setting->updated_by = $userId;
            $setting->save();
        } else {
            self::create([
                'group_key' => $groupKey,
                'value' => [$key => $value],
                'updated_by' => $userId,
            ]);
        }
    }
}
