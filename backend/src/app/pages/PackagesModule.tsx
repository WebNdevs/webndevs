import { useState } from "react";
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
  Check,
  Copy,
  Download,
  Upload,
  Search,
} from "lucide-react";

type Package = {
  id: string;
  name: string;
  tier: string;
  price: number;
  duration: string;
  status: "active" | "draft" | "archived";
  features: string[];
  description: string;
  popular: boolean;
};

const initialPackages: Package[] = [
  {
    id: "PKG-001",
    name: "Starter Web Package",
    tier: "Basic",
    price: 999,
    duration: "One-time",
    status: "active",
    features: ["5-page website", "Responsive design", "Contact form", "Basic SEO", "3 revisions"],
    description: "Perfect for small businesses launching their first website.",
    popular: false,
  },
  {
    id: "PKG-002",
    name: "Business Pro Package",
    tier: "Professional",
    price: 2499,
    duration: "One-time",
    status: "active",
    features: ["15-page website", "Custom design", "CMS integration", "Advanced SEO", "E-commerce ready", "10 revisions"],
    description: "Full-featured website for growing businesses.",
    popular: true,
  },
  {
    id: "PKG-003",
    name: "Enterprise Suite",
    tier: "Enterprise",
    price: 7999,
    duration: "One-time",
    status: "active",
    features: ["Unlimited pages", "Custom web app", "API integrations", "Full SEO strategy", "Priority support", "Unlimited revisions"],
    description: "Complete digital solution for enterprise organizations.",
    popular: false,
  },
  {
    id: "PKG-004",
    name: "Monthly Maintenance",
    tier: "Add-on",
    price: 299,
    duration: "Monthly",
    status: "active",
    features: ["Security updates", "Performance monitoring", "Content updates (2/mo)", "Uptime monitoring", "Monthly reports"],
    description: "Keep your website healthy and up-to-date.",
    popular: false,
  },
  {
    id: "PKG-005",
    name: "SEO Growth Package",
    tier: "Add-on",
    price: 599,
    duration: "Monthly",
    status: "draft",
    features: ["Keyword research", "On-page optimization", "Link building", "Monthly analytics", "Competitor analysis"],
    description: "Drive organic traffic with comprehensive SEO.",
    popular: false,
  },
];

const tierColors: Record<string, "brand" | "success" | "warning" | "default" | "secondary"> = {
  Basic: "secondary",
  Professional: "brand",
  Enterprise: "success",
  "Add-on": "warning",
};

type FormData = {
  name: string;
  tier: string;
  price: string;
  duration: string;
  status: "active" | "draft" | "archived";
  description: string;
  featuresText: string;
  popular: boolean;
};

const emptyForm: FormData = {
  name: "",
  tier: "Basic",
  price: "",
  duration: "One-time",
  status: "draft",
  description: "",
  featuresText: "",
  popular: false,
};

function pkgToForm(pkg: Package): FormData {
  return {
    name: pkg.name,
    tier: pkg.tier,
    price: pkg.price.toString(),
    duration: pkg.duration,
    status: pkg.status,
    description: pkg.description,
    featuresText: pkg.features.join("\n"),
    popular: pkg.popular,
  };
}

function PackageCard({
  pkg,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  pkg: Package;
  onEdit: (p: Package) => void;
  onDelete: (id: string) => void;
  onDuplicate: (p: Package) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg border border-border-primary relative">
      {pkg.popular && (
        <div className="absolute -top-3 left-xl">
          <Badge label="Most Popular" variant="brand" />
        </div>
      )}
      <div className="flex items-start justify-between mt-xs">
        <div className="flex flex-col gap-xs">
          <span className="text-label text-text-primary font-semibold">{pkg.name}</span>
          <span className="text-video-title text-text-tertiary">{pkg.id}</span>
        </div>
        <Badge label={pkg.tier} variant={tierColors[pkg.tier] || "default"} />
      </div>

      <p className="text-label-sm text-text-secondary">{pkg.description}</p>

      <div className="bg-bg-faint rounded-corner-md p-lg flex flex-col gap-sm">
        {pkg.features.map((f) => (
          <div key={f} className="flex items-center gap-sm">
            <Check size={12} className="text-success flex-shrink-0" />
            <span className="text-video-title text-text-primary">{f}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-xs">
        <div>
          <span className="text-title text-text-primary">${pkg.price.toLocaleString()}</span>
          <span className="text-label-sm text-text-secondary ml-xs">/ {pkg.duration}</span>
        </div>
        <Badge
          label={pkg.status}
          variant={pkg.status === "active" ? "success" : pkg.status === "draft" ? "warning" : "default"}
        />
      </div>

      <div className="flex gap-sm">
        <Button variant="neutral" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(pkg)}>
          Edit
        </Button>
        <Button variant="neutral" size="small" iconStart={<Copy size={16} />} onClick={() => onDuplicate(pkg)}>
          Duplicate
        </Button>
        <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(pkg.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function PackageTable({
  packages,
  onEdit,
  onDelete,
}: {
  packages: Package[];
  onEdit: (p: Package) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-secondary">
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Package</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Tier</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Price</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Duration</th>
            <th className="text-left p-lg text-label-sm text-text-secondary font-medium">Status</th>
            <th className="text-right p-lg text-label-sm text-text-secondary font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, i) => (
            <tr
              key={pkg.id}
              className={`${i !== packages.length - 1 ? "border-b border-border-secondary" : ""} hover:bg-bg-faint transition-colors`}
            >
              <td className="p-lg">
                <div>
                  <p className="text-label-sm text-text-primary font-medium">{pkg.name}</p>
                  <p className="text-video-title text-text-tertiary">{pkg.id}</p>
                </div>
              </td>
              <td className="p-lg">
                <Badge label={pkg.tier} variant={tierColors[pkg.tier] || "default"} />
              </td>
              <td className="p-lg text-label-sm text-text-primary">${pkg.price.toLocaleString()}</td>
              <td className="p-lg text-label-sm text-text-secondary">{pkg.duration}</td>
              <td className="p-lg">
                <Badge
                  label={pkg.status}
                  variant={pkg.status === "active" ? "success" : pkg.status === "draft" ? "warning" : "default"}
                />
              </td>
              <td className="p-lg">
                <div className="flex items-center justify-end gap-sm">
                  <Button variant="subtle" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(pkg)}>
                    Edit
                  </Button>
                  <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(pkg.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PackagesModule() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const filtered = packages.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    const matchTier = !filterTier || p.tier === filterTier;
    return matchSearch && matchStatus && matchTier;
  });

  const openCreate = () => {
    setEditingPkg(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setFormData(pkgToForm(pkg));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicate = (pkg: Package) => {
    const newPkg: Package = {
      ...pkg,
      id: `PKG-${String(packages.length + 1).padStart(3, "0")}`,
      name: `${pkg.name} (Copy)`,
      status: "draft",
      popular: false,
    };
    setPackages((prev) => [...prev, newPkg]);
  };

  const handleSave = () => {
    const features = formData.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const price = parseFloat(formData.price) || 0;

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                name: formData.name,
                tier: formData.tier,
                price,
                duration: formData.duration,
                status: formData.status,
                description: formData.description,
                features,
              }
            : p
        )
      );
    } else {
      const newPkg: Package = {
        id: `PKG-${String(packages.length + 1).padStart(3, "0")}`,
        name: formData.name,
        tier: formData.tier,
        price,
        duration: formData.duration,
        status: formData.status,
        description: formData.description,
        features,
        popular: false,
      };
      setPackages((prev) => [...prev, newPkg]);
    }
    setIsModalOpen(false);
  };

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Packages</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage web development service packages and pricing tiers.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<Download size={16} />}>Export</Button>
          <Button variant="neutral" iconStart={<Upload size={16} />}>Import</Button>
          <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>
            New Package
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-xl">
        {[
          { label: "Total Packages", value: packages.length },
          { label: "Active", value: packages.filter((p) => p.status === "active").length },
          { label: "Draft", value: packages.filter((p) => p.status === "draft").length },
          { label: "Popular", value: packages.filter((p) => p.popular).length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center gap-xl">
        <div className="flex-1">
          <InputField
            prefix={<Search size={16} />}
            placeholder="Search packages..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <SelectField
          label=""
          placeholder="All Statuses"
          options={[
            { value: "", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-[160px]"
        />
        <SelectField
          label=""
          placeholder="All Tiers"
          options={[
            { value: "", label: "All Tiers" },
            { value: "Basic", label: "Basic" },
            { value: "Professional", label: "Professional" },
            { value: "Enterprise", label: "Enterprise" },
            { value: "Add-on", label: "Add-on" },
          ]}
          value={filterTier}
          onChange={setFilterTier}
          className="w-[160px]"
        />
        <div className="flex gap-sm">
          <Button
            variant={viewMode === "cards" ? "neutral" : "subtle"}
            size="small"
            onClick={() => setViewMode("cards")}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "neutral" : "subtle"}
            size="small"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-3 gap-xl">
          {filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onEdit={openEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 bg-surface-bg rounded-corner-lg p-2xl text-center">
              <p className="text-label text-text-secondary">No packages found.</p>
            </div>
          )}
        </div>
      ) : (
        <PackageTable packages={filtered} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPkg ? "Edit Package" : "Create New Package"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingPkg ? "Save Changes" : "Create Package"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Package Name"
                placeholder="e.g. Business Pro Package"
                value={formData.name}
                onChange={(v) => updateForm("name", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Tier"
                options={[
                  { value: "Basic", label: "Basic" },
                  { value: "Professional", label: "Professional" },
                  { value: "Enterprise", label: "Enterprise" },
                  { value: "Add-on", label: "Add-on" },
                ]}
                value={formData.tier}
                onChange={(v) => updateForm("tier", v)}
              />
            </div>
          </div>
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Price ($)"
                placeholder="0.00"
                value={formData.price}
                onChange={(v) => updateForm("price", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Duration"
                options={[
                  { value: "One-time", label: "One-time" },
                  { value: "Monthly", label: "Monthly" },
                  { value: "Yearly", label: "Yearly" },
                ]}
                value={formData.duration}
                onChange={(v) => updateForm("duration", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as FormData["status"])}
              />
            </div>
          </div>
          <TextareaField
            label="Description"
            placeholder="Describe this package..."
            value={formData.description}
            rows={3}
            onChange={(v) => updateForm("description", v)}
          />
          <TextareaField
            label="Features (one per line)"
            placeholder={"5-page website\nResponsive design\nContact form"}
            value={formData.featuresText}
            rows={5}
            onChange={(v) => updateForm("featuresText", v)}
          />
        </div>
      </Modal>
    </div>
  );
}
