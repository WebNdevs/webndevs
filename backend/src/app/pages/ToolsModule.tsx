import { useState, useEffect } from "react";
import {
  Button,
  Badge,
  InputField,
  TextareaField,
  SelectField,
  Modal,
  Tabs,
} from "@figma/astraui";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Globe,
  Star,
  Sparkles,
  Package,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { AiAssistant, AiFieldHelper, SparkleButton, useFieldSchema } from "../components/ai";

type ToolCategory = {
  id: number;
  name: string;
  slug: string;
};

type Tool = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  overview: string | null;
  tool_category_id: number;
  category: ToolCategory | null;
  website_url: string | null;
  docs_url: string | null;
  is_featured: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
};

const statusColors: Record<Tool["status"], "success" | "default" | "warning"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

type FormData = {
  name: string;
  slug: string;
  logo_url: string;
  overview: string;
  tool_category_id: string;
  website_url: string;
  docs_url: string;
  is_featured: boolean;
  sort_order: string;
  status: Tool["status"];
  aiPrompt: string;
};
function normalizeList<T>(response: T[] | Paginated<T> | undefined | null): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}


const emptyForm: FormData = {
  name: "",
  slug: "",
  logo_url: "",
  overview: "",
  tool_category_id: "",
  website_url: "",
  docs_url: "",
  is_featured: false,
  sort_order: "0",
  status: "draft",
  aiPrompt: "",
};

function AiContentPanel({ name, onApply }: { name: string; onApply: (content: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  const handleGenerate = async () => {
    if (!name) return;
    setIsGenerating(true);
    setGenerated("");

    try {
      const token = localStorage.getItem("auth_token") ?? "";
      const response = await fetch("/api/v1/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          entity_type: "tool",
          entity_id: 0,
          section_key: "overview",
          prompt_template: "entity_overview",
          entity_name: name,
          prompt: `Write a comprehensive overview for ${name} as an integration tool. Include: what it does, key features (4-6 points), who uses it, and why an agency would implement it. Be specific and practical. 150-200 words.`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGenerated(result.content || "");
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-bg-faint border border-border-secondary rounded-corner-md overflow-hidden">
      <button
        type="button"
        onClick={() => setShowPanel(!showPanel)}
        className="w-full flex items-center justify-between px-lg py-md bg-bg-subtle hover:bg-bg-faint transition-colors"
      >
        <div className="flex items-center gap-sm">
          <Sparkles size={16} className="text-brand-primary" />
          <p className="text-label text-text-primary font-semibold">AI Content Helper</p>
        </div>
        <span className="text-label-sm text-text-tertiary">{showPanel ? "Hide" : "Show"}</span>
      </button>

      {showPanel && (
        <div className="p-lg space-y-md">
          <p className="text-label-sm text-text-secondary">
            Let AI help you write content for this tool. Enter a name first, then generate suggestions.
          </p>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!name || isGenerating}
              className="inline-flex items-center gap-xs px-md py-sm rounded-corner-sm bg-brand-primary text-white text-label-sm hover:bg-brand-hover disabled:opacity-50 transition-colors"
            >
              <Sparkles size={14} />
              {isGenerating ? "Generating..." : "Generate Overview"}
            </button>
          </div>

          {generated && (
            <div className="bg-surface-bg border border-border-primary rounded-corner-md p-md">
              <p className="text-label-sm text-text-secondary mb-sm">AI Suggestion:</p>
              <p className="text-label-sm text-text-primary whitespace-pre-wrap mb-md">{generated}</p>
              <div className="flex items-center gap-sm">
                <button
                  type="button"
                  onClick={() => { setGenerated(""); }}
                  className="text-label-sm text-text-secondary hover:text-text-primary"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => { onApply(generated); setGenerated(""); }}
                  className="px-sm py-xs rounded-corner-sm bg-brand-primary text-white text-label-sm"
                >
                  Use This
                </button>
              </div>
            </div>
          )}

          {/* Quick prompts for specific fields */}
          <div className="border-t border-border-secondary pt-md">
            <p className="text-label-sm text-text-tertiary mb-sm">Quick help for specific fields:</p>
            <div className="flex flex-wrap gap-xs">
              <span className="text-video-title text-text-tertiary">Type in field name + "AI help" to generate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toolToForm(t: Tool): FormData {
  return {
    name: t.name,
    slug: t.slug,
    logo_url: t.logo_url ?? "",
    overview: t.overview ?? "",
    tool_category_id: t.tool_category_id.toString(),
    website_url: t.website_url ?? "",
    docs_url: t.docs_url ?? "",
    is_featured: t.is_featured,
    sort_order: t.sort_order.toString(),
    status: t.status,
    aiPrompt: "",
  };
}

function AiGeneratePanel({
  toolName,
  onGenerate,
}: {
  toolName: string;
  onGenerate: (content: string) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    if (!toolName) return;
    setIsGenerating(true);
    setGenerated("");
    setTimeout(() => {
      const content = `${toolName} is a powerful platform that enables businesses to streamline their operations and drive growth. With enterprise-grade reliability and developer-friendly APIs, ${toolName} helps teams integrate seamlessly into existing workflows. Whether you're a startup or an enterprise, ${toolName} scales with your needs.`;
      setGenerated(content);
      setIsGenerating(false);
    }, 1800);
  };

  return (
    <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-sm">
          <Sparkles size={16} className="text-brand-primary" />
          <p className="text-label text-text-primary font-semibold">AI Generate Description</p>
        </div>
        <Button
          variant="primary"
          size="small"
          iconStart={<Sparkles size={14} />}
          onClick={handleGenerate}
          disabled={!toolName || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
      {isGenerating && (
        <div className="flex items-center gap-sm text-text-secondary">
          <div className="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <span className="text-label-sm">Writing with AI...</span>
        </div>
      )}
      {generated && (
        <div className="mt-sm">
          <p className="text-label-sm text-text-secondary bg-surface-bg border border-border-primary rounded-corner-md p-md">
            {generated}
          </p>
          <div className="flex gap-sm mt-sm">
            <Button variant="primary" size="small" onClick={() => onGenerate(generated)}>Use This</Button>
            <Button variant="neutral" size="small" onClick={handleGenerate}>Regenerate</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolRow({
  tool,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  tool: Tool;
  onEdit: (t: Tool) => void;
  onDelete: (slug: string) => void;
  onToggleFeatured: (tool: Tool) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(tool)}
    >
      <div className="flex items-center gap-xl">
        <div className="w-12 h-12 rounded-corner-md bg-bg-subtle flex items-center justify-center flex-shrink-0 overflow-hidden">
          {tool.logo_url ? (
            <img
              src={tool.logo_url}
              alt={tool.name}
              className="w-10 h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <Package size={24} className="text-text-tertiary" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-sm">
            <h3 className="text-label text-text-primary font-semibold">{tool.name}</h3>
            {tool.is_featured && (
              <span className="bg-yellow-100 text-yellow-700 text-video-title px-sm py-xs rounded-corner-md border border-yellow-200">
                ⭐ Featured
              </span>
            )}
            <Badge label={tool.status} variant={statusColors[tool.status]} />
            {tool.category && (
              <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">
                {tool.category.name}
              </span>
            )}
          </div>
          <p className="text-video-title text-text-tertiary mt-xs">/{tool.slug}</p>
          {tool.overview && <p className="text-label-sm text-text-secondary mt-xs">{tool.overview}</p>}
        </div>

        <div className="flex items-center gap-sm flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="subtle"
            size="small"
            iconStart={<Star size={14} />}
            onClick={() => onToggleFeatured(tool)}
          >
            {tool.is_featured ? "Unfeature" : "Feature"}
          </Button>
          {tool.website_url && (
            <Button
              variant="subtle"
              size="small"
              iconStart={<Globe size={14} />}
              onClick={() => window.open(tool.website_url!, "_blank")}
            >
              Website
            </Button>
          )}
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(tool)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(tool.slug)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function ToolsModule() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ToolCategory[] | Paginated<ToolCategory>>("/tool-categories"),
      api.get<Tool[] | Paginated<Tool>>("/tools?per_page=100"),
    ])
      .then(([catRes, toolRes]) => {
        setCategories(normalizeList<ToolCategory>(catRes));
        setTools(normalizeList<Tool>(toolRes));
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateForm = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingTool(null);
    setFormData({
      ...emptyForm,
      tool_category_id: categories[0]?.id.toString() ?? "",
    });
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData(toolToForm(tool));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    try {
      await api.del(`/tools/${slug}`);
      setTools((prev) => prev.filter((t) => t.slug !== slug));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleToggleFeatured = async (tool: Tool) => {
    try {
      const updated = await api.put<Tool>(`/tools/${tool.slug}`, {
        is_featured: !tool.is_featured,
      });
      setTools((prev) => prev.map((t) => t.id === tool.id ? updated : t));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async (status: Tool["status"]) => {
    const payload = {
      name: formData.name,
      slug: formData.slug,
      tool_category_id: parseInt(formData.tool_category_id),
      logo_url: formData.logo_url || undefined,
      overview: formData.overview || undefined,
      website_url: formData.website_url || undefined,
      docs_url: formData.docs_url || undefined,
      is_featured: formData.is_featured,
      sort_order: parseInt(formData.sort_order) || 0,
      status,
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingTool) {
        const updated = await api.put<Tool>(`/tools/${editingTool.slug}`, payload);
        setTools((prev) => prev.map((t) => t.id === editingTool.id ? updated : t));
      } else {
        const created = await api.post<Tool>("/tools", payload);
        setTools((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const makeTabContent = (statusFilter: string) => {
    const filtered = tools.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase());
      const matchCat = !filterCategory || t.tool_category_id.toString() === filterCategory;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((tool) => (
          <ToolRow
            key={tool.id}
            tool={tool}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No tools found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Tools Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage integration tools, CRMs, automation platforms, and more.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>Add Tool</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Tools", value: tools.length },
          { label: "Published", value: tools.filter((t) => t.status === "published").length },
          { label: "Featured", value: tools.filter((t) => t.is_featured).length },
          { label: "Drafts", value: tools.filter((t) => t.status === "draft").length },
          { label: "Categories", value: categories.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl flex gap-xl items-center">
        <div className="flex-1">
          <InputField prefix={<Search size={16} />} placeholder="Search tools..." value={search} onChange={setSearch} />
        </div>
        <SelectField
          label=""
          placeholder="All Categories"
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
          ]}
          value={filterCategory}
          onChange={setFilterCategory}
          className="w-[200px]"
        />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading tools...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Tools", content: makeTabContent("") },
            { id: "published", label: "Published", content: makeTabContent("published") },
            { id: "draft", label: "Drafts", content: makeTabContent("draft") },
            { id: "archived", label: "Archived", content: makeTabContent("archived") },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTool ? `Edit Tool — ${editingTool.name}` : "Add New Tool"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => void handleSave("draft")} disabled={isSaving}>Save Draft</Button>
            <Button variant="primary" onClick={() => void handleSave("published")} disabled={isSaving}>
              {isSaving ? "Saving..." : editingTool ? "Update Tool" : "Publish Tool"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          {formData.name && (
            <div className="flex justify-end">
              <SparkleButton
                context={{
                  entityName: formData.name,
                  entityType: "tool",
                  fields: [
                    { key: "name", label: "Tool Name", type: "text", value: formData.name },
                    { key: "slug", label: "URL Slug", type: "slug", value: formData.slug },
                    { key: "overview", label: "Overview", type: "textarea", value: formData.overview },
                    { key: "website_url", label: "Website URL", type: "url", value: formData.website_url },
                    { key: "docs_url", label: "Docs URL", type: "url", value: formData.docs_url },
                  ],
                }}
                onApplyField={(fieldKey, value) => updateForm(fieldKey as keyof FormData, value)}
              />
            </div>
          )}
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-corner-md p-md">
              <p className="text-label-sm text-red-600">{saveError}</p>
            </div>
          )}
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Tool Name"
                placeholder="e.g. Twilio"
                value={formData.name}
                onChange={(v) => {
                  updateForm("name", v);
                  if (!editingTool) {
                    updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="twilio" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Category *"
                options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
                value={formData.tool_category_id}
                onChange={(v) => updateForm("tool_category_id", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as Tool["status"])}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Sort Order"
                type="number"
                placeholder="0"
                value={formData.sort_order}
                onChange={(v) => updateForm("sort_order", v)}
              />
            </div>
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField label="Website URL" placeholder="https://example.com" value={formData.website_url} onChange={(v) => updateForm("website_url", v)} />
            </div>
            <div className="flex-1">
              <InputField label="Docs URL" placeholder="https://docs.example.com" value={formData.docs_url} onChange={(v) => updateForm("docs_url", v)} />
            </div>
          </div>

          <InputField
            label="Logo URL"
            placeholder="https://logo.clearbit.com/example.com"
            value={formData.logo_url}
            onChange={(v) => updateForm("logo_url", v)}
          />

          <TextareaField
            label="Overview"
            placeholder="Brief description of the tool..."
            value={formData.overview}
            rows={3}
            onChange={(v) => updateForm("overview", v)}
          />

          <AiContentPanel
            name={formData.name}
            onApply={(content) => updateForm("overview", content)}
          />

          <div className="flex items-center gap-md">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => updateForm("is_featured", e.target.checked)}
              className="w-4 h-4 accent-brand-primary"
            />
            <label htmlFor="is_featured" className="text-label text-text-primary cursor-pointer">
              Mark as Featured Tool
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
