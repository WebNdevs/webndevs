import { useState } from "react";
import { useEffect } from "react";
import { api } from "../utils/api";
import {
  Button,
  Badge,
  InputField,
  TextareaField,
  SelectField,
  Modal,
} from "@figma/astraui";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Sparkles,
} from "lucide-react";

type EntityRef = {
  type: "tool" | "crm" | "automation" | "platform";
  id: string;
  name: string;
};

type FeatureRow = {
  id: string;
  featureName: string;
  values: Record<string, string>;
};

type ComparisonPage = {
  id: string;
  slug: string;
  title: string;
  entities: EntityRef[];
  features: FeatureRow[];
  verdictSummary: string;
  recommendation: string;
  status: "draft" | "published";
};

  function normalizeList<T>(response: T[] | { data?: T[] } | undefined | null): T[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  }

const entityPool: EntityRef[] = [
  { type: "automation", id: "zapier", name: "Zapier" },
  { type: "automation", id: "make", name: "Make" },
  { type: "automation", id: "n8n", name: "n8n" },
  { type: "crm", id: "zoho-crm", name: "Zoho CRM" },
  { type: "crm", id: "hubspot", name: "HubSpot" },
  { type: "crm", id: "salesforce", name: "Salesforce" },
  { type: "tool", id: "twilio", name: "Twilio" },
  { type: "tool", id: "vonage", name: "Vonage" },
  { type: "platform", id: "shopify", name: "Shopify" },
  { type: "platform", id: "woocommerce", name: "WooCommerce" },
  { type: "platform", id: "wix", name: "Wix" },
];

const statusColors: Record<ComparisonPage["status"], "success" | "warning"> = {
  published: "success",
  draft: "warning",
};

type FormData = {
  slug: string;
  title: string;
  entities: EntityRef[];
  features: FeatureRow[];
  verdictSummary: string;
  recommendation: string;
  status: ComparisonPage["status"];
};

const emptyForm: FormData = {
  slug: "", title: "", entities: [], features: [], verdictSummary: "", recommendation: "", status: "draft",
};

function pageToForm(p: any): FormData {
  return {
    slug: p.slug ?? "",
    title: p.title ?? "",
    entities: (p.entities ?? []).map((e: any) => ({
      type: e.entity_type ?? e.type ?? "tool",
      id: String(e.entity_id ?? e.id ?? e.name),
      name: e.tag ?? e.name ?? "",
    })),
    features: (p.features ?? []).map((f: any) => ({
      id: String(f.id ?? crypto.randomUUID()),
      featureName: f.feature_name ?? f.name ?? "",
      values: f.values ?? {},
    })),
    verdictSummary: p.quick_verdict ?? p.verdictSummary ?? "",
    recommendation: p.recommendation ?? "",
    status: p.status ?? "draft",
  };
}

function EntitySelector({ entities, onChange }: { entities: EntityRef[]; onChange: (e: EntityRef[]) => void }) {
  const available = entityPool.filter((e) => !entities.find((sel) => sel.id === e.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-sm">
        <p className="text-label text-text-primary font-semibold">Entities to Compare (2–4)</p>
        <span className="text-video-title text-text-tertiary">{entities.length}/4 selected</span>
      </div>
      <div className="flex flex-wrap gap-sm mb-md">
        {entities.map((e, i) => (
          <div key={e.id} className="flex items-center gap-xs bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-label-sm px-md py-sm rounded-corner-md">
            <span className="font-mono text-xs text-text-tertiary mr-xs">{i + 1}</span>
            {e.name}
            <button onClick={() => onChange(entities.filter((x) => x.id !== e.id))} className="hover:text-red-500 ml-xs"><X size={12} /></button>
          </div>
        ))}
        {entities.length === 0 && <p className="text-label-sm text-text-tertiary">No entities selected.</p>}
      </div>
      {entities.length < 4 && (
        <SelectField
          label=""
          placeholder="Add entity to compare..."
          options={available.map((e) => ({ value: e.id, label: `${e.name} (${e.type})` }))}
          value=""
          onChange={(id) => {
            const entity = entityPool.find((e) => e.id === id);
            if (entity) onChange([...entities, entity]);
          }}
        />
      )}
    </div>
  );
}

function FeatureMatrixEditor({ entities, features, onChange }: {
  entities: EntityRef[];
  features: FeatureRow[];
  onChange: (f: FeatureRow[]) => void;
}) {
  const addRow = () => {
    const newRow: FeatureRow = {
      id: `f${Date.now()}`,
      featureName: "",
      values: Object.fromEntries(entities.map((e) => [e.name, ""])),
    };
    onChange([...features, newRow]);
  };

  const updateCell = (rowId: string, entityId: string, value: string) => {
    onChange(features.map((f) => f.id === rowId ? { ...f, values: { ...f.values, [entityId]: value } } : f));
  };

  const updateName = (rowId: string, name: string) => {
    onChange(features.map((f) => f.id === rowId ? { ...f, featureName: name } : f));
  };

  const removeRow = (rowId: string) => onChange(features.filter((f) => f.id !== rowId));

  if (entities.length < 2) {
    return <p className="text-label-sm text-text-tertiary">Select at least 2 entities to build the feature matrix.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-sm">
        <p className="text-label text-text-primary font-semibold">Feature Matrix</p>
        <Button variant="neutral" size="small" iconStart={<Plus size={14} />} onClick={addRow}>Add Row</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-label-sm text-text-secondary p-sm border-b border-border-primary w-40">Feature</th>
              {entities.map((e) => (
                <th key={e.id} className="text-left text-label-sm text-text-primary p-sm border-b border-border-primary">{e.name}</th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {features.map((row) => (
              <tr key={row.id} className="border-b border-border-primary hover:bg-bg-faint">
                <td className="p-sm">
                  <InputField placeholder="Feature name" value={row.featureName} onChange={(v) => updateName(row.id, v)} />
                </td>
                {entities.map((e) => (
                  <td key={e.id} className="p-sm">
                    <InputField placeholder="✓ or value" value={row.values[e.name] ?? ""} onChange={(v) => updateCell(row.id, e.name, v)} />
                  </td>
                ))}
                <td className="p-sm">
                  <button onClick={() => removeRow(row.id)} className="text-text-tertiary hover:text-red-500"><X size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {features.length === 0 && (
          <p className="text-label-sm text-text-tertiary text-center py-lg">No features added. Click "Add Row" to start building the matrix.</p>
        )}
      </div>
    </div>
  );
}

function ComparisonRow({ page, onEdit, onDelete }: {
  page: ComparisonPage;
  onEdit: (p: ComparisonPage) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors">
      <div className="flex items-start gap-xl">
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-xs">
            <h3 className="text-label text-text-primary font-semibold">{page.title}</h3>
            <Badge label={page.status} variant={statusColors[page.status]} />
          </div>
          <p className="text-video-title text-text-tertiary mb-sm">/{page.slug}</p>
          <div className="flex flex-wrap gap-xs mb-sm">
            {page.entities.map((e) => (
              <span key={e.id} className="bg-bg-faint border border-border-secondary text-text-secondary text-video-title px-md py-xs rounded-corner-md">
                {e.name}
              </span>
            ))}
          </div>
          <p className="text-label-sm text-text-secondary">{page.verdictSummary}</p>
          <p className="text-video-title text-text-tertiary mt-xs">{page.features.length} features in matrix</p>
        </div>
        <div className="flex items-center gap-sm flex-shrink-0">
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(page)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(page.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function ComparisonModule() {
  const [pages, setPages] = useState<ComparisonPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ComparisonPage | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);

    api.get<any>("/comparison-pages")
      .then((res) => {
        setPages(normalizeList<ComparisonPage>(res));
      })
      .catch((err) => {
        console.error("Failed to load comparisons", err);
        setPages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateForm = (key: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingPage(null);
    setFormData(emptyForm);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: ComparisonPage) => {
    setEditingPage(p);
    setFormData(pageToForm(p));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comparison? This cannot be undone.")) return;

    try {
      await api.del(`/comparison-pages/${id}`);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };
  const handleEntityChange = (entities: EntityRef[]) => {
    const newFeatures = formData.features.map((f) => {
      const newValues: Record<string, string> = {};
      entities.forEach((e) => { newValues[e.name] = f.values[e.name] ?? ""; });
      return { ...f, values: newValues };
    });
    updateForm("entities", entities);
    updateForm("features", newFeatures);
    if (entities.length >= 2 && !editingPage) {
      const names = entities.map((e) => e.name).join(" vs ");
      updateForm("title", names);
      updateForm("slug", entities.map((e) => e.id).join("-vs-"));
    }
  };

  const generateVerdict = () => {
    if (formData.entities.length < 2) return;
    setIsGenerating(true);
    setTimeout(() => {
      const names = formData.entities.map((e) => e.name).join(", ");
      updateForm("verdictSummary", `After analyzing ${names} across ${formData.features.length} key features, each platform shows distinct strengths. The best choice depends on your team size, budget, and technical requirements. Consider your primary use case before making a decision.`);
      updateForm("recommendation", `For small teams: choose the most affordable option. For scale: prioritize integration depth and automation capabilities. Enterprise users should evaluate support and SLA guarantees.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async (status: ComparisonPage["status"]) => {
    setSaveError(null);

    const validFeatures = formData.features.filter((feature) =>
      feature.featureName.trim()
    );

    if (!formData.title.trim()) {
      setSaveError("Title is required.");
      return;
    }

    if (!formData.slug.trim()) {
      setSaveError("Slug is required.");
      return;
    }

    if (formData.entities.length < 2) {
      setSaveError("Select at least 2 entities.");
      return;
    }

    if (validFeatures.length === 0) {
      setSaveError("Add at least one feature name.");
      return;
    }

    const payload = {
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      subtitle: "",
      quick_verdict: formData.verdictSummary.trim() || null,
      recommendation: formData.recommendation.trim() || null,
      intro_content: formData.verdictSummary.trim() || null,
      status,

      entities: formData.entities.map((entity, index) => ({
        entity_type: entity.type,
        entity_id: index + 1,
        position: index,
        tag: entity.name,
      })),

      features: validFeatures.map((feature, index) => ({
        feature_name: feature.featureName.trim(),
        category: null,
        values: feature.values,
        is_highlighted: false,
        sort_order: index,
      })),
    };

    setIsSaving(true);

    try {
      if (editingPage) {
        const updated = await api.put<ComparisonPage>(
          `/comparison-pages/${editingPage.id}`,
          payload
        );

        setPages((prev) =>
          prev.map((p) => (p.id === editingPage.id ? updated : p))
        );
      } else {
        const created = await api.post<ComparisonPage>(
          "/comparison-pages",
          payload
        );

        setPages((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save comparison:", err);
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = pages.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Comparison Page Builder</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Build feature matrix comparisons between 2–4 tools, CRMs, or platforms.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>New Comparison</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Comparisons", value: pages.length },
          { label: "Published", value: pages.filter((p) => p.status === "published").length },
          { label: "Drafts", value: pages.filter((p) => p.status === "draft").length },
          { label: "Avg. Features", value: pages.length > 0 ? Math.round(pages.reduce((a, p) => a + p.features.length, 0) / pages.length) : 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search comparisons..." value={search} onChange={setSearch} />
      </div>

      {loading ? (
              <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
                <p className="text-label text-text-secondary">Loading solutions...</p>
              </div>
            ) : (<div className="flex flex-col gap-lg">
        {filtered.map((p) => (
          <ComparisonRow key={p.id} page={p} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No comparison pages found.</p>
          </div>
        )}
      </div>)}

      

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? "Edit Comparison Page" : "Create Comparison Page"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>

            <Button variant="neutral" onClick={() => void handleSave("draft")} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>

            <Button variant="primary" onClick={() => void handleSave("published")} disabled={isSaving}>
              {isSaving ? "Saving..." : editingPage ? "Update" : "Publish"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-corner-md p-md">
              <p className="text-label-sm text-red-600">{saveError}</p>
            </div>
          )}
          <EntitySelector entities={formData.entities} onChange={handleEntityChange} />

          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField label="Page Title" placeholder="Make vs Zapier vs n8n — Comparison 2025"
                value={formData.title} onChange={(v) => updateForm("title", v)} />
            </div>
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="make-vs-zapier-vs-n8n"
                value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
            <div className="w-36">
              <SelectField label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]}
                value={formData.status} onChange={(v) => updateForm("status", v as ComparisonPage["status"])} />
            </div>
          </div>

          <FeatureMatrixEditor
            entities={formData.entities}
            features={formData.features}
            onChange={(f) => updateForm("features", f)}
          />

          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <p className="text-label text-text-primary font-semibold">Verdict & Recommendation</p>
              <Button
                variant="subtle"
                size="small"
                iconStart={<Sparkles size={14} />}
                onClick={generateVerdict}
                disabled={isGenerating || formData.entities.length < 2}
              >
                {isGenerating ? "Generating..." : "AI Generate"}
              </Button>
            </div>
            <TextareaField
              label="Verdict Summary"
              placeholder="Summary of comparison findings..."
              value={formData.verdictSummary}
              rows={3}
              onChange={(v) => updateForm("verdictSummary", v)}
            />
            <TextareaField
              label="Recommendation"
              placeholder="Who should choose which option and why..."
              value={formData.recommendation}
              rows={2}
              onChange={(v) => updateForm("recommendation", v)}
            />

            {/* AI Helper for Recommendation */}
            <div className="flex items-center gap-sm">
              <button
                type="button"
                onClick={() => {
                  if (formData.entities.length < 2) return;
                  setAiGenerating(true);
                  const entityNames = formData.entities.map(e => e.name).join(", ");
                  fetch("/api/v1/ai/generate", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("auth_token") ?? ""}`,
                    },
                    body: JSON.stringify({
                      entity_type: "comparison",
                      entity_id: editingPage?.id ?? 0,
                      section_key: "recommendation",
                      prompt_template: "comparison_page",
                      entity_name: entityNames,
                      prompt: `Write recommendations for choosing between ${entityNames}. Include who should pick each option based on team size, budget, technical expertise, and use case. 100-150 words.`,
                    }),
                  }).then(r => r.json()).then(r => {
                    if (r.content) updateForm("recommendation", r.content);
                  }).catch(console.error).finally(() => setAiGenerating(false));
                }}
                disabled={formData.entities.length < 2 || aiGenerating}
                className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary text-label-sm disabled:opacity-50"
              >
                <Sparkles size={13} className="text-brand-primary" />
                {aiGenerating ? "Generating..." : "AI Write Recommendation"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
