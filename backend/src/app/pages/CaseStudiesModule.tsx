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
  X,
  Sparkles,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { SparkleButton } from "../components/ai";

type Metric = {
  id?: number;
  label: string;
  before_value: string;
  after_value: string;
  unit: string | null;
};

type EntityLink = {
  entity_type: string;
  entity_id: number;
};

type CaseStudy = {
  id: number;
  slug: string;
  title: string;
  client_name: string;
  client_industry: string | null;
  challenge: string;
  solution: string;
  results_summary: string;
  timeline: string | null;
  status: "draft" | "published";
  metrics: Metric[];
  entityLinks: EntityLink[];
};

const industriesList = ["Healthcare", "Real Estate", "Finance", "E-Commerce", "Education", "Legal", "Hospitality"];

const statusColors: Record<CaseStudy["status"], "success" | "warning"> = {
  published: "success",
  draft: "warning",
};

type FormData = {
  slug: string;
  title: string;
  client_name: string;
  client_industry: string;
  challenge: string;
  solution: string;
  results_summary: string;
  timeline: string;
  status: CaseStudy["status"];
  metrics: Metric[];
};

const emptyForm: FormData = {
  slug: "",
  title: "",
  client_name: "",
  client_industry: "Healthcare",
  challenge: "",
  solution: "",
  results_summary: "",
  timeline: "",
  status: "draft",
  metrics: [],
};

function studyToForm(s: CaseStudy): FormData {
  return {
    slug: s.slug,
    title: s.title,
    client_name: s.client_name,
    client_industry: s.client_industry ?? "Healthcare",
    challenge: s.challenge,
    solution: s.solution,
    results_summary: s.results_summary,
    timeline: s.timeline ?? "",
    status: s.status,
    metrics: s.metrics.map((m) => ({ ...m })),
  };
}

function MetricsEditor({ metrics, onChange }: { metrics: Metric[]; onChange: (m: Metric[]) => void }) {
  const addMetric = () => {
    onChange([...metrics, { label: "", before_value: "", after_value: "", unit: "" }]);
  };

  const update = (idx: number, field: keyof Metric, value: string) => {
    onChange(metrics.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-sm">
        <p className="text-label text-text-primary font-semibold">Metrics (Before/After)</p>
        <Button variant="neutral" size="small" iconStart={<Plus size={14} />} onClick={addMetric}>Add Metric</Button>
      </div>
      <div className="flex flex-col gap-sm">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex items-center gap-sm bg-bg-faint border border-border-secondary rounded-corner-md p-md">
            <div className="flex-1">
              <InputField placeholder="Metric label" value={m.label} onChange={(v) => update(idx, "label", v)} />
            </div>
            <div className="w-28">
              <InputField placeholder="Before" value={m.before_value} onChange={(v) => update(idx, "before_value", v)} />
            </div>
            <span className="text-text-tertiary">→</span>
            <div className="w-28">
              <InputField placeholder="After" value={m.after_value} onChange={(v) => update(idx, "after_value", v)} />
            </div>
            <div className="w-20">
              <InputField placeholder="%" value={m.unit ?? ""} onChange={(v) => update(idx, "unit", v)} />
            </div>
            <button onClick={() => onChange(metrics.filter((_, i) => i !== idx))} className="text-text-tertiary hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        ))}
        {metrics.length === 0 && (
          <p className="text-label-sm text-text-tertiary">No metrics yet. Add before/after stats to showcase impact.</p>
        )}
      </div>
    </div>
  );
}

function CaseStudyRow({ study, onEdit, onDelete }: {
  study: CaseStudy;
  onEdit: (s: CaseStudy) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(study)}
    >
      <div className="flex items-start gap-xl">
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-xs">
            <h3 className="text-label text-text-primary font-semibold">{study.title}</h3>
            <Badge label={study.status} variant={statusColors[study.status]} />
          </div>
          <p className="text-video-title text-text-tertiary mb-sm">
            {study.client_name} · {study.client_industry} {study.timeline ? `· ${study.timeline}` : ""}
          </p>
          <p className="text-label-sm text-text-secondary mb-sm">{study.challenge}</p>

          {study.metrics.length > 0 && (
            <div className="flex flex-wrap gap-sm mb-sm">
              {study.metrics.map((m, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-corner-md px-md py-xs text-video-title text-green-700">
                  <span className="font-bold">{m.label}</span>: {m.before_value} → {m.after_value}{m.unit}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-sm flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(study)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(study.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesModule() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    api.get<Paginated<CaseStudy>>("/case-studies?per_page=100")
      .then((res) => { setStudies(res.data); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateForm = (key: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingStudy(null);
    setFormData(emptyForm);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (s: CaseStudy) => {
    setEditingStudy(s);
    setFormData(studyToForm(s));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this case study? This cannot be undone.")) return;
    try {
      await api.del(`/case-studies/${id}`);
      setStudies((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const generateResultsSummary = () => {
    if (!formData.client_name || formData.metrics.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      const metric = formData.metrics[0];
      updateForm("results_summary", `After implementing the solution, ${formData.client_name} achieved a ${metric.after_value}${metric.unit ?? ""} ${metric.label.toLowerCase()} (up from ${metric.before_value}${metric.unit ?? ""}), demonstrating the power of automation for ${formData.client_industry.toLowerCase()} businesses.`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async () => {

    setSaveError(null);

    if (!formData.title.trim()) {
      setSaveError("Title is required.");
      return;
    }

    if (!formData.slug.trim()) {
      setSaveError("Slug is required.");
      return;
    }

    if (!formData.client_name.trim()) {
      setSaveError("Client name is required.");
      return;
    }

    if (!formData.challenge.trim()) {
      setSaveError("Challenge is required.");
      return;
    }

    if (!formData.solution.trim()) {
      setSaveError("Solution is required.");
      return;
    }

    if (!formData.results_summary.trim()) {
      setSaveError("Results summary is required.");
      return;
    }

    const validMetrics = formData.metrics.filter(
      (m) => m.label.trim() && m.before_value.trim() && m.after_value.trim()
    );

    const payload : Record<string, unknown> = {
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      client_name: formData.client_name.trim(),
      client_industry: formData.client_industry || null,
      challenge: formData.challenge.trim(),
      solution: formData.solution.trim(),
      results_summary: formData.results_summary.trim(),
      timeline: formData.timeline.trim() || null,
      status: formData.status,
    };
      
    if(!editingStudy){
      payload.metrics = validMetrics.map((m, i) => ({
        label: m.label.trim(),
        before_value: m.before_value.trim(),
        after_value: m.after_value.trim(),
        unit: m.unit?.trim() || null,
        improvement: null,
        sort_order: i,
      }));
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingStudy) {
        const updated = await api.put<CaseStudy>(`/case-studies/${editingStudy.id}`, payload);
        // Replace metrics separately
        if (formData.metrics.length > 0) {
          await api.put(`/case-studies/${editingStudy.id}/metrics`, {
            metrics: validMetrics.map((m, i) => ({
              label: m.label.trim(),
              before_value: m.before_value.trim(),
              after_value: m.after_value.trim(),
              unit: m.unit?.trim() || null,
              sort_order: i,
            })),
          });
        }
        setStudies((prev) => prev.map((s) => s.id === editingStudy.id ? { ...updated, metrics: formData.metrics } : s));
      } else {
        const created = await api.post<CaseStudy>("/case-studies", payload);
        setStudies((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const makeTabContent = (statusFilter: string) => {
    const filtered = studies.filter((s) => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.client_name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((s) => (
          <CaseStudyRow key={s.id} study={s} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No case studies found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Case Studies Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Document client results with before/after metrics and testimonials.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>New Case Study</Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Studies", value: studies.length },
          { label: "Published", value: studies.filter((s) => s.status === "published").length },
          { label: "Drafts", value: studies.filter((s) => s.status === "draft").length },
          { label: "Total Metrics", value: studies.reduce((a, s) => a + (s.metrics ?? []).length, 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search case studies..." value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading case studies...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Studies", content: makeTabContent("") },
            { id: "published", label: "Published", content: makeTabContent("published") },
            { id: "draft", label: "Drafts", content: makeTabContent("draft") },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudy ? "Edit Case Study" : "Create New Case Study"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => {updateForm("status", "draft"); void handleSave()}} disabled={isSaving}>Save Draft</Button>
            <Button variant="primary" onClick={() => {updateForm("status", "published"); void handleSave()}} disabled={isSaving}>
              {isSaving ? "Saving..." : editingStudy ? "Update" : "Publish"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          {formData.title && (
            <div className="flex justify-end">
              <SparkleButton
                context={{
                  entityName: formData.title,
                  entityType: "case_study",
                  fields: [
                    { key: "title", label: "Case Study Title", type: "text", value: formData.title },
                    { key: "slug", label: "URL Slug", type: "slug", value: formData.slug },
                    { key: "client_name", label: "Client Name", type: "text", value: formData.client_name },
                    { key: "challenge", label: "Challenge", type: "textarea", value: formData.challenge },
                    { key: "solution", label: "Solution", type: "textarea", value: formData.solution },
                    { key: "results_summary", label: "Results Summary", type: "textarea", value: formData.results_summary },
                    { key: "timeline", label: "Timeline", type: "text", value: formData.timeline },
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
          <InputField
            label="Case Study Title"
            placeholder="How [Client] achieved [Result] with [Tool]"
            value={formData.title}
            onChange={(v) => {
              updateForm("title", v);
              if (!editingStudy) updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60));
            }}
          />

          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="client-result-tool" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
            <div className="flex-1">
              <InputField label="Client Name" placeholder="City Medical Clinic" value={formData.client_name} onChange={(v) => updateForm("client_name", v)} />
            </div>
            <div className="flex-1">
              <SelectField
                label="Client Industry"
                options={industriesList.map((i) => ({ value: i, label: i }))}
                value={formData.client_industry}
                onChange={(v) => updateForm("client_industry", v)}
              />
            </div>
            <div className="w-32">
              <InputField label="Timeline" placeholder="6 weeks" value={formData.timeline} onChange={(v) => updateForm("timeline", v)} />
            </div>
          </div>

          <TextareaField label="Challenge" placeholder="Describe the problem the client was facing..." value={formData.challenge} rows={2} onChange={(v) => updateForm("challenge", v)} />

          <TextareaField label="Solution" placeholder="Describe the solution you implemented..." value={formData.solution} rows={3} onChange={(v) => updateForm("solution", v)} />

          <MetricsEditor metrics={formData.metrics} onChange={(m) => updateForm("metrics", m)} />

          <TextareaField label="Results Summary" placeholder="Summary of key results and impact..." value={formData.results_summary} rows={3} onChange={(v) => updateForm("results_summary", v)} />

          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as CaseStudy["status"])}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}