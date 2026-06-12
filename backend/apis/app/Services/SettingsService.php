<?php

namespace App\Services;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SettingsService
{
    /** @var array|null */
    private static $cache = null;
    
    /** @var int|null */
    private static $cacheTime = null;

    public static function get(string $groupKey, ?string $key = null, $default = null)
    {
        $settings = self::getGroup($groupKey);
        
        if ($key === null) {
            return $settings;
        }
        
        return $settings[$key] ?? $default;
    }

    public static function getGroup(string $groupKey): array
    {
        if (self::$cache !== null && self::$cacheTime !== null && 
            (time() - self::$cacheTime) < 300) {
            return self::$cache[$groupKey] ?? [];
        }

        try {
            $setting = AppSetting::query()->where('group_key', $groupKey)->first();
            $value = $setting ? $setting->value : [];
            
            self::$cache = self::$cache ?? [];
            self::$cache[$groupKey] = $value;
            self::$cacheTime = time();
            
            return $value;
        } catch (\Exception $e) {
            return [];
        }
    }

    public static function isMaintenanceMode(): bool
    {
        return (bool) self::get('general', 'maintenance_mode', false);
    }

    public static function getSecurity(): array
    {
        return self::getGroup('security');
    }

    public static function getAiSettings(): array
    {
        return self::getGroup('ai-settings');
    }

    public static function getApiKeys(): array
    {
        return self::getGroup('api-keys');
    }

    public static function getSmtp(): array
    {
        return self::getGroup('smtp');
    }

    public static function getWebhooks(): array
    {
        return self::getGroup('webhooks');
    }

    public static function isWebhookEnabled(): bool
    {
        return (bool) self::get('webhooks', 'enabled', false);
    }

    public static function getWebhookUrls(): array
    {
        return self::get('webhooks', 'urls', []);
    }

    public static function dispatchWebhook(string $event, array $data): void
    {
        $enabled = self::isWebhookEnabled();
        Log::info('dispatchWebhook called', [
            'event' => $event,
            'enabled' => $enabled,
            'data' => $data,
        ]);

        if (!$enabled) {
            Log::info('Webhook skipped - not enabled');
            return;
        }

        $urls = self::getWebhookUrls();
        $secret = self::get('webhooks', 'secret', '');
        
        Log::info('Webhook dispatching', [
            'urls_count' => count($urls),
            'urls' => $urls,
        ]);
        
        foreach ($urls as $url) {
            try {
                $payload = [
                    'event' => $event,
                    'timestamp' => now()->toIso8601String(),
                    'data' => $data,
                ];

                $signature = '';
                if ($secret) {
                    $jsonPayload = json_encode($payload);
                    $signature = hash_hmac('sha256', $jsonPayload, $secret);
                }

                $response = Http::timeout(5)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'X-Webhook-Signature' => $signature,
                        'X-Webhook-Event' => $event,
                    ])
                    ->send('POST', $url, ['body' => json_encode($payload)]);
                    
                Log::info('Webhook sent', [
                    'url' => $url,
                    'status' => $response->status(),
                ]);
            } catch (\Exception $e) {
                Log::warning("Webhook failed for {$url}: " . $e->getMessage());
            }
        }
    }

    public static function getCacheDriver(): string
    {
        return self::get('cache', 'driver', 'file');
    }

    public static function clearCache(): void
    {
        self::$cache = null;
        self::$cacheTime = null;
    }
}