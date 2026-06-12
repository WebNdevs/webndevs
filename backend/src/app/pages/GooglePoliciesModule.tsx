import { useState } from "react";
import { Button, Badge, Tabs } from "@figma/astraui";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Bell,
  Info,
  Eye,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";

type PolicyAlert = {
  id: string;
  policy: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  affectedPages: string[];
  suggestedFix: string;
  detectedDate: string;
  status: "open" | "resolved" | "ignored";
};

type PolicyUpdate = {
  id: string;
  policy: string;
  date: string;
  summary: string;
  impact: "high" | "medium" | "low";
  actionRequired: boolean;
};

const mockAlerts: PolicyAlert[] = [
  {
    id: "PA-001",
    policy: "Content Policy",
    severity: "critical",
    title: "Thin Content Detected",
    description: "Multiple pages have been flagged for thin or low-quality content that may not meet Google's quality guidelines.",
    affectedPages: ["/services/maintenance", "/packages/starter", "/blog/draft-post"],
    suggestedFix: "Add at least 300+ words of original, valuable content to each flagged page. Include relevant details, FAQs, or case studies.",
    detectedDate: "2024-12-20",
    status: "open",
  },
  {
    id: "PA-002",
    policy: "Core Web Vitals",
    severity: "warning",
    title: "LCP Score Below Threshold",
    description: "Largest Contentful Paint (LCP) exceeds 2.5 seconds on mobile devices, violating Google's Core Web Vitals standards.",
    affectedPages: ["/", "/packages", "/portfolio"],
    suggestedFix: "Optimize hero images, enable lazy loading, implement CDN for static assets, and reduce server response time.",
    detectedDate: "2024-12-18",
    status: "open",
  },
  {
    id: "PA-003",
    policy: "Link Spam Policy",
    severity: "warning",
    title: "Excessive Footer Links",
    description: "The footer contains a large number of links that may be considered spammy by Google's link spam guidelines.",
    affectedPages: ["All pages (footer)"],
    suggestedFix: "Reduce footer links to essential navigation only. Use rel='nofollow' for external links where appropriate.",
    detectedDate: "2024-12-15",
    status: "open",
  },
  {
    id: "PA-004",
    policy: "Cookie Consent",
    severity: "critical",
    title: "Missing Cookie Consent Banner",
    description: "No cookie consent mechanism detected. GDPR and Google's consent requirements mandate user consent for tracking cookies.",
    affectedPages: ["All pages"],
    suggestedFix: "Implement a GDPR-compliant cookie consent banner with clear accept/decline options before setting analytics cookies.",
    detectedDate: "2024-12-10",
    status: "open",
  },
  {
    id: "PA-005",
    policy: "Structured Data",
    severity: "info",
    title: "Missing Schema Markup",
    description: "Service pages are missing LocalBusiness and Service schema markup that could improve rich snippet eligibility.",
    affectedPages: ["/services", "/about", "/contact"],
    suggestedFix: "Add JSON-LD schema markup for LocalBusiness, Service, and FAQPage on relevant pages.",
    detectedDate: "2024-12-05",
    status: "open",
  },
  {
    id: "PA-006",
    policy: "Mobile Usability",
    severity: "info",
    title: "Tap Target Size Issues",
    description: "Several button and link elements on mobile have insufficient tap target sizes (less than 48×48px).",
    affectedPages: ["/blog", "/packages/enterprise"],
    suggestedFix: "Increase touch target sizes to minimum 48×48px for all interactive elements on mobile.",
    detectedDate: "2024-12-01",
    status: "resolved",
  },
];

const mockUpdates: PolicyUpdate[] = [
  {
    id: "PU-001",
    policy: "Spam Policies",
    date: "2024-12-15",
    summary: "Google updated spam policies to include AI-generated content guidelines. Sites must ensure AI content is reviewed and adds value.",
    impact: "high",
    actionRequired: true,
  },
  {
    id: "PU-002",
    policy: "Core Web Vitals",
    date: "2024-11-30",
    summary: "Google confirmed that Core Web Vitals will have increased ranking weight in the March 2025 algorithm update.",
    impact: "high",
    actionRequired: true,
  },
  {
    id: "PU-003",
    policy: "Product Reviews",
    date: "2024-11-20",
    summary: "Product review guidelines updated to require more in-depth, expert-level reviews with original media.",
    impact: "medium",
    actionRequired: false,
  },
  {
    id: "PU-004",
    policy: "Link Building",
    date: "2024-10-28",
    summary: "Google clarified that buying or selling links that pass PageRank is a violation regardless of disclosure.",
    impact: "medium",
    actionRequired: false,
  },
];

const severityIcons = {
  critical: <AlertCircle size={16} className="text-danger" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  info: <Info size={16} className="text-brand-primary" />,
};

const severityColors = {
  critical: "danger" as const,
  warning: "warning" as const,
  info: "brand" as const,
};

const impactColors = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "secondary" as const,
};

function AlertCard({ alert }: { alert: PolicyAlert }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-surface-bg rounded-corner-lg p-xl border ${
      alert.severity === "critical" ? "border-danger" :
      alert.severity === "warning" ? "border-warning" :
      "border-border-primary"
    }`}>
      <div className="flex items-start justify-between gap-xl">
        <div className="flex items-start gap-lg flex-1">
          {severityIcons[alert.severity]}
          <div className="flex flex-col gap-xs flex-1">
            <div className="flex items-center gap-lg">
              <span className="text-label text-text-primary font-semibold">{alert.title}</span>
              <Badge label={alert.severity} variant={severityColors[alert.severity]} />
              <Badge label={alert.policy} variant="secondary" />
            </div>
            <p className="text-label-sm text-text-secondary">{alert.description}</p>
            <div className="flex items-center gap-lg mt-xs">
              <div className="flex items-center gap-xs text-text-tertiary">
                <Clock size={12} />
                <span className="text-video-title">Detected: {alert.detectedDate}</span>
              </div>
              <div className="flex items-center gap-xs text-text-tertiary">
                <Eye size={12} />
                <span className="text-video-title">{alert.affectedPages.length} page(s) affected</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-sm flex-shrink-0">
          <Badge label={alert.status} variant={alert.status === "resolved" ? "success" : alert.status === "ignored" ? "default" : "warning"} />
          <Button variant="subtle" size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Less" : "Details"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-lg pt-lg border-t border-border-secondary flex flex-col gap-lg">
          <div>
            <p className="text-label-sm text-text-primary font-medium mb-sm">Affected Pages:</p>
            <div className="flex flex-wrap gap-sm">
              {alert.affectedPages.map((page) => (
                <span key={page} className="bg-bg-faint border border-border-secondary rounded-corner-md px-sm py-xs text-video-title text-text-primary font-mono">
                  {page}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-bg-faint rounded-corner-md p-lg">
            <div className="flex items-center gap-sm mb-sm">
              <Zap size={14} className="text-brand-primary" />
              <span className="text-label-sm text-text-primary font-medium">Suggested Fix</span>
            </div>
            <p className="text-label-sm text-text-secondary">{alert.suggestedFix}</p>
          </div>
          <div className="flex gap-sm">
            <Button variant="primary" size="small">Mark as Resolved</Button>
            <Button variant="neutral" size="small" iconStart={<ExternalLink size={16} />}>Google Documentation</Button>
            <Button variant="subtle" size="small">Ignore</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceScore() {
  const total = mockAlerts.length;
  const open = mockAlerts.filter((a) => a.status === "open").length;
  const critical = mockAlerts.filter((a) => a.severity === "critical" && a.status === "open").length;
  const score = Math.round(((total - open) / total) * 100);

  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg">
      <h2 className="text-label text-text-primary font-semibold">Compliance Score</h2>
      <div className="flex items-center gap-xl">
        <div className="relative w-[100px] h-[100px] flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-subtle)" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={score >= 70 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)"}
              strokeWidth="10"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-heading text-text-primary font-semibold">{score}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-md">
            <AlertCircle size={14} className="text-danger" />
            <span className="text-label-sm text-text-secondary">{critical} Critical issues</span>
          </div>
          <div className="flex items-center gap-md">
            <AlertTriangle size={14} className="text-warning" />
            <span className="text-label-sm text-text-secondary">{mockAlerts.filter((a) => a.severity === "warning" && a.status === "open").length} Warnings</span>
          </div>
          <div className="flex items-center gap-md">
            <CheckCircle size={14} className="text-success" />
            <span className="text-label-sm text-text-secondary">{mockAlerts.filter((a) => a.status === "resolved").length} Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GooglePoliciesModule() {
  const openAlerts = mockAlerts.filter((a) => a.status === "open");
  const resolvedAlerts = mockAlerts.filter((a) => a.status === "resolved");

  const alertsTab = (alerts: PolicyAlert[]) => (
    <div className="flex flex-col gap-lg">
      {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
    </div>
  );

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Google Policies Compliance</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Monitor policy compliance, track updates, and get fix recommendations.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<Bell size={16} />}>Alert Settings</Button>
          <Button variant="neutral" iconStart={<RefreshCw size={16} />}>Scan Now</Button>
          <Button variant="primary" iconStart={<ShieldCheck size={16} />}>Full Audit</Button>
        </div>
      </div>

      {/* Overview */}
      <div className="flex gap-xl">
        <ComplianceScore />
        <div className="flex-1 grid grid-cols-2 gap-xl">
          {[
            { label: "Total Alerts", value: mockAlerts.length, icon: <Bell size={16} />, color: "text-text-primary" },
            { label: "Critical", value: mockAlerts.filter((a) => a.severity === "critical" && a.status === "open").length, icon: <AlertCircle size={16} />, color: "text-danger" },
            { label: "Warnings", value: mockAlerts.filter((a) => a.severity === "warning" && a.status === "open").length, icon: <AlertTriangle size={16} />, color: "text-warning" },
            { label: "Policy Updates", value: mockUpdates.length, icon: <TrendingUp size={16} />, color: "text-brand-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex items-center gap-lg">
              <div className={`${stat.color} bg-bg-faint p-md rounded-corner-md`}>
                {stat.icon}
              </div>
              <div>
                <span className="text-heading text-text-primary">{stat.value}</span>
                <p className="text-video-title text-text-secondary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts with Tabs */}
      <Tabs
        tabs={[
          { id: "open", label: `Open Issues (${openAlerts.length})`, content: alertsTab(openAlerts) },
          { id: "resolved", label: `Resolved (${resolvedAlerts.length})`, content: alertsTab(resolvedAlerts) },
          {
            id: "updates",
            label: `Policy Updates (${mockUpdates.length})`,
            content: (
              <div className="flex flex-col gap-lg">
                {mockUpdates.map((update) => (
                  <div key={update.id} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary flex flex-col gap-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-lg">
                        <TrendingUp size={16} className="text-brand-primary" />
                        <span className="text-label text-text-primary font-semibold">{update.policy} Update</span>
                        <Badge label={update.impact + " impact"} variant={impactColors[update.impact]} />
                        {update.actionRequired && <Badge label="Action Required" variant="danger" />}
                      </div>
                      <span className="text-video-title text-text-tertiary">{update.date}</span>
                    </div>
                    <p className="text-label-sm text-text-secondary">{update.summary}</p>
                    <div className="flex gap-sm">
                      <Button variant="neutral" size="small" iconStart={<ExternalLink size={16} />}>Read Full Update</Button>
                      {update.actionRequired && <Button variant="primary" size="small">Take Action</Button>}
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
        defaultTab="open"
      />
    </div>
  );
}
