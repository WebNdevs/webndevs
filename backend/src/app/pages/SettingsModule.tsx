import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Badge, Button, InputField, SelectField, TextareaField } from "@figma/astraui";
import { 
  Eye, EyeOff, Send, Check, RefreshCw, Database, BarChart2, Megaphone, Plus, X, Sparkles,
  Settings as SettingsIcon, HardDrive, Clock, Link2, Users, Shield, Download, Upload, Search,
  Trash2, AlertTriangle, ChevronRight, History, Zap, Image, Wifi, Edit2, UserPlus, Trash, Key as KeyIcon
} from "lucide-react";
import { getStoredToken } from "../auth";
import { API_BASE_URL } from "../../config/api.config";
import { setStoredAiKey, type AiProvider } from "../utils/ai-settings";
import { TokenStatus } from "../components/TokenStatus";
import { useUsers, type User, type PaginatedUsers } from "../hooks/useUsers";
import { LoadingGame } from "../components/LoadingGame";

type TabKey = "general" | "smtp" | "api-keys" | "email-templates" | "security" | 
              "site-ctas" | "analytics" | "seeder" | "ai-settings" | "media-storage" | 
              "cache" | "backups" | "webhooks" | "user-management" | "audit-logs";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type SettingsPayload = {
  general: {
    site_name: string;
    site_url: string;
    timezone: string;
    default_language: string;
    support_email: string;
    maintenance_mode: boolean;
    site_logo_url?: string;
    favicon_url?: string;
    social_share_image?: string;
  };
  smtp: {
    driver: string;
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    from_name: string;
    from_email: string;
    reply_to_email: string;
  };
  "api-keys": {
    google_maps_key: string;
    recaptcha_site_key: string;
    recaptcha_secret_key: string;
    stripe_public_key: string;
    stripe_secret_key: string;
    mailgun_api_key: string;
    claude_api_key: string;
    openai_api_key: string;
    google_analytics_id: string;
    plausible_domain: string;
  };
  "email-templates": {
    welcome_subject: string;
    welcome_body: string;
    invoice_subject: string;
    invoice_body: string;
    password_reset_subject: string;
    password_reset_body: string;
    contact_form_subject?: string;
    contact_form_body?: string;
  };
  security: {
    session_timeout_minutes: number;
    password_min_length: number;
    require_two_factor: boolean;
    allow_ip_whitelist: boolean;
    ip_whitelist: string[];
    max_login_attempts: number;
    lockout_duration_minutes?: number;
    require_special_chars?: boolean;
    require_numbers?: boolean;
    require_uppercase?: boolean;
  };
  "ai-settings": {
    default_provider: string;
    default_model: string;
    temperature: number;
    max_tokens: number;
    streaming_enabled: boolean;
    cache_ttl_hours: number;
    rate_limit_per_hour: number;
    auto_regenerate_on_edit: boolean;
  };
  "media-storage": {
    driver: string;
    s3_bucket: string;
    s3_region: string;
    s3_key: string;
    s3_secret: string;
    s3_endpoint: string;
    cloudflare_r2_account_id: string;
    cloudflare_r2_access_key: string;
    cloudflare_r2_secret_key: string;
    cloudflare_r2_bucket: string;
    max_upload_size_mb: number;
    allowed_mime_types: string[];
    image_compression_quality: number;
    auto_generate_thumbnails: boolean;
    thumbnail_sizes: number[];
  };
  cache: {
    driver: string;
    content_ttl_minutes: number;
    pages_ttl_minutes: number;
    queries_ttl_minutes: number;
    api_ttl_minutes: number;
    enable_api_cache: boolean;
    cache_sitemap: boolean;
    cache_routes: string[];
  };
  backups: {
    auto_backup_enabled: boolean;
    backup_schedule: string;
    retention_days: number;
    backup_time: string;
    backup_destination: string;
    s3_backup_bucket: string;
    include_database: boolean;
    include_files: boolean;
    include_settings: boolean;
    last_backup_at?: string | null;
    last_backup_status?: string | null;
  };
  webhooks: {
    enabled: boolean;
    urls: string[];
    secret: string;
    retry_count: number;
    retry_delay_seconds: number;
    events: {
      page_published: boolean;
      page_updated: boolean;
      form_submitted: boolean;
      user_registered: boolean;
      ai_generation_complete: boolean;
    };
  };
  "user-management": {
    allow_registration: boolean;
    require_email_verification: boolean;
    default_user_role: string;
    password_expiry_days: number;
    session_remember_me_days: number;
    allow_social_login: boolean;
    oauth_google_client_id: string;
    oauth_google_client_secret: string;
    oauth_github_client_id: string;
    oauth_github_client_secret: string;
  };
  "site-ctas": Array<{
    pageType: string;
    text: string;
    url: string;
  }>;
  analytics: {
    googleAnalyticsId: string;
    plausibleDomain: string;
    plausibleApiKey: string;
    hotjarId: string;
    facebookPixelId: string;
    googleTagManagerId: string;
  };
};

type AuditLogEntry = {
  id: number;
  tab_key: string;
  action: string;
  editor_name: string;
  created_at: string;
};

const tabItems: Array<{ key: TabKey; label: string; icon?: React.ReactNode }> = [
  { key: "general", label: "General", icon: <SettingsIcon size={14} /> },
  { key: "ai-settings", label: "AI Settings", icon: <Sparkles size={14} /> },
  { key: "smtp", label: "SMTP", icon: <Mail size={14} /> },
  { key: "api-keys", label: "API Keys", icon: <Key size={14} /> },
  { key: "email-templates", label: "Email", icon: <Mail size={14} /> },
  { key: "security", label: "Security", icon: <Shield size={14} /> },
  { key: "media-storage", label: "Media", icon: <Image size={14} /> },
  { key: "cache", label: "Cache", icon: <HardDrive size={14} /> },
  { key: "backups", label: "Backups", icon: <Database size={14} /> },
  { key: "webhooks", label: "Webhooks", icon: <Link2 size={14} /> },
  { key: "user-management", label: "Users", icon: <Users size={14} /> },
  { key: "site-ctas", label: "CTAs", icon: <Megaphone size={14} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart2 size={14} /> },
  { key: "seeder", label: "Seeder", icon: <Database size={14} /> },
  { key: "audit-logs", label: "Audit Logs", icon: <History size={14} /> },
];

// Helper components
function Mail({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Key({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5-3 3L17 15" />
    </svg>
  );
}

function boolFromValue(value: string): boolean {
  return value === "true";
}

function MaskedKeyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-xs">
      <label className="text-label-sm text-text-primary font-semibold">{label}</label>
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <InputField
            type={visible ? "text" : "password"}
            placeholder={`Enter ${label}...`}
            value={value}
            onChange={onChange}
          />
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-text-tertiary hover:text-text-primary transition-colors p-sm"
          title={visible ? "Hide" : "Show"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {value && (
        <p className="text-video-title text-text-tertiary">
          Stored: {visible ? value : `${value.slice(0, 4)}${"•".repeat(Math.max(0, value.length - 8))}${value.slice(-4)}`}
        </p>
      )}
    </div>
  );
}

// Site-wide CTA type
type CtaEntry = { pageType: string; text: string; url: string };

// Analytics config type
type AnalyticsConfig = {
  googleAnalyticsId: string;
  plausibleDomain: string;
  plausibleApiKey: string;
  hotjarId: string;
  facebookPixelId: string;
  googleTagManagerId: string;
};

// Webhook URL entry type
type WebhookUrlEntry = { id: string; url: string };

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [serverData, setServerData] = useState<SettingsPayload | null>(null);
  const [draftData, setDraftData] = useState<SettingsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savingTab, setSavingTab] = useState<string | null>(null);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  const token = useMemo(() => getStoredToken(), []);

  // SMTP test email state
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<"" | "success" | "error">("");

  // Seeder state
  const [seederForm, setSeederForm] = useState({ name: "Admin", email: "admin@webndevs.com", password: "", passwordConfirm: "" });
  const [seederResult, setSeederResult] = useState<"" | "success" | "error">("");
  const [isSeeding, setIsSeeding] = useState(false);

  // Cache state
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheResult, setCacheResult] = useState<"" | "success" | "error">("");

  // Backup state
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupResult, setBackupResult] = useState<"" | "success" | "error">("");

  // Webhook URLs state
  const [webhookUrls, setWebhookUrls] = useState<WebhookUrlEntry[]>([]);

  const hasChanges = useMemo(() => {
    if (!serverData || !draftData) return false;
    const tabKey = activeTab as keyof SettingsPayload;
    if (!serverData[tabKey]) return false;
    return JSON.stringify(serverData[tabKey]) !== JSON.stringify(draftData[tabKey]);
  }, [activeTab, draftData, serverData]);

  // Auto-save effect
  useEffect(() => {
    if (autoSaveEnabled && pendingChanges && hasChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveCurrentTab();
        setPendingChanges(false);
      }, 3000);
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveEnabled, pendingChanges, hasChanges]);

  function authHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  // Default settings to prevent loading stuck
  const defaultSettings: SettingsPayload = {
    general: {
      site_name: 'WebNDevs CMS',
      site_url: 'http://localhost:5175',
      timezone: 'Asia/Kolkata',
      default_language: 'en',
      support_email: 'support@webndevs.local',
      maintenance_mode: false,
    },
    smtp: {
      driver: 'smtp',
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls',
      from_name: 'WebNDevs CMS',
      from_email: 'noreply@webndevs.local',
      reply_to_email: '',
    },
    'api-keys': {
      google_maps_key: '',
      recaptcha_site_key: '',
      recaptcha_secret_key: '',
      stripe_public_key: '',
      stripe_secret_key: '',
      mailgun_api_key: '',
      claude_api_key: '',
      openai_api_key: '',
      google_analytics_id: '',
      plausible_domain: '',
    },
    'email-templates': {
      welcome_subject: 'Welcome to WebNDevs',
      welcome_body: 'Welcome!',
      invoice_subject: 'Invoice',
      invoice_body: 'Your invoice.',
      password_reset_subject: 'Reset your password',
      password_reset_body: 'Click to reset.',
    },
    security: {
      session_timeout_minutes: 60,
      password_min_length: 8,
      require_two_factor: false,
      allow_ip_whitelist: false,
      ip_whitelist: [],
      max_login_attempts: 5,
    },
    'ai-settings': {
      default_provider: 'anthropic',
      default_model: 'claude-sonnet-4-20250514',
      temperature: 0.7,
      max_tokens: 4096,
      streaming_enabled: true,
      cache_ttl_hours: 24,
      rate_limit_per_hour: 10,
      auto_regenerate_on_edit: false,
    },
    'media-storage': {
      driver: 'local',
      s3_bucket: '',
      s3_region: 'us-east-1',
      s3_key: '',
      s3_secret: '',
      s3_endpoint: '',
      cloudflare_r2_account_id: '',
      cloudflare_r2_access_key: '',
      cloudflare_r2_secret_key: '',
      cloudflare_r2_bucket: '',
      max_upload_size_mb: 10,
      allowed_mime_types: ['image/jpeg', 'image/png'],
      image_compression_quality: 85,
      auto_generate_thumbnails: true,
      thumbnail_sizes: [150, 300, 600],
    },
    cache: {
      driver: 'file',
      content_ttl_minutes: 15,
      pages_ttl_minutes: 60,
      queries_ttl_minutes: 5,
      api_ttl_minutes: 15,
      enable_api_cache: true,
      cache_sitemap: true,
      cache_routes: [],
    },
    backups: {
      auto_backup_enabled: false,
      backup_schedule: 'daily',
      retention_days: 30,
      backup_time: '02:00',
      backup_destination: 'local',
      s3_backup_bucket: '',
      include_database: true,
      include_files: true,
      include_settings: true,
    },
    webhooks: {
      enabled: false,
      urls: [],
      secret: '',
      retry_count: 3,
      retry_delay_seconds: 60,
      events: {
        page_published: true,
        page_updated: true,
        form_submitted: true,
        user_registered: false,
        ai_generation_complete: true,
      },
    },
    'user-management': {
      allow_registration: true,
      require_email_verification: true,
      default_user_role: 'editor',
      password_expiry_days: 0,
      session_remember_me_days: 14,
      allow_social_login: false,
      oauth_google_client_id: '',
      oauth_google_client_secret: '',
      oauth_github_client_id: '',
      oauth_github_client_secret: '',
    },
    'site-ctas': [
      { pageType: "Tool Page", text: "Get a Free Integration Audit", url: "/contact" },
      { pageType: "Industry Page", text: "See Our Industry Solutions", url: "/solutions" },
      { pageType: "Cross-Reference Page", text: "Book a Free Consultation", url: "/contact" },
      { pageType: "Comparison Page", text: "Talk to an Expert", url: "/contact" },
      { pageType: "Case Study Page", text: "Get Similar Results", url: "/contact" },
      { pageType: "Solution Page", text: "Implement This Solution", url: "/contact" },
    ],
    analytics: {
      googleAnalyticsId: "",
      plausibleDomain: "",
      plausibleApiKey: "",
      hotjarId: "",
      facebookPixelId: "",
      googleTagManagerId: "",
    },
  };

  async function fetchSettings() {
    setIsLoading(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: authHeaders(),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const payload = await response.json();
      
      // Check if we got valid settings data
      if (payload && payload.data && payload.data.settings) {
        setServerData(payload.data.settings);
        setDraftData(payload.data.settings);
        
        // Initialize webhook URLs
        if (payload.data.settings.webhooks?.urls) {
          setWebhookUrls(payload.data.settings.webhooks.urls.map((url: string, idx: number) => ({
            id: `wh-${idx}-${Date.now()}`,
            url
          })));
        }
        
        if (payload.data.audit_logs) {
          setAuditLogs(payload.data.audit_logs);
        }
      } else {
        // Use defaults if no data
        setServerData(defaultSettings);
        setDraftData(defaultSettings);
        console.warn('Using default settings - API returned unexpected format');
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
      // Use defaults on error to prevent stuck loading
      setServerData(defaultSettings);
      setDraftData(defaultSettings);
      setErrorText(error instanceof Error ? error.message : "Failed to load settings. Using defaults.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function updateTab<K extends keyof SettingsPayload>(tab: K, data: SettingsPayload[K]) {
    setDraftData((current) => (current ? { ...current, [tab]: data } : current));
    setPendingChanges(true);
    if (autoSaveEnabled) {
      // Auto-save will trigger via effect
    }
  }

  function validate(tab: TabKey): string {
    if (!draftData) return "Settings not loaded.";
    if (tab === "general") {
      if (!draftData.general.site_name.trim()) return "Site name is required.";
      if (!draftData.general.support_email.trim()) return "Support email is required.";
    }
    if (tab === "smtp") {
      if (!draftData.smtp.from_name.trim()) return "From name is required.";
      if (!draftData.smtp.from_email.trim()) return "From email is required.";
    }
    if (tab === "email-templates") {
      if (!draftData["email-templates"].welcome_subject.trim()) return "Welcome subject is required.";
      if (!draftData["email-templates"].welcome_body.trim()) return "Welcome body is required.";
    }
    return "";
  }

  function cancelCurrentTab() {
    if (!serverData || !draftData) return;
    const tabKey = activeTab as keyof SettingsPayload;
    if (serverData[tabKey]) {
      setDraftData({ ...draftData, [tabKey]: serverData[tabKey] });
    }
    setErrorText("");
    setSuccessText("Changes discarded.");
    setPendingChanges(false);
  }

  async function saveCurrentTab() {
    if (!draftData) return;
    const tabKey = activeTab as keyof SettingsPayload;
    if (!draftData[tabKey]) return;

    const validationError = validate(activeTab);
    if (validationError) {
      setErrorText(validationError);
      setSuccessText("");
      return;
    }

    setSavingTab(activeTab);
    setErrorText("");
    setSuccessText("");
    try {
      // Handle webhooks specially - merge URLs array
      let payload = draftData[tabKey];
      if (tabKey === "webhooks" && webhookUrls.length > 0) {
        payload = {
          ...draftData[tabKey],
          urls: webhookUrls.map(w => w.url).filter(Boolean)
        };
      }

      const response = await fetch(`${API_BASE_URL}/settings/${tabKey}`, {
        method: "PUT",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save settings.");
      }

      setServerData((current) => (current ? { ...current, [tabKey]: result.data } : current));
      setDraftData((current) => (current ? { ...current, [tabKey]: result.data } : current));
      setSuccessText("Settings saved successfully.");
      setLastSaved(new Date().toLocaleTimeString());
      setPendingChanges(false);

      // Refresh audit logs
      fetchAuditLogs();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSavingTab(null);
    }
  }

  async function fetchAuditLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/audit-logs`, {
        headers: authHeaders(),
        credentials: "include",
      });
      const payload = await response.json();
      if (payload.success) {
        setAuditLogs(payload.data.data || []);
      }
    } catch {
      // Silent fail
    }
  }

  async function sendTestEmail() {
    if (!testEmailAddress) return;
    setIsSendingTest(true);
    setTestEmailResult("");
    try {
      const response = await fetch(`${API_BASE_URL}/settings/smtp/test`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ email: testEmailAddress }),
      });
      setTestEmailResult(response.ok ? "success" : "error");
    } catch {
      setTestEmailResult("error");
    } finally {
      setIsSendingTest(false);
    }
  }

  async function testAiConnection() {
    setSuccessText("Testing AI connection...");
    setErrorText("");
    try {
      const response = await fetch(`${API_BASE_URL}/settings/ai-settings/test`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSuccessText(`AI connection ready: ${result.data.provider} (${result.data.model})`);
      } else {
        setErrorText(result.message || "AI connection failed.");
      }
    } catch (error) {
      setErrorText("Failed to test AI connection.");
    }
  }

  async function clearCache(type: string = "all") {
    setIsClearingCache(true);
    setCacheResult("");
    try {
      const response = await fetch(`${API_BASE_URL}/settings/cache/clear`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ type }),
      });
      setCacheResult(response.ok ? "success" : "error");
    } catch {
      setCacheResult("error");
    } finally {
      setIsClearingCache(false);
    }
  }

  async function createBackup() {
    setIsCreatingBackup(true);
    setBackupResult("");
    try {
      const response = await fetch(`${API_BASE_URL}/settings/backup`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setBackupResult("success");
        setSuccessText(`Backup created: ${result.data.filename}`);
      } else {
        setBackupResult("error");
        setErrorText(result.message || "Failed to create backup.");
      }
    } catch {
      setBackupResult("error");
    } finally {
      setIsCreatingBackup(false);
    }
  }

  async function resetTabToDefaults() {
    if (!confirm("Are you sure you want to reset this tab to default values? This cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${activeTab}/reset`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setDraftData((current) => current ? { ...current, [activeTab]: result.data } : current);
        setSuccessText("Tab reset to defaults.");
        fetchAuditLogs();
      } else {
        setErrorText(result.message || "Failed to reset.");
      }
    } catch {
      setErrorText("Failed to reset tab.");
    }
  }

  async function exportSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/settings-export`, {
        headers: authHeaders(),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `settings-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSuccessText("Settings exported successfully.");
      }
    } catch {
      setErrorText("Failed to export settings.");
    }
  }

  async function runSeeder() {
    if (!seederForm.email || !seederForm.password || seederForm.password !== seederForm.passwordConfirm) {
      setErrorText("Please fill out all seeder fields and ensure passwords match.");
      return;
    }
    setIsSeeding(true);
    setSeederResult("");
    setErrorText("");
    setSuccessText("");

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          name: seederForm.name,
          email: seederForm.email,
          password: seederForm.password,
          password_confirmation: seederForm.passwordConfirm,
          is_admin: true,
          role: 'admin',
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to seed admin user.');
      }
      setSeederResult("success");
      setSuccessText("Admin user created successfully.");
    } catch (err) {
      setSeederResult("error");
      setErrorText(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSeeding(false);
    }
  }

  function addWebhookUrl() {
    setWebhookUrls([...webhookUrls, { id: `wh-${Date.now()}`, url: "" }]);
    setPendingChanges(true);
  }

  function removeWebhookUrl(id: string) {
    setWebhookUrls(webhookUrls.filter(w => w.id !== id));
    setPendingChanges(true);
  }

  function updateWebhookUrl(id: string, url: string) {
    setWebhookUrls(webhookUrls.map(w => w.id === id ? { ...w, url } : w));
    setPendingChanges(true);
  }

  // Filter tabs by search
  const filteredTabs = useMemo(() => {
    if (!searchQuery) return tabItems;
    const query = searchQuery.toLowerCase();
    return tabItems.filter(tab => tab.label.toLowerCase().includes(query));
  }, [searchQuery]);

  if (isLoading || !draftData) {
    return (
      <div className="p-2xl"><LoadingGame /></div>
  );
}

// ============ USER MANAGEMENT SECTION ============
function UsersManagementSection() {
  const { users, isLoading, error, refetch } = useUsers();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "editor",
    is_admin: false,
    permissions: [] as string[],
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "editor",
    is_admin: false,
    permissions: [] as string[],
  });

  // Password form state (for edit)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = useMemo(() => getStoredToken(), []);

  function authHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async function createUser() {
    if (!createForm.name || !createForm.email || !createForm.password) {
      setActionError("Please fill in all required fields.");
      return;
    }
    if (createForm.password !== createForm.password_confirmation) {
      setActionError("Passwords do not match.");
      return;
    }

    setIsActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(createForm),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create user.");
      }

      setShowCreateModal(false);
      setCreateForm({ name: "", email: "", password: "", password_confirmation: "", role: "editor", is_admin: false, permissions: [] });
      setActionSuccess("User created successfully.");
      void refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setIsActionLoading(false);
    }
  }

  function openEditModal(user: User) {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, is_admin: user.is_admin, permissions: user.permissions || [] });
    setNewPassword("");
    setConfirmPassword("");
    setShowEditModal(true);
  }

  async function updateUser() {
    if (!selectedUser) return;

    setIsActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      // Update user details first
      const userPayload = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        is_admin: editForm.is_admin,
        permissions: editForm.permissions,
      };

      const userResponse = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(userPayload),
      });
      const userResult = await userResponse.json();

      if (!userResponse.ok || !userResult.success) {
        throw new Error(userResult.message || "Failed to update user details.");
      }

      // If a new password is set, update it via the dedicated endpoint
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const passwordPayload = {
          password: newPassword,
          password_confirmation: confirmPassword,
          force_change: true, // Assuming admin is forcing the change
        };

        const passwordResponse = await fetch(`${API_BASE_URL}/users/${selectedUser.id}/change-password`, {
            method: "POST",
            headers: authHeaders(),
            credentials: "include",
            body: JSON.stringify(passwordPayload),
        });
        const passwordResult = await passwordResponse.json();

        if (!passwordResponse.ok || !passwordResult.success) {
            throw new Error(passwordResult.message || "Failed to update password.");
        }
      }

      setShowEditModal(false);
      setSelectedUser(null);
      setNewPassword("");
      setConfirmPassword("");
      setActionSuccess("User updated successfully.");
      void refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setIsActionLoading(false);
    }
  }

  function openDeleteModal(user: User) {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }

  async function deleteUser() {
    if (!selectedUser) return;

    setIsActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete user.");
      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      setActionSuccess("User deleted successfully.");
      void refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setIsActionLoading(false);
    }
  }

  if (isLoading) {
    return (
      <LoadingGame />
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary font-semibold">User Management</p>
          <p className="text-video-title text-text-tertiary">Manage admin and editor accounts.</p>
        </div>
        <Button variant="primary" size="small" iconStart={<UserPlus size={14} />} onClick={() => setShowCreateModal(true)}>
          Add User
        </Button>
      </div>

      {/* Error/Success Messages */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-corner-md p-md flex items-center gap-sm">
          <AlertTriangle size={16} className="text-red-500" />
          <p className="text-label-sm text-red-600">{actionError}</p>
          <button onClick={() => setActionError("")} className="ml-auto"><X size={16} className="text-red-400" /></button>
        </div>
      )}
      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-corner-md p-md flex items-center gap-sm">
          <Check size={16} className="text-green-500" />
          <p className="text-label-sm text-green-600">{actionSuccess}</p>
          <button onClick={() => setActionSuccess("")} className="ml-auto"><X size={16} className="text-green-400" /></button>
        </div>
      )}

      {/* Users Table */}
      <div className="border border-border-secondary rounded-corner-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-faint">
            <tr>
              <th className="px-lg py-md text-left text-label-sm text-text-secondary font-medium">Name</th>
              <th className="px-lg py-md text-left text-label-sm text-text-secondary font-medium">Email</th>
              <th className="px-lg py-md text-left text-label-sm text-text-secondary font-medium">Role</th>
              <th className="px-lg py-md text-left text-label-sm text-text-secondary font-medium">Admin</th>
              <th className="px-lg py-md text-left text-label-sm text-text-secondary font-medium">Created</th>
              <th className="px-lg py-md text-right text-label-sm text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-secondary">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-bg-faint/50">
                <td className="px-lg py-md text-label-sm text-text-primary">{user.name}</td>
                <td className="px-lg py-md text-label-sm text-text-secondary">{user.email}</td>
                <td className="px-lg py-md">
                  <Badge 
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                    variant={user.role === "admin" ? "brand" : "secondary"} 
                  />
                </td>
                <td className="px-lg py-md">
                  {user.is_admin ? (
                    <Badge label="Yes" variant="brand" />
                  ) : (
                    <Badge label="No" variant="secondary" />
                  )}
                </td>
                <td className="px-lg py-md text-label-sm text-text-tertiary">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-lg py-md text-right">
                  <div className="flex items-center justify-end gap-sm">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-sm text-text-tertiary hover:text-text-primary transition-colors"
                      title="Edit user"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="p-sm text-text-tertiary hover:text-red-500 transition-colors"
                      title="Delete user"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-lg py-xl text-center text-label text-text-tertiary">
                  No users found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-surface-bg rounded-corner-lg p-xl w-full max-w-md border border-border-primary" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-title-sm text-text-primary">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-lg">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={createForm.name}
                onChange={(v) => setCreateForm((f) => ({ ...f, name: v }))}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={createForm.email}
                onChange={(v) => setCreateForm((f) => ({ ...f, email: v }))}
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={createForm.password}
                onChange={(v) => setCreateForm((f) => ({ ...f, password: v }))}
              />
              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={createForm.password_confirmation}
                onChange={(v) => setCreateForm((f) => ({ ...f, password_confirmation: v }))}
              />
              <SelectField
                label="Role"
                options={[
                  { value: "viewer", label: "Viewer" },
                  { value: "editor", label: "Editor" },
                  { value: "admin", label: "Admin" },
                ]}
                value={createForm.role}
                onChange={(v) => setCreateForm((f) => ({ ...f, role: v }))}
              />
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.is_admin}
                  onChange={(e) => setCreateForm((f) => ({ ...f, is_admin: e.target.checked }))}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Admin Access (Full Access)</span>
              </label>

              <div className="border-t border-border-secondary pt-lg">
                <p className="text-label-sm text-text-primary font-semibold mb-md">Module Permissions</p>
                <div className="grid grid-cols-2 gap-sm">
                  {[
                    { key: 'blog.manage', label: 'Blog Posts' },
                    { key: 'services.manage', label: 'Services' },
                    { key: 'case_studies.manage', label: 'Case Studies' },
                    { key: 'content.manage', label: 'Content Pages' },
                    { key: 'media.manage', label: 'Media Library' },
                    { key: 'tools.manage', label: 'Tools' },
                    { key: 'industries.manage', label: 'Industries' },
                    { key: 'solutions.manage', label: 'Solutions' },
                    { key: 'ai.use', label: 'AI Generation' },
                    { key: 'analytics.view', label: 'Analytics' },
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center gap-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createForm.permissions.includes(perm.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCreateForm((f) => ({ ...f, permissions: [...f.permissions, perm.key] }));
                          } else {
                            setCreateForm((f) => ({ ...f, permissions: f.permissions.filter((p) => p !== perm.key) }));
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-border-primary"
                      />
                      <span className="text-label-xs text-text-secondary">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <Button variant="neutral" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={createUser}
                  disabled={isActionLoading || !createForm.name || !createForm.email || !createForm.password}
                >
                  {isActionLoading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-surface-bg rounded-corner-lg p-xl w-full max-w-md border border-border-primary" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-title-sm text-text-primary">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-lg">
              <InputField
                label="Full Name"
                placeholder="John Doe"
                value={editForm.name}
                onChange={(v) => setEditForm((f) => ({ ...f, name: v }))}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={editForm.email}
                onChange={(v) => setEditForm((f) => ({ ...f, email: v }))}
              />
              <SelectField
                label="Role"
                options={[
                  { value: "viewer", label: "Viewer" },
                  { value: "editor", label: "Editor" },
                  { value: "admin", label: "Admin" },
                ]}
                value={editForm.role}
                onChange={(v) => setEditForm((f) => ({ ...f, role: v }))}
              />
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.is_admin}
                  onChange={(e) => setEditForm((f) => ({ ...f, is_admin: e.target.checked }))}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Admin Access</span>
              </label>

              <div className="border-t border-border-secondary pt-lg">
                <p className="text-label-sm text-text-secondary mb-md">Leave blank to keep current password.</p>
                <InputField
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={setNewPassword}
                />
                {newPassword && (
                  <InputField
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                )}
              </div>

              <div className="border-t border-border-secondary pt-lg">
                <p className="text-label-sm text-text-primary font-semibold mb-md">Module Permissions</p>
                <div className="grid grid-cols-2 gap-sm">
                  {[
                    { key: 'blog.manage', label: 'Blog Posts' },
                    { key: 'services.manage', label: 'Services' },
                    { key: 'case_studies.manage', label: 'Case Studies' },
                    { key: 'content.manage', label: 'Content Pages' },
                    { key: 'media.manage', label: 'Media Library' },
                    { key: 'tools.manage', label: 'Tools' },
                    { key: 'industries.manage', label: 'Industries' },
                    { key: 'solutions.manage', label: 'Solutions' },
                    { key: 'ai.use', label: 'AI Generation' },
                    { key: 'analytics.view', label: 'Analytics' },
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center gap-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.permissions.includes(perm.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm((f) => ({ ...f, permissions: [...f.permissions, perm.key] }));
                          } else {
                            setEditForm((f) => ({ ...f, permissions: f.permissions.filter((p) => p !== perm.key) }));
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-border-primary"
                      />
                      <span className="text-label-xs text-text-secondary">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <Button variant="neutral" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  onClick={updateUser}
                  disabled={isActionLoading || !editForm.name || !editForm.email}
                >
                  {isActionLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-surface-bg rounded-corner-lg p-xl w-full max-w-sm border border-border-primary" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-title-sm text-text-primary">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <p className="text-label-sm text-text-secondary mb-lg">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-sm">
              <Button variant="neutral" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={deleteUser}
                disabled={isActionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isActionLoading ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <div className="p-2xl flex flex-col gap-xl max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-md">
        <div>
          <h1 className="text-title text-text-primary">Settings</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Manage platform configuration, integrations, and security controls.</p>
        </div>
        <div className="flex items-center gap-md flex-wrap">
          <TokenStatus />
          {lastSaved && (
            <span className="text-label-sm text-text-tertiary flex items-center gap-xs">
              <Check size={12} className="text-success" />
              Saved at {lastSaved}
            </span>
          )}
          {pendingChanges && (
            <Badge label="Unsaved changes" variant="warning" />
          )}
          <Button variant="neutral" size="small" iconStart={<Download size={14} />} onClick={exportSettings}>
            Export
          </Button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {errorText && (
        <div className="bg-red-50 border border-red-200 rounded-corner-md p-md flex items-center gap-sm">
          <AlertTriangle size={16} className="text-red-500" />
          <p className="text-label-sm text-red-600">{errorText}</p>
          <button onClick={() => setErrorText("")} className="ml-auto">
            <X size={16} className="text-red-400 hover:text-red-600" />
          </button>
        </div>
      )}
      {successText && (
        <div className="bg-green-50 border border-green-200 rounded-corner-md p-md flex items-center gap-sm">
          <Check size={16} className="text-green-500" />
          <p className="text-label-sm text-green-600">{successText}</p>
          <button onClick={() => setSuccessText("")} className="ml-auto">
            <X size={16} className="text-green-400 hover:text-green-600" />
          </button>
        </div>
      )}

      {/* Search and Auto-save Toggle */}
      <div className="flex items-center gap-md flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-md top-1/2 -translate-y-1/2 text-text-tertiary" />
          <InputField
            placeholder="Search settings..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="pl-xl"
          />
        </div>
        <label className="flex items-center gap-sm cursor-pointer">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-border-primary"
          />
          <span className="text-label-sm text-text-secondary">Auto-save (3s delay)</span>
        </label>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface-bg rounded-corner-lg p-md border border-border-primary">
        <div className="flex gap-sm flex-wrap">
          {filteredTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setErrorText("");
                setSuccessText("");
              }}
              className={`px-lg py-sm rounded-corner-full text-label-sm transition-colors flex items-center gap-xs ${
                activeTab === tab.key 
                  ? "bg-brand-primary text-on-brand" 
                  : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10 hover:text-text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary flex flex-col gap-lg">
        
        {/* ============ GENERAL SETTINGS ============ */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <InputField 
              label="Site Name" 
              value={draftData.general.site_name} 
              onChange={(value) => updateTab("general", { ...draftData.general, site_name: value })} 
            />
            <InputField 
              label="Site URL" 
              value={draftData.general.site_url} 
              onChange={(value) => updateTab("general", { ...draftData.general, site_url: value })} 
            />
            <InputField 
              label="Timezone" 
              value={draftData.general.timezone} 
              onChange={(value) => updateTab("general", { ...draftData.general, timezone: value })} 
            />
            <InputField 
              label="Default Language" 
              value={draftData.general.default_language} 
              onChange={(value) => updateTab("general", { ...draftData.general, default_language: value })} 
            />
            <InputField 
              label="Support Email" 
              value={draftData.general.support_email} 
              onChange={(value) => updateTab("general", { ...draftData.general, support_email: value })} 
            />
            <SelectField
              label="Maintenance Mode"
              options={[
                { value: "false", label: "Disabled" },
                { value: "true", label: "Enabled" },
              ]}
              value={String(draftData.general.maintenance_mode)}
              onChange={(value) => updateTab("general", { ...draftData.general, maintenance_mode: boolFromValue(value) })}
            />
            <InputField 
              label="Site Logo URL" 
              value={draftData.general.site_logo_url || ""} 
              onChange={(value) => updateTab("general", { ...draftData.general, site_logo_url: value })} 
            />
            <InputField 
              label="Favicon URL" 
              value={draftData.general.favicon_url || ""} 
              onChange={(value) => updateTab("general", { ...draftData.general, favicon_url: value })} 
            />
          </div>
        )}

        {/* ============ AI SETTINGS ============ */}
        {activeTab === "ai-settings" && (
          <div className="flex flex-col gap-xl">
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-corner-md p-lg">
              <div className="flex items-center gap-sm mb-sm">
                <Sparkles size={16} className="text-brand-primary" />
                <p className="text-label text-text-primary font-semibold">AI Content Generation</p>
              </div>
              <p className="text-video-title text-text-secondary">
                Configure AI settings for automated content generation across all modules.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <SelectField
                label="Default Provider"
                options={[
                  { value: "anthropic", label: "Anthropic (Claude)" },
                  { value: "openai", label: "OpenAI (GPT)" },
                  { value: "google", label: "Google (Gemini)" },
                ]}
                value={draftData["ai-settings"].default_provider}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], default_provider: value })}
              />
              <InputField
                label="Default Model"
                value={draftData["ai-settings"].default_model}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], default_model: value })}
              />
              <InputField
                label="Temperature (0-2)"
                type="number"
                value={String(draftData["ai-settings"].temperature)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], temperature: parseFloat(value) || 0 })}
              />
              <InputField
                label="Max Tokens"
                type="number"
                value={String(draftData["ai-settings"].max_tokens)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], max_tokens: parseInt(value) || 100 })}
              />
              <SelectField
                label="Streaming Enabled"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={String(draftData["ai-settings"].streaming_enabled)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], streaming_enabled: boolFromValue(value) })}
              />
              <InputField
                label="Cache TTL (hours)"
                type="number"
                value={String(draftData["ai-settings"].cache_ttl_hours)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], cache_ttl_hours: parseInt(value) || 24 })}
              />
              <InputField
                label="Rate Limit (per hour)"
                type="number"
                value={String(draftData["ai-settings"].rate_limit_per_hour)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], rate_limit_per_hour: parseInt(value) || 10 })}
              />
              <SelectField
                label="Auto-regenerate on Edit"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={String(draftData["ai-settings"].auto_regenerate_on_edit)}
                onChange={(value) => updateTab("ai-settings", { ...draftData["ai-settings"], auto_regenerate_on_edit: boolFromValue(value) })}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="primary" iconStart={<Sparkles size={14} />} onClick={testAiConnection}>
                Test AI Connection
              </Button>
            </div>
          </div>
        )}

        {/* ============ SMTP SETTINGS ============ */}
        {activeTab === "smtp" && (
          <div className="flex flex-col gap-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <SelectField
                label="Driver"
                options={["smtp", "sendmail", "mailgun", "ses", "postmark", "log"].map((v) => ({ value: v, label: v.toUpperCase() }))}
                value={draftData.smtp.driver}
                onChange={(value) => updateTab("smtp", { ...draftData.smtp, driver: value })}
              />
              <InputField label="Host" value={draftData.smtp.host} onChange={(value) => updateTab("smtp", { ...draftData.smtp, host: value })} />
              <InputField
                label="Port"
                value={String(draftData.smtp.port)}
                onChange={(value) => updateTab("smtp", { ...draftData.smtp, port: parseInt(value, 10) || 0 })}
              />
              <InputField label="Username" value={draftData.smtp.username} onChange={(value) => updateTab("smtp", { ...draftData.smtp, username: value })} />
              <MaskedKeyField label="Password" value={draftData.smtp.password} onChange={(v) => updateTab("smtp", { ...draftData.smtp, password: v })} />
              <SelectField
                label="Encryption"
                options={[
                  { value: "none", label: "None" },
                  { value: "tls", label: "TLS" },
                  { value: "ssl", label: "SSL" },
                ]}
                value={draftData.smtp.encryption}
                onChange={(value) => updateTab("smtp", { ...draftData.smtp, encryption: value })}
              />
              <InputField label="From Name" value={draftData.smtp.from_name} onChange={(value) => updateTab("smtp", { ...draftData.smtp, from_name: value })} />
              <InputField label="From Email" value={draftData.smtp.from_email} onChange={(value) => updateTab("smtp", { ...draftData.smtp, from_email: value })} />
              <InputField label="Reply-To Email" value={draftData.smtp.reply_to_email} onChange={(value) => updateTab("smtp", { ...draftData.smtp, reply_to_email: value })} />
            </div>

            {/* Test Email Section */}
            <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
              <p className="text-label text-text-primary font-semibold mb-md flex items-center gap-sm">
                <Send size={16} /> Send Test Email
              </p>
              <div className="flex items-end gap-lg">
                <div className="flex-1">
                  <InputField
                    label="Recipient Address"
                    placeholder="test@example.com"
                    value={testEmailAddress}
                    onChange={setTestEmailAddress}
                  />
                </div>
                <Button
                  variant="primary"
                  iconStart={isSendingTest ? undefined : <Send size={14} />}
                  onClick={sendTestEmail}
                  disabled={!testEmailAddress || isSendingTest}
                >
                  {isSendingTest ? "Sending..." : "Send Test"}
                </Button>
              </div>
              {testEmailResult === "success" && (
                <p className="text-label-sm text-green-600 mt-sm flex items-center gap-xs">
                  <Check size={14} /> Test email sent successfully.
                </p>
              )}
              {testEmailResult === "error" && (
                <p className="text-label-sm text-red-500 mt-sm">Failed to send test email. Check your SMTP configuration.</p>
              )}
            </div>
          </div>
        )}

        {/* ============ API KEYS ============ */}
        {activeTab === "api-keys" && (
          <div className="flex flex-col gap-xl">
            <div>
              <p className="text-label text-text-primary font-semibold mb-md flex items-center gap-sm">
                <Sparkles size={14} className="text-brand-primary" /> AI Services
              </p>
              <p className="text-video-title text-text-tertiary mb-md">
                Add your AI API keys to enable AI-powered content generation across all modules.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <MaskedKeyField 
                  label="Anthropic (Claude) API Key" 
                  value={draftData["api-keys"].claude_api_key} 
                  onChange={(v) => {
                    updateTab("api-keys", { ...draftData["api-keys"], claude_api_key: v });
                    setStoredAiKey("anthropic", v);
                  }} 
                />
                <MaskedKeyField 
                  label="OpenAI API Key" 
                  value={draftData["api-keys"].openai_api_key} 
                  onChange={(v) => {
                    updateTab("api-keys", { ...draftData["api-keys"], openai_api_key: v });
                    setStoredAiKey("openai", v);
                  }} 
                />
              </div>
            </div>

            <div>
              <p className="text-label text-text-primary font-semibold mb-md">Payment & Communications</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <InputField label="Stripe Public Key" value={draftData["api-keys"].stripe_public_key} onChange={(value) => updateTab("api-keys", { ...draftData["api-keys"], stripe_public_key: value })} />
                <MaskedKeyField label="Stripe Secret Key" value={draftData["api-keys"].stripe_secret_key} onChange={(v) => updateTab("api-keys", { ...draftData["api-keys"], stripe_secret_key: v })} />
                <MaskedKeyField label="Mailgun API Key" value={draftData["api-keys"].mailgun_api_key} onChange={(v) => updateTab("api-keys", { ...draftData["api-keys"], mailgun_api_key: v })} />
              </div>
            </div>

            <div>
              <p className="text-label text-text-primary font-semibold mb-md">Google Services</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <MaskedKeyField label="Google Maps API Key" value={draftData["api-keys"].google_maps_key} onChange={(v) => updateTab("api-keys", { ...draftData["api-keys"], google_maps_key: v })} />
                <InputField label="reCAPTCHA Site Key" value={draftData["api-keys"].recaptcha_site_key} onChange={(value) => updateTab("api-keys", { ...draftData["api-keys"], recaptcha_site_key: value })} />
                <MaskedKeyField label="reCAPTCHA Secret Key" value={draftData["api-keys"].recaptcha_secret_key} onChange={(v) => updateTab("api-keys", { ...draftData["api-keys"], recaptcha_secret_key: v })} />
              </div>
            </div>

            <p className="text-video-title text-text-tertiary">All secret keys are encrypted before being stored in the database.</p>
          </div>
        )}

        {/* ============ EMAIL TEMPLATES ============ */}
        {activeTab === "email-templates" && (
          <div className="grid grid-cols-1 gap-lg">
            <InputField label="Welcome Subject" value={draftData["email-templates"].welcome_subject} onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], welcome_subject: value })} />
            <TextareaField label="Welcome Body" rows={4} value={draftData["email-templates"].welcome_body} onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], welcome_body: value })} />
            <InputField label="Invoice Subject" value={draftData["email-templates"].invoice_subject} onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], invoice_subject: value })} />
            <TextareaField label="Invoice Body" rows={4} value={draftData["email-templates"].invoice_body} onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], invoice_body: value })} />
            <InputField
              label="Password Reset Subject"
              value={draftData["email-templates"].password_reset_subject}
              onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], password_reset_subject: value })}
            />
            <TextareaField
              label="Password Reset Body"
              rows={4}
              value={draftData["email-templates"].password_reset_body}
              onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], password_reset_body: value })}
            />
            <InputField
              label="Contact Form Subject"
              value={draftData["email-templates"].contact_form_subject || ""}
              onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], contact_form_subject: value })}
            />
            <TextareaField
              label="Contact Form Body"
              rows={4}
              value={draftData["email-templates"].contact_form_body || ""}
              onChange={(value) => updateTab("email-templates", { ...draftData["email-templates"], contact_form_body: value })}
            />
          </div>
        )}

        {/* ============ SECURITY ============ */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <InputField
              label="Session Timeout (minutes)"
              value={String(draftData.security.session_timeout_minutes)}
              onChange={(value) => updateTab("security", { ...draftData.security, session_timeout_minutes: parseInt(value, 10) || 0 })}
            />
            <InputField
              label="Password Minimum Length"
              value={String(draftData.security.password_min_length)}
              onChange={(value) => updateTab("security", { ...draftData.security, password_min_length: parseInt(value, 10) || 0 })}
            />
            <InputField
              label="Max Login Attempts"
              value={String(draftData.security.max_login_attempts)}
              onChange={(value) => updateTab("security", { ...draftData.security, max_login_attempts: parseInt(value, 10) || 0 })}
            />
            <InputField
              label="Lockout Duration (minutes)"
              value={String(draftData.security.lockout_duration_minutes || 15)}
              onChange={(value) => updateTab("security", { ...draftData.security, lockout_duration_minutes: parseInt(value, 10) || 15 })}
            />
            <SelectField
              label="Require Two Factor"
              options={[
                { value: "false", label: "No" },
                { value: "true", label: "Yes" },
              ]}
              value={String(draftData.security.require_two_factor)}
              onChange={(value) => updateTab("security", { ...draftData.security, require_two_factor: boolFromValue(value) })}
            />
            <SelectField
              label="Enable IP Whitelist"
              options={[
                { value: "false", label: "No" },
                { value: "true", label: "Yes" },
              ]}
              value={String(draftData.security.allow_ip_whitelist)}
              onChange={(value) => updateTab("security", { ...draftData.security, allow_ip_whitelist: boolFromValue(value) })}
            />
            <TextareaField
              label="IP Whitelist (one IP per line)"
              rows={4}
              value={draftData.security.ip_whitelist.join("\n")}
              onChange={(value) =>
                updateTab("security", {
                  ...draftData.security,
                  ip_whitelist: value.split("\n").map((ip) => ip.trim()).filter(Boolean),
                })
              }
            />
            <div className="flex flex-col gap-md">
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.security.require_special_chars ?? true}
                  onChange={(e) => updateTab("security", { ...draftData.security, require_special_chars: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Require Special Characters</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.security.require_numbers ?? true}
                  onChange={(e) => updateTab("security", { ...draftData.security, require_numbers: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Require Numbers</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.security.require_uppercase ?? true}
                  onChange={(e) => updateTab("security", { ...draftData.security, require_uppercase: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Require Uppercase</span>
              </label>
            </div>
          </div>
        )}

        {/* ============ MEDIA STORAGE ============ */}
        {activeTab === "media-storage" && (
          <div className="flex flex-col gap-xl">
            <SelectField
              label="Storage Driver"
              options={[
                { value: "local", label: "Local Storage" },
                { value: "s3", label: "Amazon S3" },
                { value: "cloudflare-r2", label: "Cloudflare R2" },
              ]}
              value={draftData["media-storage"].driver}
              onChange={(value) => updateTab("media-storage", { ...draftData["media-storage"], driver: value })}
            />

            {draftData["media-storage"].driver === "s3" && (
              <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
                <p className="col-span-2 text-label text-text-primary font-semibold">Amazon S3 Configuration</p>
                <InputField label="Bucket Name" value={draftData["media-storage"].s3_bucket} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], s3_bucket: v })} />
                <InputField label="Region" value={draftData["media-storage"].s3_region} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], s3_region: v })} />
                <InputField label="Access Key" value={draftData["media-storage"].s3_key} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], s3_key: v })} />
                <MaskedKeyField label="Secret Key" value={draftData["media-storage"].s3_secret} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], s3_secret: v })} />
                <div className="col-span-2">
                  <InputField label="Custom Endpoint (optional)" value={draftData["media-storage"].s3_endpoint} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], s3_endpoint: v })} />
                </div>
              </div>
            )}

            {draftData["media-storage"].driver === "cloudflare-r2" && (
              <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
                <p className="col-span-2 text-label text-text-primary font-semibold">Cloudflare R2 Configuration</p>
                <InputField label="Account ID" value={draftData["media-storage"].cloudflare_r2_account_id} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], cloudflare_r2_account_id: v })} />
                <InputField label="Bucket Name" value={draftData["media-storage"].cloudflare_r2_bucket} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], cloudflare_r2_bucket: v })} />
                <InputField label="Access Key" value={draftData["media-storage"].cloudflare_r2_access_key} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], cloudflare_r2_access_key: v })} />
                <MaskedKeyField label="Secret Key" value={draftData["media-storage"].cloudflare_r2_secret_key} onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], cloudflare_r2_secret_key: v })} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <InputField
                label="Max Upload Size (MB)"
                type="number"
                value={String(draftData["media-storage"].max_upload_size_mb)}
                onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], max_upload_size_mb: parseInt(v) || 10 })}
              />
              <InputField
                label="Image Compression Quality (10-100)"
                type="number"
                value={String(draftData["media-storage"].image_compression_quality)}
                onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], image_compression_quality: parseInt(v) || 85 })}
              />
              <SelectField
                label="Auto-generate Thumbnails"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={String(draftData["media-storage"].auto_generate_thumbnails)}
                onChange={(v) => updateTab("media-storage", { ...draftData["media-storage"], auto_generate_thumbnails: boolFromValue(v) })}
              />
            </div>
          </div>
        )}

        {/* ============ CACHE ============ */}
        {activeTab === "cache" && (
          <div className="flex flex-col gap-xl">
            <div className="bg-yellow-50 border border-yellow-200 rounded-corner-md p-lg">
              <p className="text-label text-yellow-700 font-semibold flex items-center gap-sm">
                <AlertTriangle size={16} /> Clear Cache Warning
              </p>
              <p className="text-label-sm text-yellow-600 mt-xs">
                Clearing cache may temporarily slow down the application as fresh data is fetched.
              </p>
            </div>

            <SelectField
              label="Cache Driver"
              options={[
                { value: "file", label: "File Cache" },
                { value: "redis", label: "Redis" },
                { value: "memcached", label: "Memcached" },
                { value: "array", label: "Array (No Cache)" },
              ]}
              value={draftData.cache.driver}
              onChange={(value) => updateTab("cache", { ...draftData.cache, driver: value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <InputField
                label="Content TTL (minutes)"
                type="number"
                value={String(draftData.cache.content_ttl_minutes)}
                onChange={(v) => updateTab("cache", { ...draftData.cache, content_ttl_minutes: parseInt(v) || 15 })}
              />
              <InputField
                label="Pages TTL (minutes)"
                type="number"
                value={String(draftData.cache.pages_ttl_minutes)}
                onChange={(v) => updateTab("cache", { ...draftData.cache, pages_ttl_minutes: parseInt(v) || 60 })}
              />
              <InputField
                label="Queries TTL (minutes)"
                type="number"
                value={String(draftData.cache.queries_ttl_minutes)}
                onChange={(v) => updateTab("cache", { ...draftData.cache, queries_ttl_minutes: parseInt(v) || 5 })}
              />
              <InputField
                label="API TTL (minutes)"
                type="number"
                value={String(draftData.cache.api_ttl_minutes)}
                onChange={(v) => updateTab("cache", { ...draftData.cache, api_ttl_minutes: parseInt(v) || 15 })}
              />
            </div>

            <div className="flex flex-col gap-md">
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.cache.enable_api_cache}
                  onChange={(e) => updateTab("cache", { ...draftData.cache, enable_api_cache: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Enable API Cache</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.cache.cache_sitemap}
                  onChange={(e) => updateTab("cache", { ...draftData.cache, cache_sitemap: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Cache Sitemap</span>
              </label>
            </div>

            <div className="flex items-center gap-md flex-wrap">
              <Button
                variant="neutral"
                iconStart={isClearingCache ? undefined : <Trash2 size={14} />}
                onClick={() => clearCache("all")}
                disabled={isClearingCache}
              >
                {isClearingCache ? "Clearing..." : "Clear All Cache"}
              </Button>
              <Button
                variant="neutral"
                onClick={() => clearCache("settings")}
                disabled={isClearingCache}
              >
                Clear Settings Cache
              </Button>
              <Button
                variant="neutral"
                onClick={() => clearCache("content")}
                disabled={isClearingCache}
              >
                Clear Content Cache
              </Button>
            </div>
            {cacheResult === "success" && (
              <p className="text-label-sm text-green-600 flex items-center gap-xs">
                <Check size={14} /> Cache cleared successfully.
              </p>
            )}
            {cacheResult === "error" && (
              <p className="text-label-sm text-red-500">Failed to clear cache.</p>
            )}
          </div>
        )}

        {/* ============ BACKUPS ============ */}
        {activeTab === "backups" && (
          <div className="flex flex-col gap-xl">
            <div className="bg-blue-50 border border-blue-200 rounded-corner-md p-lg">
              <p className="text-label text-blue-700 font-semibold flex items-center gap-sm">
                <Database size={16} /> Backup Information
              </p>
              <p className="text-label-sm text-blue-600 mt-xs">
                {draftData.backups.last_backup_at 
                  ? `Last backup: ${new Date(draftData.backups.last_backup_at).toLocaleString()}`
                  : "No backups created yet."}
              </p>
            </div>

            <div className="flex items-center gap-md flex-wrap">
              <SelectField
                label="Auto Backup"
                options={[
                  { value: "false", label: "Disabled" },
                  { value: "true", label: "Enabled" },
                ]}
                value={String(draftData.backups.auto_backup_enabled)}
                onChange={(v) => updateTab("backups", { ...draftData.backups, auto_backup_enabled: boolFromValue(v) })}
              />
              <SelectField
                label="Backup Schedule"
                options={[
                  { value: "hourly", label: "Hourly" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
                value={draftData.backups.backup_schedule}
                onChange={(v) => updateTab("backups", { ...draftData.backups, backup_schedule: v })}
              />
              <InputField
                label="Backup Time"
                value={draftData.backups.backup_time}
                onChange={(v) => updateTab("backups", { ...draftData.backups, backup_time: v })}
              />
              <InputField
                label="Retention (days)"
                type="number"
                value={String(draftData.backups.retention_days)}
                onChange={(v) => updateTab("backups", { ...draftData.backups, retention_days: parseInt(v) || 30 })}
              />
            </div>

            <SelectField
              label="Backup Destination"
              options={[
                { value: "local", label: "Local Storage" },
                { value: "s3", label: "Amazon S3" },
                { value: "email", label: "Email" },
              ]}
              value={draftData.backups.backup_destination}
              onChange={(v) => updateTab("backups", { ...draftData.backups, backup_destination: v })}
            />

            <div className="flex flex-col gap-md">
              <p className="text-label text-text-primary font-semibold">Include in Backup:</p>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.backups.include_database}
                  onChange={(e) => updateTab("backups", { ...draftData.backups, include_database: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Database</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.backups.include_files}
                  onChange={(e) => updateTab("backups", { ...draftData.backups, include_files: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Uploaded Files</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftData.backups.include_settings}
                  onChange={(e) => updateTab("backups", { ...draftData.backups, include_settings: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-label-sm text-text-primary">Settings</span>
              </label>
            </div>

            <div className="flex items-center gap-md">
              <Button
                variant="primary"
                iconStart={isCreatingBackup ? undefined : <Database size={14} />}
                onClick={createBackup}
                disabled={isCreatingBackup}
              >
                {isCreatingBackup ? "Creating..." : "Create Backup Now"}
              </Button>
            </div>
            {backupResult === "success" && (
              <p className="text-label-sm text-green-600 flex items-center gap-xs">
                <Check size={14} /> Backup created successfully.
              </p>
            )}
          </div>
        )}

        {/* ============ WEBHOOKS ============ */}
        {activeTab === "webhooks" && (
          <div className="flex flex-col gap-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-text-primary font-semibold">Webhooks</p>
                <p className="text-video-title text-text-tertiary">Receive notifications when events occur.</p>
              </div>
              <SelectField
                label=""
                options={[
                  { value: "false", label: "Disabled" },
                  { value: "true", label: "Enabled" },
                ]}
                value={String(draftData.webhooks.enabled)}
                onChange={(v) => updateTab("webhooks", { ...draftData.webhooks, enabled: boolFromValue(v) })}
              />
            </div>

            <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
              <p className="text-label text-text-primary font-semibold mb-md flex items-center gap-sm">
                <Link2 size={16} /> Webhook URLs
              </p>
              <div className="flex flex-col gap-md">
                {webhookUrls.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-sm">
                    <InputField
                      placeholder="https://your-server.com/webhook"
                      value={entry.url}
                      onChange={(v) => updateWebhookUrl(entry.id, v)}
                      className="flex-1"
                    />
                    <Button variant="neutral" size="small" onClick={() => removeWebhookUrl(entry.id)}>
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                <Button variant="neutral" size="small" iconStart={<Plus size={14} />} onClick={addWebhookUrl}>
                  Add Webhook URL
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <MaskedKeyField
                label="Webhook Secret"
                value={draftData.webhooks.secret}
                onChange={(v) => updateTab("webhooks", { ...draftData.webhooks, secret: v })}
              />
              <InputField
                label="Retry Count"
                type="number"
                value={String(draftData.webhooks.retry_count)}
                onChange={(v) => updateTab("webhooks", { ...draftData.webhooks, retry_count: parseInt(v) || 3 })}
              />
              <InputField
                label="Retry Delay (seconds)"
                type="number"
                value={String(draftData.webhooks.retry_delay_seconds)}
                onChange={(v) => updateTab("webhooks", { ...draftData.webhooks, retry_delay_seconds: parseInt(v) || 60 })}
              />
            </div>

            <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
              <p className="text-label text-text-primary font-semibold mb-md">Events to Send</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {Object.entries(draftData.webhooks.events).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateTab("webhooks", { 
                        ...draftData.webhooks, 
                        events: { ...draftData.webhooks.events, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 rounded border-border-primary"
                    />
                    <span className="text-label-sm text-text-primary capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ USER MANAGEMENT ============ */}
        {activeTab === "user-management" && (
          <UsersManagementSection />
        )}

        {/* ============ SITE CTAs (Frontend Only) ============ */}
        {activeTab === "site-ctas" && (
          <div className="flex flex-col gap-lg">
            <p className="text-label-sm text-text-secondary">
              Configure the default call-to-action button shown on each page type.
            </p>
            <div className="grid grid-cols-[9rem_1fr_12rem] gap-lg px-lg text-label-sm text-text-tertiary font-medium">
              <span>Page Type</span>
              <span>Button Text</span>
              <span>URL</span>
            </div>
            {draftData['site-ctas'].map((cta, idx) => (
              <div key={idx} className="grid grid-cols-[9rem_1fr_12rem] items-center gap-lg bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
                <p className="text-label-sm text-text-primary font-semibold">{cta.pageType}</p>
                <InputField
                  placeholder="CTA button text"
                  value={cta.text}
                  onChange={(v) => updateTab('site-ctas', draftData['site-ctas'].map((c, i) => i === idx ? { ...c, text: v } : c))}
                />
                <InputField
                  placeholder="/contact"
                  value={cta.url}
                  onChange={(v) => updateTab('site-ctas', draftData['site-ctas'].map((c, i) => i === idx ? { ...c, url: v } : c))}
                />
              </div>
            ))}
            {/* Save button is now at the bottom of the page */}
            {/* <div className="flex justify-end">
              <Button
                variant="primary"
                iconStart={<Check size={14} />}
                onClick={() => { setSuccessText("CTA settings saved."); }}
              >
                Save CTAs
              </Button>
            </div> */}
          </div>
        )}

        {/* ============ ANALYTICS (Frontend Only) ============ */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-lg">
            <p className="text-label-sm text-text-secondary">
              Configure analytics and tracking integrations. IDs are injected into the frontend automatically.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <p className="text-label text-text-primary font-semibold mb-md">Google Analytics</p>
                <InputField
                  label="Measurement ID (GA4)"
                  placeholder="G-XXXXXXXXXX"
                  value={draftData.analytics.googleAnalyticsId}
                  onChange={(v) => updateTab('analytics', { ...draftData.analytics, googleAnalyticsId: v })}
                />
              </div>
              <div>
                <p className="text-label text-text-primary font-semibold mb-md">Google Tag Manager</p>
                <InputField
                  label="GTM Container ID"
                  placeholder="GTM-XXXXXXX"
                  value={draftData.analytics.googleTagManagerId}
                  onChange={(v) => updateTab('analytics', { ...draftData.analytics, googleTagManagerId: v })}
                />
              </div>
              <div>
                <p className="text-label text-text-primary font-semibold mb-md">Plausible Analytics</p>
                <InputField
                  label="Domain"
                  placeholder="webndevs.com"
                  value={draftData.analytics.plausibleDomain}
                  onChange={(v) => updateTab('analytics', { ...draftData.analytics, plausibleDomain: v })}
                />
              </div>
              <div>
                <p className="text-label text-text-primary font-semibold mb-md">Hotjar</p>
                <InputField
                  label="Hotjar Site ID"
                  placeholder="1234567"
                  value={draftData.analytics.hotjarId}
                  onChange={(v) => updateTab('analytics', { ...draftData.analytics, hotjarId: v })}
                />
              </div>
              <div>
                <p className="text-label text-text-primary font-semibold mb-md">Meta / Facebook</p>
                <MaskedKeyField
                  label="Facebook Pixel ID"
                  value={draftData.analytics.facebookPixelId}
                  onChange={(v) => updateTab('analytics', { ...draftData.analytics, facebookPixelId: v })}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============ SEEDER (Frontend Only) ============ */}
        {activeTab === "seeder" && (
          <div className="flex flex-col gap-lg">
            <div className="bg-yellow-50 border border-yellow-200 rounded-corner-md p-lg">
              <p className="text-label text-yellow-700 font-semibold">Use with caution</p>
              <p className="text-label-sm text-yellow-600 mt-xs">
                The seeder creates a default admin user. Only run this on a fresh installation.
              </p>
            </div>

            <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg flex flex-col gap-lg">
              <p className="text-label text-text-primary font-semibold flex items-center gap-sm">
                <Database size={16} /> Create Default Admin User
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <InputField
                  label="Full Name"
                  placeholder="Admin User"
                  value={seederForm.name}
                  onChange={(v) => setSeederForm((f) => ({ ...f, name: v }))}
                />
                <InputField
                  label="Email Address"
                  placeholder="admin@webndevs.com"
                  value={seederForm.email}
                  onChange={(v) => setSeederForm((f) => ({ ...f, email: v }))}
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={seederForm.password}
                  onChange={(v) => setSeederForm((f) => ({ ...f, password: v }))}
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={seederForm.passwordConfirm}
                  onChange={(v) => setSeederForm((f) => ({ ...f, passwordConfirm: v }))}
                />
              </div>
              {seederForm.password && seederForm.passwordConfirm && seederForm.password !== seederForm.passwordConfirm && (
                <p className="text-label-sm text-red-500">Passwords do not match.</p>
              )}
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  iconStart={isSeeding ? undefined : <Database size={14} />}
                  onClick={runSeeder}
                  disabled={isSeeding || !seederForm.email || !seederForm.password || seederForm.password !== seederForm.passwordConfirm}
                >
                  {isSeeding ? "Creating user..." : "Seed Admin User"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============ AUDIT LOGS ============ */}
        {activeTab === "audit-logs" && (
          <div className="flex flex-col gap-lg">
            <div className="flex items-center justify-between">
              <p className="text-label text-text-primary font-semibold">Recent Settings Changes</p>
              <Button variant="neutral" size="small" iconStart={<RefreshCw size={14} />} onClick={fetchAuditLogs}>
                Refresh
              </Button>
            </div>
            
            {auditLogs.length === 0 ? (
              <div className="text-center py-xl">
                <p className="text-label text-text-tertiary">No settings changes recorded yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-sm">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-md p-md bg-bg-faint rounded-corner-md">
                    <div className="flex-1">
                      <p className="text-label-sm text-text-primary font-medium">
                        {log.tab_key.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-video-title text-text-tertiary">
                        {log.action} by {log.editor_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-label-sm text-text-tertiary">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-video-title text-text-tertiary">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ SAVE/CANCEL ACTIONS ============ */}
        {["general", "smtp", "api-keys", "email-templates", "security", "ai-settings", "media-storage", "cache", "backups", "webhooks", "user-management", "site-ctas", "analytics"].includes(activeTab) && (
          <div className="flex items-center justify-between pt-md border-t border-border-primary flex-wrap gap-md">
            <Button
              variant="neutral"
              size="small"
              iconStart={<RefreshCw size={14} />}
              onClick={resetTabToDefaults}
            >
              Reset to Defaults
            </Button>
            <div className="flex items-center gap-sm">
              <Button 
                variant="neutral" 
                onClick={cancelCurrentTab} 
                disabled={!hasChanges || savingTab !== null}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={saveCurrentTab} 
                disabled={!hasChanges || savingTab !== null}
                iconStart={savingTab === activeTab ? undefined : <Check size={14} />}
              >
                {savingTab === activeTab ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}