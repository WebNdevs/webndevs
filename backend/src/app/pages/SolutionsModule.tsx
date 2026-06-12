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
  Sparkles,
  X,
  Layers,
  Loader2,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { SparkleButton } from "../components/ai";

type Industry = { id: number; name: string; slug: string };
type Tool = { id: number; name: string; slug: string };

type SolutionTool = {
  id: number;
  name: string;
};

type Solution = {
  id: number;
  slug: string;
  name: string;
  problem_statement: string | null;
  solution_summary: string | null;
  workflow_description: string | null;
  industry_id: number | null;
  industry: Industry | null;
  status: "draft" | "published";
  tools: SolutionTool[];
};

const statusColors: Record<Solution["status"], "success" | "warning"> = {
  published: "success",
  draft: "warning",
};

type FormData = {
  slug: string;
  name: string;
  problem_statement: string;
  solution_summary: string;
  workflow_description: string;
  industry_id: string;
  status: Solution["status"];
  tool_ids: number[];
};

function normalizeList<T>(response: T[] | Paginated<T> | undefined | null): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

const emptyForm: FormData = {
  slug: "",
  name: "",
  problem_statement: "",
  solution_summary: "",
  workflow_description: "",
  industry_id: "",
  status: "draft",
  tool_ids: [],
};


function solutionToForm(s: Solution): FormData {
  return {
    slug: s.slug,
    name: s.name,
    problem_statement: s.problem_statement ?? "",
    solution_summary: s.solution_summary ?? "",
    workflow_description: s.workflow_description ?? "",
    industry_id: s.industry_id?.toString() ?? "",
    status: s.status,
    tool_ids: (s.tools ?? []).map((t) => t.id),
  };
}

function ToolSelector({
  allTools,
  selectedIds,
  onChange,
}: {
  allTools: Tool[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const selected = allTools.filter((t) => selectedIds.includes(t.id));
  const available = allTools.filter((t) => !selectedIds.includes(t.id));

  return (
    <div>
      <p className="text-label text-text-primary font-semibold mb-sm">Tools in Solution</p>
      <div className="flex flex-wrap gap-sm mb-md">
        {selected.map((t) => (
          <div key={t.id} className="flex items-center gap-xs bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-label-sm px-md py-sm rounded-corner-md">
            <Layers size={12} />
            {t.name}
            <button onClick={() => onChange(selectedIds.filter((id) => id !== t.id))}><X size={12} /></button>
          </div>
        ))}
        {selected.length === 0 && <p className="text-label-sm text-text-tertiary">No tools selected.</p>}
      </div>
      {available.length > 0 && (
        <SelectField
          label=""
          placeholder="Add tool to solution..."
          options={available.map((t) => ({ value: t.id.toString(), label: t.name }))}
          value=""
          onChange={(v) => { if (v) onChange([...selectedIds, parseInt(v)]); }}
        />
      )}
    </div>
  );
}

function SolutionRow({ solution, onEdit, onDelete }: {
  solution: Solution;
  onEdit: (s: Solution) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(solution)}
    >
      <div className="flex items-start gap-xl">
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-xs">
            <h3 className="text-label text-text-primary font-semibold">{solution.name}</h3>
            <Badge label={solution.status} variant={statusColors[solution.status]} />
            {solution.industry && (
              <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">
                {solution.industry.name}
              </span>
            )}
          </div>
          <p className="text-video-title text-text-tertiary mb-sm">/{solution.slug}</p>
          {solution.problem_statement && (
            <p className="text-label-sm text-text-secondary">{solution.problem_statement}</p>
          )}
          {(solution.tools ?? []).length > 0 && (
            <div className="flex flex-wrap gap-xs mt-sm">
              {(solution.tools ?? []).map((t) => (
                <span key={t.id} className="text-video-title px-sm py-xs rounded-corner-md border bg-bg-faint border-border-secondary text-text-tertiary">
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-sm flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(solution)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(solution.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function SolutionsModule() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Solution[] | Paginated<Solution>>("/solutions?per_page=100"),
      api.get<Industry[] | Paginated<Industry>>("/industries?per_page=100"),
      api.get<Tool[] | Paginated<Tool>>("/tools?per_page=100"),
    ])
      .then(([solRes, indRes, toolRes]) => {
        setSolutions(normalizeList<Solution>(solRes));
        setIndustries(normalizeList<Industry>(indRes));
        setTools(normalizeList<Tool>(toolRes));
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateForm = (key: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingSolution(null);
    setFormData({ ...emptyForm, industry_id: industries[0]?.id.toString() ?? "" });
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (s: Solution) => {
    setEditingSolution(s);
    setFormData(solutionToForm(s));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this solution? This cannot be undone.")) return;
    try {
      await api.del(`/solutions/${id}`);
      setSolutions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const generateWorkflow = () => {
    if (!formData.name) return;
    setIsGenerating(true);
    setTimeout(() => {
      updateForm("workflow_description", `When a new ${formData.name.toLowerCase()} trigger occurs → The primary tool processes the event → Supporting tools are activated in sequence → Data flows through the pipeline → Final state is recorded and confirmed. This automated workflow eliminates manual steps and ensures 24/7 operation.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async (status: Solution["status"]) => {
    const payload = {
      name: formData.name,
      slug: formData.slug,
      industry_id: formData.industry_id ? parseInt(formData.industry_id) : undefined,
      problem_statement: formData.problem_statement || undefined,
      solution_summary: formData.solution_summary || undefined,
      workflow_description: formData.workflow_description || undefined,
      status,
      tool_ids: formData.tool_ids,
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingSolution) {
        const updated = await api.put<Solution>(`/solutions/${editingSolution.id}`, payload);
        setSolutions((prev) => prev.map((s) => s.id === editingSolution.id ? updated : s));
      } else {
        const created = await api.post<Solution>("/solutions", payload);
        setSolutions((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const makeTabContent = (statusFilter: string) => {
    const filtered = solutions.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((s) => (
          <SolutionRow key={s.id} solution={s} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No solutions found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Solutions Builder</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Build solution pages combining multiple tools for a specific problem.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>New Solution</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Solutions", value: solutions.length },
          { label: "Published", value: solutions.filter((s) => s.status === "published").length },
          { label: "Drafts", value: solutions.filter((s) => s.status === "draft").length },
          { label: "Industries", value: industries.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search solutions..." value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading solutions...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Solutions", content: makeTabContent("") },
            { id: "published", label: "Published", content: makeTabContent("published") },
            { id: "draft", label: "Drafts", content: makeTabContent("draft") },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSolution ? `Edit Solution — ${editingSolution.name}` : "Create New Solution"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => void handleSave("draft")} disabled={isSaving}>Save Draft</Button>
            <Button variant="primary" onClick={() => void handleSave("published")} disabled={isSaving}>
              {isSaving ? "Saving..." : editingSolution ? "Update Solution" : "Publish Solution"}
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
                  entityType: "solution",
                  fields: [
                    { key: "name", label: "Solution Name", type: "text", value: formData.name },
                    { key: "slug", label: "URL Slug", type: "slug", value: formData.slug },
                    { key: "problem_statement", label: "Problem Statement", type: "textarea", value: formData.problem_statement },
                    { key: "solution_summary", label: "Solution Summary", type: "textarea", value: formData.solution_summary },
                    { key: "workflow_description", label: "Workflow Description", type: "textarea", value: formData.workflow_description },
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
                label="Solution Name"
                placeholder="e.g. Appointment Reminder System"
                value={formData.name}
                onChange={(v) => {
                  updateForm("name", v);
                  if (!editingSolution) updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }}
              />
            </div>
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="appointment-reminder-system" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Industry"
                options={[
                  { value: "", label: "None" },
                  ...industries.map((i) => ({ value: i.id.toString(), label: i.name })),
                ]}
                value={formData.industry_id}
                onChange={(v) => updateForm("industry_id", v)}
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
                onChange={(v) => updateForm("status", v as Solution["status"])}
              />
            </div>
          </div>

          <TextareaField
            label="Problem Statement"
            placeholder="Describe the specific problem this solution solves..."
            value={formData.problem_statement}
            rows={2}
            onChange={(v) => updateForm("problem_statement", v)}
          />

          <TextareaField
            label="Solution Summary"
            placeholder="Brief description of the solution approach..."
            value={formData.solution_summary}
            rows={2}
            onChange={(v) => updateForm("solution_summary", v)}
          />

          <TextareaField
            label="Workflow Description"
            placeholder="Describe the step-by-step workflow automation..."
            value={formData.workflow_description}
            rows={3}
            onChange={(v) => updateForm("workflow_description", v)}
          />

          <ToolSelector
            allTools={tools}
            selectedIds={formData.tool_ids}
            onChange={(ids) => updateForm("tool_ids", ids)}
          />
        </div>
      </Modal>
    </div>
  );
}
