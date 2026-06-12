import { useState } from "react";
import { Button, Badge, InputField, SelectField, Modal, SwitchField } from "@figma/astraui";
import { Plus, Download, RefreshCw, ChevronRight, Globe, Eye, Pencil, Trash2, Copy, Search } from "lucide-react";

type SitemapEntry = {
  id: string;
  url: string;
  priority: string;
  changefreq: string;
  lastmod: string;
  status: "active" | "excluded" | "noindex";
  children?: SitemapEntry[];
};

const mockSitemap: SitemapEntry[] = [
  {
    id: "sm-1",
    url: "/",
    priority: "1.0",
    changefreq: "weekly",
    lastmod: "2024-12-20",
    status: "active",
    children: [],
  },
  {
    id: "sm-2",
    url: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2024-11-15",
    status: "active",
    children: [],
  },
  {
    id: "sm-3",
    url: "/services",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: "2024-12-18",
    status: "active",
    children: [
      { id: "sm-3-1", url: "/services/web-development", priority: "0.8", changefreq: "monthly", lastmod: "2024-12-01", status: "active" },
      { id: "sm-3-2", url: "/services/seo-optimization", priority: "0.8", changefreq: "monthly", lastmod: "2024-12-01", status: "active" },
      { id: "sm-3-3", url: "/services/ui-ux-design", priority: "0.7", changefreq: "monthly", lastmod: "2024-11-20", status: "active" },
      { id: "sm-3-4", url: "/services/mobile-apps", priority: "0.7", changefreq: "monthly", lastmod: "2024-11-20", status: "active" },
    ],
  },
  {
    id: "sm-4",
    url: "/packages",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: "2024-12-15",
    status: "active",
    children: [
      { id: "sm-4-1", url: "/packages/starter", priority: "0.7", changefreq: "monthly", lastmod: "2024-12-15", status: "active" },
      { id: "sm-4-2", url: "/packages/business-pro", priority: "0.8", changefreq: "monthly", lastmod: "2024-12-15", status: "active" },
      { id: "sm-4-3", url: "/packages/enterprise", priority: "0.8", changefreq: "monthly", lastmod: "2024-12-15", status: "active" },
    ],
  },
  {
    id: "sm-5",
    url: "/blog",
    priority: "0.7",
    changefreq: "daily",
    lastmod: "2024-12-21",
    status: "active",
    children: [
      { id: "sm-5-1", url: "/blog/nextjs-14-best-practices", priority: "0.6", changefreq: "monthly", lastmod: "2024-12-15", status: "active" },
      { id: "sm-5-2", url: "/blog/complete-seo-guide-2025", priority: "0.6", changefreq: "monthly", lastmod: "2024-12-10", status: "active" },
    ],
  },
  {
    id: "sm-6",
    url: "/portfolio",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2024-12-05",
    status: "active",
    children: [],
  },
  {
    id: "sm-7",
    url: "/contact",
    priority: "0.6",
    changefreq: "monthly",
    lastmod: "2024-10-01",
    status: "active",
    children: [],
  },
  {
    id: "sm-8",
    url: "/admin",
    priority: "0.1",
    changefreq: "never",
    lastmod: "2024-01-01",
    status: "excluded",
    children: [],
  },
];

const priorityColors: Record<string, "brand" | "success" | "warning" | "default" | "secondary"> = {
  "1.0": "brand",
  "0.9": "success",
  "0.8": "success",
  "0.7": "warning",
  "0.6": "warning",
  "0.5": "default",
  "0.1": "secondary",
};

const freqColors: Record<string, string> = {
  daily: "text-brand-primary",
  weekly: "text-success",
  monthly: "text-text-secondary",
  never: "text-text-tertiary",
};

function SitemapRow({ entry, depth = 0 }: { entry: SitemapEntry; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = entry.children && entry.children.length > 0;

  return (
    <>
      <tr className="border-b border-border-secondary hover:bg-bg-faint transition-colors">
        <td className="p-lg">
          <div className="flex items-center gap-sm" style={{ paddingLeft: depth * 24 }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="text-text-tertiary hover:text-text-primary transition-colors">
                <ChevronRight size={14} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>
            ) : (
              <span className="w-[14px]" />
            )}
            <Globe size={14} className={depth === 0 ? "text-brand-primary" : "text-text-tertiary"} />
            <span className={`text-label-sm ${depth === 0 ? "text-text-primary font-medium" : "text-text-secondary"}`}>
              {entry.url}
            </span>
          </div>
        </td>
        <td className="p-lg">
          <Badge label={entry.priority} variant={priorityColors[entry.priority] || "default"} />
        </td>
        <td className="p-lg">
          <span className={`text-label-sm ${freqColors[entry.changefreq]}`}>{entry.changefreq}</span>
        </td>
        <td className="p-lg text-label-sm text-text-secondary">{entry.lastmod}</td>
        <td className="p-lg">
          <Badge
            label={entry.status}
            variant={entry.status === "active" ? "success" : entry.status === "excluded" ? "default" : "warning"}
          />
        </td>
        <td className="p-lg">
          <div className="flex items-center justify-end gap-sm">
            <Button variant="subtle" size="small" iconStart={<Pencil size={16} />}>Edit</Button>
            <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />}>Remove</Button>
          </div>
        </td>
      </tr>
      {hasChildren && expanded && entry.children?.map((child) => (
        <SitemapRow key={child.id} entry={child} depth={depth + 1} />
      ))}
    </>
  );
}

function generateXML(entries: SitemapEntry[]): string {
  const baseUrl = "https://webdevs.io";
  const rows: string[] = [];

  const process = (entry: SitemapEntry) => {
    if (entry.status !== "active") return;
    rows.push(
      `  <url>\n    <loc>${baseUrl}${entry.url}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    );
    entry.children?.forEach(process);
  };

  entries.forEach(process);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>`;
}

export function SitemapModule() {
  const [sitemap] = useState<SitemapEntry[]>(mockSitemap);
  const [showXML, setShowXML] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://webdevs.io");
  const [defaultFreq, setDefaultFreq] = useState("weekly");
  const [defaultPriority, setDefaultPriority] = useState("0.8");
  const [newUrl, setNewUrl] = useState("");
  const [newPriority, setNewPriority] = useState("0.8");
  const [newFreq, setNewFreq] = useState("monthly");

  const totalUrls = sitemap.reduce((a, e) => a + 1 + (e.children?.length || 0), 0);
  const activeUrls = sitemap.reduce(
    (a, e) => a + (e.status === "active" ? 1 : 0) + (e.children?.filter((c) => c.status === "active").length || 0),
    0
  );

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Sitemap Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage URL structure, priorities, and generate XML sitemaps.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<RefreshCw size={16} />}>Regenerate</Button>
          <Button variant="neutral" iconStart={<Eye size={16} />} onClick={() => setShowXML(true)}>Preview XML</Button>
          <Button variant="neutral" iconStart={<Download size={16} />}>Download XML</Button>
          <Button variant="primary" iconStart={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>
            Add URL
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-xl">
        {[
          { label: "Total URLs", value: totalUrls },
          { label: "Active", value: activeUrls },
          { label: "Excluded", value: totalUrls - activeUrls },
          { label: "Last Generated", value: "Dec 21, 2024" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Settings Card */}
      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <h2 className="text-label text-text-primary font-semibold mb-lg">Sitemap Settings</h2>
        <div className="flex gap-xl items-end">
          <div className="flex-1">
            <InputField
              label="Site URL"
              value={siteUrl}
              placeholder="https://yoursite.com"
              onChange={setSiteUrl}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Default Change Frequency"
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
              value={defaultFreq}
              onChange={setDefaultFreq}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Default Priority"
              options={[
                { value: "1.0", label: "1.0 - Critical" },
                { value: "0.8", label: "0.8 - High" },
                { value: "0.5", label: "0.5 - Medium" },
                { value: "0.3", label: "0.3 - Low" },
              ]}
              value={defaultPriority}
              onChange={setDefaultPriority}
            />
          </div>
          <Button variant="primary">Save Settings</Button>
        </div>
      </div>

      {/* URL Tree Table */}
      <div className="bg-surface-bg rounded-corner-lg overflow-hidden">
        <div className="p-xl border-b border-border-secondary flex items-center justify-between">
          <h2 className="text-label text-text-primary font-semibold">URL Structure</h2>
          <div className="flex items-center gap-lg">
            <span className="text-label-sm text-text-secondary">{activeUrls} active URLs</span>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-secondary bg-bg-faint">
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">URL Path</th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Priority</th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Change Freq</th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Last Modified</th>
              <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Status</th>
              <th className="text-right p-lg text-label-sm text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sitemap.map((entry) => (
              <SitemapRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Priority Legend */}
      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <h2 className="text-label text-text-primary font-semibold mb-lg">Priority Guide</h2>
        <div className="flex gap-xl flex-wrap">
          {[
            { value: "1.0", label: "Homepage – Critical" },
            { value: "0.9", label: "Main pages – Very High" },
            { value: "0.8", label: "Service pages – High" },
            { value: "0.7", label: "Sub-pages – Medium-High" },
            { value: "0.6", label: "Blog posts – Medium" },
            { value: "0.1", label: "Admin/excluded – Minimal" },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-sm">
              <Badge label={item.value} variant={priorityColors[item.value] || "default"} />
              <span className="text-label-sm text-text-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* XML Preview Modal */}
      <Modal
        isOpen={showXML}
        onClose={() => setShowXML(false)}
        title="Sitemap XML Preview"
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setShowXML(false)}>Close</Button>
            <Button variant="neutral" iconStart={<Copy size={16} />}>Copy XML</Button>
            <Button variant="primary" iconStart={<Download size={16} />}>Download sitemap.xml</Button>
          </>
        }
      >
        <div className="bg-bg-faint rounded-corner-md p-lg overflow-auto max-h-[400px]">
          <pre className="text-video-title text-text-primary font-mono whitespace-pre-wrap">
            {generateXML(sitemap)}
          </pre>
        </div>
      </Modal>

      {/* Add URL Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add URL to Sitemap"
        size="medium"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>Add URL</Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <InputField
            label="URL Path"
            placeholder="/new-page"
            value={newUrl}
            onChange={setNewUrl}
          />
          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Priority"
                options={[
                  { value: "1.0", label: "1.0 - Critical" },
                  { value: "0.9", label: "0.9 - Very High" },
                  { value: "0.8", label: "0.8 - High" },
                  { value: "0.7", label: "0.7 - Medium-High" },
                  { value: "0.6", label: "0.6 - Medium" },
                  { value: "0.5", label: "0.5 - Normal" },
                  { value: "0.3", label: "0.3 - Low" },
                  { value: "0.1", label: "0.1 - Minimal" },
                ]}
                value={newPriority}
                onChange={setNewPriority}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Change Frequency"
                options={[
                  { value: "always", label: "Always" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                  { value: "never", label: "Never" },
                ]}
                value={newFreq}
                onChange={setNewFreq}
              />
            </div>
          </div>
          <InputField label="Last Modified Date" type="date" value="" onChange={() => {}} />
          <SwitchField
            label="Include in Sitemap"
            description="Exclude this URL from the sitemap XML"
            defaultSelected={true}
            onChange={() => {}}
          />
        </div>
      </Modal>
    </div>
  );
}