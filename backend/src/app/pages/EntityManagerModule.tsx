import { useState } from "react";
import {
  Button,
  Badge,
  InputField,
  TextareaField,
  SelectField,
  Modal,
  Tabs,
} from "@figma/astraui";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { FloatingAiButton } from "../components/ai";

type EntityType = "crm" | "automation" | "platform" | "feature";

type Entity = {
  id: string;
  type: EntityType;
  name: string;
  slug: string;
  description: string;
  logo: string;
  websiteUrl: string;
  status: "active" | "draft" | "inactive";
  // CRM-specific
  crmType?: string;
  pricingModel?: string;
  targetSize?: string;
  // Automation-specific
  triggerCount?: number;
  actionCount?: number;
  // Platform-specific
  platformType?: string;
  hostingType?: string;
  // Feature-specific
  featureCategory?: string;
  supportedTools?: string[];
};

const statusColors: Record<Entity["status"], "success" | "warning" | "default"> = {
  active: "success",
  draft: "warning",
  inactive: "default",
};

const crmTypes = ["Sales CRM", "Marketing CRM", "Support CRM", "All-in-One"];
const pricingModels = ["Freemium", "Subscription", "Per Seat", "Usage-Based", "Enterprise"];
const businessSizes = ["Startup", "SMB", "Mid-Market", "Enterprise", "All"];
const platformTypes = ["Website Builder", "E-Commerce", "CMS", "Landing Page"];
const hostingTypes = ["SaaS", "Self-Hosted", "Hybrid"];
const featureCategories = ["Communication", "Messaging", "Calling", "Email", "WhatsApp", "CRM", "Analytics"];

const initialEntities: Entity[] = [
  // CRMs
  {
    id: "E-001", type: "crm", name: "Zoho CRM", slug: "zoho-crm",
    description: "Feature-rich CRM for sales, marketing, and customer support with AI-powered insights.",
    logo: "https://logo.clearbit.com/zoho.com", websiteUrl: "https://zoho.com/crm",
    status: "active", crmType: "All-in-One", pricingModel: "Freemium", targetSize: "SMB",
  },
  {
    id: "E-002", type: "crm", name: "GoHighLevel", slug: "gohighlevel",
    description: "All-in-one sales and marketing platform built for agencies.",
    logo: "https://logo.clearbit.com/gohighlevel.com", websiteUrl: "https://gohighlevel.com",
    status: "active", crmType: "All-in-One", pricingModel: "Subscription", targetSize: "SMB",
  },
  {
    id: "E-003", type: "crm", name: "Salesforce", slug: "salesforce",
    description: "World's #1 enterprise CRM platform with AI-powered automation.",
    logo: "https://logo.clearbit.com/salesforce.com", websiteUrl: "https://salesforce.com",
    status: "active", crmType: "Sales CRM", pricingModel: "Per Seat", targetSize: "Enterprise",
  },
  // Automation
  {
    id: "E-004", type: "automation", name: "Zapier", slug: "zapier",
    description: "No-code automation connecting 6000+ apps with visual workflows.",
    logo: "https://logo.clearbit.com/zapier.com", websiteUrl: "https://zapier.com",
    status: "active", triggerCount: 6000, actionCount: 6000,
  },
  {
    id: "E-005", type: "automation", name: "Make", slug: "make",
    description: "Visual integration platform for complex multi-step automation.",
    logo: "https://logo.clearbit.com/make.com", websiteUrl: "https://make.com",
    status: "active", triggerCount: 1500, actionCount: 1500,
  },
  {
    id: "E-006", type: "automation", name: "n8n", slug: "n8n",
    description: "Open-source workflow automation tool with self-hosting support.",
    logo: "https://logo.clearbit.com/n8n.io", websiteUrl: "https://n8n.io",
    status: "active", triggerCount: 400, actionCount: 400,
  },
  // Platforms
  {
    id: "E-007", type: "platform", name: "Shopify", slug: "shopify",
    description: "Leading e-commerce platform for online stores.",
    logo: "https://logo.clearbit.com/shopify.com", websiteUrl: "https://shopify.com",
    status: "active", platformType: "E-Commerce", hostingType: "SaaS",
  },
  {
    id: "E-008", type: "platform", name: "Webflow", slug: "webflow",
    description: "Professional website builder with CMS and hosting.",
    logo: "https://logo.clearbit.com/webflow.com", websiteUrl: "https://webflow.com",
    status: "active", platformType: "Website Builder", hostingType: "SaaS",
  },
  {
    id: "E-009", type: "platform", name: "Framer", slug: "framer",
    description: "Design-first website builder with interactive components.",
    logo: "https://logo.clearbit.com/framer.com", websiteUrl: "https://framer.com",
    status: "draft", platformType: "Website Builder", hostingType: "SaaS",
  },
  // Features
  {
    id: "E-010", type: "feature", name: "SMS", slug: "sms",
    description: "Short message service integration for transactional and marketing messages.",
    logo: "", websiteUrl: "",
    status: "active", featureCategory: "Messaging", supportedTools: ["Twilio", "Vonage", "Sinch"],
  },
  {
    id: "E-011", type: "feature", name: "WhatsApp Business API", slug: "whatsapp-business-api",
    description: "Official WhatsApp Business API for customer communication at scale.",
    logo: "", websiteUrl: "",
    status: "active", featureCategory: "WhatsApp", supportedTools: ["Twilio", "360dialog", "Vonage"],
  },
  {
    id: "E-012", type: "feature", name: "Voice Calling", slug: "voice-calling",
    description: "Programmable voice calls for customer support and outbound campaigns.",
    logo: "", websiteUrl: "",
    status: "active", featureCategory: "Calling", supportedTools: ["Twilio", "Vonage", "Plivo"],
  },
];

type FormData = {
  name: string;
  slug: string;
  description: string;
  logo: string;
  websiteUrl: string;
  status: Entity["status"];
  crmType: string;
  pricingModel: string;
  targetSize: string;
  triggerCount: string;
  actionCount: string;
  platformType: string;
  hostingType: string;
  featureCategory: string;
  supportedToolsText: string;
};

const emptyForm: FormData = {
  name: "", slug: "", description: "", logo: "", websiteUrl: "",
  status: "draft", crmType: "All-in-One", pricingModel: "Subscription", targetSize: "SMB",
  triggerCount: "", actionCount: "", platformType: "Website Builder", hostingType: "SaaS",
  featureCategory: "Communication", supportedToolsText: "",
};

function entityToForm(e: Entity): FormData {
  return {
    name: e.name, slug: e.slug, description: e.description, logo: e.logo,
    websiteUrl: e.websiteUrl, status: e.status,
    crmType: e.crmType || "All-in-One",
    pricingModel: e.pricingModel || "Subscription",
    targetSize: e.targetSize || "SMB",
    triggerCount: e.triggerCount?.toString() || "",
    actionCount: e.actionCount?.toString() || "",
    platformType: e.platformType || "Website Builder",
    hostingType: e.hostingType || "SaaS",
    featureCategory: e.featureCategory || "Communication",
    supportedToolsText: (e.supportedTools || []).join(", "),
  };
}

function EntityRow({ entity, onEdit, onDelete }: {
  entity: Entity;
  onEdit: (e: Entity) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary hover:bg-bg-faint transition-colors">
      <div className="flex items-center gap-lg">
        <div className="w-10 h-10 rounded-corner-md bg-bg-subtle flex items-center justify-center flex-shrink-0 overflow-hidden">
          {entity.logo ? (
            <img src={entity.logo} alt={entity.name} className="w-8 h-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <Package size={20} className="text-text-tertiary" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-sm">
            <span className="text-label text-text-primary font-semibold">{entity.name}</span>
            <Badge label={entity.status} variant={statusColors[entity.status]} />
            {entity.crmType && (
              <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">{entity.crmType}</span>
            )}
            {entity.platformType && (
              <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">{entity.platformType}</span>
            )}
            {entity.featureCategory && (
              <span className="bg-bg-faint border border-border-secondary text-text-tertiary text-video-title px-sm py-xs rounded-corner-md">{entity.featureCategory}</span>
            )}
          </div>
          <p className="text-label-sm text-text-secondary mt-xs">{entity.description}</p>
          {entity.supportedTools && entity.supportedTools.length > 0 && (
            <p className="text-video-title text-text-tertiary mt-xs">Supported by: {entity.supportedTools.join(", ")}</p>
          )}
        </div>
        <div className="flex items-center gap-sm flex-shrink-0">
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(entity)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(entity.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

function EntityFormFields({ type, formData, updateForm }: {
  type: EntityType;
  formData: FormData;
  updateForm: (k: keyof FormData, v: string) => void;
}) {
  if (type === "crm") {
    return (
      <div className="flex gap-xl">
        <div className="flex-1">
          <SelectField label="CRM Type" options={crmTypes.map((c) => ({ value: c, label: c }))}
            value={formData.crmType} onChange={(v) => updateForm("crmType", v)} />
        </div>
        <div className="flex-1">
          <SelectField label="Pricing Model" options={pricingModels.map((p) => ({ value: p, label: p }))}
            value={formData.pricingModel} onChange={(v) => updateForm("pricingModel", v)} />
        </div>
        <div className="flex-1">
          <SelectField label="Target Business Size" options={businessSizes.map((b) => ({ value: b, label: b }))}
            value={formData.targetSize} onChange={(v) => updateForm("targetSize", v)} />
        </div>
      </div>
    );
  }
  if (type === "automation") {
    return (
      <div className="flex gap-xl">
        <div className="flex-1">
          <InputField label="Trigger Count" type="number" placeholder="6000"
            value={formData.triggerCount} onChange={(v) => updateForm("triggerCount", v)} />
        </div>
        <div className="flex-1">
          <InputField label="Action Count" type="number" placeholder="6000"
            value={formData.actionCount} onChange={(v) => updateForm("actionCount", v)} />
        </div>
      </div>
    );
  }
  if (type === "platform") {
    return (
      <div className="flex gap-xl">
        <div className="flex-1">
          <SelectField label="Platform Type" options={platformTypes.map((p) => ({ value: p, label: p }))}
            value={formData.platformType} onChange={(v) => updateForm("platformType", v)} />
        </div>
        <div className="flex-1">
          <SelectField label="Hosting Type" options={hostingTypes.map((h) => ({ value: h, label: h }))}
            value={formData.hostingType} onChange={(v) => updateForm("hostingType", v)} />
        </div>
      </div>
    );
  }
  if (type === "feature") {
    return (
      <div className="flex flex-col gap-lg">
        <SelectField label="Feature Category" options={featureCategories.map((f) => ({ value: f, label: f }))}
          value={formData.featureCategory} onChange={(v) => updateForm("featureCategory", v)} />
        <InputField label="Supported Tools (comma separated)" placeholder="Twilio, Vonage, Sinch"
          value={formData.supportedToolsText} onChange={(v) => updateForm("supportedToolsText", v)} />
      </div>
    );
  }
  return null;
}

const tabConfig: { id: EntityType; label: string }[] = [
  { id: "crm", label: "CRMs" },
  { id: "automation", label: "Automation Tools" },
  { id: "platform", label: "Platforms" },
  { id: "feature", label: "Features" },
];

export function EntityManagerModule() {
  const [entities, setEntities] = useState<Entity[]>(initialEntities);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [currentType, setCurrentType] = useState<EntityType>("crm");
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = (type: EntityType) => {
    setCurrentType(type);
    setEditingEntity(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (entity: Entity) => {
    setCurrentType(entity.type);
    setEditingEntity(entity);
    setFormData(entityToForm(entity));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = (status: Entity["status"]) => {
    const base: Omit<Entity, "id"> = {
      type: currentType,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      logo: formData.logo,
      websiteUrl: formData.websiteUrl,
      status,
    };

    if (currentType === "crm") {
      Object.assign(base, { crmType: formData.crmType, pricingModel: formData.pricingModel, targetSize: formData.targetSize });
    } else if (currentType === "automation") {
      Object.assign(base, { triggerCount: parseInt(formData.triggerCount) || 0, actionCount: parseInt(formData.actionCount) || 0 });
    } else if (currentType === "platform") {
      Object.assign(base, { platformType: formData.platformType, hostingType: formData.hostingType });
    } else if (currentType === "feature") {
      Object.assign(base, {
        featureCategory: formData.featureCategory,
        supportedTools: formData.supportedToolsText.split(",").map((s) => s.trim()).filter(Boolean),
      });
    }

    if (editingEntity) {
      setEntities((prev) => prev.map((e) => e.id === editingEntity.id ? { ...e, ...base } : e));
    } else {
      setEntities((prev) => [...prev, { id: `E-${String(prev.length + 1).padStart(3, "0")}`, ...base }]);
    }
    setIsModalOpen(false);
  };

  const generateDescription = () => {
    const typeLabels = { crm: "CRM", automation: "automation tool", platform: "platform", feature: "feature" };
    updateForm("description", `A comprehensive ${typeLabels[currentType]} solution designed to streamline operations and boost productivity for modern businesses.`);
  };

  const makeContent = (type: EntityType) => {
    const filtered = entities.filter((e) => e.type === type && e.name.toLowerCase().includes(search.toLowerCase()));
    const typeLabel = tabConfig.find((t) => t.id === type)?.label ?? type;
    return (
      <div className="flex flex-col gap-md">
        <div className="flex justify-end">
          <Button variant="primary" size="small" iconStart={<Plus size={14} />} onClick={() => openCreate(type)}>
            Add {typeLabel.replace(/s$/, "")}
          </Button>
        </div>
        {filtered.map((e) => (
          <EntityRow key={e.id} entity={e} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No {typeLabel.toLowerCase()} found.</p>
          </div>
        )}
      </div>
    );
  };

  const typeLabels: Record<EntityType, string> = { crm: "CRM", automation: "Automation Tool", platform: "Platform", feature: "Feature" };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Entity Manager</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Manage CRMs, Automation Tools, Platforms, and Features.
          </p>
        </div>
      </div>

      <div className="flex gap-xl">
        {tabConfig.map(({ id, label }) => {
          const count = entities.filter((e) => e.type === id).length;
          return (
            <div key={id} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
              <span className="text-title text-text-primary">{count}</span>
              <p className="text-video-title text-text-secondary mt-xs">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search entities..." value={search} onChange={setSearch} />
      </div>

      <Tabs
        tabs={tabConfig.map(({ id, label }) => ({ id, label, content: makeContent(id) }))}
        defaultTab="crm"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntity ? `Edit ${typeLabels[currentType]} — ${editingEntity.name}` : `Add New ${typeLabels[currentType]}`}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => handleSave("draft")}>Save Draft</Button>
            <Button variant="primary" onClick={() => handleSave("active")}>
              {editingEntity ? "Update" : "Publish"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="Name"
                placeholder={`e.g. ${currentType === "crm" ? "Zoho CRM" : currentType === "automation" ? "Zapier" : currentType === "platform" ? "Shopify" : "SMS"}`}
                value={formData.name}
                onChange={(v) => {
                  updateForm("name", v);
                  if (!editingEntity) updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }}
              />
            </div>
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="my-entity-slug" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
          </div>

          {currentType !== "feature" && (
            <div className="flex gap-xl">
              <div className="flex-1">
                <InputField label="Logo URL" placeholder="https://logo.clearbit.com/example.com"
                  value={formData.logo} onChange={(v) => updateForm("logo", v)} />
              </div>
              <div className="flex-1">
                <InputField label="Website URL" placeholder="https://webndevs.com"
                  value={formData.websiteUrl} onChange={(v) => updateForm("websiteUrl", v)} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-sm">
            <div className="flex-1">
              <TextareaField label="Description" placeholder="Brief description..."
                value={formData.description} rows={2} onChange={(v) => updateForm("description", v)} />
            </div>
            <FloatingAiButton onGenerate={generateDescription} isLoading={false} className="mt-6" />
            <div className="w-[160px]">
              <SelectField label="Status" options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]} value={formData.status} onChange={(v) => updateForm("status", v as Entity["status"])} />
            </div>
          </div>

          <EntityFormFields type={currentType} formData={formData} updateForm={updateForm} />
        </div>
      </Modal>
    </div>
  );
}