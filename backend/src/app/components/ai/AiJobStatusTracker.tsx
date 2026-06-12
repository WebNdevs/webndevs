import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

type JobStatus = "pending" | "processing" | "completed" | "failed";

type AiJob = {
  id: number;
  entity_type: string;
  entity_id: number;
  section_key: string;
  prompt_template: string;
  status: JobStatus;
  generated_content?: string;
  tokens_input?: number;
  tokens_output?: number;
  model_used?: string;
  created_at: string;
  updated_at: string;
};

type AiJobStatusTrackerProps = {
  jobId: number;
  pollIntervalMs?: number;
  onComplete?: (job: AiJob) => void;
  onFailed?: (job: AiJob) => void;
  compact?: boolean;
  apiBase?: string;
};

const STATUS_CONFIG: Record<JobStatus, { icon: React.ReactNode; label: string; colorClass: string }> = {
  pending: {
    icon: <Clock size={14} />,
    label: "Pending",
    colorClass: "text-text-secondary",
  },
  processing: {
    icon: <Loader2 size={14} className="animate-spin" />,
    label: "Processing",
    colorClass: "text-brand-default",
  },
  completed: {
    icon: <CheckCircle size={14} />,
    label: "Completed",
    colorClass: "text-success-default",
  },
  failed: {
    icon: <XCircle size={14} />,
    label: "Failed",
    colorClass: "text-error-default",
  },
};

/**
 * P4-AI-31 — Real-time job progress tracker. Polls /ai/job/{id} until terminal state.
 * Calls onComplete/onFailed when job settles.
 */
export function AiJobStatusTracker({
  jobId,
  pollIntervalMs = 2500,
  onComplete,
  onFailed,
  compact = false,
  apiBase = "/api/v1",
}: AiJobStatusTrackerProps) {
  const [job, setJob] = useState<AiJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  const fetchJob = useCallback(async () => {
    const token = localStorage.getItem("auth_token") ?? "";
    try {
      const res = await fetch(`${apiBase}/ai/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AiJob = await res.json();
      setJob(data);

      if (data.status === "completed") {
        setPolling(false);
        onComplete?.(data);
      } else if (data.status === "failed") {
        setPolling(false);
        onFailed?.(data);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch job status");
      setPolling(false);
    }
  }, [jobId, apiBase, onComplete, onFailed]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  useEffect(() => {
    if (!polling) return;
    const timer = setInterval(fetchJob, pollIntervalMs);
    return () => clearInterval(timer);
  }, [polling, pollIntervalMs, fetchJob]);

  if (error) {
    return (
      <div className="inline-flex items-center gap-xs text-label-sm text-error-default">
        <XCircle size={14} />
        {error}
        <button
          type="button"
          onClick={() => { setError(null); setPolling(true); fetchJob(); }}
          className="underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="inline-flex items-center gap-xs text-label-sm text-text-secondary">
        <Loader2 size={14} className="animate-spin" />
        Loading…
      </div>
    );
  }

  const cfg = STATUS_CONFIG[job.status];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-xs text-label-sm ${cfg.colorClass}`}>
        {cfg.icon}
        {cfg.label}
      </span>
    );
  }

  const totalTokens = (job.tokens_input ?? 0) + (job.tokens_output ?? 0);

  return (
    <div className="border border-border-secondary rounded-corner-md p-md bg-bg-subtle space-y-sm">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-xs text-label font-medium ${cfg.colorClass}`}>
          {cfg.icon}
          Job #{job.id} — {cfg.label}
        </div>
        {polling && (
          <button
            type="button"
            onClick={() => { setPolling(false); setPolling(true); fetchJob(); }}
            className="text-text-tertiary hover:text-text-secondary"
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-lg gap-y-xs text-label-sm text-text-secondary">
        <div>
          <span className="text-text-tertiary">Entity:</span>{" "}
          {job.entity_type} #{job.entity_id}
        </div>
        <div>
          <span className="text-text-tertiary">Section:</span> {job.section_key}
        </div>
        <div>
          <span className="text-text-tertiary">Template:</span> {job.prompt_template}
        </div>
        {job.model_used && (
          <div>
            <span className="text-text-tertiary">Model:</span> {job.model_used}
          </div>
        )}
        {totalTokens > 0 && (
          <div className="col-span-2">
            <span className="text-text-tertiary">Tokens:</span>{" "}
            {job.tokens_input?.toLocaleString()} in / {job.tokens_output?.toLocaleString()} out
          </div>
        )}
      </div>

      {job.status === "completed" && job.generated_content && (
        <div className="border-t border-border-secondary pt-sm">
          <p className="text-label-sm text-text-tertiary mb-xs">Preview:</p>
          <p className="text-label-sm text-text-primary line-clamp-3 font-mono">
            {job.generated_content.slice(0, 300)}
            {job.generated_content.length > 300 ? "…" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
