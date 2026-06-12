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
  AlertCircle,
  X,
  Building2,
  Sparkles,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { SparkleButton } from "../components/ai";

type Industry = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  hero_image_url: string | null;
  pain_points: string[];
  is_featured: boolean;
  status: "draft" | "published";
};

const iconOptions = ["🏥", "💰", "🏠", "🛒", "📚", "⚖️", "🏨", "🏭", "🚗", "✈️"];

const statusColors: Record<Industry["status"], "success" | "warning"> = {
  published: "success",
  draft: "warning",
};

type FormData = {
  name: string;
  slug: string;
  icon: string;
  description: string;
  hero_image_url: string;
  pain_points: string[];
  is_featured: boolean;
  status: Industry["status"];
};

function normalizeList<T>(response: T[] | Paginated<T> | undefined | null): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

const emptyForm: FormData = {
  name: "",
  slug: "",
  icon: "🏥",
  description: "",
  hero_image_url: "",
  pain_points: [],
  is_featured: false,
  status: "draft",
};

function industryToForm(ind: Industry): FormData {
  return {
    name: ind.name,
    slug: ind.slug,
    icon: ind.icon ?? "🏥",
    description: ind.description ?? "",
    hero_image_url: ind.hero_image_url ?? "",
    pain_points: [...(ind.pain_points ?? [])],
    is_featured: ind.is_featured,
    status: ind.status,
  };
}

function PainPointsEditor({
  points,
  onChange,
}: {
  points: string[];
  onChange: (pts: string[]) => void;
}) {
  const [newPoint, setNewPoint] = useState("");

  const addPoint = () => {
    if (!newPoint.trim()) return;
    onChange([...points, newPoint.trim()]);
    setNewPoint("");
  };

  return (
    <div>
      <p className="text-label text-text-primary font-semibold mb-sm">Pain Points</p>
      <div className="flex flex-col gap-sm mb-md">
        {points.map((pt, i) => (
          <div key={i} className="flex items-center gap-sm bg-bg-faint border border-border-secondary rounded-corner-md px-md py-sm">
            <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
            <span className="text-label-sm text-text-primary flex-1">{pt}</span>
            <button
              onClick={() => onChange(points.filter((_, idx) => idx !== i))}
              className="text-text-tertiary hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {points.length === 0 && (
          <p className="text-label-sm text-text-tertiary">No pain points added yet.</p>
        )}
      </div>
      <div className="flex gap-sm">
        <div className="flex-1">
          <InputField placeholder="Add a pain point..." value={newPoint} onChange={setNewPoint} />
        </div>
        <Button variant="neutral" size="small" onClick={addPoint} disabled={!newPoint.trim()}>Add</Button>
      </div>
    </div>
  );
}

function IndustryRow({
  industry,
  onEdit,
  onDelete,
}: {
  industry: Industry;
  onEdit: (i: Industry) => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(industry)}
    >
      <div className="flex items-center gap-xl">
        <div className="w-12 h-12 rounded-corner-md bg-bg-subtle flex items-center justify-center flex-shrink-0 text-2xl">
          {industry.icon || <Building2 size={24} className="text-text-tertiary" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-sm">
            <h3 className="text-label text-text-primary font-semibold">{industry.name}</h3>
            <Badge label={industry.status} variant={statusColors[industry.status]} />
            {industry.is_featured && (
              <span className="bg-yellow-100 text-yellow-700 text-video-title px-sm py-xs rounded-corner-md border border-yellow-200">
                ⭐ Featured
              </span>
            )}
          </div>
          <p className="text-video-title text-text-tertiary mt-xs">/{industry.slug}</p>
          {industry.description && <p className="text-label-sm text-text-secondary mt-xs">{industry.description}</p>}
          {(industry.pain_points ?? []).length > 0 && (
            <div className="flex flex-wrap gap-xs mt-sm">
              {(industry.pain_points ?? []).slice(0, 3).map((pt, i) => (
                <span key={i} className="bg-orange-50 border border-orange-200 text-orange-700 text-video-title px-sm py-xs rounded-corner-md">
                  {pt.length > 40 ? pt.slice(0, 40) + "…" : pt}
                </span>
              ))}
              {(industry.pain_points ?? []).length > 3 && (
                <span className="text-video-title text-text-tertiary">+{(industry.pain_points ?? []).length - 3} more</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-sm flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(industry)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(industry.slug)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function IndustriesModule() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { 
    api.get<Industry[] | Paginated<Industry>>("/industries?per_page=100")
      .then((res) => { setIndustries(normalizeList<Industry>(res)); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false)); 
  }, []); 

  const updateForm = (key: keyof FormData, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingIndustry(null);
    setFormData(emptyForm);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData(industryToForm(industry));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this industry? This cannot be undone.")) return;
    try {
      await api.del(`/industries/${slug}`);
      setIndustries((prev) => prev.filter((i) => i.slug !== slug));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async (status: Industry["status"]) => {
    const payload = {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon || undefined,
      description: formData.description || undefined,
      hero_image_url: formData.hero_image_url || undefined,
      pain_points: formData.pain_points,
      is_featured: formData.is_featured,
      status,
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingIndustry) {
        const updated = await api.put<Industry>(`/industries/${editingIndustry.slug}`, payload);
        setIndustries((prev) => prev.map((i) => i.id === editingIndustry.id ? updated : i));
      } else {
        const created = await api.post<Industry>("/industries", payload);
        setIndustries((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const makeTabContent = (statusFilter: string) => {
    const filtered = industries.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((industry) => (
          <IndustryRow key={industry.id} industry={industry} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No industries found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Industries Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage industry verticals with pain points and hero content.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>Add Industry</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Industries", value: industries.length },
          { label: "Published", value: industries.filter((i) => i.status === "published").length },
          { label: "Drafts", value: industries.filter((i) => i.status === "draft").length },
          { label: "Total Pain Points", value: industries.reduce((a, i) => a + (i.pain_points ?? []).length, 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search industries..." value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading industries...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All", content: makeTabContent("") },
            { id: "published", label: "Published", content: makeTabContent("published") },
            { id: "draft", label: "Drafts", content: makeTabContent("draft") },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndustry ? `Edit Industry — ${editingIndustry.name}` : "Add New Industry"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => void handleSave("draft")} disabled={isSaving}>Save Draft</Button>
            <Button variant="primary" onClick={() => void handleSave("published")} disabled={isSaving}>
              {isSaving ? "Saving..." : editingIndustry ? "Update" : "Publish"}
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
                  entityType: "industry",
                  fields: [
                    { key: "name", label: "Industry Name", type: "text", value: formData.name },
                    { key: "slug", label: "URL Slug", type: "slug", value: formData.slug },
                    { key: "description", label: "Description", type: "textarea", value: formData.description },
                    { key: "hero_image_url", label: "Hero Image URL", type: "url", value: formData.hero_image_url },
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
                label="Industry Name"
                placeholder="e.g. Healthcare"
                value={formData.name}
                onChange={(v) => {
                  updateForm("name", v);
                  if (!editingIndustry) {
                    updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="healthcare" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Icon (Emoji)"
                options={iconOptions.map((ico) => ({ value: ico, label: ico }))}
                value={formData.icon}
                onChange={(v) => updateForm("icon", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as Industry["status"])}
              />
            </div>
            <div className="flex items-center gap-md pt-6">
              <input
                type="checkbox"
                id="ind_featured"
                checked={formData.is_featured}
                onChange={(e) => updateForm("is_featured", e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <label htmlFor="ind_featured" className="text-label text-text-primary cursor-pointer">Featured</label>
            </div>
          </div>

          <TextareaField
            label="Description"
            placeholder="Brief description of the industry vertical..."
            value={formData.description}
            rows={3}
            onChange={(v) => updateForm("description", v)}
          />

          <InputField
            label="Hero Image URL"
            placeholder="https://example.com/industry-hero.jpg"
            value={formData.hero_image_url}
            onChange={(v) => updateForm("hero_image_url", v)}
          />

          <PainPointsEditor
            points={formData.pain_points}
            onChange={(pts) => updateForm("pain_points", pts)}
          />
        </div>
      </Modal>
    </div>
  );
}
