import { useEffect, useMemo, useState } from "react";
import { Badge, Button, InputField, SelectField, TextareaField } from "@figma/astraui";
import { CheckCircle2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../config/api.config";
import { clearStoredAuth, getStoredToken, setStoredToken } from "../auth";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type Service = {
  id: number;
  name: string;
  slug: string;
  category: string;
  status: "active" | "inactive";
  hero_image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  canonical_url?: string | null;
};

type ServiceDetail = Service & {
  categories?: Array<{
    id: number;
    pivot?: {
      is_primary?: boolean;
    };
  }>;
};

type ServicePlan = {
  id: number;
  plan_key: string;
  name: string;
  price: string | number;
  billing_cycle: "one_time" | "monthly";
  delivery_days: number | null;
  max_duration_days?: number | null;
  description: string | null;
  features: string[] | null;
  custom_config?: Record<string, unknown> | null;
  max_revisions?: number | null;
  comparison_points?: string[] | null;
  parent_plan_id?: number | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

type ServicePlanRelation = {
  id: number;
  from_plan_id: number;
  to_plan_id: number;
  relation_type: "upgrade" | "downgrade" | "alternative";
};

type ServicePlansPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  sync_token: string;
  plans: ServicePlan[];
  relations: ServicePlanRelation[];
};

type ServiceTemplateField = {
  id: number;
  field_key: string;
  label: string;
  field_type: "text" | "long_text" | "number" | "boolean" | "image" | "json";
  is_required: boolean;
  default_value: unknown;
  options: unknown;
  display_order: number;
};

type ServiceTemplateValue = {
  id: number;
  field_key: string;
  service_plan_id: number | null;
  value: unknown;
};

type ServiceTemplatesPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  fields: ServiceTemplateField[];
  values: ServiceTemplateValue[];
};

type ServicePageContentItem = {
  id?: number;
  content_key: string;
  label: string;
  content_type: "text" | "rich_text" | "number" | "boolean" | "image" | "json" | "seo";
  value: unknown;
  is_active: boolean;
  display_order: number;
};

type ServicePageContentPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  items: ServicePageContentItem[];
};

type SectionKey =
  | "how_we_work"
  | "who_is_this_for"
  | "real_results_delivered"
  | "client_testimonials"
  | "frequently_asked_questions"
  | "technologies_we_use"
  | "what_you_get"
  | "why_choose_our_service";

type ManagedSection = {
  section_key: SectionKey;
  heading: string;
  subheading?: string;
  is_active: boolean;
  items: Array<Record<string, string>>;
};

type ServicePageSectionsPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  locale: string;
  stage: "draft" | "published";
  sections: ManagedSection[];
};

type ServicePageSectionHistoryPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  locale: string;
  items: Array<{
    id: number;
    version_number: number;
    stage: "draft" | "published";
    change_type: string;
    created_at: string;
  }>;
};

type PackageOffer = {
  id?: number;
  offer_key: string;
  plan_key: string;
  name: string;
  description: string | null;
  offer_type: "percentage_discount" | "fixed_discount" | "bundle";
  discount_value: string | number | null;
  combo_plan_keys: string[] | null;
  combo_price: string | number | null;
  conditions: Record<string, unknown> | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  display_order: number;
};

type PackageOffersPayload = {
  service: Pick<Service, "id" | "name" | "slug">;
  offers: PackageOffer[];
};

type ServiceCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  full_slug: string;
  description: string | null;
  is_active: boolean;
  template_key: string | null;
  custom_fields: Record<string, unknown> | null;
  conditional_rules: Record<string, unknown> | null;
  display_order: number;
  services_count?: number;
};

type MediaFolderNode = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  full_path: string;
  display_order: number;
  children: MediaFolderNode[];
};

type MediaAsset = {
  id?: number;
  media_folder_id: number | null;
  service_id: number | null;
  service_category_id: number | null;
  title: string | null;
  alt_text: string | null;
  caption: string | null;
  file_name: string;
  disk: string;
  path: string;
  url: string;
  mime_type: string | null;
  size_bytes: number;
  width: number | null;
  height: number | null;
  tags: string[] | null;
  optimization_meta: Record<string, unknown> | null;
  is_optimized: boolean;
  display_order: number;
};

type Paginated<T> = {
  data: T[];
};

type EditablePlan = {
  row_id: string;
  id?: number;
  plan_key: string;
  name: string;
  price: string;
  billing_cycle: "one_time" | "monthly";
  delivery_days: string;
  max_duration_days: string;
  description: string;
  features_text: string;
  custom_config_text: string;
  max_revisions: string;
  comparison_points_text: string;
  parent_plan_key: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

type EditableRelation = {
  row_id: string;
  from_plan_key: string;
  to_plan_key: string;
  relation_type: "upgrade" | "downgrade" | "alternative";
};

type EditableTemplateField = {
  row_id: string;
  field_key: string;
  label: string;
  field_type: "text" | "long_text" | "number" | "boolean" | "image" | "json";
  is_required: boolean;
  default_value_text: string;
  options_text: string;
  display_order: number;
};

type EditableTemplateValue = {
  row_id: string;
  field_key: string;
  service_plan_key: string;
  service_plan_id: number | null;
  value_text: string;
};

type EditableContentItem = {
  row_id: string;
  content_key: string;
  label: string;
  content_type: "text" | "rich_text" | "number" | "boolean" | "image" | "json" | "seo";
  value_text: string;
  is_active: boolean;
  display_order: number;
};

type EditableSectionItem = {
  title: string;
  description: string;
  value: string;
  question: string;
  answer: string;
  name: string;
  role: string;
  quote: string;
  metric: string;
  author_name: string;
  author_title: string;
  company: string;
  content: string;
  rating: string;
  category: string;
  results: string;
  technologies: string;
  icon: string;
  number: string;
  project_url: string;
};

type EditableManagedSection = {
  section_key: SectionKey;
  heading: string;
  subheading: string;
  is_active: boolean;
  items: EditableSectionItem[];
};

type EditableOffer = {
  row_id: string;
  offer_key: string;
  plan_key: string;
  name: string;
  description: string;
  offer_type: "percentage_discount" | "fixed_discount" | "bundle";
  discount_value: string;
  combo_plan_keys_text: string;
  combo_price: string;
  conditions_text: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  display_order: number;
};

type EditableCategory = {
  id?: number;
  parent_id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  template_key: string;
  custom_fields_text: string;
  conditional_rules_text: string;
  display_order: number;
  is_selected: boolean;
};

type EditableMediaAsset = {
  id?: number;
  media_folder_id: string;
  service_id: string;
  service_category_id: string;
  title: string;
  alt_text: string;
  caption: string;
  file_name: string;
  disk: string;
  path: string;
  url: string;
  mime_type: string;
  size_bytes: string;
  width: string;
  height: string;
  tags_text: string;
  optimization_meta_text: string;
  is_optimized: boolean;
  display_order: number;
  is_selected: boolean;
};

const categoryList = ["Web Development", "UI/UX Design", "SEO & Marketing", "Cybersecurity", "Mobile Apps", "Domain & Hosting"];

type ServicePlansTab = "plan_configurations" | "service_page_sections";
type PlanConfigSectionTab =
  | "plan_definitions"
  | "package_relations"
  | "template_fields"
  | "template_values"
  | "service_metadata"
  | "package_offers"
  | "service_categories"
  | "media_library";
type ServicePageSectionTab = "publishing_workflow" | "managed_sections" | "dynamic_content" | SectionKey;

const ACTIVE_TAB_STORAGE_KEY = "wnd_service_plans_active_tab";
const PLAN_CONFIG_SECTION_TABS: Array<{ value: PlanConfigSectionTab; label: string }> = [
  { value: "plan_definitions", label: "Plan Definitions" },
  { value: "package_relations", label: "Package Relations" },
  { value: "template_fields", label: "Template Fields" },
  { value: "template_values", label: "Template Values" },
  { value: "service_metadata", label: "Service Metadata" },
  { value: "package_offers", label: "Package Offers" },
  { value: "service_categories", label: "Service Categories" },
  { value: "media_library", label: "Media Library" },
];
const SERVICE_PAGE_BASE_SECTION_TABS: Array<{ value: Exclude<ServicePageSectionTab, SectionKey>; label: string }> = [
  { value: "publishing_workflow", label: "Publishing Workflow" },
  { value: "managed_sections", label: "Managed Sections" },
  { value: "dynamic_content", label: "Dynamic Content" },
];
const SECTION_DEFINITIONS: Array<{ key: SectionKey; label: string }> = [
  { key: "how_we_work", label: "How We Work" },
  { key: "who_is_this_for", label: "Who Is This For?" },
  { key: "real_results_delivered", label: "Real Results We've Delivered" },
  { key: "client_testimonials", label: "Client Testimonials" },
  { key: "frequently_asked_questions", label: "Frequently Asked Questions" },
  { key: "technologies_we_use", label: "Technologies We Use" },
  { key: "what_you_get", label: "What You Get" },
  { key: "why_choose_our_service", label: "Why Choose Our Service?" },
];

function emptySectionItem(): EditableSectionItem {
  return {
    title: "",
    description: "",
    value: "",
    question: "",
    answer: "",
    name: "",
    role: "",
    quote: "",
    metric: "",
    author_name: "",
    author_title: "",
    company: "",
    content: "",
    rating: "5",
    category: "",
    results: "",
    technologies: "",
    icon: "",
    number: "",
    project_url: "",
  };
}

function defaultManagedSections(): EditableManagedSection[] {
  return SECTION_DEFINITIONS.map((section) => ({
    section_key: section.key,
    heading: "",
    subheading: "",
    is_active: true,
    items: [emptySectionItem()],
  }));
}

function toEditablePlan(plan: ServicePlan): EditablePlan {
  return {
    row_id: `plan-${plan.id}`,
    id: plan.id,
    plan_key: plan.plan_key,
    name: plan.name,
    price: String(plan.price ?? "0"),
    billing_cycle: plan.billing_cycle,
    delivery_days: plan.delivery_days ? String(plan.delivery_days) : "",
    max_duration_days: plan.max_duration_days ? String(plan.max_duration_days) : "",
    description: plan.description ?? "",
    features_text: (plan.features ?? []).join("\n"),
    custom_config_text: plan.custom_config ? JSON.stringify(plan.custom_config, null, 2) : "",
    max_revisions: plan.max_revisions != null ? String(plan.max_revisions) : "",
    comparison_points_text: (plan.comparison_points ?? []).join("\n"),
    parent_plan_key: "",
    is_featured: Boolean(plan.is_featured),
    is_active: Boolean(plan.is_active),
    display_order: plan.display_order ?? 0,
  };
}

function emptyPlan(order: number): EditablePlan {
  return {
    row_id: `plan-new-${crypto.randomUUID()}`,
    plan_key: "",
    name: "",
    price: "",
    billing_cycle: "one_time",
    delivery_days: "",
    max_duration_days: "",
    description: "",
    features_text: "",
    custom_config_text: "",
    max_revisions: "",
    comparison_points_text: "",
    parent_plan_key: "",
    is_featured: false,
    is_active: true,
    display_order: order,
  };
}

function emptyTemplateField(order: number): EditableTemplateField {
  return {
    row_id: `template-field-new-${crypto.randomUUID()}`,
    field_key: "",
    label: "",
    field_type: "text",
    is_required: false,
    default_value_text: "",
    options_text: "",
    display_order: order,
  };
}

function emptyTemplateValue(): EditableTemplateValue {
  return {
    row_id: `template-value-new-${crypto.randomUUID()}`,
    field_key: "",
    service_plan_key: "",
    service_plan_id: null,
    value_text: "",
  };
}

function emptyContentItem(order: number): EditableContentItem {
  return {
    row_id: `content-new-${crypto.randomUUID()}`,
    content_key: "",
    label: "",
    content_type: "text",
    value_text: "",
    is_active: true,
    display_order: order,
  };
}

function emptyOffer(order: number): EditableOffer {
  return {
    row_id: `offer-new-${crypto.randomUUID()}`,
    offer_key: "",
    plan_key: "",
    name: "",
    description: "",
    offer_type: "percentage_discount",
    discount_value: "",
    combo_plan_keys_text: "",
    combo_price: "",
    conditions_text: "",
    starts_at: "",
    ends_at: "",
    is_active: true,
    display_order: order,
  };
}

function emptyCategory(order: number): EditableCategory {
  return {
    parent_id: "",
    name: "",
    slug: "",
    description: "",
    is_active: true,
    template_key: "",
    custom_fields_text: "",
    conditional_rules_text: "",
    display_order: order,
    is_selected: false,
  };
}

function emptyMediaAsset(order: number): EditableMediaAsset {
  return {
    media_folder_id: "",
    service_id: "",
    service_category_id: "",
    title: "",
    alt_text: "",
    caption: "",
    file_name: "",
    disk: "",
    path: "",
    url: "",
    mime_type: "",
    size_bytes: "",
    width: "",
    height: "",
    tags_text: "",
    optimization_meta_text: "",
    is_optimized: false,
    display_order: order,
    is_selected: false,
  };
}

function parseJsonText(value: string): unknown | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  try {
    return JSON.parse(normalized);
  } catch {
    return normalized;
  }
}

function keyFromName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toEditableSectionItem(item: Record<string, string> | undefined): EditableSectionItem {
  return {
    title: item?.title ?? "",
    description: item?.description ?? "",
    value: item?.value ?? "",
    question: item?.question ?? "",
    answer: item?.answer ?? "",
    name: item?.name ?? "",
    role: item?.role ?? "",
    quote: item?.quote ?? "",
    metric: item?.metric ?? "",
    author_name: item?.author_name ?? item?.name ?? "",
    author_title: item?.author_title ?? item?.role ?? "",
    company: item?.company ?? item?.metric ?? "",
    content: item?.content ?? item?.quote ?? "",
    rating: item?.rating ? String(item.rating) : "5",
    category: item?.category ?? item?.name ?? "",
    results: Array.isArray(item?.results) ? item.results.join("\n") : item?.results ?? item?.value ?? "",
    technologies: Array.isArray(item?.technologies) ? item.technologies.join(", ") : item?.technologies ?? item?.metric ?? "",
    icon: item?.icon ?? item?.value ?? "",
    number: item?.number ?? "",
    project_url: item?.project_url ?? item?.url ?? "",
  };
}

function cleanSectionItem(sectionKey: SectionKey, item: EditableSectionItem): Record<string, string | number | string[] | null> {
  if (sectionKey === "client_testimonials") {
    return {
      author_name: item.author_name.trim() || null,
      author_title: item.author_title.trim() || null,
      company: item.company.trim() || null,
      content: item.content.trim() || null,
      rating: Number(item.rating || 5),
    };
  }

  if (sectionKey === "frequently_asked_questions") {
    return {
      question: item.question.trim() || null,
      answer: item.answer.trim() || null,
    };
  }

  if (sectionKey === "real_results_delivered") {
    return {
      title: item.title.trim() || null,
      category: item.category.trim() || null,
      description: item.description.trim() || null,
      results: item.results.split("\n").map((x) => x.trim()).filter(Boolean),
      technologies: item.technologies.split(",").map((x) => x.trim()).filter(Boolean),
      project_url: item.project_url.trim() || null,
    };
  }

  if (sectionKey === "how_we_work") {
    return {
      number: item.number.trim() || null,
      title: item.title.trim() || null,
      description: item.description.trim() || null,
    };
  }

  if (sectionKey === "who_is_this_for") {
    return {
      title: item.title.trim() || null,
      description: item.description.trim() || null,
    };
  }

  if (sectionKey === "technologies_we_use") {
    return {
      title: item.title.trim() || null,
    };
  }

  if (sectionKey === "what_you_get") {
    return {
      number: item.number.trim() || null,
      title: item.title.trim() || null,
      description: item.description.trim() || null,
    };
  }

  if (sectionKey === "why_choose_our_service") {
    return {
      title: item.title.trim() || null,
      icon: item.icon.trim() || null,
      description: item.description.trim() || null,
    };
  }

  return {
    title: item.title.trim() || null,
    description: item.description.trim() || null,
  };
}

export function ServicePlansModule() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeServiceSlug, setActiveServiceSlug] = useState("");
  const [plans, setPlans] = useState<EditablePlan[]>([]);
  const [relations, setRelations] = useState<EditableRelation[]>([]);
  const [templateFields, setTemplateFields] = useState<EditableTemplateField[]>([]);
  const [templateValues, setTemplateValues] = useState<EditableTemplateValue[]>([]);
  const [pageContents, setPageContents] = useState<EditableContentItem[]>([]);
  const [managedSections, setManagedSections] = useState<EditableManagedSection[]>(defaultManagedSections());
  const [sectionHistory, setSectionHistory] = useState<ServicePageSectionHistoryPayload["items"]>([]);
  const [sectionLocale, setSectionLocale] = useState("en");
  const [selectedSectionVersionId, setSelectedSectionVersionId] = useState("");
  const [offers, setOffers] = useState<EditableOffer[]>([]);
  const [categories, setCategories] = useState<EditableCategory[]>([]);
  const [mediaFolders, setMediaFolders] = useState<MediaFolderNode[]>([]);
  const [mediaAssets, setMediaAssets] = useState<EditableMediaAsset[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [serviceMetaTitle, setServiceMetaTitle] = useState("");
  const [serviceMetaDescription, setServiceMetaDescription] = useState("");
  const [serviceMetaKeywords, setServiceMetaKeywords] = useState("");
  const [serviceHeroImageUrl, setServiceHeroImageUrl] = useState("");
  const [serviceCanonicalUrl, setServiceCanonicalUrl] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState("");
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState(() => getStoredToken());
  const [activeTab, setActiveTab] = useState<ServicePlansTab>(() => {
    const stored = localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return stored === "service_page_sections" ? "service_page_sections" : "plan_configurations";
  });
  const [activePlanConfigTab, setActivePlanConfigTab] = useState<PlanConfigSectionTab>("plan_definitions");
  const [activeServicePageSectionTab, setActiveServicePageSectionTab] = useState<ServicePageSectionTab>("publishing_workflow");
  const [isMobileLayout, setIsMobileLayout] = useState(() => window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);
  const [isTemplateSaving, setIsTemplateSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const canManage = adminToken.trim().length > 0;
  const activeService = useMemo(() => services.find((service) => service.slug === activeServiceSlug) ?? null, [services, activeServiceSlug]);
  const servicePageSectionTabs = useMemo<Array<{ value: ServicePageSectionTab; label: string }>>(
    () => [
      SERVICE_PAGE_BASE_SECTION_TABS[0],
      SERVICE_PAGE_BASE_SECTION_TABS[1],
      ...SECTION_DEFINITIONS.map((section) => ({ value: section.key, label: section.label })),
      SERVICE_PAGE_BASE_SECTION_TABS[2],
    ],
    [],
  );
  const managedSectionKeys = useMemo(() => new Set(SECTION_DEFINITIONS.map((section) => section.key)), []);
  const activeManagedSectionIndex = managedSectionKeys.has(activeServicePageSectionTab as SectionKey)
    ? managedSections.findIndex((section) => section.section_key === activeServicePageSectionTab)
    : -1;
  const activeManagedSection = activeManagedSectionIndex >= 0 ? managedSections[activeManagedSectionIndex] : null;
  const isPlanTabActive = activeTab === "plan_configurations";

  function handleTabChange(nextTab: ServicePlansTab) {
    setActiveTab(nextTab);
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, nextTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function fetchServices() {
    setIsLoading(true);
    setErrorText("");
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const payload: ApiResponse<{ data: Service[] }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch services.");
      }

      const nextServices = payload.data?.data ?? [];
      setServices(nextServices);
      if (!activeServiceSlug && nextServices.length > 0) {
        setActiveServiceSlug(nextServices[0].slug);
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch services.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPlans(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }

    setIsLoading(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/plans`);
      const payload: ApiResponse<ServicePlansPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch plans.");
      }

      const sourcePlans = payload.data?.plans ?? [];
      const planIdToKey = new Map<number, string>();
      sourcePlans.forEach((plan) => {
        planIdToKey.set(plan.id, plan.plan_key);
      });

      const editable = sourcePlans.length > 0 ? sourcePlans.map(toEditablePlan) : [emptyPlan(0), emptyPlan(1), emptyPlan(2)];
      editable.forEach((plan, index) => {
        const source = sourcePlans[index];
        plan.parent_plan_key = source?.parent_plan_id ? planIdToKey.get(source.parent_plan_id) ?? "" : "";
      });
      setPlans(editable);
      setRelations(
        (payload.data?.relations ?? [])
          .map((relation) => ({
            row_id: `relation-${relation.id}`,
            from_plan_key: planIdToKey.get(relation.from_plan_id) ?? "",
            to_plan_key: planIdToKey.get(relation.to_plan_id) ?? "",
            relation_type: relation.relation_type,
          }))
          .filter((relation) => relation.from_plan_key && relation.to_plan_key),
      );
      setSyncToken(payload.data?.sync_token ?? null);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch plans.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchServiceDetails(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}`);
      const payload: ApiResponse<ServiceDetail> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch service details.");
      }
      const service = payload.data;
      const categoryIds = (service?.categories ?? []).map((category) => String(category.id));
      const primary = (service?.categories ?? []).find((category) => Boolean(category.pivot?.is_primary));
      setSelectedCategoryIds(categoryIds);
      setPrimaryCategoryId(primary ? String(primary.id) : "");
      setServiceMetaTitle(service?.meta_title ?? "");
      setServiceMetaDescription(service?.meta_description ?? "");
      setServiceMetaKeywords((service?.meta_keywords ?? []).join(", "));
      setServiceHeroImageUrl(service?.hero_image_url ?? "");
      setServiceCanonicalUrl(service?.canonical_url ?? "");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch service details.");
    }
  }

  async function fetchTemplates(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }

    setErrorText("");
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/templates`);
      const payload: ApiResponse<ServiceTemplatesPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch template fields.");
      }

      const sourceFields = payload.data?.fields ?? [];
      const editableFields = sourceFields.length
        ? sourceFields.map((field) => ({
            row_id: `template-field-${field.id}`,
            field_key: field.field_key,
            label: field.label,
            field_type: field.field_type,
            is_required: Boolean(field.is_required),
            default_value_text: field.default_value != null ? JSON.stringify(field.default_value, null, 2) : "",
            options_text: field.options != null ? JSON.stringify(field.options, null, 2) : "",
            display_order: field.display_order ?? 0,
          }))
        : [emptyTemplateField(0)];
      setTemplateFields(editableFields);

      const planKeyById = new Map<number, string>();
      plans.forEach((plan) => {
        if (plan.id) {
          planKeyById.set(plan.id, plan.plan_key);
        }
      });

      const editableValues = (payload.data?.values ?? []).map((value) => ({
        row_id: `template-value-${value.id}`,
        field_key: value.field_key,
        service_plan_key: value.service_plan_id ? planKeyById.get(value.service_plan_id) ?? "" : "",
        service_plan_id: value.service_plan_id ?? null,
        value_text: value.value != null ? JSON.stringify(value.value, null, 2) : "",
      }));
      setTemplateValues(editableValues.length ? editableValues : [emptyTemplateValue()]);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch template fields.");
    }
  }

  async function fetchPageContent(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/page-content`);
      const payload: ApiResponse<ServicePageContentPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch service page content.");
      }
      const items = payload.data?.items ?? [];
      setPageContents(
        items.length
          ? items.map((item) => ({
              row_id: item.id ? `content-${item.id}` : `content-new-${crypto.randomUUID()}`,
              id: item.id,
              content_key: item.content_key,
              label: item.label,
              content_type: item.content_type,
              value_text: item.value != null ? JSON.stringify(item.value, null, 2) : "",
              is_active: Boolean(item.is_active),
              display_order: item.display_order ?? 0,
            }))
          : [emptyContentItem(0)],
      );
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch service page content.");
    }
  }

  async function fetchManagedSections(serviceSlug: string, stage: "draft" | "published" = "draft") {
    if (!serviceSlug) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/sections?locale=${encodeURIComponent(sectionLocale)}&stage=${stage}`);
      const payload: ApiResponse<ServicePageSectionsPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch section content.");
      }

      const incoming = payload.data?.sections ?? [];
      const sectionMap = new Map(incoming.map((section) => [section.section_key, section]));
      setManagedSections(
        SECTION_DEFINITIONS.map((definition) => {
          const section = sectionMap.get(definition.key);
          return {
            section_key: definition.key,
            heading: section?.heading ?? definition.label,
            subheading: section?.subheading ?? "",
            is_active: section?.is_active ?? true,
            items: (section?.items ?? []).length > 0 ? (section?.items ?? []).map((item) => toEditableSectionItem(item)) : [emptySectionItem()],
          };
        }),
      );
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch section content.");
    }
  }

  async function fetchSectionHistory(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/sections/history?locale=${encodeURIComponent(sectionLocale)}`);
      const payload: ApiResponse<ServicePageSectionHistoryPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch section history.");
      }
      const items = payload.data?.items ?? [];
      setSectionHistory(items);
      setSelectedSectionVersionId((current) => (current && items.some((item) => String(item.id) === current) ? current : items[0] ? String(items[0].id) : ""));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch section history.");
    }
  }

  async function fetchOffers(serviceSlug: string) {
    if (!serviceSlug) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceSlug}/package-offers`);
      const payload: ApiResponse<PackageOffersPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch package offers.");
      }
      const sourceOffers = payload.data?.offers ?? [];
      setOffers(
        sourceOffers.length
          ? sourceOffers.map((offer) => ({
              row_id: offer.id ? `offer-${offer.id}` : `offer-new-${crypto.randomUUID()}`,
              id: offer.id,
              offer_key: offer.offer_key,
              plan_key: offer.plan_key ?? "",
              name: offer.name,
              description: offer.description ?? "",
              offer_type: offer.offer_type,
              discount_value: offer.discount_value != null ? String(offer.discount_value) : "",
              combo_plan_keys_text: (offer.combo_plan_keys ?? []).join("\n"),
              combo_price: offer.combo_price != null ? String(offer.combo_price) : "",
              conditions_text: offer.conditions != null ? JSON.stringify(offer.conditions, null, 2) : "",
              starts_at: offer.starts_at ?? "",
              ends_at: offer.ends_at ?? "",
              is_active: Boolean(offer.is_active),
              display_order: offer.display_order ?? 0,
            }))
          : [emptyOffer(0)],
      );
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch package offers.");
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/service-categories?search=${encodeURIComponent(categorySearch)}`);
      const payload: ApiResponse<ServiceCategory[]> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch categories.");
      }
      const sourceCategories = payload.data ?? [];
      setCategories(
        sourceCategories.length
          ? sourceCategories.map((category) => ({
              id: category.id,
              parent_id: category.parent_id ? String(category.parent_id) : "",
              name: category.name,
              slug: category.slug,
              description: category.description ?? "",
              is_active: Boolean(category.is_active),
              template_key: category.template_key ?? "",
              custom_fields_text: category.custom_fields != null ? JSON.stringify(category.custom_fields, null, 2) : "",
              conditional_rules_text: category.conditional_rules != null ? JSON.stringify(category.conditional_rules, null, 2) : "",
              display_order: category.display_order ?? 0,
              is_selected: false,
            }))
          : [emptyCategory(0)],
      );
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch categories.");
    }
  }

  async function fetchMediaFolders() {
    try {
      const response = await fetch(`${API_BASE_URL}/media/folders/tree`);
      const payload: ApiResponse<MediaFolderNode[]> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch media folders.");
      }
      setMediaFolders(payload.data ?? []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch media folders.");
    }
  }

  async function fetchMediaAssets() {
    try {
      const response = await fetch(`${API_BASE_URL}/media/assets?search=${encodeURIComponent(mediaSearch)}&per_page=100`);
      const payload: ApiResponse<Paginated<MediaAsset>> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to fetch media assets.");
      }
      const sourceAssets = payload.data?.data ?? [];
      setMediaAssets(
        sourceAssets.length
          ? sourceAssets.map((asset) => ({
              id: asset.id,
              media_folder_id: asset.media_folder_id ? String(asset.media_folder_id) : "",
              service_id: asset.service_id ? String(asset.service_id) : "",
              service_category_id: asset.service_category_id ? String(asset.service_category_id) : "",
              title: asset.title ?? "",
              alt_text: asset.alt_text ?? "",
              caption: asset.caption ?? "",
              file_name: asset.file_name,
              disk: asset.disk ?? "public",
              path: asset.path,
              url: asset.url,
              mime_type: asset.mime_type ?? "",
              size_bytes: String(asset.size_bytes ?? 0),
              width: asset.width != null ? String(asset.width) : "",
              height: asset.height != null ? String(asset.height) : "",
              tags_text: (asset.tags ?? []).join("\n"),
              optimization_meta_text: asset.optimization_meta ? JSON.stringify(asset.optimization_meta, null, 2) : "",
              is_optimized: Boolean(asset.is_optimized),
              display_order: asset.display_order ?? 0,
              is_selected: false,
            }))
          : [emptyMediaAsset(0)],
      );
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to fetch media assets.");
    }
  }

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchMediaFolders();
    fetchMediaAssets();
  }, []);

  useEffect(() => {
    if (activeServiceSlug) {
      fetchPlans(activeServiceSlug);
      fetchServiceDetails(activeServiceSlug);
    }
  }, [activeServiceSlug]);

  useEffect(() => {
    if (activeServiceSlug) {
      fetchTemplates(activeServiceSlug);
      fetchPageContent(activeServiceSlug);
      fetchManagedSections(activeServiceSlug, "draft");
      fetchSectionHistory(activeServiceSlug);
      fetchOffers(activeServiceSlug);
    }
  }, [activeServiceSlug, sectionLocale]);

  useEffect(() => {
    if (plans.length === 0 || templateValues.length === 0) {
      return;
    }

    setTemplateValues((current) => {
      let changed = false;
      const updated = current.map((value) => {
        if (value.service_plan_id && !value.service_plan_key) {
          const planKey = plans.find((plan) => plan.id === value.service_plan_id)?.plan_key;
          if (planKey) {
            changed = true;
            return { ...value, service_plan_key: planKey };
          }
        }
        return value;
      });
      return changed ? updated : current;
    });
  }, [plans]);

  useEffect(() => {
    if (!activeService) {
      return;
    }
    setServiceMetaTitle(activeService.meta_title ?? "");
    setServiceMetaDescription(activeService.meta_description ?? "");
    setServiceMetaKeywords((activeService.meta_keywords ?? []).join(", "));
    setServiceHeroImageUrl(activeService.hero_image_url ?? "");
    setServiceCanonicalUrl(activeService.canonical_url ?? "");
  }, [activeService]);

  useEffect(() => {
    const onResize = () => setIsMobileLayout(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function updatePlan(index: number, key: keyof EditablePlan, value: string | number | boolean) {
    setPlans((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value };
      if (key === "name" && !next[index].plan_key) {
        next[index].plan_key = keyFromName(String(value));
      }
      return next;
    });
  }

  function addPlan() {
    setPlans((current) => [...current, emptyPlan(current.length)]);
  }

  function removePlan(index: number) {
    setPlans((current) => current.filter((_, itemIndex) => itemIndex !== index).map((plan, itemIndex) => ({ ...plan, display_order: itemIndex })));
  }

  function addRelation() {
    setRelations((current) => [...current, { row_id: `relation-new-${crypto.randomUUID()}`, from_plan_key: "", to_plan_key: "", relation_type: "upgrade" }]);
  }

  function updateRelation(index: number, key: keyof EditableRelation, value: string) {
    setRelations((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableRelation;
      return next;
    });
  }

  function removeRelation(index: number) {
    setRelations((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addTemplateField() {
    setTemplateFields((current) => [...current, emptyTemplateField(current.length)]);
  }

  function updateTemplateField(index: number, key: keyof EditableTemplateField, value: string | number | boolean) {
    setTemplateFields((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableTemplateField;
      if (key === "label" && !next[index].field_key) {
        next[index].field_key = keyFromName(String(value)).replace(/-/g, "_");
      }
      return next;
    });
  }

  function removeTemplateField(index: number) {
    setTemplateFields((current) => current.filter((_, itemIndex) => itemIndex !== index).map((field, itemIndex) => ({ ...field, display_order: itemIndex })));
  }

  function addTemplateValue() {
    setTemplateValues((current) => [...current, emptyTemplateValue()]);
  }

  function updateTemplateValue(index: number, key: keyof EditableTemplateValue, value: string) {
    setTemplateValues((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  }

  function removeTemplateValue(index: number) {
    setTemplateValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addContentItem() {
    setPageContents((current) => [...current, emptyContentItem(current.length)]);
  }

  function updateContentItem(index: number, key: keyof EditableContentItem, value: string | number | boolean) {
    setPageContents((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableContentItem;
      if (key === "label" && !next[index].content_key) {
        next[index].content_key = keyFromName(String(value)).replace(/-/g, "_");
      }
      return next;
    });
  }

  function removeContentItem(index: number) {
    setPageContents((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, display_order: itemIndex })));
  }

  function updateManagedSection(index: number, key: keyof EditableManagedSection, value: string | boolean) {
    setManagedSections((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableManagedSection;
      return next;
    });
  }

  function updateManagedSectionItem(sectionIndex: number, itemIndex: number, key: keyof EditableSectionItem, value: string) {
    setManagedSections((current) => {
      const next = [...current];
      const section = next[sectionIndex];
      const items = [...section.items];
      items[itemIndex] = { ...items[itemIndex], [key]: value };
      next[sectionIndex] = { ...section, items };
      return next;
    });
  }

  function addManagedSectionItem(sectionIndex: number) {
    setManagedSections((current) => {
      const next = [...current];
      const section = next[sectionIndex];
      next[sectionIndex] = { ...section, items: [...section.items, emptySectionItem()] };
      return next;
    });
  }

  function removeManagedSectionItem(sectionIndex: number, itemIndex: number) {
    setManagedSections((current) => {
      const next = [...current];
      const section = next[sectionIndex];
      const remaining = section.items.filter((_, index) => index !== itemIndex);
      next[sectionIndex] = { ...section, items: remaining.length > 0 ? remaining : [emptySectionItem()] };
      return next;
    });
  }

  function addOffer() {
    setOffers((current) => [...current, emptyOffer(current.length)]);
  }

  function updateOffer(index: number, key: keyof EditableOffer, value: string | number | boolean) {
    setOffers((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableOffer;
      if (key === "name" && !next[index].offer_key) {
        next[index].offer_key = keyFromName(String(value));
      }
      return next;
    });
  }

  function removeOffer(index: number) {
    setOffers((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, display_order: itemIndex })));
  }

  function addCategory() {
    setCategories((current) => [...current, emptyCategory(current.length)]);
  }

  function updateCategory(index: number, key: keyof EditableCategory, value: string | number | boolean) {
    setCategories((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableCategory;
      if (key === "name" && !next[index].slug) {
        next[index].slug = keyFromName(String(value));
      }
      return next;
    });
  }

  function toggleCategorySelection(index: number, checked: boolean) {
    setCategories((current) => {
      const next = [...current];
      next[index] = { ...next[index], is_selected: checked };
      return next;
    });
  }

  function addMediaAsset() {
    setMediaAssets((current) => [...current, emptyMediaAsset(current.length)]);
  }

  function updateMediaAsset(index: number, key: keyof EditableMediaAsset, value: string | number | boolean) {
    setMediaAssets((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value } as EditableMediaAsset;
      return next;
    });
  }

  function toggleMediaAssetSelection(index: number, checked: boolean) {
    setMediaAssets((current) => {
      const next = [...current];
      next[index] = { ...next[index], is_selected: checked };
      return next;
    });
  }

  function removeMediaAsset(index: number) {
    setMediaAssets((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, display_order: itemIndex })));
  }

  function removeCategory(index: number) {
    setCategories((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, display_order: itemIndex })));
  }

  function validatePlans(): string | null {
    const keySet = new Set<string>();
    for (const plan of plans) {
      if (!plan.plan_key || !/^[a-z0-9-]+$/.test(plan.plan_key)) {
        return "Each plan key is required and must be lowercase kebab-case.";
      }
      if (keySet.has(plan.plan_key)) {
        return "Plan keys must be unique within a service.";
      }
      keySet.add(plan.plan_key);
      if (!plan.name.trim()) {
        return "Each plan must have a name.";
      }
      if (plan.price.trim() === "" || Number.isNaN(Number(plan.price)) || Number(plan.price) < 0) {
        return "Each plan must have a valid non-negative price.";
      }
      if (plan.delivery_days.trim() !== "" && (!Number.isInteger(Number(plan.delivery_days)) || Number(plan.delivery_days) < 1)) {
        return "Delivery days must be empty or a positive integer.";
      }
      if (plan.max_duration_days.trim() !== "" && (!Number.isInteger(Number(plan.max_duration_days)) || Number(plan.max_duration_days) < 1)) {
        return "Max duration days must be empty or a positive integer.";
      }
      if (plan.max_revisions.trim() !== "" && (!Number.isInteger(Number(plan.max_revisions)) || Number(plan.max_revisions) < 0)) {
        return "Max revisions must be empty or a non-negative integer.";
      }
      if (plan.custom_config_text.trim() !== "") {
        try {
          JSON.parse(plan.custom_config_text);
        } catch {
          return `Custom config for ${plan.name || plan.plan_key} must be valid JSON.`;
        }
      }
    }
    for (const relation of relations) {
      if (!relation.from_plan_key || !relation.to_plan_key) {
        return "Each package relation requires source and target plan keys.";
      }
      if (relation.from_plan_key === relation.to_plan_key) {
        return "Package relation cannot point to the same plan.";
      }
    }
    return null;
  }

  function validateTemplates(): string | null {
    const fieldKeySet = new Set<string>();
    for (const field of templateFields) {
      if (!field.field_key || !/^[a-z0-9_.-]+$/.test(field.field_key)) {
        return "Template field keys must be lowercase and may include dot, underscore, and hyphen.";
      }
      if (fieldKeySet.has(field.field_key)) {
        return "Template field keys must be unique.";
      }
      fieldKeySet.add(field.field_key);
      if (!field.label.trim()) {
        return "Each template field requires a label.";
      }
      if (field.default_value_text.trim() !== "") {
        try {
          JSON.parse(field.default_value_text);
        } catch {
          return `Default value for ${field.field_key} must be valid JSON.`;
        }
      }
      if (field.options_text.trim() !== "") {
        try {
          JSON.parse(field.options_text);
        } catch {
          return `Options for ${field.field_key} must be valid JSON.`;
        }
      }
    }
    for (const value of templateValues) {
      if (!value.field_key.trim()) {
        return "Each template value needs a field key.";
      }
      if (!fieldKeySet.has(value.field_key)) {
        return `Template value field key ${value.field_key} does not exist in fields list.`;
      }
      if (value.value_text.trim() !== "") {
        try {
          JSON.parse(value.value_text);
        } catch {
          return `Template value for ${value.field_key} must be valid JSON.`;
        }
      }
    }
    return null;
  }

  function validatePageContents(): string | null {
    const keySet = new Set<string>();
    for (const item of pageContents) {
      if (!item.content_key || !/^[a-z0-9_.-]+$/.test(item.content_key)) {
        return "Content keys must be lowercase and may include dot, underscore, and hyphen.";
      }
      if (keySet.has(item.content_key)) {
        return "Content keys must be unique.";
      }
      keySet.add(item.content_key);
      if (!item.label.trim()) {
        return "Each content item requires a label.";
      }
      if (item.content_type === "number" && item.value_text.trim() !== "" && Number.isNaN(Number(item.value_text.trim()))) {
        return `Content value for ${item.content_key} must be a valid number.`;
      }
      if (item.content_type === "boolean" && item.value_text.trim() !== "") {
        const normalized = item.value_text.trim().toLowerCase();
        if (!["true", "false", "1", "0"].includes(normalized)) {
          return `Content value for ${item.content_key} must be true, false, 1, or 0.`;
        }
      }
      if ((item.content_type === "json" || item.content_type === "seo") && item.value_text.trim() !== "") {
        try {
          JSON.parse(item.value_text);
        } catch {
          return `Content value for ${item.content_key} must be valid JSON.`;
        }
      }
    }
    return null;
  }

  function validateManagedSections(): string | null {
    if (managedSections.length !== SECTION_DEFINITIONS.length) {
      return "All predefined sections are required.";
    }
    const keySet = new Set<string>();
    for (const section of managedSections) {
      if (!SECTION_DEFINITIONS.some((definition) => definition.key === section.section_key)) {
        return "Invalid section key detected.";
      }
      if (keySet.has(section.section_key)) {
        return "Duplicate section key detected.";
      }
      keySet.add(section.section_key);
      if (section.items.length > 30) {
        return `Section ${section.section_key} supports maximum 30 items.`;
      }
      for (const item of section.items) {
        if ((item.title ?? "").length > 255 || (item.question ?? "").length > 255 || (item.name ?? "").length > 255 || (item.role ?? "").length > 255) {
          return `One or more fields in ${section.section_key} exceed allowed title lengths.`;
        }
        if (
          (item.description ?? "").length > 2000 ||
          (item.value ?? "").length > 2000 ||
          (item.answer ?? "").length > 2000 ||
          (item.quote ?? "").length > 2000
        ) {
          return `One or more fields in ${section.section_key} exceed allowed content length.`;
        }
      }
    }
    return null;
  }

  function validateOffers(): string | null {
    const keySet = new Set<string>();
    for (const offer of offers) {
      if (!offer.offer_key || !/^[a-z0-9-]+$/.test(offer.offer_key)) {
        return "Offer keys must be lowercase kebab-case.";
      }
      if (keySet.has(offer.offer_key)) {
        return "Offer keys must be unique.";
      }
      keySet.add(offer.offer_key);
      if (!offer.name.trim()) {
        return "Each offer requires a name.";
      }
      if (offer.discount_value.trim() !== "" && (Number.isNaN(Number(offer.discount_value)) || Number(offer.discount_value) < 0)) {
        return `Discount value for ${offer.offer_key} must be a non-negative number.`;
      }
      if (offer.combo_price.trim() !== "" && (Number.isNaN(Number(offer.combo_price)) || Number(offer.combo_price) < 0)) {
        return `Combo price for ${offer.offer_key} must be a non-negative number.`;
      }
      if (offer.conditions_text.trim() !== "") {
        try {
          JSON.parse(offer.conditions_text);
        } catch {
          return `Conditions for ${offer.offer_key} must be valid JSON.`;
        }
      }
      if (offer.starts_at && Number.isNaN(new Date(offer.starts_at).getTime())) {
        return `Start date for ${offer.offer_key} is invalid.`;
      }
      if (offer.ends_at && Number.isNaN(new Date(offer.ends_at).getTime())) {
        return `End date for ${offer.offer_key} is invalid.`;
      }
    }
    return null;
  }

  function validateCategories(): string | null {
    for (const category of categories) {
      if (!category.name.trim()) {
        return "Each category requires a name.";
      }
      if (!category.slug || !/^[a-z0-9-]+$/.test(category.slug)) {
        return "Each category slug must be lowercase kebab-case.";
      }
      if (category.custom_fields_text.trim() !== "") {
        try {
          JSON.parse(category.custom_fields_text);
        } catch {
          return `Custom fields for ${category.slug} must be valid JSON.`;
        }
      }
      if (category.conditional_rules_text.trim() !== "") {
        try {
          JSON.parse(category.conditional_rules_text);
        } catch {
          return `Conditional rules for ${category.slug} must be valid JSON.`;
        }
      }
    }
    return null;
  }

  function validateMediaAssets(): string | null {
    for (const asset of mediaAssets) {
      if (!asset.file_name.trim()) {
        return "Each media asset requires a file name.";
      }
      if (!asset.path.trim()) {
        return `Path is required for ${asset.file_name || "media asset"}.`;
      }
      if (!asset.url.trim()) {
        return `URL is required for ${asset.file_name || "media asset"}.`;
      }
      try {
        new URL(asset.url.trim());
      } catch {
        return `URL for ${asset.file_name || "media asset"} is invalid.`;
      }
      if (asset.size_bytes.trim() !== "" && (!Number.isInteger(Number(asset.size_bytes)) || Number(asset.size_bytes) < 0)) {
        return `Size for ${asset.file_name || "media asset"} must be a non-negative integer.`;
      }
      if (asset.width.trim() !== "" && (!Number.isInteger(Number(asset.width)) || Number(asset.width) < 1)) {
        return `Width for ${asset.file_name || "media asset"} must be a positive integer.`;
      }
      if (asset.height.trim() !== "" && (!Number.isInteger(Number(asset.height)) || Number(asset.height) < 1)) {
        return `Height for ${asset.file_name || "media asset"} must be a positive integer.`;
      }
      if (asset.optimization_meta_text.trim() !== "") {
        try {
          JSON.parse(asset.optimization_meta_text);
        } catch {
          return `Optimization meta for ${asset.file_name || "media asset"} must be valid JSON.`;
        }
      }
    }
    return null;
  }

  async function saveServiceMeta() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      hero_image_url: serviceHeroImageUrl.trim() || null,
      meta_title: serviceMetaTitle.trim() || null,
      meta_description: serviceMetaDescription.trim() || null,
      meta_keywords: serviceMetaKeywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      canonical_url: serviceCanonicalUrl.trim() || null,
      category_ids: selectedCategoryIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0),
      primary_category_id: primaryCategoryId ? Number(primaryCategoryId) : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<Service> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save service metadata.");
      }
      await fetchServices();
      await fetchServiceDetails(activeServiceSlug);
      setSuccessText("Service metadata synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save service metadata.");
    } finally {
      setIsSaving(false);
    }
  }

  async function savePageContent() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const validationError = validatePageContents();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      items: pageContents.map((item, index) => {
        const normalizedValue = item.value_text.trim();
        let value: unknown = normalizedValue || null;
        if (item.content_type === "number") {
          value = normalizedValue === "" ? null : Number(normalizedValue);
        } else if (item.content_type === "boolean") {
          value = normalizedValue === "" ? null : ["true", "1"].includes(normalizedValue.toLowerCase());
        } else if (item.content_type === "json" || item.content_type === "seo") {
          value = parseJsonText(item.value_text);
        }
        return {
          content_key: item.content_key.trim(),
          label: item.label.trim(),
          content_type: item.content_type,
          value,
          is_active: item.is_active,
          display_order: item.display_order ?? index,
        };
      }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/page-content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<ServicePageContentPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save page content.");
      }
      await fetchPageContent(activeServiceSlug);
      setSuccessText("Service page content synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save page content.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveManagedSections(shouldPublish: boolean) {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const validationError = validateManagedSections();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      locale: sectionLocale.trim() || "en",
      publish: shouldPublish,
      sections: managedSections.map((section) => ({
        section_key: section.section_key,
        heading: section.heading.trim() || null,
        subheading: section.subheading.trim() || null,
        is_active: section.is_active,
        items: section.items.map((item) => cleanSectionItem(section.section_key, item)),
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/sections`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<{ locale: string }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save managed sections.");
      }
      await Promise.all([fetchManagedSections(activeServiceSlug, "draft"), fetchSectionHistory(activeServiceSlug)]);
      setSuccessText(shouldPublish ? "Sections saved and published successfully." : "Sections saved to draft successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save managed sections.");
    } finally {
      setIsSaving(false);
    }
  }

  async function publishManagedSections() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/sections/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          locale: sectionLocale.trim() || "en",
        }),
      });
      const payload: ApiResponse<{ locale: string }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to publish sections.");
      }
      await Promise.all([fetchManagedSections(activeServiceSlug, "draft"), fetchSectionHistory(activeServiceSlug)]);
      setSuccessText("Draft sections published successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to publish sections.");
    } finally {
      setIsSaving(false);
    }
  }

  async function rollbackManagedSections(publishAfterRollback: boolean) {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    if (!selectedSectionVersionId) {
      setErrorText("Select a version to rollback.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/sections/rollback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          locale: sectionLocale.trim() || "en",
          version_id: Number(selectedSectionVersionId),
          publish: publishAfterRollback,
        }),
      });
      const payload: ApiResponse<{ locale: string }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to rollback sections.");
      }
      await Promise.all([fetchManagedSections(activeServiceSlug, "draft"), fetchSectionHistory(activeServiceSlug)]);
      setSuccessText(publishAfterRollback ? "Rollback applied and published successfully." : "Rollback applied to draft successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to rollback sections.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveOffers() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const validationError = validateOffers();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      offers: offers.map((offer, index) => ({
        offer_key: offer.offer_key.trim(),
        plan_key: offer.plan_key.trim() || null,
        name: offer.name.trim(),
        description: offer.description.trim() || null,
        offer_type: offer.offer_type,
        discount_value: offer.discount_value.trim() === "" ? null : Number(offer.discount_value),
        combo_plan_keys: offer.combo_plan_keys_text
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        combo_price: offer.combo_price.trim() === "" ? null : Number(offer.combo_price),
        conditions: parseJsonText(offer.conditions_text),
        starts_at: offer.starts_at || null,
        ends_at: offer.ends_at || null,
        is_active: offer.is_active,
        display_order: offer.display_order ?? index,
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/package-offers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<PackageOffersPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save package offers.");
      }
      await fetchOffers(activeServiceSlug);
      setSuccessText("Package offers synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save package offers.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveCategories() {
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const validationError = validateCategories();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    try {
      const saved: Array<{ id: number; parent_id: number | null; display_order: number }> = [];
      for (const [index, category] of categories.entries()) {
        const payload = {
          parent_id: category.parent_id ? Number(category.parent_id) : null,
          name: category.name.trim(),
          slug: category.slug.trim(),
          description: category.description.trim() || null,
          is_active: category.is_active,
          template_key: category.template_key.trim() || null,
          custom_fields: parseJsonText(category.custom_fields_text),
          conditional_rules: parseJsonText(category.conditional_rules_text),
          display_order: category.display_order ?? index,
        };

        const url = category.id ? `${API_BASE_URL}/service-categories/${category.id}` : `${API_BASE_URL}/service-categories`;
        const method = category.id ? "PUT" : "POST";
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        const result: ApiResponse<ServiceCategory> = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to save service categories.");
        }
        saved.push({
          id: result.data.id,
          parent_id: payload.parent_id,
          display_order: payload.display_order,
        });
      }

      if (saved.length > 0) {
        await fetch(`${API_BASE_URL}/service-categories/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            items: saved.map((item, index) => ({
              id: item.id,
              parent_id: item.parent_id,
              display_order: index,
            })),
          }),
        });
      }
      await fetchCategories();
      setSuccessText("Service categories synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save service categories.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedCategories() {
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const ids = categories.filter((item) => item.is_selected && item.id).map((item) => Number(item.id));
    if (!ids.length) {
      setErrorText("Select at least one category to delete.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/service-categories/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ids, action: "delete" }),
      });
      const payload: ApiResponse<{ affected: number }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete categories.");
      }
      await fetchCategories();
      setSelectedCategoryIds((current) => current.filter((id) => !ids.includes(Number(id))));
      if (primaryCategoryId && ids.includes(Number(primaryCategoryId))) {
        setPrimaryCategoryId("");
      }
      setSuccessText("Selected categories deleted successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete categories.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveMediaAssets() {
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const validationError = validateMediaAssets();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      const body = {
        items: mediaAssets.map((asset, index) => ({
          id: asset.id,
          media_folder_id: asset.media_folder_id ? Number(asset.media_folder_id) : null,
          service_id: asset.service_id ? Number(asset.service_id) : null,
          service_category_id: asset.service_category_id ? Number(asset.service_category_id) : null,
          title: asset.title.trim() || null,
          alt_text: asset.alt_text.trim() || null,
          caption: asset.caption.trim() || null,
          file_name: asset.file_name.trim(),
          disk: asset.disk.trim() || "public",
          path: asset.path.trim(),
          url: asset.url.trim(),
          mime_type: asset.mime_type.trim() || null,
          size_bytes: asset.size_bytes.trim() === "" ? 0 : Number(asset.size_bytes),
          width: asset.width.trim() === "" ? null : Number(asset.width),
          height: asset.height.trim() === "" ? null : Number(asset.height),
          tags: asset.tags_text
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          optimization_meta: parseJsonText(asset.optimization_meta_text),
          is_optimized: asset.is_optimized,
          display_order: asset.display_order ?? index,
        })),
      };
      const response = await fetch(`${API_BASE_URL}/media/assets/bulk-upsert`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<{ affected: number }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save media assets.");
      }
      await fetchMediaAssets();
      setSuccessText("Media assets synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save media assets.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelectedMediaAssets() {
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    const ids = mediaAssets.filter((item) => item.is_selected && item.id).map((item) => Number(item.id));
    if (!ids.length) {
      setErrorText("Select at least one media asset to delete.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      const response = await fetch(`${API_BASE_URL}/media/assets/bulk-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ids, action: "delete" }),
      });
      const payload: ApiResponse<{ affected: number }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete media assets.");
      }
      await fetchMediaAssets();
      setSuccessText("Selected media assets deleted successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete media assets.");
    } finally {
      setIsSaving(false);
    }
  }

  async function savePlans() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }

    const validationError = validatePlans();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      plans: plans.map((plan, index) => ({
        plan_key: plan.plan_key,
        name: plan.name,
        price: Number(plan.price),
        billing_cycle: plan.billing_cycle,
        delivery_days: plan.delivery_days.trim() === "" ? null : Number(plan.delivery_days),
        max_duration_days: plan.max_duration_days.trim() === "" ? null : Number(plan.max_duration_days),
        description: plan.description.trim() || null,
        features: plan.features_text.split("\n").map((item) => item.trim()).filter(Boolean),
        custom_config: parseJsonText(plan.custom_config_text),
        max_revisions: plan.max_revisions.trim() === "" ? null : Number(plan.max_revisions),
        comparison_points: plan.comparison_points_text.split("\n").map((item) => item.trim()).filter(Boolean),
        parent_plan_key: plan.parent_plan_key || null,
        is_featured: plan.is_featured,
        is_active: plan.is_active,
        display_order: index,
      })),
      relations: relations.map((relation) => ({
        from_plan_id: plans.find((plan) => plan.plan_key === relation.from_plan_key)?.id,
        to_plan_id: plans.find((plan) => plan.plan_key === relation.to_plan_key)?.id,
        from_plan_key: relation.from_plan_key,
        to_plan_key: relation.to_plan_key,
        relation_type: relation.relation_type,
      })),
      sync_token: syncToken,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/plans`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<ServicePlansPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to sync plans.");
      }

      setPlans((payload.data?.plans ?? []).map(toEditablePlan));
      const planIdToKey = new Map<number, string>();
      (payload.data?.plans ?? []).forEach((plan) => {
        planIdToKey.set(plan.id, plan.plan_key);
      });
      setRelations(
        (payload.data?.relations ?? [])
          .map((relation) => ({
            row_id: `relation-${relation.id}`,
            from_plan_key: planIdToKey.get(relation.from_plan_id) ?? "",
            to_plan_key: planIdToKey.get(relation.to_plan_id) ?? "",
            relation_type: relation.relation_type,
          }))
          .filter((relation) => relation.from_plan_key && relation.to_plan_key),
      );
      setSyncToken(payload.data?.sync_token ?? null);
      setSuccessText("Plans synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to sync plans.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveTemplates() {
    if (!activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }

    const validationError = validateTemplates();
    if (validationError) {
      setErrorText(validationError);
      return;
    }

    setIsTemplateSaving(true);
    setErrorText("");
    setSuccessText("");

    const body = {
      fields: templateFields.map((field, index) => ({
        field_key: field.field_key.trim(),
        label: field.label.trim(),
        field_type: field.field_type,
        is_required: field.is_required,
        default_value: parseJsonText(field.default_value_text),
        options: parseJsonText(field.options_text),
        display_order: field.display_order ?? index,
      })),
      values: templateValues
        .filter((value) => value.field_key.trim())
        .map((value) => {
          const plan = plans.find((planItem) => planItem.plan_key === value.service_plan_key);
          return {
            field_key: value.field_key.trim(),
            service_plan_id: plan?.id ?? null,
            value: parseJsonText(value.value_text),
          };
        }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}/templates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<ServiceTemplatesPayload> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to sync template fields.");
      }
      await fetchTemplates(activeServiceSlug);
      setSuccessText("Template fields synchronized successfully.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to sync template fields.");
    } finally {
      setIsTemplateSaving(false);
    }
  }

  function setToken() {
    const value = window.prompt("Paste admin API token")?.trim() ?? "";
    if (!value) {
      return;
    }
    setStoredToken(value);
    setAdminToken(value);
    setErrorText("");
  }

  function clearToken() {
    clearStoredAuth();
    setAdminToken("");
  }

  // Service creation state and functions
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Web Development");

  function openCreateService() {
    if (!canManage) {
      setErrorText("Set an admin API token to create services.");
      return;
    }
    setIsCreatingService(true);
    setNewServiceName("");
    setNewServiceCategory("Web Development");
    setErrorText("");
    setSuccessText("");
  }

  async function createService() {
    if (!newServiceName.trim()) {
      setErrorText("Service name is required.");
      return;
    }
    if (!canManage) {
      setErrorText("Set an admin API token to create services.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    const slug = keyFromName(newServiceName);
    const body = {
      name: newServiceName.trim(),
      slug,
      category: newServiceCategory,
      base_price: 0,
      status: "active",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });
      const payload: ApiResponse<Service> = await response.json();
      if (!response.ok || !payload.success) {
        const errorMessage = payload.errors && Object.keys(payload.errors).length > 0 
          ? Object.values(payload.errors as Record<string, string[]>).flat().join(", ")
          : payload.message || "Failed to create service.";
        throw new Error(errorMessage);
      }

      // Refresh services list
      await fetchServices();
      
      // Switch to the newly created service
      setActiveServiceSlug(slug);
      
      // Clear the form
      setIsCreatingService(false);
      setNewServiceName("");
      setNewServiceCategory("Web Development");
      
      setSuccessText(`Service "${payload.data.name}" created successfully!`);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to create service.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteService() {
    if (!activeService || !activeServiceSlug) {
      return;
    }
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    if (!confirm(`Delete service "${activeService.name}"? This will delete the service, all its plans, sections, and content. This action cannot be undone.`)) {
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    try {
      const response = await fetch(`${API_BASE_URL}/services/${activeServiceSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const payload: ApiResponse<null> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete service.");
      }

      // Attempt to clear the public API cache to ensure the page is gone from the frontend
      try {
        await fetch(`${API_BASE_URL}/settings/cache/clear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ type: "content" }),
        });
      } catch (e) {
        console.warn("Could not clear cache, but service was deleted.", e);
      }

      // Refresh services list and clear selection
      await fetchServices();
      setActiveServiceSlug("");
      setSuccessText(`Service "${activeService.name}" deleted successfully.`);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete service.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Service Plans</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Dedicated plan configuration and synchronization for each service.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-lg">
          <Button variant="neutral" iconStart={<RefreshCw size={16} />} onClick={() => activeServiceSlug && fetchPlans(activeServiceSlug)}>
            Refresh
          </Button>
          {!canManage ? (
            <Button variant="neutral" onClick={setToken}>
              Set Admin Token
            </Button>
          ) : (
            <Button variant="neutral"  onClick={clearToken}>
              Clear Token
            </Button>
          )}
          <Button variant="primary" iconStart={<Save size={16} />} onClick={savePlans} disabled={isSaving || !activeServiceSlug}>
            Save Plans
          </Button>
          <Button variant="neutral" iconStart={<Save size={16} />} onClick={saveTemplates} disabled={isTemplateSaving || !activeServiceSlug}>
            Save Template Fields
          </Button>
          <Button variant="neutral" iconStart={<Save size={16} />} onClick={saveServiceMeta} disabled={isSaving || !activeServiceSlug}>
            Save Service Meta
          </Button>
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-wrap gap-sm">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveServiceSlug(service.slug)}
            className={`px-xl py-xl rounded-corner-full text-label-sm transition-colors ${
              activeServiceSlug === service.slug ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10 hover:text-text-primary"
            }`}
          >
            {service.name}
          </button>
        ))}
      </div>

      {activeService && (
      <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center justify-between flex-wrap gap-md">
        <div>
          <p className="text-label text-text-primary">{activeService.name}</p>
          <p className="text-video-title text-text-tertiary">{activeService.category}</p>
        </div>
        <div className="flex items-center gap-md">
          <Badge label={activeService.status} variant={activeService.status === "active" ? "success" : "default"} />
          <Button variant="subtle" iconStart={<Trash2 size={16} />} onClick={deleteService} disabled={!canManage}>
            Delete
          </Button>
          <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreateService}>
            Add Service
          </Button>
        </div>
      </div>
      )}

      {isCreatingService && (
      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg border border-brand-primary">
        <h3 className="text-label text-text-primary">Create New Service</h3>
        <div className="grid grid-cols-2 gap-lg">
          <InputField label="Service Name" placeholder="e.g. Custom Development" value={newServiceName} onChange={setNewServiceName} />
          <SelectField
            label="Category"
            options={categoryList.map((cat) => ({ value: cat, label: cat }))}
            value={newServiceCategory}
            onChange={setNewServiceCategory}
          />
        </div>
        {newServiceName && (
          <div className="bg-bg-faint rounded-corner-md p-lg flex items-center gap-sm">
            <span className="text-label-sm text-text-secondary">URL Preview:</span>
            <span className="text-label-sm text-brand-primary font-mono">/services/{newServiceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}</span>
          </div>
        )}
        <div className="flex items-center gap-md">
          <Button variant="neutral" onClick={() => { setIsCreatingService(false); setNewServiceName(""); setNewServiceCategory("Web Development"); }}>
            Cancel
          </Button>
          <Button variant="primary" iconStart={<Save size={16} />} onClick={createService} disabled={!newServiceName.trim() || !canManage}>
            Create Service
          </Button>
        </div>
      </div>
      )}

      {errorText && (
        <div className="bg-danger/10 border border-danger/20 rounded-corner-lg p-lg text-label-sm text-danger">{errorText}</div>
      )}

      {successText && (
        <div className="bg-success/10 border border-success/20 rounded-corner-lg p-lg flex items-center gap-sm text-label-sm text-success">
          <CheckCircle2 size={16} />
          {successText}
        </div>
      )}

      {!isMobileLayout ? (
        <div
          role="tablist"
          aria-label="Service plan content sections"
          className="flex items-center gap-2 rounded-corner-lg border border-border-primary bg-bg-faint p-2"
        >
          <button
            type="button"
            role="tab"
            id="tab-plan-configurations"
            aria-controls="panel-plan-configurations"
            aria-selected={isPlanTabActive}
            disabled={isPlanTabActive}
            onClick={() => handleTabChange("plan_configurations")}
            className={`rounded-corner-md px-4 py-2 text-label-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              isPlanTabActive
                ? "bg-brand-primary text-on-brand shadow-sm"
                : "bg-transparent text-text-secondary hover:bg-surface-bg hover:text-text-primary"
            }`}
          >
            Plan Configurations
          </button>
          <button
            type="button"
            role="tab"
            id="tab-service-page-sections"
            aria-controls="panel-service-page-sections"
            aria-selected={!isPlanTabActive}
            disabled={!isPlanTabActive}
            onClick={() => handleTabChange("service_page_sections")}
            className={`rounded-corner-md px-4 py-2 text-label-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              !isPlanTabActive
                ? "bg-brand-primary text-on-brand shadow-sm"
                : "bg-transparent text-text-secondary hover:bg-surface-bg hover:text-text-primary"
            }`}
          >
            Service Page Sections
          </button>
        </div>
      ) : (
        <div aria-label="Service plan section accordion" className="flex flex-col gap-2">
          <button
            type="button"
            aria-label="Toggle Plan Configurations section"
            aria-expanded={isPlanTabActive}
            aria-controls="panel-plan-configurations"
            disabled={isPlanTabActive}
            onClick={() => handleTabChange("plan_configurations")}
            className={`w-full rounded-corner-md border px-4 py-3 text-left text-label-sm font-medium transition-all duration-200 ${
              isPlanTabActive
                ? "border-brand-primary bg-brand-primary/10 text-text-primary"
                : "border-border-primary bg-surface-bg text-text-secondary hover:bg-bg-faint hover:text-text-primary"
            }`}
          >
            Plan Configurations
          </button>
          <button
            type="button"
            aria-label="Toggle Service Page Sections section"
            aria-expanded={!isPlanTabActive}
            aria-controls="panel-service-page-sections"
            disabled={!isPlanTabActive}
            onClick={() => handleTabChange("service_page_sections")}
            className={`w-full rounded-corner-md border px-4 py-3 text-left text-label-sm font-medium transition-all duration-200 ${
              !isPlanTabActive
                ? "border-brand-primary bg-brand-primary/10 text-text-primary"
                : "border-border-primary bg-surface-bg text-text-secondary hover:bg-bg-faint hover:text-text-primary"
            }`}
          >
            Service Page Sections
          </button>
        </div>
      )}

      {isPlanTabActive && (
        <div id="panel-plan-configurations" role="tabpanel" aria-labelledby="tab-plan-configurations" className="flex flex-col gap-xl">
          <h2 className="text-title text-text-primary">Plan Configurations</h2>

          <div className="bg-surface-bg rounded-corner-lg p-md border border-border-primary">
            {!isMobileLayout ? (
              <div role="tablist" aria-label="Plan configuration sections" className="flex flex-wrap items-center gap-2">
                {PLAN_CONFIG_SECTION_TABS.map((section) => {
                  const isActive = activePlanConfigTab === section.value;
                  return (
                    <button
                      key={section.value}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`plan-config-${section.value}`}
                      onClick={() => setActivePlanConfigTab(section.value)}
                      className={`rounded-corner-md px-4 py-2 text-label-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-brand-primary text-on-brand shadow-sm"
                          : "bg-transparent text-text-secondary hover:bg-bg-faint hover:text-text-primary"
                      }`}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <SelectField
                label="Plan Configuration Section"
                options={PLAN_CONFIG_SECTION_TABS}
                value={activePlanConfigTab}
                onChange={(value) => setActivePlanConfigTab(value as PlanConfigSectionTab)}
              />
            )}
          </div>

          {activePlanConfigTab === "plan_definitions" && (
          <div id="plan-config-plan_definitions" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-label text-text-primary">Plan Definitions</h3>
            <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addPlan}>
              Add Plan
            </Button>
          </div>

          {isLoading ? (
            <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
              <p className="text-label text-text-secondary">Loading plans...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-lg">
              {plans.map((plan, index) => (
                <div key={plan.row_id} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary">
                  <div className="flex items-center justify-between mb-lg">
                    <p className="text-label text-text-primary">Plan {index + 1}</p>
                    <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removePlan(index)}>
                      Remove
                    </Button>
                  </div>

              <div className="grid grid-cols-2 gap-xl">
                <InputField label="Plan Key" placeholder="starter" value={plan.plan_key} onChange={(value) => updatePlan(index, "plan_key", keyFromName(value))} />
                <InputField label="Plan Name" placeholder="Starter" value={plan.name} onChange={(value) => updatePlan(index, "name", value)} />
                <InputField label="Price" placeholder="0.00" value={plan.price} onChange={(value) => updatePlan(index, "price", value)} />
                <SelectField
                  label="Billing Cycle"
                  options={[
                    { value: "one_time", label: "One Time" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                  value={plan.billing_cycle}
                  onChange={(value) => updatePlan(index, "billing_cycle", value as EditablePlan["billing_cycle"])}
                />
                <InputField label="Delivery Days" placeholder="7" value={plan.delivery_days} onChange={(value) => updatePlan(index, "delivery_days", value)} />
                <InputField label="Max Duration (Days)" placeholder="30" value={plan.max_duration_days} onChange={(value) => updatePlan(index, "max_duration_days", value)} />
                <InputField label="Display Order" placeholder="0" value={String(plan.display_order)} onChange={(value) => updatePlan(index, "display_order", Number(value || "0"))} />
                <InputField label="Parent Plan Key" placeholder="starter" value={plan.parent_plan_key} onChange={(value) => updatePlan(index, "parent_plan_key", keyFromName(value))} />
                <InputField label="Max Revisions" placeholder="3" value={plan.max_revisions} onChange={(value) => updatePlan(index, "max_revisions", value)} />
              </div>

              <div className="grid grid-cols-2 gap-xl mt-lg">
                <TextareaField label="Description" placeholder="Brief plan description shown to customers..." value={plan.description} rows={3} onChange={(value) => updatePlan(index, "description", value)} />
                <TextareaField label="Features (one per line)" placeholder="Unlimited revisions" value={plan.features_text} rows={3} onChange={(value) => updatePlan(index, "features_text", value)} />
                <TextareaField label="Custom Config (JSON)" placeholder='{"badge": "Popular", "highlight": true}' value={plan.custom_config_text} rows={4} onChange={(value) => updatePlan(index, "custom_config_text", value)} />
                <TextareaField label="Comparison Points (one per line)" placeholder="Best for small businesses" value={plan.comparison_points_text} rows={4} onChange={(value) => updatePlan(index, "comparison_points_text", value)} />
              </div>

              <div className="flex items-center gap-md mt-lg">
                <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                  <input type="checkbox" checked={plan.is_featured} onChange={(event) => updatePlan(index, "is_featured", event.target.checked)} />
                  Featured
                </label>
                <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                  <input type="checkbox" checked={plan.is_active} onChange={(event) => updatePlan(index, "is_active", event.target.checked)} />
                  Active
                </label>
              </div>
                </div>
              ))}
            </div>
          )}
          </div>
          )}

      {activePlanConfigTab === "package_relations" && (
      <div id="plan-config-package_relations" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Package Relations</h3>
        <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addRelation}>
          Add Relation
        </Button>
      </div>

      <div className="flex flex-col gap-lg">
        {relations.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-lg text-label-sm text-text-secondary">No relations configured.</div>
        )}
        {relations.map((relation, index) => (
          <div key={relation.row_id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-4 gap-lg">
              <SelectField
                label="From Plan"
                options={plans.map((plan) => ({ value: plan.plan_key, label: `${plan.name || plan.plan_key} (${plan.plan_key})` }))}
                value={relation.from_plan_key}
                onChange={(value) => updateRelation(index, "from_plan_key", value)}
              />
              <SelectField
                label="Relation"
                options={[
                  { value: "upgrade", label: "Upgrade" },
                  { value: "downgrade", label: "Downgrade" },
                  { value: "alternative", label: "Alternative" },
                ]}
                value={relation.relation_type}
                onChange={(value) => updateRelation(index, "relation_type", value)}
              />
              <SelectField
                label="To Plan"
                options={plans.map((plan) => ({ value: plan.plan_key, label: `${plan.name || plan.plan_key} (${plan.plan_key})` }))}
                value={relation.to_plan_key}
                onChange={(value) => updateRelation(index, "to_plan_key", value)}
              />
              <div className="flex items-end">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeRelation(index)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {activePlanConfigTab === "template_fields" && (
      <div id="plan-config-template_fields" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Template Fields</h3>
        <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addTemplateField}>
          Add Template Field
        </Button>
      </div>

      <div className="flex flex-col gap-lg">
        {templateFields.map((field, index) => (
          <div key={field.row_id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-3 gap-lg">
              <InputField label="Field Key" placeholder="hero_title" value={field.field_key} onChange={(value) => updateTemplateField(index, "field_key", value.replace(/\s+/g, "_").toLowerCase())} />
              <InputField label="Label" placeholder="Hero Title" value={field.label} onChange={(value) => updateTemplateField(index, "label", value)} />
              <SelectField
                label="Field Type"
                options={[
                  { value: "text", label: "Text" },
                  { value: "long_text", label: "Long Text" },
                  { value: "number", label: "Number" },
                  { value: "boolean", label: "Boolean" },
                  { value: "image", label: "Image URL" },
                  { value: "json", label: "JSON" },
                ]}
                value={field.field_type}
                onChange={(value) => updateTemplateField(index, "field_type", value)}
              />
              <TextareaField label="Default Value (JSON)" placeholder='"Hello World"' value={field.default_value_text} rows={3} onChange={(value) => updateTemplateField(index, "default_value_text", value)} />
              <TextareaField label="Options (JSON)" placeholder='[{"value": "opt1", "label": "Option 1"}]' value={field.options_text} rows={3} onChange={(value) => updateTemplateField(index, "options_text", value)} />
              <div className="flex flex-col justify-between gap-md">
                <div className="flex flex-col gap-md">
                  <InputField label="Display Order" placeholder="0" value={String(field.display_order)} onChange={(value) => updateTemplateField(index, "display_order", Number(value || "0"))} />
                  <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                    <input type="checkbox" checked={field.is_required} onChange={(event) => updateTemplateField(index, "is_required", event.target.checked)} />
                    Required
                  </label>
                </div>
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeTemplateField(index)}>
                  Remove Field
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {activePlanConfigTab === "template_values" && (
      <div id="plan-config-template_values" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Template Values</h3>
        <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addTemplateValue}>
          Add Template Value
        </Button>
      </div>

      <div className="flex flex-col gap-lg">
        {templateValues.map((value, index) => (
          <div key={value.row_id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-3 gap-lg">
              <SelectField
                label="Field Key"
                options={templateFields.map((field) => ({ value: field.field_key, label: `${field.label || field.field_key} (${field.field_key})` }))}
                value={value.field_key}
                onChange={(next) => updateTemplateValue(index, "field_key", next)}
              />
              <SelectField
                label="Plan Scope (Optional)"
                options={[{ value: "", label: "Service Default" }, ...plans.map((plan) => ({ value: plan.plan_key, label: `${plan.name || plan.plan_key} (${plan.plan_key})` }))]}
                value={value.service_plan_key}
                onChange={(next) => updateTemplateValue(index, "service_plan_key", next)}
              />
              <div className="flex items-end">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeTemplateValue(index)}>
                  Remove Value
                </Button>
              </div>
            </div>
            <div className="mt-lg">
              <TextareaField label="Value (JSON)" placeholder='"Hello World"' value={value.value_text} rows={4} onChange={(next) => updateTemplateValue(index, "value_text", next)} />
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {activePlanConfigTab === "service_metadata" && (
      <div id="plan-config-service_metadata" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Service Metadata & Category Mapping</h3>
        <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={saveServiceMeta} disabled={isSaving || !activeServiceSlug}>
          Save Metadata
        </Button>
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
        <div className="grid grid-cols-2 gap-lg">
          <InputField label="Hero Image URL" placeholder="https://cdn.example.com/hero.jpg" value={serviceHeroImageUrl} onChange={setServiceHeroImageUrl} />
          <InputField label="Canonical URL" placeholder="https://webndevs.com/service" value={serviceCanonicalUrl} onChange={setServiceCanonicalUrl} />
          <InputField label="Meta Title" placeholder="Service Meta Title" value={serviceMetaTitle} onChange={setServiceMetaTitle} />
          <InputField label="Meta Keywords (comma separated)" placeholder="design, seo, website" value={serviceMetaKeywords} onChange={setServiceMetaKeywords} />
          <div className="col-span-2">
            <TextareaField label="Meta Description" placeholder="Describe this service in 150–160 characters for search engines..." value={serviceMetaDescription} rows={3} onChange={setServiceMetaDescription} />
          </div>
        </div>
        <div className="mt-lg">
          <p className="text-label-sm text-text-secondary mb-sm">Assign Categories</p>
          <div className="grid grid-cols-3 gap-md">
            {categories.filter((item) => item.id).map((category) => {
              const categoryId = String(category.id);
              const checked = selectedCategoryIds.includes(categoryId);
              return (
                <label key={categoryId} className="flex items-center gap-sm text-label-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      setSelectedCategoryIds((current) =>
                        event.target.checked ? Array.from(new Set([...current, categoryId])) : current.filter((item) => item !== categoryId),
                      )
                    }
                  />
                  {category.name}
                </label>
              );
            })}
          </div>
          <div className="mt-md">
            <SelectField
              label="Primary Category"
              options={[{ value: "", label: "None" }, ...categories.filter((item) => selectedCategoryIds.includes(String(item.id))).map((item) => ({ value: String(item.id), label: item.name || item.slug }))]}
              value={primaryCategoryId}
              onChange={setPrimaryCategoryId}
            />
          </div>
        </div>
      </div>
      </div>
      )}

        </div>
      )}

      {!isPlanTabActive && (
        <div id="panel-service-page-sections" role="tabpanel" aria-labelledby="tab-service-page-sections" className="flex flex-col gap-xl">
      <h2 className="text-title text-text-primary">Service Page Sections</h2>

      <div className="bg-surface-bg rounded-corner-lg p-md border border-border-primary">
        {!isMobileLayout ? (
          <div role="tablist" aria-label="Service page sections" className="flex flex-wrap items-center gap-2">
            {servicePageSectionTabs.map((section) => {
              const isActive = activeServicePageSectionTab === section.value;
              return (
                <button
                  key={section.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`service-section-${section.value}`}
                  onClick={() => setActiveServicePageSectionTab(section.value)}
                  className={`rounded-corner-md border px-4 py-2 text-label-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-brand-primary bg-brand-primary text-on-brand shadow-sm"
                      : "border-border-primary bg-transparent text-text-secondary hover:bg-bg-faint hover:text-text-primary"
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        ) : (
          <SelectField
            label="Service Page Section"
            options={servicePageSectionTabs}
            value={activeServicePageSectionTab}
            onChange={(value) => setActiveServicePageSectionTab(value as ServicePageSectionTab)}
          />
        )}
      </div>

      {activeServicePageSectionTab === "publishing_workflow" && (
      <div id="service-section-publishing_workflow" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary text-label text-text-secondary">Loading publishing workflow...</div>
      ) : (
      <>
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Publishing Workflow</h3>
        <div className="flex items-center gap-sm">
          <InputField label="Locale" placeholder="en" value={sectionLocale} onChange={(value) => setSectionLocale(value.trim() || "en")} />
          <Button variant="neutral" size="small" onClick={() => activeServiceSlug && fetchManagedSections(activeServiceSlug, "draft")} disabled={!activeServiceSlug || isSaving}>
            Refresh Draft
          </Button>
          <Button variant="neutral" size="small" onClick={() => activeServiceSlug && fetchManagedSections(activeServiceSlug, "published")} disabled={!activeServiceSlug || isSaving}>
            Preview Published
          </Button>
          <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={() => saveManagedSections(false)} disabled={isSaving || !activeServiceSlug}>
            Save Draft
          </Button>
          <Button variant="primary" size="small" iconStart={<Save size={16} />} onClick={() => saveManagedSections(true)} disabled={isSaving || !activeServiceSlug}>
            Save & Publish
          </Button>
          <Button variant="neutral" size="small" onClick={publishManagedSections} disabled={isSaving || !activeServiceSlug}>
            Publish Draft
          </Button>
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
        <div className="grid grid-cols-3 gap-lg">
          <SelectField
            label="Rollback Version"
            options={[
              { value: "", label: "Select Version" },
              ...sectionHistory.map((item) => ({
                value: String(item.id),
                label: `V${item.version_number} • ${item.stage} • ${item.change_type} • ${new Date(item.created_at).toLocaleString()}`,
              })),
            ]}
            value={selectedSectionVersionId}
            onChange={setSelectedSectionVersionId}
          />
          <div className="flex items-end">
            <Button variant="neutral" size="small" onClick={() => rollbackManagedSections(false)} disabled={isSaving || !activeServiceSlug}>
              Rollback Draft
            </Button>
          </div>
          <div className="flex items-end">
            <Button variant="neutral" size="small" onClick={() => rollbackManagedSections(true)} disabled={isSaving || !activeServiceSlug}>
              Rollback & Publish
            </Button>
          </div>
        </div>
      </div>
      </>
      )}
      </div>
      )}

      {activeServicePageSectionTab === "managed_sections" && (
      <div id="service-section-managed_sections" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary text-label text-text-secondary">Loading managed sections...</div>
      ) : (
      <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
        <h3 className="text-label text-text-primary">Managed Sections</h3>
        <p className="text-label-sm text-text-secondary mt-sm">Select a section tab to edit its card content.</p>
        <div className="grid grid-cols-2 gap-md mt-lg">
          {SECTION_DEFINITIONS.map((definition) => {
            const section = managedSections.find((item) => item.section_key === definition.key);
            return (
              <button
                key={definition.key}
                type="button"
                onClick={() => setActiveServicePageSectionTab(definition.key)}
                className="rounded-corner-md border border-border-primary bg-bg-faint px-4 py-3 text-left transition-all duration-300 hover:bg-brand-primary/10"
              >
                <p className="text-label-sm text-text-primary">{definition.label}</p>
                <p className="text-label-xs text-text-secondary mt-1">{section?.items.length ?? 0} item(s)</p>
              </button>
            );
          })}
        </div>
      </div>
      )}
      </div>
      )}

      {managedSectionKeys.has(activeServicePageSectionTab as SectionKey) && (
      <div id={`service-section-${activeServicePageSectionTab}`} role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary text-label text-text-secondary">Loading section content...</div>
      ) : activeManagedSection ? (
      <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
        <div className="grid grid-cols-3 gap-lg">
          <InputField label="Section Key" value={activeManagedSection.section_key} onChange={() => {}} />
          <InputField label="Heading" placeholder="Why Choose Us" value={activeManagedSection.heading} onChange={(value) => updateManagedSection(activeManagedSectionIndex, "heading", value)} />
          <InputField label="Subheading" placeholder="Trusted by 500+ businesses" value={activeManagedSection.subheading} onChange={(value) => updateManagedSection(activeManagedSectionIndex, "subheading", value)} />
        </div>
        <div className="mt-md">
          <label className="flex items-center gap-sm text-label-sm text-text-secondary">
            <input type="checkbox" checked={activeManagedSection.is_active} onChange={(event) => updateManagedSection(activeManagedSectionIndex, "is_active", event.target.checked)} />
            Active Section
          </label>
        </div>
        <div className="flex items-center justify-between mt-lg">
          <p className="text-label-sm text-text-secondary">Items</p>
          <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={() => addManagedSectionItem(activeManagedSectionIndex)}>
            Add More
          </Button>
        </div>
        <div className="flex flex-col gap-md mt-md">
          {activeManagedSection.items.map((item, itemIndex) => (
            <div key={`${activeManagedSection.section_key}-${itemIndex}`} className="bg-bg-faint rounded-corner-md p-md border border-border-primary">
              {activeManagedSection.section_key === "client_testimonials" ? (
                <div className="flex flex-col gap-md">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                    <InputField
                      label="Author Name"
                      placeholder="Sarah Mitchell"
                      value={item.author_name}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "author_name", value)
                      }
                    />

                    <InputField
                      label="Author Role & Company"
                      placeholder="CEO, TechStart Inc."
                      value={item.author_title}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "author_title", value)
                      }
                    />

                    <InputField
                      label="Company"
                      placeholder="TechStart Inc."
                      value={item.company}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "company", value)
                      }
                    />

                    <InputField
                    label="Rating" 
                    value={item.rating}
                    placeholder="5"
                    onChange={(value) =>
                      updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "rating", value)}
                    />
                  </div>

                  <TextareaField
                    label="Content"
                    placeholder="WebNDevs transformed our outdated website into a modern, high-converting platform..."
                    value={item.content}
                    rows={4}
                    onChange={(value) =>
                      updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "content", value)
                    }
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="subtle"
                      size="small"
                      iconStart={<Trash2 size={16} />}
                      onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                    >
                      Remove Testimonial
                    </Button>
                  </div>
                </div>
              ) : activeManagedSection.section_key === "frequently_asked_questions" ? (
                  <div className="flex flex-col gap-md">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                      <TextareaField
                        label="Question"
                        placeholder="What services does WebNDevs offer?"
                        value={item.question}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "question", value)
                        }
                      />

                      <TextareaField
                        label="Answer"
                        placeholder="We offer complete digital solutions including web development, UI/UX design, mobile apps, AI automation, SEO, and digital marketing."
                        value={item.answer}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "answer", value)
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="subtle"
                        size="small"
                        iconStart={<Trash2 size={16} />}
                        onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                      >
                        Remove FAQ
                      </Button>
                    </div>
                  </div>
              ) : activeManagedSection.section_key === "real_results_delivered" ? (
                <div className="flex flex-col gap-md">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                    <InputField
                      label="Project Title"
                      placeholder="FinanceFlow SaaS Platform"
                      value={item.title}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                      }
                    />

                    <InputField
                      label="Category"
                      placeholder="Web Development"
                      value={item.category}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "category", value)
                      }
                    />

                    <InputField
                      label="Project URL"
                      placeholder="https://webndevs.com/project"
                      value={item.project_url}
                      onChange={(value) =>
                        updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "project_url", value)
                      }
                    />
                  </div>

                  <TextareaField
                    label="Project Description"
                    placeholder="Built a complete financial management platform with real-time analytics and automated reporting."
                    value={item.description}
                    rows={3}
                    onChange={(value) =>
                      updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)
                    }
                  />

                  <TextareaField
                    label="Results"
                    placeholder={`10,000+ active users in 6 months
                      40% reduction in processing time
                      98% uptime since launch`}
                    value={item.results}
                    rows={4}
                    onChange={(value) =>
                      updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "results", value)
                    }
                  />

                  <InputField
                    label="Technologies"
                    placeholder="React, Node.js, PostgreSQL"
                    value={item.technologies}
                    onChange={(value) =>
                      updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "technologies", value)
                    }
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="subtle"
                      size="small"
                      iconStart={<Trash2 size={16} />}
                      onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                    >
                      Remove Result
                    </Button>
                  </div>
                </div>
              ) : activeManagedSection.section_key === "why_choose_our_service" ? (
                    <div className="flex flex-col gap-md">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <InputField
                          label="Card Title"
                          placeholder="One Team for Everything"
                          value={item.title}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                          }
                        />

                        <InputField
                          label="Icon"
                          placeholder="type icon name from below description"
                          value={item.icon}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "icon", value)
                          }
                        />
                      </div>

                      <TextareaField
                        label="Description"
                        placeholder="Shield, Rocket, TrendingUp, BadgeCheck, Zap, Star, Target, Handshake, Award, CheckCircle, Gauge, Workflow, Sparkles, Lightbulb, Gem, Crown, Medal, ThumbsUp, Lock, ShieldCheck"
                        value={item.description}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)
                        }
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="subtle"
                          size="small"
                          iconStart={<Trash2 size={16} />}
                          onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                        >
                          Remove Card
                        </Button>
                      </div>
                    </div> 
              ) : activeManagedSection.section_key === "what_you_get" ? (
                    <div className="flex flex-col gap-md">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <InputField
                          label="Number"
                          placeholder="1"
                          value={item.number}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "number", value)
                          }
                        />

                        <InputField
                          label="Title"
                          placeholder="API integrations"
                          value={item.title}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                          }
                        />
                      </div>

                      <TextareaField
                        label="Description"
                        placeholder="Connect different platforms and tools to work together automatically."
                        value={item.description}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)
                        }
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="subtle"
                          size="small"
                          iconStart={<Trash2 size={16} />}
                          onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                        >
                          Remove Item
                        </Button>
                      </div>
                    </div> 
              ) : activeManagedSection.section_key === "technologies_we_use" ? (
                    <div className="flex flex-col gap-md">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <InputField
                          label="Technology Name"
                          placeholder="React, Node.js, AWS"
                          value={item.title}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                          }
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="subtle"
                          size="small"
                          iconStart={<Trash2 size={16} />}
                          onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                        >
                          Remove Technology
                        </Button>
                      </div>
                    </div> 
              ) : activeManagedSection.section_key === "who_is_this_for" ? (
                    <div className="flex flex-col gap-md">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <InputField
                          label="Title"
                          placeholder="Startups, SMBs, Enterprises"
                          value={item.title}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                          }
                        />
                      </div>

                      <TextareaField
                        label="Description"
                        placeholder="Automate workflows early and grow efficiently with smaller teams."
                        value={item.description}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)
                        }
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="subtle"
                          size="small"
                          iconStart={<Trash2 size={16} />}
                          onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                        >
                          Remove Clients
                        </Button>
                      </div>
                    </div> 
              ) : activeManagedSection.section_key === "how_we_work" ? (
                    <div className="flex flex-col gap-md">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                        <InputField
                          label="Number"
                          placeholder="1"
                          value={item.number}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "number", value)
                          }
                        />
                        <InputField
                          label="Title"
                          placeholder="Workflow Analysis"
                          value={item.title}
                          onChange={(value) =>
                            updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)
                          }
                        />
                      </div>

                      <TextareaField
                        label="Description"
                        placeholder="We study your current process and identify repetitive bottlenecks."
                        value={item.description}
                        rows={3}
                        onChange={(value) =>
                          updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)
                        }
                      />

                      <div className="flex justify-end">
                        <Button
                          variant="subtle"
                          size="small"
                          iconStart={<Trash2 size={16} />}
                          onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                        >
                          Remove Clients
                        </Button>
                      </div>
                    </div> 
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-md">
                    <InputField label="Title" placeholder="Feature Headline" value={item.title} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "title", value)} />
                    <InputField label="Name" placeholder="John Doe" value={item.name} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "name", value)} />
                    <InputField label="Role" placeholder="CEO, Acme Corp" value={item.role} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "role", value)} />
                    <InputField label="Value" placeholder="500+" value={item.value} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "value", value)} />
                    <InputField label="Metric" placeholder="clients served" value={item.metric} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "metric", value)} />
                    <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}>
                      Remove Item
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-md mt-md">
                    <TextareaField label="Description" placeholder="Brief description..." value={item.description} rows={2} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "description", value)} />
                    <TextareaField label="Quote" placeholder='"The best service I have ever used"' value={item.quote} rows={2} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "quote", value)} />
                    <TextareaField label="Question" placeholder="What does this plan include?" value={item.question} rows={2} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "question", value)} />
                    <TextareaField label="Answer" placeholder="This plan includes..." value={item.answer} rows={2} onChange={(value) => updateManagedSectionItem(activeManagedSectionIndex, itemIndex, "answer", value)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      ) : (
      <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary text-label text-text-secondary">Section data not available yet.</div>
      )}
      </div>
      )}

      {activeServicePageSectionTab === "dynamic_content" && (
      <div id="service-section-dynamic_content" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary text-label text-text-secondary">Loading dynamic content...</div>
      ) : (
      <>
      <div className="flex flex-col gap-lg">
        <div className="flex items-center justify-between mt-xl">
          <h3 className="text-label text-text-primary">Dynamic Page Content</h3>
          <div className="flex items-center gap-sm">
            <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addContentItem}>
              Add Content
            </Button>
            <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={savePageContent} disabled={isSaving || !activeServiceSlug}>
              Save Content
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          {pageContents.map((item, index) => (
            <div key={item.row_id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
              <div className="grid grid-cols-3 gap-lg">
                <InputField label="Content Key" placeholder="hero_title" value={item.content_key} onChange={(value) => updateContentItem(index, "content_key", value.replace(/\s+/g, "_").toLowerCase())} />
                <InputField label="Label" placeholder="Hero Title" value={item.label} onChange={(value) => updateContentItem(index, "label", value)} />
                <SelectField
                  label="Content Type"
                  options={[
                    { value: "text", label: "Text" },
                    { value: "rich_text", label: "Rich Text" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "Boolean" },
                    { value: "image", label: "Image URL" },
                    { value: "json", label: "JSON" },
                    { value: "seo", label: "SEO JSON" },
                  ]}
                  value={item.content_type}
                  onChange={(value) => updateContentItem(index, "content_type", value)}
                />
                <InputField label="Display Order" placeholder="0" value={String(item.display_order)} onChange={(value) => updateContentItem(index, "display_order", Number(value || "0"))} />
                <div className="flex items-end">
                  <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeContentItem(index)}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="mt-lg">
                <TextareaField label="Value" placeholder="Enter text, number, or JSON depending on content type..." value={item.value_text} rows={4} onChange={(value) => updateContentItem(index, "value_text", value)} />
              </div>
              <div className="mt-md">
                <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateContentItem(index, "is_active", event.target.checked)} />
                  Active
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
      </div>
      )}

        </div>
      )}

      {isPlanTabActive && (
        <div className="flex flex-col gap-xl">
      {activePlanConfigTab === "package_offers" && (
      <div id="plan-config-package_offers" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Package Offers</h3>
        <div className="flex items-center gap-sm">
          <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addOffer}>
            Add Offer
          </Button>
          <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={saveOffers} disabled={isSaving || !activeServiceSlug}>
            Save Offers
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-lg">
        {offers.map((offer, index) => (
          <div key={offer.row_id} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-3 gap-lg">
              <InputField label="Plan Key" placeholder="premium" value={offer.plan_key} onChange={(value) => updateOffer(index, "plan_key", value)} />
              <InputField label="Offer Key" placeholder="summer-sale" value={offer.offer_key} onChange={(value) => updateOffer(index, "offer_key", keyFromName(value))} />
              <InputField label="Name" placeholder="Summer Sale" value={offer.name} onChange={(value) => updateOffer(index, "name", value)} />
              <SelectField
                label="Offer Type"
                options={[
                  { value: "percentage_discount", label: "Percentage Discount" },
                  { value: "fixed_discount", label: "Fixed Discount" },
                  { value: "bundle", label: "Bundle" },
                ]}
                value={offer.offer_type}
                onChange={(value) => updateOffer(index, "offer_type", value)}
              />
              <InputField label="Discount Value" placeholder="10" value={offer.discount_value} onChange={(value) => updateOffer(index, "discount_value", value)} />
              <InputField label="Combo Price" placeholder="99.99" value={offer.combo_price} onChange={(value) => updateOffer(index, "combo_price", value)} />
              <InputField label="Display Order" placeholder="0" value={String(offer.display_order)} onChange={(value) => updateOffer(index, "display_order", Number(value || "0"))} />
              <InputField label="Starts At" placeholder="2026-01-01 00:00:00" value={offer.starts_at} onChange={(value) => updateOffer(index, "starts_at", value)} />
              <InputField label="Ends At" placeholder="2026-12-31 23:59:59" value={offer.ends_at} onChange={(value) => updateOffer(index, "ends_at", value)} />
              <div className="flex items-end">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeOffer(index)}>
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-lg mt-lg">
              <TextareaField label="Description" placeholder="Get 10% off your first month with this limited-time offer..." value={offer.description} rows={3} onChange={(value) => updateOffer(index, "description", value)} />
              <TextareaField label="Combo Plan Keys (one per line)" placeholder="starter" value={offer.combo_plan_keys_text} rows={3} onChange={(value) => updateOffer(index, "combo_plan_keys_text", value)} />
              <TextareaField label="Conditions (JSON)" placeholder='{"min_order": 100, "valid_for": "new_users"}' value={offer.conditions_text} rows={3} onChange={(value) => updateOffer(index, "conditions_text", value)} />
            </div>
            <div className="mt-md">
              <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                <input type="checkbox" checked={offer.is_active} onChange={(event) => updateOffer(index, "is_active", event.target.checked)} />
                Active
              </label>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {activePlanConfigTab === "service_categories" && (
      <div id="plan-config-service_categories" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Service Categories</h3>
        <div className="flex items-center gap-sm">
          <InputField placeholder="Search categories..." value={categorySearch} onChange={setCategorySearch} />
          <Button variant="neutral" size="small" iconStart={<RefreshCw size={16} />} onClick={fetchCategories}>
            Search
          </Button>
          <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addCategory}>
            Add Category
          </Button>
          <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={saveCategories} disabled={isSaving}>
            Save Categories
          </Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={deleteSelectedCategories} disabled={isSaving}>
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-lg">
        {categories.map((category, index) => (
          <div key={`${category.id ?? "new"}-${index}`} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-4 gap-lg">
              <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                <input type="checkbox" checked={category.is_selected} onChange={(event) => toggleCategorySelection(index, event.target.checked)} />
                Select
              </label>
              <InputField label="Name" placeholder="Design" value={category.name} onChange={(value) => updateCategory(index, "name", value)} />
              <InputField label="Slug" placeholder="design" value={category.slug} onChange={(value) => updateCategory(index, "slug", keyFromName(value))} />
              <InputField label="Parent ID" placeholder="Optional" value={category.parent_id} onChange={(value) => updateCategory(index, "parent_id", value)} />
              <InputField label="Template Key" placeholder="design_template" value={category.template_key} onChange={(value) => updateCategory(index, "template_key", value)} />
              <InputField label="Display Order" placeholder="0" value={String(category.display_order)} onChange={(value) => updateCategory(index, "display_order", Number(value || "0"))} />
              <div className="flex items-end">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeCategory(index)}>
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-lg mt-lg">
              <TextareaField label="Description" placeholder="Describe what services this category covers..." value={category.description} rows={2} onChange={(value) => updateCategory(index, "description", value)} />
              <TextareaField label="Custom Fields (JSON)" placeholder='{"icon": "palette", "color": "#5250f3"}' value={category.custom_fields_text} rows={2} onChange={(value) => updateCategory(index, "custom_fields_text", value)} />
              <TextareaField label="Conditional Rules (JSON)" placeholder='{"show_if": "plan_key=pro"}' value={category.conditional_rules_text} rows={2} onChange={(value) => updateCategory(index, "conditional_rules_text", value)} />
            </div>
            <div className="mt-md">
              <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                <input type="checkbox" checked={category.is_active} onChange={(event) => updateCategory(index, "is_active", event.target.checked)} />
                Active
              </label>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {activePlanConfigTab === "media_library" && (
      <div id="plan-config-media_library" role="tabpanel" className="flex flex-col gap-lg transition-opacity duration-200">
      <div className="flex items-center justify-between mt-xl">
        <h3 className="text-label text-text-primary">Media Library</h3>
        <div className="flex items-center gap-sm">
          <InputField placeholder="Search media..." value={mediaSearch} onChange={setMediaSearch} />
          <Button variant="neutral" size="small" iconStart={<RefreshCw size={16} />} onClick={fetchMediaAssets}>
            Search
          </Button>
          <Button variant="neutral" size="small" iconStart={<Plus size={16} />} onClick={addMediaAsset}>
            Add Asset
          </Button>
          <Button variant="neutral" size="small" iconStart={<Save size={16} />} onClick={saveMediaAssets} disabled={isSaving}>
            Save Media
          </Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={deleteSelectedMediaAssets} disabled={isSaving}>
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-lg">
        {mediaAssets.map((asset, index) => (
          <div key={`${asset.id ?? "new"}-${index}`} className="bg-surface-bg rounded-corner-lg p-lg border border-border-primary">
            <div className="grid grid-cols-4 gap-lg">
              <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                <input type="checkbox" checked={asset.is_selected} onChange={(event) => toggleMediaAssetSelection(index, event.target.checked)} />
                Select
              </label>
              <InputField label="File Name" placeholder="banner.png" value={asset.file_name} onChange={(value) => updateMediaAsset(index, "file_name", value)} />
              <InputField label="URL" placeholder="https://cdn.example.com/banner.png" value={asset.url} onChange={(value) => updateMediaAsset(index, "url", value)} />
              <InputField label="Path" placeholder="services/design/banner.png" value={asset.path} onChange={(value) => updateMediaAsset(index, "path", value)} />
              <InputField label="Folder ID" placeholder="Optional" value={asset.media_folder_id} onChange={(value) => updateMediaAsset(index, "media_folder_id", value)} />
              <InputField label="Service ID" placeholder="Optional" value={asset.service_id} onChange={(value) => updateMediaAsset(index, "service_id", value)} />
              <InputField label="Category ID" placeholder="Optional" value={asset.service_category_id} onChange={(value) => updateMediaAsset(index, "service_category_id", value)} />
              <InputField label="Disk" placeholder="public" value={asset.disk} onChange={(value) => updateMediaAsset(index, "disk", value)} />
              <InputField label="MIME Type" placeholder="image/png" value={asset.mime_type} onChange={(value) => updateMediaAsset(index, "mime_type", value)} />
              <InputField label="Size (bytes)" placeholder="10240" value={asset.size_bytes} onChange={(value) => updateMediaAsset(index, "size_bytes", value)} />
              <InputField label="Width" placeholder="1200" value={asset.width} onChange={(value) => updateMediaAsset(index, "width", value)} />
              <InputField label="Height" placeholder="630" value={asset.height} onChange={(value) => updateMediaAsset(index, "height", value)} />
              <InputField label="Display Order" placeholder="0" value={String(asset.display_order)} onChange={(value) => updateMediaAsset(index, "display_order", Number(value || "0"))} />
              <div className="flex items-end">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => removeMediaAsset(index)}>
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-lg mt-lg">
              <InputField label="Title" placeholder="Homepage Banner" value={asset.title} onChange={(value) => updateMediaAsset(index, "title", value)} />
              <InputField label="Alt Text" placeholder="People designing website" value={asset.alt_text} onChange={(value) => updateMediaAsset(index, "alt_text", value)} />
              <TextareaField label="Caption" placeholder="Banner image for the homepage hero section" value={asset.caption} rows={2} onChange={(value) => updateMediaAsset(index, "caption", value)} />
              <TextareaField label="Tags (one per line)" placeholder="hero" value={asset.tags_text} rows={2} onChange={(value) => updateMediaAsset(index, "tags_text", value)} />
              <TextareaField label="Optimization Meta (JSON)" placeholder='{"quality": 80, "format": "webp"}' value={asset.optimization_meta_text} rows={2} onChange={(value) => updateMediaAsset(index, "optimization_meta_text", value)} />
            </div>
            <div className="mt-md">
              <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                <input type="checkbox" checked={asset.is_optimized} onChange={(event) => updateMediaAsset(index, "is_optimized", event.target.checked)} />
                Optimized
              </label>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}
      </div>
      )}
    </div>
  );
}
