import { useState } from "react";
import { Plus, X, Play, Loader2, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { AiJobStatusTracker } from "./AiJobStatusTracker";

type BulkJobInput = {
  id: string; // local UI id
  entity_type: string;
  entity_id: number | "";
  section_key: string;
  prompt_template: string;
};

type CreatedJob = {
  id: number;
  entity_type: string;
  entity_id: number;
  section_key: string;
  status: string;
};

type BulkRunResult = {
  message: string;
  jobs: CreatedJob[];
  total: number;
};

const ENTITY_TYPES = ["tool", "industry", "service", "solution", "comparison", "case_study"];
const TEMPLATES = [
  "entity_overview",
  "use_cases",
  "faq",
  "process_steps",
  "seo_meta",
  "cross_reference",
  "solution_page",
  "comparison",
  "case_study_summary",
  "internal_links",
  "content_gap_score",
  "freshness_review",
];

const emptyInput = (): BulkJobInput => ({
  id: crypto.randomUUID(),
  entity_type: "tool",
  entity_id: "",
  section_key: "overview",
  prompt_template: "entity_overview",
});

/**
 * P4-AI-30 — Full-page bulk AI generation UI.
 * Build a job list, submit to /ai/bulk-generate, then track each job's status.
 */
export function AiBulkGeneratorPage({ apiBase = "/api/v1" }: { apiBase?: string }) {
  const [jobs, setJobs] = useState<BulkJobInput[]>([emptyInput()]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BulkRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => setJobs((prev) => [...prev, emptyInput()]);

  const removeRow = (id: string) =>
    setJobs((prev) => prev.filter((j) => j.id !== id));

  const updateRow = (id: string, field: keyof BulkJobInput, value: string | number) =>
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );

  const clearAll = () => { setJobs([emptyInput()]); setResult(null); setError(null); };

  const isValid = jobs.every(
    (j) => j.entity_type && j.entity_id !== "" && j.section_key && j.prompt_template
  );

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    setResult(null);

    const token = localStorage.getItem("auth_token") ?? "";
    const payload = {
      jobs: jobs.map(({ entity_type, entity_id, section_key, prompt_template }) => ({
        entity_type,
        entity_id: Number(entity_id),
        section_key,
        prompt_template,
      })),
    };

    try {
      const res = await fetch(`${apiBase}/ai/bulk-generate`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }

      const data: BulkRunResult = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title text-text-primary font-semibold">Bulk AI Generator</h2>
          <p className="text-label-sm text-text-tertiary mt-xs">
            Queue up to 50 content generation jobs. Jobs run in the background.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-xs px-md py-sm rounded-corner-sm text-label border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
          <button
            type="button"
            onClick={addRow}
            disabled={jobs.length >= 50}
            className="inline-flex items-center gap-xs px-md py-sm rounded-corner-sm text-label border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors disabled:opacity-40"
          >
            <Plus size={14} />
            Add Row
          </button>
        </div>
      </div>

      {/* Job table */}
      <div className="border border-border-secondary rounded-corner-md overflow-hidden">
        <table className="w-full text-label-sm">
          <thead className="bg-bg-subtle border-b border-border-secondary">
            <tr>
              <th className="text-left px-md py-sm text-text-tertiary font-medium w-8">#</th>
              <th className="text-left px-md py-sm text-text-tertiary font-medium">Entity Type</th>
              <th className="text-left px-md py-sm text-text-tertiary font-medium">Entity ID</th>
              <th className="text-left px-md py-sm text-text-tertiary font-medium">Section Key</th>
              <th className="text-left px-md py-sm text-text-tertiary font-medium">Template</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-secondary">
            {jobs.map((job, idx) => (
              <tr key={job.id} className="bg-surface-bg hover:bg-bg-faint transition-colors">
                <td className="px-md py-sm text-text-tertiary">{idx + 1}</td>
                <td className="px-md py-sm">
                  <select
                    value={job.entity_type}
                    onChange={(e) => updateRow(job.id, "entity_type", e.target.value)}
                    className="w-full bg-bg-subtle border border-border-secondary rounded-corner-sm px-xs py-xs text-text-primary focus:outline-none focus:border-brand-default"
                  >
                    {ENTITY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td className="px-md py-sm">
                  <input
                    type="number"
                    min={1}
                    value={job.entity_id}
                    onChange={(e) => updateRow(job.id, "entity_id", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="ID"
                    className="w-24 bg-bg-subtle border border-border-secondary rounded-corner-sm px-xs py-xs text-text-primary focus:outline-none focus:border-brand-default"
                  />
                </td>
                <td className="px-md py-sm">
                  <input
                    type="text"
                    value={job.section_key}
                    onChange={(e) => updateRow(job.id, "section_key", e.target.value)}
                    placeholder="e.g. overview"
                    className="w-full bg-bg-subtle border border-border-secondary rounded-corner-sm px-xs py-xs text-text-primary focus:outline-none focus:border-brand-default"
                  />
                </td>
                <td className="px-md py-sm">
                  <select
                    value={job.prompt_template}
                    onChange={(e) => updateRow(job.id, "prompt_template", e.target.value)}
                    className="w-full bg-bg-subtle border border-border-secondary rounded-corner-sm px-xs py-xs text-text-primary focus:outline-none focus:border-brand-default"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td className="px-md py-sm">
                  <button
                    type="button"
                    onClick={() => removeRow(job.id)}
                    disabled={jobs.length === 1}
                    className="text-text-tertiary hover:text-error-default transition-colors disabled:opacity-30"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-md py-sm bg-bg-subtle border-t border-border-secondary text-label-sm text-text-tertiary">
          {jobs.length} / 50 jobs queued
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-sm px-md py-sm rounded-corner-sm bg-error-subtle border border-error-default text-error-default text-label-sm">
          <XCircle size={14} />
          {error}
        </div>
      )}

      {/* Submit */}
      {!result && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="inline-flex items-center gap-sm px-lg py-sm rounded-corner-sm text-label font-medium bg-brand-primary text-white hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Queuing…</>
            ) : (
              <><Play size={15} /> Run {jobs.length} Job{jobs.length !== 1 ? "s" : ""}</>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-md">
          <div className="flex items-center gap-sm px-md py-sm rounded-corner-sm bg-success-subtle border border-success-default text-success-default text-label-sm">
            <CheckCircle size={14} />
            {result.message}
          </div>

          <div className="space-y-sm">
            {result.jobs.map((createdJob) => (
              <AiJobStatusTracker
                key={createdJob.id}
                jobId={createdJob.id}
                apiBase={apiBase}
                pollIntervalMs={3000}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-xs px-md py-sm rounded-corner-sm text-label border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors"
            >
              <Plus size={14} />
              New Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
