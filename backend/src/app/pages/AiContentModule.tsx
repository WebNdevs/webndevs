import React, { useState } from "react";
import {
  Button,
  Badge,
  InputField,
  SelectField,
  Tabs,
} from "@figma/astraui";
import {
  Sparkles,
  Search,
  Check,
  X,
  Play,
  AlertCircle,
  Clock,
  Link,
  RefreshCw,
  Eye,
  Zap,
  TrendingUp,
  FileText,
} from "lucide-react";

// ---------- AI Bulk Generator ----------

type GenerationJob = {
  id: string;
  entityA: string;
  entityB: string;
  slug: string;
  status: "pending" | "generating" | "done" | "failed" | "approved" | "rejected";
  preview: string;
};

const mockCombinations: GenerationJob[] = [
  { id: "j1", entityA: "Twilio", entityB: "Healthcare", slug: "twilio-healthcare", status: "done", preview: "Twilio enables healthcare providers to build HIPAA-compliant patient communication workflows..." },
  { id: "j2", entityA: "Twilio", entityB: "Finance", slug: "twilio-finance", status: "pending", preview: "" },
  { id: "j3", entityA: "Twilio", entityB: "Real Estate", slug: "twilio-real-estate", status: "pending", preview: "" },
  { id: "j4", entityA: "Make", entityB: "Shopify", slug: "make-shopify", status: "generating", preview: "" },
  { id: "j5", entityA: "n8n", entityB: "Zoho CRM", slug: "n8n-zoho-crm", status: "failed", preview: "" },
  { id: "j6", entityA: "HubSpot", entityB: "Finance", slug: "hubspot-finance", status: "approved", preview: "HubSpot's CRM capabilities make it ideal for financial services firms needing to track complex sales cycles..." },
];

const statusColors: Record<GenerationJob["status"], "success" | "warning" | "default"> = {
  pending: "default",
  generating: "warning",
  done: "warning",
  failed: "default",
  approved: "success",
  rejected: "default",
};

function BulkGeneratorTab({ jobs, setJobs, onApprove, onReject }: {
  jobs: GenerationJob[];
  setJobs: React.Dispatch<React.SetStateAction<GenerationJob[]>>;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [selectedEntity, setSelectedEntity] = useState("twilio");
  const [progress, setProgress] = useState<number | null>(null);

  const entities = ["Twilio", "Zapier", "Make", "HubSpot", "Zoho CRM", "Shopify"];

  const startBulk = () => {
    setProgress(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 15;
      setProgress(Math.min(count, 100));
      if (count >= 100) {
        clearInterval(interval);
        setJobs((prev) => prev.map((j) => j.status === "pending" ? { ...j, status: "done", preview: `Auto-generated content for ${j.entityA} × ${j.entityB}...` } : j));
        setTimeout(() => setProgress(null), 500);
      }
    }, 300);
  };

  const approve = onApprove;
  const reject  = onReject;
  const retry = (id: string) => setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "generating", preview: "" } : j));

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    done: jobs.filter((j) => j.status === "done").length,
    approved: jobs.filter((j) => j.status === "approved").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  return (
    <div className="flex flex-col gap-xl">
      {/* Controls */}
      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <p className="text-label text-text-primary font-semibold mb-md">Generate All Cross-Reference Combinations</p>
        <div className="flex items-end gap-lg">
          <div className="flex-1">
            <SelectField
              label="Select Entity"
              options={entities.map((e) => ({ value: e.toLowerCase(), label: e }))}
              value={selectedEntity}
              onChange={setSelectedEntity}
            />
          </div>
          <Button
            variant="primary"
            iconStart={<Play size={16} />}
            onClick={startBulk}
            disabled={progress !== null}
          >
            {progress !== null ? `Generating... ${progress}%` : "Start Bulk Generation"}
          </Button>
        </div>

        {progress !== null && (
          <div className="mt-md">
            <div className="flex justify-between mb-xs">
              <span className="text-label-sm text-text-secondary">Progress</span>
              <span className="text-label-sm text-text-primary font-semibold">{progress}%</span>
            </div>
            <div className="bg-bg-subtle rounded-full h-2">
              <div
                className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-xl">
        {[
          { label: "Total", value: stats.total, color: "text-text-primary" },
          { label: "Pending", value: stats.pending, color: "text-text-secondary" },
          { label: "Generated", value: stats.done, color: "text-yellow-600" },
          { label: "Approved", value: stats.approved, color: "text-green-600" },
          { label: "Failed", value: stats.failed, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-lg flex-1 text-center">
            <span className={`text-title font-bold ${s.color}`}>{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div className="flex flex-col gap-md">
        {jobs.map((job) => (
          <div key={job.id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="flex items-center gap-lg">
              <div className="flex items-center gap-sm">
                <span className="text-label-sm text-text-primary font-semibold">{job.entityA}</span>
                <span className="text-text-tertiary">×</span>
                <span className="text-label-sm text-text-primary font-semibold">{job.entityB}</span>
              </div>
              <span className="text-video-title text-text-tertiary flex-1">/{job.slug}</span>
              <Badge label={job.status} variant={statusColors[job.status]} />

              <div className="flex items-center gap-sm">
                {job.status === "done" && (
                  <>
                    <Button variant="subtle" size="small" iconStart={<Eye size={14} />}>Preview</Button>
                    <Button variant="subtle" size="small" iconStart={<Check size={14} />} onClick={() => approve(job.id)}>Approve</Button>
                    <Button variant="subtle" size="small" iconStart={<X size={14} />} onClick={() => reject(job.id)}>Reject</Button>
                  </>
                )}
                {job.status === "failed" && (
                  <Button variant="subtle" size="small" iconStart={<RefreshCw size={14} />} onClick={() => retry(job.id)}>Retry</Button>
                )}
                {job.status === "generating" && (
                  <div className="flex items-center gap-xs text-text-secondary">
                    <div className="w-3 h-3 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                    <span className="text-video-title">Writing...</span>
                  </div>
                )}
              </div>
            </div>
            {job.preview && (
              <p className="text-label-sm text-text-secondary mt-sm border-t border-border-primary pt-sm">{job.preview}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Content Gap Finder ----------

type ContentGap = {
  id: string;
  entityA: string;
  entityB: string;
  gapScore: number;
  suggestedTitle: string;
  status: "pending" | "created" | "ignored";
  reason: string;
};

const mockGaps: ContentGap[] = [
  { id: "g1", entityA: "Twilio", entityB: "Zapier", gapScore: 9.2, suggestedTitle: "Twilio + Zapier Integration Guide", status: "pending", reason: "High search volume, no existing page" },
  { id: "g2", entityA: "GoHighLevel", entityB: "Healthcare", gapScore: 8.7, suggestedTitle: "GoHighLevel for Healthcare Practices", status: "pending", reason: "Competitor pages rank well for this term" },
  { id: "g3", entityA: "Salesforce", entityB: "E-Commerce", gapScore: 8.1, suggestedTitle: "Salesforce for E-Commerce", status: "pending", reason: "High buying intent keyword cluster" },
  { id: "g4", entityA: "HubSpot", entityB: "Real Estate", gapScore: 7.8, suggestedTitle: "HubSpot CRM for Real Estate Agents", status: "created", reason: "Medium volume, low competition" },
  { id: "g5", entityA: "n8n", entityB: "Healthcare", gapScore: 6.5, suggestedTitle: "n8n Automation for Healthcare", status: "ignored", reason: "Lower priority niche" },
  { id: "g6", entityA: "Stripe", entityB: "E-Commerce", gapScore: 9.5, suggestedTitle: "Stripe for E-Commerce — Complete Integration", status: "pending", reason: "Very high search volume, low existing content" },
];

function ContentGapTab() {
  const [gaps, setGaps] = useState<ContentGap[]>(mockGaps);
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const markAs = (id: string, status: ContentGap["status"]) => {
    setGaps((prev) => prev.map((g) => g.id === id ? { ...g, status } : g));
  };

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  };

  const gapStatusColor: Record<ContentGap["status"], string> = {
    pending: "bg-yellow-50 border-yellow-200",
    created: "bg-green-50 border-green-200",
    ignored: "bg-gray-50 border-gray-200 opacity-60",
  };

  const filtered = gaps.filter((g) =>
    g.entityA.toLowerCase().includes(search.toLowerCase()) ||
    g.entityB.toLowerCase().includes(search.toLowerCase()) ||
    g.suggestedTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-xl">
      <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary font-semibold">Content Gap Analysis</p>
          <p className="text-label-sm text-text-secondary">Missing cross-reference pairs that could rank well.</p>
        </div>
        <Button
          variant="primary"
          iconStart={<Search size={16} />}
          onClick={runScan}
          disabled={isScanning}
        >
          {isScanning ? "Scanning..." : "Re-scan for Gaps"}
        </Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Pending", value: gaps.filter((g) => g.status === "pending").length, color: "text-yellow-600" },
          { label: "Created", value: gaps.filter((g) => g.status === "created").length, color: "text-green-600" },
          { label: "Ignored", value: gaps.filter((g) => g.status === "ignored").length, color: "text-text-tertiary" },
          { label: "Avg. Gap Score", value: (gaps.filter((g) => g.status === "pending").reduce((a, g) => a + g.gapScore, 0) / Math.max(1, gaps.filter((g) => g.status === "pending").length)).toFixed(1), color: "text-brand-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-lg flex-1 text-center">
            <span className={`text-title font-bold ${s.color}`}>{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Filter gaps..." value={search} onChange={setSearch} />
      </div>

      <div className="flex flex-col gap-md">
        {filtered.sort((a, b) => b.gapScore - a.gapScore).map((gap) => (
          <div key={gap.id} className={`rounded-corner-lg p-lg border ${gapStatusColor[gap.status]}`}>
            <div className="flex items-center gap-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-corner-md bg-white border border-border-primary flex items-center justify-center">
                <span className={`text-title font-bold ${gap.gapScore >= 9 ? "text-red-500" : gap.gapScore >= 7 ? "text-orange-500" : "text-yellow-500"}`}>
                  {gap.gapScore}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-label text-text-primary font-semibold">{gap.suggestedTitle}</p>
                <div className="flex items-center gap-sm mt-xs">
                  <span className="text-video-title text-text-tertiary">{gap.entityA}</span>
                  <span className="text-text-tertiary">×</span>
                  <span className="text-video-title text-text-tertiary">{gap.entityB}</span>
                </div>
                <p className="text-label-sm text-text-secondary mt-xs">{gap.reason}</p>
              </div>
              {gap.status === "pending" && (
                <div className="flex items-center gap-sm flex-shrink-0">
                  <Button variant="primary" size="small" iconStart={<Sparkles size={14} />} onClick={() => markAs(gap.id, "created")}>
                    Create with AI
                  </Button>
                  <Button variant="neutral" size="small" onClick={() => markAs(gap.id, "ignored")}>Ignore</Button>
                </div>
              )}
              {gap.status === "created" && (
                <Badge label="Page Created" variant="success" />
              )}
              {gap.status === "ignored" && (
                <Button variant="neutral" size="small" onClick={() => markAs(gap.id, "pending")}>Restore</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Internal Link Manager ----------

type InternalLink = {
  id: string;
  sourceEntity: string;
  targetEntity: string;
  anchorText: string;
  isConfirmed: boolean;
  isAutoGenerated: boolean;
};

type OrphanPage = {
  id: string;
  title: string;
  slug: string;
  inboundLinks: number;
  type: string;
};

const mockLinks: InternalLink[] = [
  { id: "l1", sourceEntity: "Twilio Overview", targetEntity: "Twilio + Zapier", anchorText: "Zapier integration", isConfirmed: false, isAutoGenerated: true },
  { id: "l2", sourceEntity: "Healthcare Industry", targetEntity: "Twilio × Healthcare", anchorText: "Twilio for healthcare", isConfirmed: true, isAutoGenerated: true },
  { id: "l3", sourceEntity: "Automation Tools", targetEntity: "Make vs Zapier", anchorText: "compare Make and Zapier", isConfirmed: false, isAutoGenerated: true },
];

const mockOrphans: OrphanPage[] = [
  { id: "o1", title: "n8n for Healthcare", slug: "/n8n-healthcare", inboundLinks: 0, type: "cross-reference" },
  { id: "o2", title: "Wix Overview", slug: "/platforms/wix", inboundLinks: 1, type: "platform" },
  { id: "o3", title: "Stripe × E-Commerce", slug: "/stripe-e-commerce", inboundLinks: 0, type: "cross-reference" },
];

function InternalLinkTab() {
  const [links, setLinks] = useState<InternalLink[]>(mockLinks);
  const [isScanning, setIsScanning] = useState(false);

  const confirm = (id: string) => setLinks((prev) => prev.map((l) => l.id === id ? { ...l, isConfirmed: true } : l));
  const reject = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

  return (
    <div className="flex flex-col gap-xl">
      <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary font-semibold">Internal Link Suggestions</p>
          <p className="text-label-sm text-text-secondary">AI-suggested internal links to improve site architecture.</p>
        </div>
        <Button variant="primary" iconStart={<Sparkles size={16} />} onClick={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 2000); }} disabled={isScanning}>
          {isScanning ? "Scanning..." : "Scan & Suggest Links"}
        </Button>
      </div>

      <div>
        <p className="text-label text-text-primary font-semibold mb-md">Pending Suggestions</p>
        <div className="flex flex-col gap-sm">
          {links.filter((l) => !l.isConfirmed).map((link) => (
            <div key={link.id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary flex items-center gap-lg">
              <Link size={16} className="text-text-tertiary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-label-sm text-text-primary">
                  <span className="font-semibold">{link.sourceEntity}</span>
                  <span className="text-text-tertiary mx-sm">→</span>
                  <span className="font-semibold">{link.targetEntity}</span>
                </p>
                <p className="text-video-title text-text-tertiary mt-xs">Anchor: "{link.anchorText}"</p>
              </div>
              <Badge label="AI Suggested" variant="default" />
              <div className="flex gap-sm">
                <Button variant="primary" size="small" iconStart={<Check size={14} />} onClick={() => confirm(link.id)}>Confirm</Button>
                <Button variant="neutral" size="small" iconStart={<X size={14} />} onClick={() => reject(link.id)}>Reject</Button>
              </div>
            </div>
          ))}
          {links.filter((l) => !l.isConfirmed).length === 0 && (
            <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
              <Check size={24} className="text-green-500 mx-auto mb-sm" />
              <p className="text-label text-text-secondary">All link suggestions reviewed.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-label text-text-primary font-semibold mb-md">Orphan Pages (Low Inbound Links)</p>
        <div className="flex flex-col gap-sm">
          {mockOrphans.map((page) => (
            <div key={page.id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary flex items-center gap-lg">
              <AlertCircle size={16} className={page.inboundLinks === 0 ? "text-red-500" : "text-yellow-500"} />
              <div className="flex-1">
                <p className="text-label-sm text-text-primary font-semibold">{page.title}</p>
                <p className="text-video-title text-text-tertiary">{page.slug} · {page.type}</p>
              </div>
              <span className={`text-label-sm font-bold ${page.inboundLinks === 0 ? "text-red-500" : "text-yellow-600"}`}>
                {page.inboundLinks} inbound link{page.inboundLinks !== 1 ? "s" : ""}
              </span>
              <Button variant="subtle" size="small" iconStart={<Sparkles size={14} />}>
                Suggest Links
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Content Freshness Dashboard ----------

type FreshContent = {
  id: string;
  title: string;
  slug: string;
  type: string;
  lastUpdated: string;
  daysSinceUpdate: number;
  status: "fresh" | "stale" | "critical";
};

const mockFreshness: FreshContent[] = [
  { id: "fc1", title: "Twilio × Healthcare", slug: "/twilio-healthcare", type: "cross-reference", lastUpdated: "2025-01-15", daysSinceUpdate: 97, status: "critical" },
  { id: "fc2", title: "Make vs Zapier vs n8n", slug: "/compare/make-vs-zapier", type: "comparison", lastUpdated: "2025-02-10", daysSinceUpdate: 71, status: "stale" },
  { id: "fc3", title: "HubSpot Overview", slug: "/tools/hubspot", type: "tool", lastUpdated: "2025-03-05", daysSinceUpdate: 48, status: "stale" },
  { id: "fc4", title: "Lead Generation Pipeline", slug: "/solutions/lead-gen", type: "solution", lastUpdated: "2025-04-01", daysSinceUpdate: 21, status: "fresh" },
  { id: "fc5", title: "Healthcare Industry", slug: "/industries/healthcare", type: "industry", lastUpdated: "2025-04-10", daysSinceUpdate: 12, status: "fresh" },
];

function FreshnessTab() {
  const freshnessBg: Record<FreshContent["status"], string> = {
    fresh: "bg-green-50 border-green-200",
    stale: "bg-yellow-50 border-yellow-200",
    critical: "bg-red-50 border-red-200",
  };

  const freshnessIcon: Record<FreshContent["status"], string> = {
    fresh: "text-green-600",
    stale: "text-yellow-600",
    critical: "text-red-600",
  };

  const sorted = [...mockFreshness].sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex gap-xl">
        {[
          { label: "Critical (>90 days)", value: mockFreshness.filter((f) => f.status === "critical").length, color: "text-red-600" },
          { label: "Stale (30–90 days)", value: mockFreshness.filter((f) => f.status === "stale").length, color: "text-yellow-600" },
          { label: "Fresh (<30 days)", value: mockFreshness.filter((f) => f.status === "fresh").length, color: "text-green-600" },
          { label: "Avg. Age (days)", value: Math.round(mockFreshness.reduce((a, f) => a + f.daysSinceUpdate, 0) / mockFreshness.length), color: "text-text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-lg flex-1 text-center">
            <span className={`text-title font-bold ${s.color}`}>{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-md">
        {sorted.map((item) => (
          <div key={item.id} className={`rounded-corner-lg p-lg border ${freshnessBg[item.status]}`}>
            <div className="flex items-center gap-lg">
              <Clock size={16} className={freshnessIcon[item.status]} />
              <div className="flex-1">
                <p className="text-label text-text-primary font-semibold">{item.title}</p>
                <div className="flex items-center gap-md mt-xs">
                  <span className="text-video-title text-text-tertiary">{item.slug}</span>
                  <span className="text-video-title text-text-tertiary capitalize">{item.type}</span>
                  <span className="text-video-title text-text-tertiary">Last updated: {item.lastUpdated}</span>
                </div>
              </div>
              <span className={`text-label font-bold ${freshnessIcon[item.status]}`}>
                {item.daysSinceUpdate} days
              </span>
              {item.status !== "fresh" && (
                <Button variant="subtle" size="small" iconStart={<Sparkles size={14} />}>
                  AI Refresh
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Review Queue ----------

function ReviewQueueTab({ jobs, onApprove, onReject }: {
  jobs: GenerationJob[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const reviewable = jobs.filter((j) => j.status === "done");
  const approved  = jobs.filter((j) => j.status === "approved");
  const rejected  = jobs.filter((j) => j.status === "rejected");

  const approveAll = () => reviewable.forEach((j) => onApprove(j.id));
  const rejectAll  = () => reviewable.forEach((j) => onReject(j.id));

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary font-semibold">
            Review Queue
            {reviewable.length > 0 && (
              <span className="ml-sm text-label-sm font-normal text-yellow-600">
                {reviewable.length} awaiting review
              </span>
            )}
          </p>
          <p className="text-label-sm text-text-secondary">Accept or reject AI-generated pages before publishing.</p>
        </div>
        {reviewable.length > 0 && (
          <div className="flex gap-sm">
            <Button variant="primary" size="small" iconStart={<Check size={14} />} onClick={approveAll}>
              Approve All ({reviewable.length})
            </Button>
            <Button variant="neutral" size="small" iconStart={<X size={14} />} onClick={rejectAll}>
              Reject All
            </Button>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex gap-xl">
        {[
          { label: "Awaiting Review", value: reviewable.length, color: "text-yellow-600" },
          { label: "Approved", value: approved.length, color: "text-green-600" },
          { label: "Rejected", value: rejected.length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-lg flex-1 text-center">
            <span className={`text-title font-bold ${s.color}`}>{s.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reviewable items */}
      {reviewable.length === 0 ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <Check size={24} className="text-green-500 mx-auto mb-sm" />
          <p className="text-label text-text-secondary">All generated pages have been reviewed.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {reviewable.map((job) => (
            <div key={job.id} className="bg-surface-bg rounded-corner-lg p-lg border border-yellow-200">
              <div className="flex items-start gap-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-sm">
                    <span className="text-label text-text-primary font-semibold">{job.entityA}</span>
                    <span className="text-text-tertiary">×</span>
                    <span className="text-label text-text-primary font-semibold">{job.entityB}</span>
                    <span className="text-video-title text-text-tertiary">/{job.slug}</span>
                  </div>
                  {job.preview && (
                    <p className="text-label-sm text-text-secondary mt-sm border-t border-border-primary pt-sm line-clamp-3">
                      {job.preview}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-sm flex-shrink-0">
                  <Button variant="subtle" size="small" iconStart={<Eye size={14} />}>Preview</Button>
                  <Button variant="primary" size="small" iconStart={<Check size={14} />} onClick={() => onApprove(job.id)}>Approve</Button>
                  <Button variant="neutral" size="small" iconStart={<X size={14} />} onClick={() => onReject(job.id)}>Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decided items summary */}
      {(approved.length > 0 || rejected.length > 0) && (
        <div>
          <p className="text-label text-text-primary font-semibold mb-md">Already Decided</p>
          <div className="flex flex-col gap-sm">
            {[...approved, ...rejected].map((job) => (
              <div key={job.id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary flex items-center gap-lg opacity-70">
                <div className="flex-1 flex items-center gap-sm">
                  <span className="text-label-sm text-text-primary">{job.entityA} × {job.entityB}</span>
                  <span className="text-video-title text-text-tertiary">/{job.slug}</span>
                </div>
                <Badge label={job.status} variant={job.status === "approved" ? "success" : "default"} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------

export function AiContentModule() {
  const [jobs, setJobs] = useState<GenerationJob[]>(mockCombinations);

  const approve = (id: string) => setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "approved" } : j));
  const reject  = (id: string) => setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "rejected" } : j));

  const reviewCount = jobs.filter((j) => j.status === "done").length;

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div>
        <h1 className="text-title text-text-primary">AI Content Tools</h1>
        <p className="text-label-sm text-text-secondary mt-xs">
          Bulk generation, content gap analysis, internal link management, and freshness monitoring.
        </p>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "AI Generations Today", value: "24", icon: <Sparkles size={20} className="text-brand-primary" /> },
          { label: "Pending Review", value: String(reviewCount), icon: <Eye size={20} className="text-yellow-600" /> },
          { label: "Content Gaps Found", value: "6", icon: <TrendingUp size={20} className="text-yellow-600" /> },
          { label: "Stale Pages", value: "3", icon: <Clock size={20} className="text-red-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1">
            <div className="flex items-center gap-md">
              {s.icon}
              <div>
                <span className="text-title text-text-primary">{s.value}</span>
                <p className="text-video-title text-text-secondary">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Tabs
        tabs={[
          { id: "bulk", label: "Bulk Page Generator", content: <BulkGeneratorTab jobs={jobs} setJobs={setJobs} onApprove={approve} onReject={reject} /> },
          { id: "review", label: `Review Queue${reviewCount > 0 ? ` (${reviewCount})` : ""}`, content: <ReviewQueueTab jobs={jobs} onApprove={approve} onReject={reject} /> },
          { id: "gaps", label: "Content Gap Finder", content: <ContentGapTab /> },
          { id: "links", label: "Internal Link Manager", content: <InternalLinkTab /> },
          { id: "freshness", label: "Content Freshness", content: <FreshnessTab /> },
        ]}
        defaultTab="bulk"
      />
    </div>
  );
}
