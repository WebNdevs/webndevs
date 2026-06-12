import { useState, useEffect } from "react";
import {
  Button,
  InputField,
  TextareaField,
  SelectField,
  Tabs,
} from "@figma/astraui";
import {
  Search,
  Pencil,
  Check,
  AlertCircle,
  Sparkles,
  Globe,
  Code,
  ExternalLink,
  Save,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { FloatingAiButton } from "../components/ai";

type SeoMetadata = {
  id: number;
  entity_type: string;
  entity_id: number;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: string | null;
  canonical_url: string | null;
  schema_type: string | null;
  robots_directive: string | null;
  focus_keyword: string | null;
  secondary_keywords: string[] | null;
  seo_score: number | null;
};

const schemaTypes = [
  "Organization", "WebSite", "Article", "Service", "FAQPage",
  "HowTo", "SoftwareApplication", "ItemList", "BreadcrumbList", "Product",
];

const robotsOptions = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
];

function calcCompleteness(entry: Partial<SeoMetadata>): number {
  const fields = [
    entry.meta_title, entry.meta_description, entry.og_title,
    entry.og_description, entry.og_image_url, entry.focus_keyword, entry.canonical_url,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function completenessColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-500";
}

function completenessBar(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

type SeoForm = {
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  twitter_card: string;
  canonical_url: string;
  schema_type: string;
  robots_directive: string;
  focus_keyword: string;
  secondary_keywords_text: string;
};

function entryToForm(entry: SeoMetadata): SeoForm {
  return {
    meta_title: entry.meta_title ?? "",
    meta_description: entry.meta_description ?? "",
    og_title: entry.og_title ?? "",
    og_description: entry.og_description ?? "",
    og_image_url: entry.og_image_url ?? "",
    twitter_card: entry.twitter_card ?? "summary_large_image",
    canonical_url: entry.canonical_url ?? "",
    schema_type: entry.schema_type ?? "Article",
    robots_directive: entry.robots_directive ?? "index, follow",
    focus_keyword: entry.focus_keyword ?? "",
    secondary_keywords_text: (entry.secondary_keywords ?? []).join(", "),
  };
}

function SeoEditor({ entry, onSave, onBack }: {
  entry: SeoMetadata;
  onSave: (updated: SeoMetadata) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<SeoForm>(entryToForm(entry));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (key: keyof SeoForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const completeness = calcCompleteness({
    meta_title: form.meta_title || null,
    meta_description: form.meta_description || null,
    og_title: form.og_title || null,
    og_description: form.og_description || null,
    og_image_url: form.og_image_url || null,
    focus_keyword: form.focus_keyword || null,
    canonical_url: form.canonical_url || null,
  });

  const generateMeta = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        meta_title: `${entry.entity_type} — Integration Services | WebNDevs`,
        meta_description: `Explore how WebNDevs implements solutions for businesses. Expert integration, automation, and custom development services.`,
        og_title: `${entry.entity_type} — WebNDevs Agency`,
        og_description: `Build better with our solutions. Our experts deliver production-ready integrations fast.`,
      }));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = {
        meta_title: form.meta_title || undefined,
        meta_description: form.meta_description || undefined,
        og_title: form.og_title || undefined,
        og_description: form.og_description || undefined,
        og_image_url: form.og_image_url || undefined,
        twitter_card: form.twitter_card || undefined,
        canonical_url: form.canonical_url || undefined,
        schema_type: form.schema_type || undefined,
        robots_directive: form.robots_directive || undefined,
        focus_keyword: form.focus_keyword || undefined,
        secondary_keywords: form.secondary_keywords_text
          ? form.secondary_keywords_text.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        seo_score: completeness,
      };
      const updated = await api.put<SeoMetadata>(`/seo-metadata/${entry.id}`, payload);
      onSave(updated);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const titleLen = form.meta_title.length;
  const descLen = form.meta_description.length;

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-sm mb-lg">
        <Button variant="neutral" size="small" onClick={onBack}>← Back to List</Button>
        <span className="text-label text-text-primary font-semibold">{entry.entity_type} #{entry.entity_id}</span>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-corner-md p-md">
          <p className="text-label-sm text-red-600">{saveError}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className={`text-title font-bold ${completenessColor(completeness)}`}>{completeness}%</span>
          <span className="text-label-sm text-text-secondary">SEO Completeness</span>
        </div>
        <div className="flex items-center gap-sm">
          <FloatingAiButton onGenerate={generateMeta} isLoading={isGenerating} />
          <Button variant="primary" size="small" iconStart={<Save size={14} />} onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save SEO"}
          </Button>
        </div>
      </div>

      <div className="w-full bg-bg-subtle rounded-full h-2">
        <div className={`${completenessBar(completeness)} h-2 rounded-full transition-all`} style={{ width: `${completeness}%` }} />
      </div>

      <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
        <p className="text-video-title text-text-tertiary mb-sm font-semibold">Google Snippet Preview</p>
        <div className="flex flex-col gap-xs">
          <p className="text-blue-600 text-label font-medium truncate">{form.meta_title || "Page Title"}</p>
          <p className="text-video-title text-green-700">{form.canonical_url || `/${entry.entity_type.toLowerCase()}/${entry.entity_id}`}</p>
          <p className="text-label-sm text-text-secondary line-clamp-2">{form.meta_description || "Meta description will appear here..."}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg">
        <div>
          <div className="flex justify-between mb-xs">
            <label className="text-label-sm text-text-primary font-semibold">Meta Title</label>
            <span className={`text-video-title ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-yellow-600" : "text-green-600"}`}>
              {titleLen}/60
            </span>
          </div>
          <InputField placeholder="SEO-optimized page title" value={form.meta_title} onChange={(v) => update("meta_title", v)} />
        </div>
        <div>
          <InputField label="Focus Keyword" placeholder="e.g. Twilio integration" value={form.focus_keyword} onChange={(v) => update("focus_keyword", v)} />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-xs">
          <label className="text-label-sm text-text-primary font-semibold">Meta Description</label>
          <span className={`text-video-title ${descLen > 160 ? "text-red-500" : descLen > 140 ? "text-yellow-600" : "text-green-600"}`}>
            {descLen}/160
          </span>
        </div>
        <TextareaField placeholder="Compelling meta description (140-160 chars)" value={form.meta_description} rows={2} onChange={(v) => update("meta_description", v)} />
      </div>

      <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg flex flex-col gap-lg">
        <p className="text-label text-text-primary font-semibold flex items-center gap-sm">
          <Globe size={16} /> Open Graph (Social Sharing)
        </p>
        <div className="grid grid-cols-2 gap-lg">
          <InputField label="OG Title" placeholder="Title for social sharing" value={form.og_title} onChange={(v) => update("og_title", v)} />
          <SelectField
            label="Twitter Card"
            options={[
              { value: "summary", label: "Summary" },
              { value: "summary_large_image", label: "Summary Large Image" },
            ]}
            value={form.twitter_card}
            onChange={(v) => update("twitter_card", v)}
          />
        </div>
        <TextareaField label="OG Description" placeholder="Description for social sharing" value={form.og_description} rows={2} onChange={(v) => update("og_description", v)} />
        <div className="flex gap-lg items-end">
          <div className="flex-1">
            <InputField label="OG Image URL" placeholder="https://example.com/og-image.jpg" value={form.og_image_url} onChange={(v) => update("og_image_url", v)} />
          </div>
          {form.og_image_url && (
            <div className="w-24 h-16 rounded-corner-md overflow-hidden border border-border-primary bg-bg-subtle flex-shrink-0">
              <img src={form.og_image_url} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg">
        <div>
          <InputField
            label="Canonical URL"
            prefix={<ExternalLink size={14} />}
            placeholder="https://webndevs.com/tools/twilio"
            value={form.canonical_url}
            onChange={(v) => update("canonical_url", v)}
          />
        </div>
        <div>
          <SelectField
            label="Schema.org Type"
            options={schemaTypes.map((s) => ({ value: s, label: s }))}
            value={form.schema_type}
            onChange={(v) => update("schema_type", v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-lg">
        <div>
          <SelectField
            label="Robots Directive"
            options={robotsOptions.map((r) => ({ value: r, label: r }))}
            value={form.robots_directive}
            onChange={(v) => update("robots_directive", v)}
          />
        </div>
        <div>
          <InputField
            label="Secondary Keywords (comma-separated)"
            placeholder="Twilio SMS, Twilio API"
            value={form.secondary_keywords_text}
            onChange={(v) => update("secondary_keywords_text", v)}
          />
        </div>
      </div>
    </div>
  );
}

function SeoListTab({ entries, onSelect }: { entries: SeoMetadata[]; onSelect: (e: SeoMetadata) => void }) {
  const [search, setSearch] = useState("");

  const filtered = entries.filter((e) =>
    e.entity_type.toLowerCase().includes(search.toLowerCase()) ||
    e.entity_id.toString().includes(search)
  );

  return (
    <div className="flex flex-col gap-lg">
      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search by entity type..." value={search} onChange={setSearch} />
      </div>
      {filtered.map((entry) => {
        const completeness = calcCompleteness({
          meta_title: entry.meta_title,
          meta_description: entry.meta_description,
          og_title: entry.og_title,
          og_description: entry.og_description,
          og_image_url: entry.og_image_url,
          focus_keyword: entry.focus_keyword,
          canonical_url: entry.canonical_url,
        });
        return (
          <div
            key={entry.id}
            className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
            onClick={() => onSelect(entry)}
          >
            <div className="flex items-center gap-xl">
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-xs">
                  <span className="text-label text-text-primary font-semibold">#{entry.entity_id}</span>
                  <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">{entry.entity_type}</span>
                  {completeness === 100 ? (
                    <span className="flex items-center gap-xs text-green-600 text-video-title"><Check size={12} /> Complete</span>
                  ) : completeness === 0 ? (
                    <span className="flex items-center gap-xs text-red-500 text-video-title"><AlertCircle size={12} /> Missing</span>
                  ) : null}
                </div>
                {entry.focus_keyword && (
                  <p className="text-video-title text-text-secondary">Focus: <span className="font-semibold">{entry.focus_keyword}</span></p>
                )}
                {entry.meta_title && (
                  <p className="text-label-sm text-text-secondary mt-xs truncate">{entry.meta_title}</p>
                )}
              </div>
              <div className="flex items-center gap-lg flex-shrink-0">
                <div className="flex flex-col items-center">
                  <span className={`text-title font-bold ${completenessColor(completeness)}`}>{completeness}%</span>
                  <div className="w-20 bg-bg-subtle rounded-full h-1.5 mt-xs">
                    <div className={`${completenessBar(completeness)} h-1.5 rounded-full`} style={{ width: `${completeness}%` }} />
                  </div>
                </div>
                <Button variant="subtle" size="small" iconStart={<Pencil size={14} />}>Edit SEO</Button>
              </div>
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">No SEO metadata entries found.</p>
        </div>
      )}
    </div>
  );
}

function RobotsTxtTab() {
  const [content, setContent] = useState(`User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://webndevs.com/sitemap.xml
Sitemap: https://webndevs.com/sitemap-tools.xml
Sitemap: https://webndevs.com/sitemap-industries.xml`);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary font-semibold">robots.txt Editor</p>
          <p className="text-label-sm text-text-secondary">Controls how search engines crawl your site.</p>
        </div>
        <Button variant="primary" iconStart={saved ? <Check size={14} /> : <Save size={14} />} onClick={save}>
          {saved ? "Saved!" : "Save robots.txt"}
        </Button>
      </div>
      <div className="bg-bg-faint border border-border-secondary rounded-corner-md overflow-hidden">
        <div className="bg-bg-subtle border-b border-border-secondary px-lg py-sm flex items-center gap-sm">
          <Code size={14} className="text-text-tertiary" />
          <span className="text-video-title text-text-tertiary font-mono">robots.txt</span>
        </div>
        <textarea
          className="w-full bg-transparent p-lg font-mono text-label-sm text-text-primary resize-none outline-none"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}

export function SeoModule() {
  const [entries, setEntries] = useState<SeoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<SeoMetadata | null>(null);

  useEffect(() => {
    api.get<Paginated<SeoMetadata>>("/seo-metadata?per_page=100")
      .then((res) => { setEntries(res.data); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = (updated: SeoMetadata) => {
    setEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
    setSelectedEntry(null);
  };

  if (isLoading) {
    return (
      <div className="p-2xl">
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading SEO metadata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2xl">
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const avgScore = entries.length
    ? Math.round(entries.reduce((a, e) => a + calcCompleteness({
        meta_title: e.meta_title,
        meta_description: e.meta_description,
        og_title: e.og_title,
        og_description: e.og_description,
        og_image_url: e.og_image_url,
        focus_keyword: e.focus_keyword,
        canonical_url: e.canonical_url,
      }), 0) / entries.length)
    : 0;

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div>
        <h1 className="text-title text-text-primary">SEO Manager</h1>
        <p className="text-label-sm text-text-secondary mt-xs">
          Manage meta tags, OG data, schema markup, sitemap, and robots.txt across all entities.
        </p>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Entries", value: entries.length, color: "text-text-primary" },
          { label: "Avg. Score", value: `${avgScore}%`, color: "text-brand-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className={`text-title font-bold ${s.color}`}>{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {selectedEntry ? (
        <SeoEditor entry={selectedEntry} onSave={handleSave} onBack={() => setSelectedEntry(null)} />
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Pages", content: <SeoListTab entries={entries} onSelect={setSelectedEntry} /> },
            { id: "robots", label: "Robots.txt", content: <RobotsTxtTab /> },
          ]}
          defaultTab="all"
        />
      )}
    </div>
  );
}