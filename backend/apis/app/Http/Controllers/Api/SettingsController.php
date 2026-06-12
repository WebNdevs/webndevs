<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAppSettingsRequest;
use App\Models\AppSetting;
use App\Models\SettingsAuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    private const TAB_KEYS = [
        'general',
        'smtp',
        'api-keys',
        'email-templates',
        'security',
        'ai-settings',
        'media-storage',
        'cache',
        'backups',
        'webhooks',
        'user-management',
        'site-ctas',
        'analytics',
    ];

    private const SENSITIVE_TABS = [
        'smtp' => ['password'],
        'api-keys' => ['stripe_secret_key', 'mailgun_api_key', 'claude_api_key', 'openai_api_key', 'recaptcha_secret_key'],
    ];

    private const DEFAULTS = [
        'general' => [
            'site_name' => 'WebNDevs CMS',
            'site_url' => 'http://localhost:5175',
            'timezone' => 'Asia/Kolkata',
            'default_language' => 'en',
            'support_email' => 'support@webndevs.local',
            'maintenance_mode' => false,
            'site_logo_url' => '',
            'favicon_url' => '',
            'social_share_image' => '',
        ],
        'smtp' => [
            'driver' => 'smtp',
            'host' => '',
            'port' => 587,
            'username' => '',
            'password' => '',
            'encryption' => 'tls',
            'from_name' => 'WebNDevs CMS',
            'from_email' => 'noreply@webndevs.local',
            'reply_to_email' => '',
        ],
        'api-keys' => [
            'google_maps_key' => '',
            'recaptcha_site_key' => '',
            'recaptcha_secret_key' => '',
            'stripe_public_key' => '',
            'stripe_secret_key' => '',
            'mailgun_api_key' => '',
            'claude_api_key' => '',
            'openai_api_key' => '',
            'google_analytics_id' => '',
            'plausible_domain' => '',
        ],
        'email-templates' => [
            'welcome_subject' => 'Welcome to WebNDevs',
            'welcome_body' => "Hi {{name}},\n\nWelcome aboard! We're excited to have you.\n\nBest,\nThe Team",
            'invoice_subject' => 'Invoice {{invoice_number}} from WebNDevs',
            'invoice_body' => "Hi {{name}},\n\nYour invoice total is {{amount}}.\n\nPlease find the details below.",
            'password_reset_subject' => 'Reset your password',
            'password_reset_body' => "Hi {{name}},\n\nClick the link below to reset your password:\n\n{{reset_link}}\n\nThis link expires in 24 hours.",
            'contact_form_subject' => 'New Contact Form Submission',
            'contact_form_body' => "New submission from {{name}} ({{email}}):\n\n{{message}}",
        ],
        'security' => [
            'session_timeout_minutes' => 60,
            'password_min_length' => 8,
            'require_two_factor' => false,
            'allow_ip_whitelist' => false,
            'ip_whitelist' => [],
            'max_login_attempts' => 5,
            'lockout_duration_minutes' => 15,
            'require_special_chars' => true,
            'require_numbers' => true,
            'require_uppercase' => true,
        ],
        'ai-settings' => [
            'default_provider' => 'anthropic',
            'default_model' => 'claude-sonnet-4-7-20250714',
            'temperature' => 0.7,
            'max_tokens' => 4096,
            'streaming_enabled' => true,
            'cache_ttl_hours' => 24,
            'rate_limit_per_hour' => 10,
            'auto_regenerate_on_edit' => false,
        ],
        'media-storage' => [
            'driver' => 'local',
            's3_bucket' => '',
            's3_region' => 'us-east-1',
            's3_key' => '',
            's3_secret' => '',
            's3_endpoint' => '',
            'cloudflare_r2_account_id' => '',
            'cloudflare_r2_access_key' => '',
            'cloudflare_r2_secret_key' => '',
            'cloudflare_r2_bucket' => '',
            'max_upload_size_mb' => 10,
            'allowed_mime_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
            'image_compression_quality' => 85,
            'auto_generate_thumbnails' => true,
            'thumbnail_sizes' => [150, 300, 600],
        ],
        'cache' => [
            'driver' => 'file',
            'content_ttl_minutes' => 15,
            'pages_ttl_minutes' => 60,
            'queries_ttl_minutes' => 5,
            'api_ttl_minutes' => 15,
            'enable_api_cache' => true,
            'cache_sitemap' => true,
            'cache_routes' => ['home', 'tools', 'industries'],
        ],
        'backups' => [
            'auto_backup_enabled' => false,
            'backup_schedule' => 'daily',
            'retention_days' => 30,
            'backup_time' => '02:00',
            'backup_destination' => 'local',
            's3_backup_bucket' => '',
            'include_database' => true,
            'include_files' => true,
            'include_settings' => true,
            'last_backup_at' => null,
            'last_backup_status' => null,
        ],
        'webhooks' => [
            'enabled' => false,
            'urls' => [],
            'secret' => '',
            'retry_count' => 3,
            'retry_delay_seconds' => 60,
            'events' => [
                'page_published' => true,
                'page_updated' => true,
                'form_submitted' => true,
                'user_registered' => false,
                'ai_generation_complete' => true,
            ],
        ],
        'user-management' => [
            'allow_registration' => true,
            'require_email_verification' => true,
            'default_user_role' => 'editor',
            'password_expiry_days' => 0,
            'session_remember_me_days' => 14,
            'allow_social_login' => false,
            'oauth_google_client_id' => '',
            'oauth_google_client_secret' => '',
            'oauth_github_client_id' => '',
            'oauth_github_client_secret' => '',
        ],
        'site-ctas' => [
            ['pageType' => 'Tool Page', 'text' => 'Get a Free Integration Audit', 'url' => '/contact'],
            ['pageType' => 'Industry Page', 'text' => 'See Our Industry Solutions', 'url' => '/solutions'],
            ['pageType' => 'Cross-Reference Page', 'text' => 'Book a Free Consultation', 'url' => '/contact'],
            ['pageType' => 'Comparison Page', 'text' => 'Talk to an Expert', 'url' => '/contact'],
            ['pageType' => 'Case Study Page', 'text' => 'Get Similar Results', 'url' => '/contact'],
            ['pageType' => 'Solution Page', 'text' => 'Implement This Solution', 'url' => '/contact'],
        ],
        'analytics' => [
            'googleAnalyticsId' => '',
            'plausibleDomain' => '',
            'plausibleApiKey' => '',
            'hotjarId' => '',
            'facebookPixelId' => '',
            'googleTagManagerId' => '',
        ],
    ];

    public function index(): JsonResponse
    {
        $settings = [];
        foreach (self::TAB_KEYS as $tab) {
            $settings[$tab] = $this->resolveTabValues($tab);
        }

        return $this->success([
            'settings' => $settings,
            'audit_logs' => $this->getRecentAuditLogs(10),
        ], 'Settings fetched.');
    }

    public function show(string $tab): JsonResponse
    {
        if (!in_array($tab, self::TAB_KEYS, true)) {
            return $this->error('Invalid settings tab.', ['tab' => ['Unsupported settings tab.']], 422);
        }

        return $this->success([
            'tab' => $tab,
            'values' => $this->resolveTabValues($tab),
            'defaults' => self::DEFAULTS[$tab] ?? [],
        ], 'Tab settings fetched.');
    }

    public function publicGeneral(): JsonResponse
    {
        $values = $this->resolveTabValues('general');

        return $this->success([
            'values' => [
                'maintenance_mode' => (bool) ($values['maintenance_mode'] ?? false),
            ],
        ], 'General settings fetched.');
    }

    public function update(UpdateAppSettingsRequest $request, string $tab): JsonResponse
    {
        if (!in_array($tab, self::TAB_KEYS, true)) {
            return $this->error('Invalid settings tab.', ['tab' => ['Unsupported settings tab.']], 422);
        }

        try {
            $validated = $request->validated();
            $oldValues = $this->resolveTabValues($tab);

            AppSetting::query()->updateOrCreate(
                ['group_key' => $tab],
                [
                    'value' => $validated,
                    'updated_by' => $request->user()?->id,
                ]
            );

            // Log the change
            $this->logChange($tab, $oldValues, $validated, $request->user()?->id);

            // Clear relevant caches
            $this->clearSettingCache($tab);

            return $this->success($this->resolveTabValues($tab), 'Settings updated.');
        } catch (\Exception $e) {
            Log::error("Settings update failed for tab {$tab}: " . $e->getMessage());
            return $this->error('Failed to update settings: ' . $e->getMessage(), [], 500);
        }
    }

    public function test(Request $request, string $tab): JsonResponse
    {
        if (!in_array($tab, self::TAB_KEYS, true)) {
            return $this->error('Invalid settings tab.', ['tab' => ['Unsupported settings tab.']], 422);
        }

        $testEmail = $request->input('email');

        switch ($tab) {
            case 'smtp':
                return $this->testSmtp($testEmail);
            case 'ai-settings':
                return $this->testAiConnection();
            case 'webhooks':
                return $this->testWebhook();
            default:
                return $this->error('Test not available for this tab.', [], 422);
        }
    }

    public function reset(Request $request, string $tab): JsonResponse
    {
        if (!in_array($tab, self::TAB_KEYS, true)) {
            return $this->error('Invalid settings tab.', ['tab' => ['Unsupported settings tab.']], 422);
        }

        $oldValues = $this->resolveTabValues($tab);

        AppSetting::query()->where('group_key', $tab)->delete();

        $this->logChange($tab, $oldValues, self::DEFAULTS[$tab] ?? [], $request->user()?->id, 'reset');
        $this->clearSettingCache($tab);

        return $this->success($this->resolveTabValues($tab), 'Settings reset to defaults.');
    }

    public function export(): JsonResponse
    {
        $settings = [];
        foreach (self::TAB_KEYS as $tab) {
            $values = $this->resolveTabValues($tab);
            // Mask sensitive values
            $values = $this->maskSensitiveValues($tab, $values);
            $settings[$tab] = $values;
        }

        return $this->success([
            'version' => '1.0',
            'exported_at' => now()->toIso8601String(),
            'settings' => $settings,
        ], 'Settings exported.');
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
            'settings_version' => 'nullable|string',
        ]);

        $importData = $request->input('settings');
        $userId = $request->user()?->id;

        foreach (self::TAB_KEYS as $tab) {
            if (isset($importData[$tab])) {
                $oldValues = $this->resolveTabValues($tab);
                $newValues = $importData[$tab];

                AppSetting::query()->updateOrCreate(
                    ['group_key' => $tab],
                    [
                        'value' => $newValues,
                        'updated_by' => $userId,
                    ]
                );

                $this->logChange($tab, $oldValues, $newValues, $userId, 'import');
                $this->clearSettingCache($tab);
            }
        }

        return $this->success(null, 'Settings imported successfully.');
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $logs = SettingsAuditLog::with('editor')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->success($logs, 'Audit logs fetched.');
    }

    public function clearCache(Request $request): JsonResponse
    {
        $cacheType = $request->input('type', 'all');

        try {
            switch ($cacheType) {
                case 'all':
                    Cache::flush();
                    break;
                case 'settings':
                    Cache::forget('app_settings');
                    foreach (self::TAB_KEYS as $tab) {
                        Cache::forget("settings_tab_{$tab}");
                    }
                    break;
                case 'content':
                    Cache::forget('content_pages');
                    Cache::forget('content_items');
                    break;
                case 'api':
                    Cache::forget('api_cache');
                    break;
                default:
                    return $this->error('Invalid cache type.', ['type' => ['Invalid cache type.']], 422);
            }

            return $this->success(['cleared' => $cacheType], 'Cache cleared successfully.');
        } catch (\Exception $e) {
            Log::error('Cache clear failed: ' . $e->getMessage());
            return $this->error('Failed to clear cache.', [], 500);
        }
    }

    public function createBackup(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;

        try {
            $backupData = [
                'timestamp' => now()->toIso8601String(),
                'generated_by' => $userId,
                'settings' => [],
            ];

            foreach (self::TAB_KEYS as $tab) {
                $backupData['settings'][$tab] = $this->resolveTabValues($tab);
            }

            $filename = 'backup_' . now()->format('Y-m-d_His') . '.json';
            Storage::disk('local')->put('backups/' . $filename, json_encode($backupData, JSON_PRETTY_PRINT));

            // Update last backup info
            $backupSettings = $this->resolveTabValues('backups');
            $backupSettings['last_backup_at'] = now()->toIso8601String();
            $backupSettings['last_backup_status'] = 'success';

            AppSetting::query()->updateOrCreate(
                ['group_key' => 'backups'],
                ['value' => $backupSettings, 'updated_by' => $userId]
            );

            $this->logChange('backups', [], ['action' => 'manual_backup'], $userId, 'backup');

            return $this->success([
                'filename' => $filename,
                'path' => 'backups/' . $filename,
                'size' => strlen(json_encode($backupData)),
            ], 'Backup created successfully.');
        } catch (\Exception $e) {
            Log::error('Backup failed: ' . $e->getMessage());
            return $this->error('Failed to create backup: ' . $e->getMessage(), [], 500);
        }
    }

    private function resolveTabValues(string $tab): array
    {
        try {
            $setting = AppSetting::query()->where('group_key', $tab)->first();
            $stored = $setting ? $setting->value : null;
        } catch (\Exception $e) {
            Log::warning("Failed to load settings for tab {$tab}: " . $e->getMessage());
            $stored = null;
        }

        $base = self::DEFAULTS[$tab] ?? [];

        return array_merge($base, ($stored ?? []));
    }

    private function maskSensitiveValues(string $tab, array $values): array
    {
        $sensitiveKeys = self::SENSITIVE_TABS[$tab] ?? [];

        foreach ($sensitiveKeys as $key) {
            if (isset($values[$key]) && !empty($values[$key])) {
                $values[$key] = '********';
            }
        }

        return $values;
    }

    private function logChange(string $tab, array $oldValues, array $newValues, ?int $userId, string $action = 'update'): void
    {
        SettingsAuditLog::create([
            'tab_key' => $tab,
            'old_values' => $this->maskSensitiveValues($tab, $oldValues),
            'new_values' => $this->maskSensitiveValues($tab, $newValues),
            'action' => $action,
            'user_id' => $userId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    private function clearSettingCache(string $tab): void
    {
        Cache::forget("settings_tab_{$tab}");
        Cache::forget('app_settings');
    }

    private function getRecentAuditLogs(int $limit): array
    {
        return SettingsAuditLog::with('editor')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'tab_key' => $log->tab_key,
                    'action' => $log->action,
                    'editor_name' => $log->editor?->name ?? 'System',
                    'created_at' => $log->created_at->toIso8601String(),
                ];
            })
            ->toArray();
    }

    private function testSmtp(?string $testEmail): JsonResponse
    {
        if (!$testEmail) {
            return $this->error('Test email address is required.', ['email' => ['Required for SMTP test.']], 422);
        }

        try {
            $smtp = $this->resolveTabValues('smtp');

            if (empty($smtp['host']) || empty($smtp['from_email'])) {
                return $this->error('SMTP settings are not configured.', [], 400);
            }

            // In a real implementation, you'd attempt to send a test email here
            // For now, we'll simulate success
            Log::info("SMTP test email would be sent to {$testEmail} with settings: {$smtp['host']}:{$smtp['port']}");

            return $this->success([
                'test_email' => $testEmail,
                'status' => 'ready',
                'message' => 'SMTP settings appear valid. A test email would be sent.',
            ], 'SMTP connection test ready.');
        } catch (\Exception $e) {
            return $this->error('SMTP test failed: ' . $e->getMessage(), [], 500);
        }
    }

    private function testAiConnection(): JsonResponse
    {
        try {
            $aiSettings = $this->resolveTabValues('ai-settings');
            $apiKeys = $this->resolveTabValues('api-keys');

            $hasKey = !empty($apiKeys['claude_api_key']) || !empty($apiKeys['openai_api_key']);

            if (!$hasKey) {
                return $this->error('No AI API key configured.', [], 400);
            }

            return $this->success([
                'provider' => $aiSettings['default_provider'],
                'model' => $aiSettings['default_model'],
                'status' => 'configured',
            ], 'AI settings are configured.');
        } catch (\Exception $e) {
            return $this->error('AI connection test failed: ' . $e->getMessage(), [], 500);
        }
    }

    private function testWebhook(): JsonResponse
    {
        try {
            $webhookSettings = $this->resolveTabValues('webhooks');

            if (empty($webhookSettings['urls'])) {
                return $this->error('No webhook URLs configured.', [], 400);
            }

            return $this->success([
                'urls_count' => count($webhookSettings['urls']),
                'enabled' => $webhookSettings['enabled'],
                'events_count' => count(array_filter($webhookSettings['events'])),
            ], 'Webhook settings are configured.');
        } catch (\Exception $e) {
            return $this->error('Webhook test failed: ' . $e->getMessage(), [], 500);
        }
    }
}
