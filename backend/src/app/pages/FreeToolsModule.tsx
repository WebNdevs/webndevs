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
import { Plus, Pencil, Trash2, Search, Wrench } from "lucide-react";
import { api, type Paginated } from "../utils/api";

type FreeTool = {
  id: number;
  name: string;
  slug: string;
  type: "calculator" | "quiz" | "audit" | "estimator";
  description: string | null;
  config: Record<string, unknown>;
  is_active: boolean;
  cta_text: string | null;
  thank_you_message: string | null;
};

const toolTypes = ["calculator", "quiz", "audit", "estimator"] as const;

const typeColors: Record<FreeTool["type"], "success" | "warning" | "default"> = {
  calculator: "success",
  quiz: "warning",
  audit: "default",
  estimator: "warning",
};

type FormData = {
  name: string;
  slug: string;
  type: FreeTool["type"];
  description: string;
  config: string;
  is_active: boolean;
  cta_text: string;
  thank_you_message: string;
};

const emptyForm: FormData = {
  name: "",
  slug: "",
  type: "calculator",
  description: "",
  config: "{}",
  is_active: true,
  cta_text: "",
  thank_you_message: "",
};

function toolToForm(t: FreeTool): FormData {
  return {
    name: t.name,
    slug: t.slug,
    type: t.type,
    description: t.description ?? "",
    config: JSON.stringify(t.config, null, 2),
    is_active: t.is_active,
    cta_text: t.cta_text ?? "",
    thank_you_message: t.thank_you_message ?? "",
  };
}

function FreeToolRow({
  tool,
  onEdit,
  onDelete,
}: {
  tool: FreeTool;
  onEdit: (t: FreeTool) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(tool)}
    >
      <div className="flex items-center gap-xl">
        <div className="w-10 h-10 rounded-corner-md bg-bg-subtle flex items-center justify-center flex-shrink-0">
          <Wrench size={20} className="text-text-tertiary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-sm flex-wrap">
            <h3 className="text-label text-text-primary font-semibold">{tool.name}</h3>
            <Badge label={tool.type} variant={typeColors[tool.type]} />
            <Badge label={tool.is_active ? "active" : "inactive"} variant={tool.is_active ? "success" : "default"} />
          </div>
          <p className="text-video-title text-text-tertiary mt-xs">/{tool.slug}</p>
          {tool.description && <p className="text-label-sm text-text-secondary mt-xs">{tool.description}</p>}
        </div>
        <div className="flex items-center gap-sm flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(tool)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(tool.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function FreeToolsModule() {
  const [tools, setTools] = useState<FreeTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<FreeTool | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Paginated<FreeTool>>("/free-tools?per_page=100&include_inactive=1")
      .then((res) => {
        setTools(res.data ?? []);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateForm = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "config") setConfigError(null);
  };

  const openCreate = () => {
    setEditingTool(null);
    setFormData(emptyForm);
    setSaveError(null);
    setConfigError(null);
    setIsModalOpen(true);
  };

  const openEdit = (tool: FreeTool) => {
    setEditingTool(tool);
    setFormData(toolToForm(tool));
    setSaveError(null);
    setConfigError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this free tool? This cannot be undone.")) return;
    try {
      await api.del(`/free-tools/${id}`);
      setTools((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async () => {
    let parsedConfig: Record<string, unknown>;
    try {
      parsedConfig = JSON.parse(formData.config || "{}");
    } catch {
      setConfigError("Config must be valid JSON.");
      return;
    }

    const payload = {
      name: formData.name,
      slug: formData.slug,
      type: formData.type,
      description: formData.description || undefined,
      config: parsedConfig,
      is_active: formData.is_active,
      cta_text: formData.cta_text || undefined,
      thank_you_message: formData.thank_you_message || undefined,
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingTool) {
        const updated = await api.put<FreeTool>(`/free-tools/${editingTool.id}`, payload);
        setTools((prev) => prev.map((t) => t.id === editingTool.id ? updated : t));
      } else {
        const created = await api.post<FreeTool>("/free-tools", payload);
        setTools((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const makeTabContent = (activeFilter: boolean | null) => {
    const filtered = tools.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.includes(search.toLowerCase());
      const matchActive = activeFilter === null || t.is_active === activeFilter;
      return matchSearch && matchActive;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((tool) => (
          <FreeToolRow key={tool.id} tool={tool} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No free tools found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Free Tools Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage ROI calculators, quizzes, audits, and estimator tools.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>Add Free Tool</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total", value: tools.length },
          { label: "Active", value: tools.filter((t) => t.is_active).length },
          { label: "Calculators", value: tools.filter((t) => t.type === "calculator").length },
          { label: "Quizzes", value: tools.filter((t) => t.type === "quiz").length },
          { label: "Audits", value: tools.filter((t) => t.type === "audit").length },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search free tools..." value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading free tools...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Tools", content: makeTabContent(null) },
            { id: "active", label: "Active", content: makeTabContent(true) },
            { id: "inactive", label: "Inactive", content: makeTabContent(false) },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTool ? `Edit — ${editingTool.name}` : "Add New Free Tool"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => void handleSave()} disabled={isSaving}>
              {isSaving ? "Saving..." : editingTool ? "Update Tool" : "Create Tool"}
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

          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Name"
                placeholder="e.g. ROI Calculator"
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
              <InputField label="URL Slug" placeholder="roi-calculator" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Type"
                options={toolTypes.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                value={formData.type}
                onChange={(v) => updateForm("type", v as FreeTool["type"])}
              />
            </div>
            <div className="flex items-end gap-md pb-xs">
              <input
                type="checkbox"
                id="ft_is_active"
                checked={formData.is_active}
                onChange={(e) => updateForm("is_active", e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <label htmlFor="ft_is_active" className="text-label text-text-primary cursor-pointer">Active</label>
            </div>
          </div>

          <TextareaField
            label="Description"
            placeholder="Brief description of what this tool does..."
            value={formData.description}
            rows={2}
            onChange={(v) => updateForm("description", v)}
          />

          <InputField label="CTA Text" placeholder="e.g. Get your free estimate" value={formData.cta_text} onChange={(v) => updateForm("cta_text", v)} />
          <TextareaField label="Thank You Message" placeholder="Message shown after submission..." value={formData.thank_you_message} rows={2} onChange={(v) => updateForm("thank_you_message", v)} />

          <div>
            <TextareaField
              label="Config (JSON)"
              placeholder='{"fields": [], "output": {}}'
              value={formData.config}
              rows={6}
              onChange={(v) => updateForm("config", v)}
            />
            {configError && <p className="text-label-sm text-red-500 mt-xs">{configError}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
