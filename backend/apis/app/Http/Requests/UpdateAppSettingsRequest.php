<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->is_admin;
    }

    public function rules(): array
    {
        $tab = $this->route('tab');

        return match ($tab) {
            'general' => $this->generalRules(),
            'smtp' => $this->smtpRules(),
            'api-keys' => $this->apiKeysRules(),
            'email-templates' => $this->emailTemplatesRules(),
            'security' => $this->securityRules(),
            'ai-settings' => $this->aiSettingsRules(),
            'media-storage' => $this->mediaStorageRules(),
            'cache' => $this->cacheRules(),
            'backups' => $this->backupsRules(),
            'webhooks' => $this->webhooksRules(),
            'user-management' => $this->userManagementRules(),
            default => [],
        };
    }

    private function generalRules(): array
    {
        return [
            'site_name' => ['nullable', 'string', 'max:255'],
            'site_url' => ['nullable', 'url', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:100'],
            'default_language' => ['nullable', 'string', 'max:10'],
            'support_email' => ['nullable', 'email', 'max:255'],
            'maintenance_mode' => ['boolean'],
            'site_logo_url' => ['nullable', 'string', 'max:500'],
            'favicon_url' => ['nullable', 'string', 'max:500'],
            'social_share_image' => ['nullable', 'string', 'max:500'],
        ];
    }

    private function smtpRules(): array
    {
        return [
            'driver' => ['required', Rule::in(['smtp', 'sendmail', 'mailgun', 'ses', 'postmark', 'log'])],
            'host' => ['nullable', 'string', 'max:255'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:500'],
            'encryption' => ['nullable', Rule::in(['none', 'tls', 'ssl'])],
            'from_name' => ['required', 'string', 'max:255'],
            'from_email' => ['required', 'email', 'max:255'],
            'reply_to_email' => ['nullable', 'email', 'max:255'],
        ];
    }

    private function apiKeysRules(): array
    {
        return [
            'google_maps_key' => ['nullable', 'string', 'max:500'],
            'recaptcha_site_key' => ['nullable', 'string', 'max:500'],
            'recaptcha_secret_key' => ['nullable', 'string', 'max:500'],
            'stripe_public_key' => ['nullable', 'string', 'max:500'],
            'stripe_secret_key' => ['nullable', 'string', 'max:500'],
            'mailgun_api_key' => ['nullable', 'string', 'max:500'],
            'claude_api_key' => ['nullable', 'string', 'max:500'],
            'openai_api_key' => ['nullable', 'string', 'max:500'],
            'google_analytics_id' => ['nullable', 'string', 'max:100'],
            'plausible_domain' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function emailTemplatesRules(): array
    {
        return [
            'welcome_subject' => ['required', 'string', 'max:255'],
            'welcome_body' => ['required', 'string', 'max:10000'],
            'invoice_subject' => ['required', 'string', 'max:255'],
            'invoice_body' => ['required', 'string', 'max:10000'],
            'password_reset_subject' => ['required', 'string', 'max:255'],
            'password_reset_body' => ['required', 'string', 'max:10000'],
            'contact_form_subject' => ['nullable', 'string', 'max:255'],
            'contact_form_body' => ['nullable', 'string', 'max:10000'],
        ];
    }

    private function securityRules(): array
    {
        return [
            'session_timeout_minutes' => ['required', 'integer', 'min:5', 'max:10080'],
            'password_min_length' => ['required', 'integer', 'min:6', 'max:128'],
            'require_two_factor' => ['boolean'],
            'allow_ip_whitelist' => ['boolean'],
            'ip_whitelist' => ['array'],
            'ip_whitelist.*' => ['ip'],
            'max_login_attempts' => ['required', 'integer', 'min:1', 'max:20'],
            'lockout_duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'require_special_chars' => ['boolean'],
            'require_numbers' => ['boolean'],
            'require_uppercase' => ['boolean'],
        ];
    }

    private function aiSettingsRules(): array
    {
        return [
            'default_provider' => ['required', Rule::in(['anthropic', 'openai', 'google'])],
            'default_model' => ['required', 'string', 'max:100'],
            'temperature' => ['required', 'numeric', 'min:0', 'max:2'],
            'max_tokens' => ['required', 'integer', 'min:100', 'max:32000'],
            'streaming_enabled' => ['boolean'],
            'cache_ttl_hours' => ['required', 'integer', 'min:1', 'max:168'],
            'rate_limit_per_hour' => ['required', 'integer', 'min:1', 'max:100'],
            'auto_regenerate_on_edit' => ['boolean'],
        ];
    }

    private function mediaStorageRules(): array
    {
        return [
            'driver' => ['required', Rule::in(['local', 's3', 'cloudflare-r2'])],
            's3_bucket' => ['nullable', 'string', 'max:255'],
            's3_region' => ['nullable', 'string', 'max:100'],
            's3_key' => ['nullable', 'string', 'max:500'],
            's3_secret' => ['nullable', 'string', 'max:500'],
            's3_endpoint' => ['nullable', 'url', 'max:500'],
            'cloudflare_r2_account_id' => ['nullable', 'string', 'max:255'],
            'cloudflare_r2_access_key' => ['nullable', 'string', 'max:500'],
            'cloudflare_r2_secret_key' => ['nullable', 'string', 'max:500'],
            'cloudflare_r2_bucket' => ['nullable', 'string', 'max:255'],
            'max_upload_size_mb' => ['required', 'integer', 'min:1', 'max:100'],
            'allowed_mime_types' => ['array'],
            'allowed_mime_types.*' => ['string'],
            'image_compression_quality' => ['required', 'integer', 'min:10', 'max:100'],
            'auto_generate_thumbnails' => ['boolean'],
            'thumbnail_sizes' => ['array'],
            'thumbnail_sizes.*' => ['integer', 'min:16', 'max:2000'],
        ];
    }

    private function cacheRules(): array
    {
        return [
            'driver' => ['required', Rule::in(['file', 'redis', 'memcached', 'array'])],
            'content_ttl_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'pages_ttl_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'queries_ttl_minutes' => ['required', 'integer', 'min:1', 'max:60'],
            'api_ttl_minutes' => ['required', 'integer', 'min:1', 'max:60'],
            'enable_api_cache' => ['boolean'],
            'cache_sitemap' => ['boolean'],
            'cache_routes' => ['array'],
            'cache_routes.*' => ['string'],
        ];
    }

    private function backupsRules(): array
    {
        return [
            'auto_backup_enabled' => ['boolean'],
            'backup_schedule' => ['nullable', Rule::in(['hourly', 'daily', 'weekly', 'monthly'])],
            'retention_days' => ['required', 'integer', 'min:1', 'max:365'],
            'backup_time' => ['nullable', 'date_format:H:i'],
            'backup_destination' => ['nullable', Rule::in(['local', 's3', 'email'])],
            's3_backup_bucket' => ['nullable', 'string', 'max:255'],
            'include_database' => ['boolean'],
            'include_files' => ['boolean'],
            'include_settings' => ['boolean'],
        ];
    }

    private function webhooksRules(): array
    {
        return [
            'enabled' => ['boolean'],
            'urls' => ['array'],
            'urls.*' => ['url', 'max:500'],
            'secret' => ['nullable', 'string', 'max:500'],
            'retry_count' => ['required', 'integer', 'min:0', 'max:10'],
            'retry_delay_seconds' => ['required', 'integer', 'min:1', 'max:3600'],
            'events' => ['array'],
            'events.page_published' => ['boolean'],
            'events.page_updated' => ['boolean'],
            'events.form_submitted' => ['boolean'],
            'events.user_registered' => ['boolean'],
            'events.ai_generation_complete' => ['boolean'],
        ];
    }

    private function userManagementRules(): array
    {
        return [
            'allow_registration' => ['boolean'],
            'require_email_verification' => ['boolean'],
            'default_user_role' => ['required', Rule::in(['viewer', 'editor', 'admin'])],
            'password_expiry_days' => ['required', 'integer', 'min:0', 'max:365'],
            'session_remember_me_days' => ['required', 'integer', 'min:1', 'max:90'],
            'allow_social_login' => ['boolean'],
            'oauth_google_client_id' => ['nullable', 'string', 'max:500'],
            'oauth_google_client_secret' => ['nullable', 'string', 'max:500'],
            'oauth_github_client_id' => ['nullable', 'string', 'max:500'],
            'oauth_github_client_secret' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'site_name.required' => 'Site name is required.',
            'site_url.url' => 'Site URL must be a valid URL.',
            'support_email.email' => 'Support email must be a valid email address.',
            'from_email.email' => 'From email must be a valid email address.',
            'password_min_length.min' => 'Password minimum length must be at least 6 characters.',
            'temperature.min' => 'Temperature must be between 0 and 2.',
            'image_compression_quality.min' => 'Image quality must be between 10 and 100.',
        ];
    }
}
