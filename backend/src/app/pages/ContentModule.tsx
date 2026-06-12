import { useEffect, useMemo, useRef, useState, JSX } from "react";
import { Badge, Button, InputField, Modal, SelectField, TextareaField } from "@figma/astraui";
import { 
  Eye, EyeOff, Globe, Layout, List, Monitor, Pencil, Plus, RefreshCw, Save, 
  Smartphone, Trash2, Type, GripVertical, Star, CheckCircle, XCircle,
  ChevronDown, ChevronRight, ExternalLink, MessageSquare, Image, Link2,
  Download, Search, RotateCcw, History, Trash, Users, Briefcase, Heart,
  Table, Columns, Copy, Clipboard, Check
} from "lucide-react";
import { API_BASE_URL } from "../../config/api.config";
import { clearStoredAuth, getStoredToken, setStoredToken } from "../auth";
import { FloatingAiButton } from "../components/ai";
import { contentApi, ApiError, AuthError, ForbiddenError, ContentPage as ApiContentPageType, ContentSection as ApiContentSectionType, ContentItem as ApiContentItemType } from "../utils/content-api";

// Section types - defines what fields a section has
type SectionType = "heading-text" | "approach-table";

// Item types - defines what fields an item has
type ItemType = "qa" | "project" | "testimonial" | "datatile" | "servicecard" | "choosecard" | "processcard";

type ContentItem = {
  id: number;
  item_key: string | null;
  title: string;
  content: string | null;
  category: string | null;
  url: string | null;
  description: string | null;
  results: string[] | null;
  tags: string[] | null;
  badge: string | null;
  avatar: string | null;
  client_name: string | null;
  client_role: string | null;
  company: string | null;
  rating: number | null;
  duration: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  custom_fields: Record<string, unknown> | null;
  external_id: string | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  
  // Q&A fields
  question?: string | null;
  answer?: string | null;
  
  // Project (Pro) fields
  pro_name?: string | null;
  pro_category?: string | null;
  pro_url?: string | null;
  pro_description?: string | null;
  pro_results?: string | string[] | null;
  pro_tag?: string | string[] | null;
  pro_badge?: string | null;
  
  // Testimonial (Test) fields
  test_name?: string | null;
  test_company?: string | null;
  test_role?: string | null;
  test_description?: string | null;
  test_url?: string | null;
  test_rate?: number | null;
  
  // Data Tile fields
  tile_name?: string | null;
  tile_url?: string | null;
  tile_description?: string | null;
  
  // Service Card (Ser) fields
  ser_name?: string | null;
  ser_url?: string | null;
  ser_description?: string | null;
  ser_icon?: string | null;
  ser_tag?: string | null;
  
  // Choose Card (cc) fields
  cc_name?: string | null;
  cc_description?: string | null;
  cc_icon?: string | null;
  
  // Process Card (pc) fields
  pc_name?: string | null;
  pc_number?: string | null;
  pc_description?: string | null;
  pc_icon?: string | null;
  pc_timeline?: string | null;
};

type ContentSection = {
  id: number;
  content_page_id: number;
  section_key: string;
  section_type: SectionType;
  title: string;
  name: string;
  content: string;
  is_visible: boolean;
  sort_order: number;
  fields: Record<string, unknown>;
  updated_at: string | null;
  items?: ContentItem[];
  
  // Heading Text fields
  description?: string | null;
  tag?: string | null;
  subheading1?: string | null;
  subheading2?: string | null;
  subtext?: string | null;
  
  // Approach Table fields
  left_heading?: string | null;
  right_heading?: string | null;
  left_points?: string[] | null;
  right_points?: string[] | null;
};

type PageContent = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  seo_title: string;
  seo_description: string;
  meta_keywords: string;
  service_id: number | null;
  service_name: string | null;
  sync_token: string | null;
  updated_at: string | null;
  sections: ContentSection[];
};

type ApiContentSection = {
  id: number;
  content_page_id?: number;
  section_key: string;
  type?: SectionType;
  section_type?: SectionType;
  title: string;
  name?: string | null;
  content?: string | null;
  visible?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  fields?: Record<string, unknown> | null;
  updated_at?: string | null;
  items?: ContentItem[];
  
  // Heading Text fields
  description?: string | null;
  tag?: string | null;
  subheading1?: string | null;
  subheading2?: string | null;
  subtext?: string | null;
  
  // Approach Table fields
  left_heading?: string | null;
  right_heading?: string | null;
  left_points?: string[] | null;
  right_points?: string[] | null;
};

type ApiContentPage = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  seo_title: string | null;
  seo_description: string | null;
  meta_keywords: string | null;
  service_id: number | null;
  service?: { id: number; name: string; slug: string } | null;
  sections: ApiContentSection[] | null;
  sync_token?: string | null;
  updated_at?: string | null;
};

type ServiceItem = { id: number; name: string };

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type SectionDraft = {
  section_key: string;
  section_type: SectionType;
  title: string;
  name: string;
  content: string;
  is_visible: "true" | "false";
  sort_order: string;
  fields_text: string;
  
  // Heading Text fields
  description: string;
  tag: string;
  subheading1: string;
  subheading2: string;
  subtext: string;
  
  // Approach Table fields
  left_heading: string;
  right_heading: string;
  left_points: string;
  right_points: string;
};

// Q&A Item Form - using exact field names from jsonformat.md
type QaItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Q&A specific fields
  question: string;
  answer: string;
  [key: string]: string;
};

// Project (Pro) Item Form - using exact prefixed field names
type ProjectItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Project specific fields
  pro_name: string;
  pro_category: string;
  pro_url: string;
  pro_description: string;
  pro_results: string;
  pro_tag: string;
  pro_badge: string;
  [key: string]: string;
};

// Testimonial (Test) Item Form - using exact prefixed field names
type TestimonialItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Testimonial specific fields
  test_name: string;
  test_company: string;
  test_role: string;
  test_description: string;
  test_url: string;
  test_rate: string;
  [key: string]: string;
};

// Data Tile Item Form - using exact prefixed field names
type DataTileItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Data Tile specific fields
  tile_name: string;
  tile_url: string;
  tile_description: string;
  [key: string]: string;
};

// Service Card (Ser) Item Form - using exact prefixed field names
type ServiceCardItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Service Card specific fields
  ser_name: string;
  ser_url: string;
  ser_description: string;
  ser_icon: string;
  ser_tag: string;
  [key: string]: string;
};

// Choose Card (cc) Item Form - using exact prefixed field names
type ChooseCardItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Choose Card specific fields
  cc_name: string;
  cc_description: string;
  cc_icon: string;
  [key: string]: string;
};

// Process Card (pc) Item Form - using exact prefixed field names
type ProcessCardItemForm = {
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  // Process Card specific fields
  pc_name: string;
  pc_number: string;
  pc_description: string;
  pc_icon: string;
  pc_timeline: string;
  [key: string]: string;
};

type ItemForm = QaItemForm | ProjectItemForm | TestimonialItemForm | DataTileItemForm | ServiceCardItemForm | ChooseCardItemForm | ProcessCardItemForm;

const emptyQaItemForm: QaItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  question: "",
  answer: "",
};

const emptyProjectItemForm: ProjectItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  pro_name: "",
  pro_category: "",
  pro_url: "",
  pro_description: "",
  pro_results: "",
  pro_tag: "",
  pro_badge: "",
};

const emptyTestimonialItemForm: TestimonialItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  test_name: "",
  test_company: "",
  test_role: "",
  test_description: "",
  test_url: "",
  test_rate: "5",
};

const emptyDataTileItemForm: DataTileItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  tile_name: "",
  tile_url: "",
  tile_description: "",
};

const emptyServiceCardItemForm: ServiceCardItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  ser_name: "",
  ser_url: "",
  ser_description: "",
  ser_icon: "",
  ser_tag: "",
};

const emptyChooseCardItemForm: ChooseCardItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  cc_name: "",
  cc_description: "",
  cc_icon: "",
};

const emptyProcessCardItemForm: ProcessCardItemForm = {
  item_key: "",
  sort_order: "0",
  is_featured: "false",
  is_active: "true",
  pc_name: "",
  pc_number: "",
  pc_description: "",
  pc_icon: "",
  pc_timeline: "",
};

const emptyHeadingTextForm: SectionDraft = {
  section_key: "", title: "", name: "", content: "", fields_text: "{}",
  is_visible: "true", section_type: "heading-text", sort_order: "0",
  description: "", tag: "", subheading1: "", subheading2: "", subtext: "",
  left_heading: "", right_heading: "", left_points: "", right_points: "",
};

const sectionTypeOptions = [
  { value: "heading-text", label: "Heading & Text" },
  { value: "approach-table", label: "Approach Table" },
];

const sectionTypeIcons: Record<SectionType, JSX.Element> = {
  "heading-text": <Type size={14} />,
  "approach-table": <Table size={14} />,
};

const emptySectionDraft: SectionDraft = {
  section_key: "",
  section_type: "heading-text",
  title: "",
  name: "",
  content: "",
  is_visible: "true",
  sort_order: "0",
  fields_text: "{}",
  description: "",
  tag: "",
  subheading1: "",
  subheading2: "",
  subtext: "",
  left_heading: "",
  right_heading: "",
  left_points: "",
  right_points: "",
};

// Simple mapItem - just return item as-is since ContentItem already has all fields
// The extract from custom_fields should be in itemToForm, not here
function mapItem(item: ContentItem): ContentItem {
  return item;
}

function mapSection(section: ApiContentSection, index: number): ContentSection {
  const sectionType = section.section_type ?? section.type ?? "heading-text";
  const apiFields = section.fields ?? {};
  return {
    id: section.id,
    content_page_id: section.content_page_id ?? 0,
    section_key: section.section_key || `section-${section.id}`,
    section_type: sectionType,
    title: section.title || `Section ${index + 1}`,
    name: section.name ?? "",
    content: section.content ?? "",
    is_visible: section.is_visible ?? section.visible ?? true,
    sort_order: section.sort_order ?? index,
    fields: apiFields,
    updated_at: section.updated_at ?? null,
    items: (section.items ?? []).map(mapItem),
    // Extract heading-text fields from both top-level API fields and nested fields object
    description: (apiFields.description as string) || section.description || "",
    tag: (apiFields.tag as string) || section.tag || "",
    subheading1: (apiFields.subheading1 as string) || section.subheading1 || "",
    subheading2: (apiFields.subheading2 as string) || section.subheading2 || "",
    subtext: (apiFields.subtext as string) || section.subtext || "",
    // Extract approach-table fields from both top-level API fields and nested fields object
    left_heading: (apiFields.left_heading as string) || section.left_heading || "",
    right_heading: (apiFields.right_heading as string) || section.right_heading || "",
    left_points: (apiFields.left_points as string[]) || section.left_points || null,
    right_points: (apiFields.right_points as string[]) || section.right_points || null,
  };
}

function mapPage(page: ApiContentPage): PageContent {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    seo_title: page.seo_title ?? "",
    seo_description: page.seo_description ?? "",
    meta_keywords: page.meta_keywords ?? "",
    service_id: page.service_id,
    service_name: page.service?.name ?? null,
    sync_token: page.sync_token ?? null,
    updated_at: page.updated_at ?? null,
    sections: (page.sections ?? []).map(mapSection).sort((a, b) => a.sort_order - b.sort_order),
  };
}

function sectionToDraft(section: ContentSection): SectionDraft {
  return {
    section_key: section.section_key,
    section_type: section.section_type,
    title: section.title,
    name: section.name,
    content: section.content,
    is_visible: section.is_visible ? "true" : "false",
    sort_order: String(section.sort_order),
    fields_text: JSON.stringify(section.fields ?? {}, null, 2),
    // Heading Text fields
    description: section.description ?? "",
    tag: section.tag ?? "",
    subheading1: section.subheading1 ?? "",
    subheading2: section.subheading2 ?? "",
    subtext: section.subtext ?? "",
    // Approach Table fields
    left_heading: section.left_heading ?? "",
    right_heading: section.right_heading ?? "",
    left_points: JSON.stringify(section.left_points ?? []),
    right_points: JSON.stringify(section.right_points ?? []),
  };
}

// Helper function to ensure a value is converted to a string for form display
function ensureString(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

// Helper function to ensure a value is converted to a string array
function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }
  return [];
}

// Detect item type from the item's truthy prefixed fields
// Also checks custom_fields since backend may store prefixed fields there
function detectItemType(item: ContentItem): ItemType {
  const cf = item.custom_fields ?? {};
  // Check prefixed fields to determine item type - check both direct fields AND custom_fields
  if (item.pro_name || cf.pro_name) return "project";
  if (item.test_name || cf.test_name) return "testimonial";
  if (item.tile_name || cf.tile_name) return "datatile";
  if (item.ser_name || cf.ser_name) return "servicecard";
  if (item.cc_name || cf.cc_name) return "choosecard";
  if (item.pc_name || cf.pc_name) return "processcard";
  if (item.question || cf.question) return "qa";
  // Default to qa if no prefixed fields found
  return "qa";
}

// Get form based on item type
function getEmptyForm(itemType: ItemType): ItemForm {
  switch (itemType) {
    case "project":
      return { ...emptyProjectItemForm };
    case "testimonial":
      return { ...emptyTestimonialItemForm };
    case "datatile":
      return { ...emptyDataTileItemForm };
    case "servicecard":
      return { ...emptyServiceCardItemForm };
    case "choosecard":
      return { ...emptyChooseCardItemForm };
    case "processcard":
      return { ...emptyProcessCardItemForm };
    case "qa":
    default:
      return { ...emptyQaItemForm };
  }
}

// Convert item to form based on item type - using exact prefixed fields from jsonformat.md
// Also extracts from custom_fields if available
function itemToForm(item: ContentItem, itemType: ItemType): ItemForm {
  const customFields = item.custom_fields ?? {};
  switch (itemType) {
    case "project":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        pro_name: item.pro_name ?? (customFields.pro_name as string) ?? "",
        pro_category: item.pro_category ?? (customFields.pro_category as string) ?? "",
        pro_url: item.pro_url ?? (customFields.pro_url as string) ?? "",
        pro_description: item.pro_description ?? (customFields.pro_description as string) ?? "",
        // Convert arrays to strings for form inputs (new line for results, comma for tags)
        pro_results: Array.isArray(item.pro_results) 
          ? item.pro_results.join('\n') 
          : typeof item.pro_results === 'string'
            ? item.pro_results
            : Array.isArray(customFields.pro_results) 
              ? customFields.pro_results.join('\n')
              : (customFields.pro_results as string) ?? "",
        pro_tag: Array.isArray(item.pro_tag) 
          ? item.pro_tag.join(', ') 
          : typeof item.pro_tag === 'string'
            ? item.pro_tag
            : Array.isArray(customFields.pro_tag) 
              ? customFields.pro_tag.join(', ')
              : (customFields.pro_tag as string) ?? "",
        pro_badge: item.pro_badge ?? (customFields.pro_badge as string) ?? "",
      };
    case "testimonial":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        test_name: item.test_name ?? (customFields.test_name as string) ?? "",
        test_company: item.test_company ?? (customFields.test_company as string) ?? "",
        test_role: item.test_role ?? (customFields.test_role as string) ?? "",
        test_description: item.test_description ?? (customFields.test_description as string) ?? "",
        test_url: item.test_url ?? (customFields.test_url as string) ?? "",
        test_rate: String(item.test_rate ?? (customFields.test_rate as number) ?? 5),
      };
    case "datatile":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        tile_name: item.tile_name ?? (customFields.tile_name as string) ?? "",
        tile_url: item.tile_url ?? (customFields.tile_url as string) ?? "",
        tile_description: item.tile_description ?? (customFields.tile_description as string) ?? "",
      };
    case "servicecard":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        ser_name: item.ser_name ?? (customFields.ser_name as string) ?? "",
        ser_url: item.ser_url ?? (customFields.ser_url as string) ?? "",
        ser_description: item.ser_description ?? (customFields.ser_description as string) ?? "",
        ser_icon: item.ser_icon ?? (customFields.ser_icon as string) ?? "",
        ser_tag: item.ser_tag ?? (customFields.ser_tag as string) ?? "",
      };
    case "choosecard":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        cc_name: item.cc_name ?? (customFields.cc_name as string) ?? "",
        cc_description: item.cc_description ?? (customFields.cc_description as string) ?? "",
        cc_icon: item.cc_icon ?? (customFields.cc_icon as string) ?? "",
      };
    case "processcard":
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        pc_name: item.pc_name ?? (customFields.pc_name as string) ?? "",
        pc_number: item.pc_number ?? (customFields.pc_number as string) ?? "",
        pc_description: item.pc_description ?? (customFields.pc_description as string) ?? "",
        pc_icon: item.pc_icon ?? (customFields.pc_icon as string) ?? "",
        pc_timeline: item.pc_timeline ?? (customFields.pc_timeline as string) ?? "",
      };
    case "qa":
    default:
      return {
        item_key: item.item_key ?? "",
        sort_order: String(item.sort_order),
        is_featured: (item.is_featured ? "true" : "false") as "true" | "false",
        is_active: (item.is_active ? "true" : "false") as "true" | "false",
        question: item.question ?? (customFields.question as string) ?? "",
        answer: item.answer ?? (customFields.answer as string) ?? "",
      };
  }
}

// Build payload from form based on item type
function buildPayload(form: ItemForm, itemType: ItemType): Record<string, unknown> {
  const base = {
    item_key: form.item_key || undefined,
    sort_order: Number(form.sort_order) || 0,
    is_featured: form.is_featured === "true",
    is_active: form.is_active === "true",
  };

  switch (itemType) {
    case "project":
      return { ...base, pro_name: form.pro_name, pro_category: form.pro_category, pro_url: form.pro_url, pro_description: form.pro_description, pro_results: form.pro_results, pro_tag: form.pro_tag, pro_badge: form.pro_badge };
    case "testimonial":
      return { ...base, test_name: form.test_name, test_company: form.test_company, test_role: form.test_role, test_description: form.test_description, test_url: form.test_url, test_rate: Number(form.test_rate) || 5 };
    case "datatile":
      return { ...base, tile_name: form.tile_name, tile_url: form.tile_url, tile_description: form.tile_description };
    case "servicecard":
      return { ...base, ser_name: form.ser_name, ser_url: form.ser_url, ser_description: form.ser_description, ser_icon: form.ser_icon, ser_tag: form.ser_tag };
    case "choosecard":
      return { ...base, cc_name: form.cc_name, cc_description: form.cc_description, cc_icon: form.cc_icon };
    case "processcard":
      return { ...base, pc_name: form.pc_name, pc_number: form.pc_number, pc_description: form.pc_description, pc_icon: form.pc_icon, pc_timeline: form.pc_timeline };
    case "qa":
    default:
      return { ...base, question: form.question, answer: form.answer };
  }
}

function slugify(value: string): string {
  // Handle slug that starts with /
  const startsWithSlash = value.startsWith('/');
  const result = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return startsWithSlash ? "/" + result.replace(/^\//, "") : result;
}

function formatDate(value: string | null): string {
  if (!value) return "N/A";
  return value.slice(0, 10);
}

function normalizeList<T>(response: T[] | { data?: T[] } | undefined | null): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

// Page Card Component (matches ServiceCard pattern)
function PageCard({ page, onEdit, onDelete, canManage }: { page: PageContent; onEdit: (page: PageContent) => void; onDelete: (page: PageContent) => void; canManage: boolean }) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg border border-border-primary">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-lg">
          <div className="text-brand-primary bg-brand-muted p-md rounded-corner-md">
            <Layout size={20} />
          </div>
          <div>
            <p className="text-label text-text-primary font-semibold">{page.title}</p>
            <p className="text-video-title text-text-tertiary">{`/${page.slug}`}</p>
          </div>
        </div>
        <Badge label={page.status} variant={page.status === "published" ? "success" : "default"} />
      </div>

      <p className="text-label-sm text-text-secondary">{page.seo_description || "No SEO description set"}</p>

      <div className="bg-bg-faint rounded-corner-md p-lg">
        <p className="text-video-title text-text-secondary mb-sm">Sections ({page.sections.length})</p>
        <div className="flex flex-wrap gap-sm">
          {page.sections.slice(0, 4).map((section) => (
            <span key={section.id} className="bg-surface-bg border border-border-secondary rounded-corner-md px-sm py-xs text-video-title text-text-primary flex items-center gap-xs">
              {sectionTypeIcons[section.section_type]}
              {section.title}
            </span>
          ))}
          {page.sections.length > 4 && (
            <span className="text-video-title text-text-tertiary">+{page.sections.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary">{(page.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0))} total items</p>
          <p className="text-video-title text-text-tertiary">{page.service_name ? `Linked: ${page.service_name}` : "General Page"}</p>
        </div>
        <Badge label={page.service_name ? "Service" : "General"} variant="secondary" />
      </div>

      <div className="flex gap-sm">
        <Button variant="neutral" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(page)} disabled={!canManage}>
          Edit
        </Button>
        <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(page)} disabled={!canManage}>
          Delete
        </Button>
      </div>
    </div>
  );
}

// Page Card with Copy functionality
function PageCardWithCopy({ 
  page, 
  onEdit, 
  onDelete, 
  onCopySection, 
  onCopyItem,
  canManage,
  copiedSectionId,
  copiedItemId 
}: { 
  page: PageContent; 
  onEdit: (page: PageContent) => void; 
  onDelete: (page: PageContent) => void; 
  onCopySection: (section: ContentSection) => void;
  onCopyItem: (item: ContentItem, sectionId: number) => void;
  canManage: boolean;
  copiedSectionId: number | null;
  copiedItemId: number | null;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg border border-border-primary">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-lg">
          <div className="text-brand-primary bg-brand-muted p-md rounded-corner-md">
            <Layout size={20} />
          </div>
          <div>
            <p className="text-label text-text-primary font-semibold">{page.title}</p>
            <p className="text-video-title text-text-tertiary">{`/${page.slug}`}</p>
          </div>
        </div>
        <Badge label={page.status} variant={page.status === "published" ? "success" : "default"} />
      </div>

      <p className="text-label-sm text-text-secondary">{page.seo_description || "No SEO description set"}</p>

      <div className="bg-bg-faint rounded-corner-md p-lg">
        <p className="text-video-title text-text-secondary mb-sm">Sections ({page.sections.length})</p>
        <div className="flex flex-col gap-sm">
          {page.sections.slice(0, 4).map((section) => (
            <div key={section.id} className="flex items-center justify-between bg-surface-bg border border-border-secondary rounded-corner-md px-sm py-xs">
              <div className="flex items-center gap-xs">
                {sectionTypeIcons[section.section_type]}
                <span className="text-video-title text-text-primary truncate">{section.title}</span>
                {section.items && section.items.length > 0 && (
                  <span className="text-video-title text-text-tertiary">({section.items.length} items)</span>
                )}
              </div>
              {canManage && (
                <button
                  onClick={() => onCopySection(section)}
                  className={`p-xs rounded hover:bg-brand-muted transition-colors ${copiedSectionId === section.id ? 'text-success' : 'text-text-tertiary'}`}
                  title={copiedSectionId === section.id ? "Copied!" : "Copy section"}
                >
                  {copiedSectionId === section.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          ))}
          {page.sections.length > 4 && (
            <span className="text-video-title text-text-tertiary">+{page.sections.length - 4} more sections</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-text-primary">{(page.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0))} total items</p>
          <p className="text-video-title text-text-tertiary">{page.service_name ? `Linked: ${page.service_name}` : "General Page"}</p>
        </div>
        <Badge label={page.service_name ? "Service" : "General"} variant="secondary" />
      </div>

      <div className="flex gap-sm">
        <Button variant="neutral" size="small" iconStart={<Pencil size={16} />} onClick={() => onEdit(page)} disabled={!canManage}>
          Edit
        </Button>
        <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={() => onDelete(page)} disabled={!canManage}>
          Delete
        </Button>
      </div>
    </div>
  );
}

// Item type options
const itemTypeOptions = [
  { value: "qa", label: "Q&A" },
  { value: "project", label: "Project (Pro)" },
  { value: "testimonial", label: "Testimonial (Test)" },
  { value: "datatile", label: "Data Tile" },
  { value: "servicecard", label: "Service Card (Ser)" },
  { value: "choosecard", label: "Choose Card (cc)" },
  { value: "processcard", label: "Process Card (pc)" },
];

// Q&A Item Fields Component - Answer field only (Question is in common fields)
function QaItemFields({ form, updateForm, isGenerating }: { form: QaItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Answer" rows={5} placeholder="Enter the answer..." value={form.answer} onChange={(v) => updateForm("answer", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("answer", "We offer a comprehensive suite of digital services including web development, mobile app development, UI/UX design, digital marketing, SEO, and automation solutions.")} isLoading={isGenerating("answer")} className="mt-6" />
      </div>
    </>
  );
}

// Default Item Fields Component
function DefaultItemFields({ form, updateForm, isGenerating }: { form: QaItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <TextareaField label="Description" rows={3} placeholder="Item description..." value={form.description} onChange={(v) => updateForm("description", v)} />
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Content" rows={4} placeholder="Item content..." value={form.content} onChange={(v) => updateForm("content", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("content", "This is sample content for the item.")} isLoading={isGenerating("content")} className="mt-6" />
      </div>
    </>
  );
}

// Project (Pro) Item Fields Component - remaining fields (Pro Name is in common fields)
function ProjectItemFields({ form, updateForm, isGenerating }: { form: ProjectItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  // Ensure pro_results and pro_tag are always strings for display
  const proResultsValue = ensureString(form.pro_results);
  const proTagsValue = ensureString(form.pro_tag);
  
  return (
    <>
      <div className="grid grid-cols-2 gap-lg">
        <InputField label="Pro Category" placeholder="e.g. Web Development" value={form.pro_category} onChange={(v) => updateForm("pro_category", v)} />
        <InputField label="Pro URL" placeholder="https://example.com" value={form.pro_url} onChange={(v) => updateForm("pro_url", v)} />
      </div>
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Pro Description" rows={4} placeholder="Brief project description..." value={form.pro_description} onChange={(v) => updateForm("pro_description", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("pro_description", "Built a complete financial management platform with real-time analytics and automated reporting for enterprise clients.")} isLoading={isGenerating("pro_description")} className="mt-6" />
      </div>
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Pro Results (one per line)" rows={3} placeholder={"Result 1\nResult 2\nResult 3"} value={proResultsValue} onChange={(v) => updateForm("pro_results", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("pro_results", "50% increase in conversions\n99.9% uptime\n3x faster load times")} isLoading={isGenerating("pro_results")} className="mt-6" />
      </div>
      <InputField label="Pro Tags (comma separated)" placeholder="React, Node.js, PostgreSQL" value={proTagsValue} onChange={(v) => updateForm("pro_tag", v)} />
      <InputField label="Pro Badge" placeholder="e.g. 'success','error','warning','info','default','premium','featured','enterprise','ai','new','hot','growth','dark'" value={form.pro_badge} onChange={(v) => updateForm("pro_badge", v)} />
    </>
  );
}

// Testimonial (Test) Item Fields Component - remaining fields (Test Name is in common fields)
function TestimonialItemFields({ form, updateForm, isGenerating }: { form: TestimonialItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-lg">
        <InputField label="Test Company" placeholder="Company Name" value={form.test_company} onChange={(v) => updateForm("test_company", v)} />
        <InputField label="Test Role" placeholder="CEO at Company" value={form.test_role} onChange={(v) => updateForm("test_role", v)} />
      </div>
      <InputField label="Test URL" placeholder="https://example.com" value={form.test_url} onChange={(v) => updateForm("test_url", v)} />
      <SelectField
        label="Test Rate"
        options={[
          { value: "5", label: "5 Stars" },
          { value: "4", label: "4 Stars" },
          { value: "3", label: "3 Stars" },
          { value: "2", label: "2 Stars" },
          { value: "1", label: "1 Star" },
        ]}
        value={form.test_rate}
        onChange={(v) => updateForm("test_rate", v)}
      />
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Test Description" rows={5} placeholder="What the client said..." value={form.test_description} onChange={(v) => updateForm("test_description", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("test_description", "WebNDevs transformed our outdated website into a modern, high-converting platform. Within 3 months, we saw a 180% increase in qualified leads.")} isLoading={isGenerating("test_description")} className="mt-6" />
      </div>
    </>
  );
}

// Data Tile Item Fields Component - remaining fields (Tile Name is in common fields)
function DataTileItemFields({ form, updateForm, isGenerating }: { form: DataTileItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <InputField label="Tile URL" placeholder="https://example.com" value={form.tile_url} onChange={(v) => updateForm("tile_url", v)} />
      <TextareaField label="Tile Description" rows={4} placeholder="Tile description..." value={form.tile_description} onChange={(v) => updateForm("tile_description", v)} />
    </>
  );
}

// Service Card (Ser) Item Fields Component - remaining fields (Ser Name is in common fields)
function ServiceCardItemFields({ form, updateForm, isGenerating }: { form: ServiceCardItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-lg">
        <InputField label="Ser Icon" placeholder="e.g. Code, Zap, Shield" value={form.ser_icon} onChange={(v) => updateForm("ser_icon", v)} />
        <InputField label="Ser URL" placeholder="/services/detail" value={form.ser_url} onChange={(v) => updateForm("ser_url", v)} />
      </div>
      <InputField label="Ser Tag (comma separated)" placeholder="Web, Mobile, UI" value={form.ser_tag} onChange={(v) => updateForm("ser_tag", v)} />
      <div className="flex items-center gap-sm">
        <div className="flex-1">
          <TextareaField label="Ser Description" rows={4} placeholder="Service description..." value={form.ser_description} onChange={(v) => updateForm("ser_description", v)} />
        </div>
        <FloatingAiButton onGenerate={() => updateForm("ser_description", "Custom websites and web applications built with modern technologies. From landing pages to complex SaaS platforms.")} isLoading={isGenerating("ser_description")} className="mt-6" />
      </div>
    </>
  );
}

// Choose Card (cc) Item Fields Component - remaining fields (Cc Name is in common fields)
function ChooseCardItemFields({ form, updateForm, isGenerating }: { form: ChooseCardItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <InputField label="Cc Icon" placeholder="e.g. Check, Star, Heart" value={form.cc_icon} onChange={(v) => updateForm("cc_icon", v)} />
      <TextareaField label="Cc Description" rows={4} placeholder="Card description..." value={form.cc_description} onChange={(v) => updateForm("cc_description", v)} />
    </>
  );
}

// Process Card (pc) Item Fields Component - remaining fields (Pc Name is in common fields)
function ProcessCardItemFields({ form, updateForm, isGenerating }: { form: ProcessCardItemForm; updateForm: (key: string, value: string) => void; isGenerating: (key: string) => boolean }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-lg">
        <InputField label="Pc Number" placeholder="e.g. 01" value={form.pc_number} onChange={(v) => updateForm("pc_number", v)} />
        <InputField label="Pc Timeline" placeholder="e.g. 2-3 days" value={form.pc_timeline} onChange={(v) => updateForm("pc_timeline", v)} />
      </div>
      <InputField label="Pc Icon" placeholder="e.g. File, Users, Settings" value={form.pc_icon} onChange={(v) => updateForm("pc_icon", v)} />
      <TextareaField label="Pc Description" rows={4} placeholder="Step description..." value={form.pc_description} onChange={(v) => updateForm("pc_description", v)} />
    </>
  );
}

// Item Editor Component with section-specific fields
function ItemEditor({
  section,
  item,
  token,
  onBack,
  onSaved,
  onDeleted,
}: {
  section: ContentSection;
  item: ContentItem | null;
  token: string;
  onBack: () => void;
  onSaved: (item: ContentItem) => void;
  onDeleted: () => void;
}) {
  // Detect item type from the item's prefixed fields when editing
  const detectedItemType = item ? detectItemType(item) : "qa";
  const [itemType, setItemType] = useState<ItemType>(detectedItemType);
  const [form, setForm] = useState<ItemForm>(() => 
    item ? itemToForm(item, detectedItemType) : getEmptyForm(detectedItemType)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  const isNew = !item;

  // Reset form when item type changes
  useEffect(() => {
    if (!item) {
      setForm(getEmptyForm(itemType));
    }
  }, [itemType, item]);

  function updateForm(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const startGenerating = (field: string) => {
    setGeneratingField(field);
    setTimeout(() => {
      setGeneratingField(null);
    }, 1500);
  };

  async function saveItem() {
    setIsSaving(true);
    setError("");
    setMessage("");

    const payload = buildPayload(form, itemType);

    try {
      const url = isNew 
        ? `${API_BASE_URL}/content-sections/${section.id}/items`
        : `${API_BASE_URL}/content-sections/${section.id}/items/${item.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      
      const payload2: ApiResponse<{ item: ContentItem }> = await response.json();
      if (!response.ok || !payload2.success) {
        throw new Error(payload2.message || "Failed to save item");
      }
      
      // Update form with returned item data so UI reflects saved values
      const returnedItem = payload2.data.item;
      const detectedType = detectItemType(returnedItem);
      setItemType(detectedType);
      setForm(itemToForm(returnedItem, detectedType));
      setMessage(isNew ? "Item created." : "Item updated.");
      onSaved(returnedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem() {
    if (!item || !confirm("Delete this item?")) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content-sections/${section.id}/items/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload: ApiResponse<null> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete item");
      }
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setIsSaving(false);
    }
  }

  const isGenerating = (field: string) => generatingField === field;

  // Get item name based on type for display
  const getItemDisplayName = () => {
    if (!item) return "";
    switch (itemType) {
      case "qa": return item.question || "Q&A Item";
      case "project": return item.pro_name || "Project Item";
      case "testimonial": return item.test_name || "Testimonial Item";
      case "datatile": return item.tile_name || "Data Tile Item";
      case "servicecard": return item.ser_name || "Service Card Item";
      case "choosecard": return item.cc_name || "Choose Card Item";
      case "processcard": return item.pc_name || "Process Card Item";
      default: return item.title || "Item";
    }
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-center gap-lg">
        <Button variant="neutral" size="small" onClick={onBack}>
          ← Back to Section
        </Button>
        <span className="text-label text-text-primary">
          {isNew ? `Add New ${itemTypeOptions.find(t => t.value === itemType)?.label || "Item"} Item` : `Edit: ${getItemDisplayName()}`}
        </span>
        <Badge label={section.section_type} variant="secondary" />
      </div>

      {error && <p className="text-label-sm text-danger">{error}</p>}
      {message && <p className="text-label-sm text-success">{message}</p>}

      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg">
        <h3 className="text-label text-text-primary font-semibold">
          Item Editor
        </h3>
        
        {/* Item Type Selector */}
        <SelectField
          label="Item Type"
          options={itemTypeOptions}
          value={itemType}
          onChange={(v) => setItemType(v as ItemType)}
        />

        {/* Common Fields */}
        <div className="grid grid-cols-2 gap-lg">
          <InputField 
            label="Item Key" 
            placeholder="unique-key"
            value={form.item_key}
            onChange={(v) => updateForm("item_key", v)}
          />
          <InputField 
            label={
              itemType === "qa" ? "Question *" : 
              itemType === "project" ? "Pro Name *" :
              itemType === "testimonial" ? "Test Name *" :
              itemType === "datatile" ? "Tile Name *" :
              itemType === "servicecard" ? "Ser Name *" :
              itemType === "choosecard" ? "Cc Name *" :
              itemType === "processcard" ? "Pc Name *" :
              "Title *"
            } 
            placeholder={
              itemType === "qa" ? "e.g. What services do you offer?" : 
              itemType === "project" ? "Project name" :
              itemType === "testimonial" ? "Client name" :
              itemType === "datatile" ? "Tile name" :
              itemType === "servicecard" ? "Service name" :
              itemType === "choosecard" ? "Choose card name" :
              itemType === "processcard" ? "Process name" :
              "Item title"
            }
            value={
              itemType === "qa" ? form.question :
              itemType === "project" ? (form as ProjectItemForm).pro_name :
              itemType === "testimonial" ? (form as TestimonialItemForm).test_name :
              itemType === "datatile" ? (form as DataTileItemForm).tile_name :
              itemType === "servicecard" ? (form as ServiceCardItemForm).ser_name :
              itemType === "choosecard" ? (form as ChooseCardItemForm).cc_name :
              itemType === "processcard" ? (form as ProcessCardItemForm).pc_name :
              form.question
            }
            onChange={(v) => updateForm(
              itemType === "qa" ? "question" :
              itemType === "project" ? "pro_name" :
              itemType === "testimonial" ? "test_name" :
              itemType === "datatile" ? "tile_name" :
              itemType === "servicecard" ? "ser_name" :
              itemType === "choosecard" ? "cc_name" :
              itemType === "processcard" ? "pc_name" :
              "question", v
            )}
          />
        </div>

        {/* Dynamic Fields based on Item Type */}
        {itemType === "qa" && <QaItemFields form={form as QaItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "project" && <ProjectItemFields form={form as ProjectItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "testimonial" && <TestimonialItemFields form={form as TestimonialItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "datatile" && <DataTileItemFields form={form as DataTileItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "servicecard" && <ServiceCardItemFields form={form as ServiceCardItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "choosecard" && <ChooseCardItemFields form={form as ChooseCardItemForm} updateForm={updateForm} isGenerating={isGenerating} />}
        {itemType === "processcard" && <ProcessCardItemFields form={form as ProcessCardItemForm} updateForm={updateForm} isGenerating={isGenerating} />}

        {/* Common Status Fields */}
        <div className="grid grid-cols-2 gap-lg">
          <SelectField
            label="Featured"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            value={form.is_featured}
            onChange={(v) => updateForm("is_featured", v)}
          />
          <SelectField
            label="Status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={form.is_active}
            onChange={(v) => updateForm("is_active", v)}
          />
        </div>

        <div className="flex items-center justify-end gap-sm">
          {!isNew && (
            <Button variant="subtle" iconStart={<Trash2 size={14} />} onClick={deleteItem} disabled={isSaving}>
              Delete Item
            </Button>
          )}
          <Button variant="primary" iconStart={<Save size={14} />} onClick={saveItem} disabled={isSaving}>
            {isSaving ? "Saving..." : isNew ? "Create Item" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Section Items List Component
function SectionItemsList({
  section,
  token,
  onEditItem,
  onAddItem,
  onRefresh,
}: {
  section: ContentSection;
  token: string;
  onEditItem: (item: ContentItem) => void;
  onAddItem: () => void;
  onRefresh: () => void;
}) {
  const [items, setItems] = useState<ContentItem[]>(section.items ?? []);
  const [isLoading, setIsLoading] = useState(false);

  // Reload items when section.id changes (e.g., after save) or when onRefresh is called
  useEffect(() => {
    loadItems();
  }, [section.id]);

  async function loadItems() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content-sections/${section.id}/items`);
      const payload: ApiResponse<{ items: ContentItem[] }> = await response.json();
      if (payload.success) {
        setItems(payload.data.items);
      }
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFeatured(item: ContentItem) {
    try {
      await fetch(`${API_BASE_URL}/content-sections/${section.id}/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_featured: !item.is_featured }),
      });
      loadItems();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  }

  async function toggleActive(item: ContentItem) {
    try {
      await fetch(`${API_BASE_URL}/content-sections/${section.id}/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      loadItems();
    } catch (err) {
      console.error("Failed to toggle active:", err);
    }
  }

  async function deleteItem(item: ContentItem) {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`${API_BASE_URL}/content-sections/${section.id}/items/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }

  // Get item preview based on item type
  function getItemPreview(item: ContentItem): JSX.Element {
    // Determine item type from prefixed fields
    let name = item.title;
    let subtitle = item.content?.slice(0, 60) || "No description";
    
    if (item.question) {
      name = item.question;
      subtitle = item.answer?.slice(0, 60) || "No answer yet";
    } else if (item.pro_name) {
      name = item.pro_name;
      subtitle = item.pro_category || "No category";
    } else if (item.test_name) {
      name = item.test_name;
      subtitle = item.test_company || "No company";
    } else if (item.tile_name) {
      name = item.tile_name;
      subtitle = item.tile_description?.slice(0, 60) || "No description";
    } else if (item.ser_name) {
      name = item.ser_name;
      subtitle = item.ser_description?.slice(0, 60) || "No description";
    } else if (item.cc_name) {
      name = item.cc_name;
      subtitle = item.cc_description?.slice(0, 60) || "No description";
    } else if (item.pc_name) {
      name = item.pc_name;
      subtitle = item.pc_description?.slice(0, 60) || "No description";
    }
    
    return (
      <div>
        <span className="text-label-sm text-text-primary font-semibold">{name}</span>
        <p className="text-video-title text-text-tertiary truncate">{subtitle}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-surface-bg rounded-corner-lg p-xl text-center">
        <p className="text-label text-text-secondary">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <p className="text-label text-text-primary font-semibold">
          {section.section_type === "heading-text" ? "Heading & Text Section" : "Items"} ({items.length})
        </p>
        <div className="flex gap-sm">
          <Button variant="neutral" size="small" iconStart={<RefreshCw size={14} />} onClick={loadItems}>
            Refresh
          </Button>
          <Button variant="primary" size="small" iconStart={<Plus size={14} />} onClick={onAddItem}>
            Add Item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-bg rounded-corner-lg p-xl text-center">
          <p className="text-label text-text-secondary">No items yet. Click "Add Item" to create one.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-bg rounded-corner-md p-md border border-border-primary flex items-center gap-md hover:bg-bg-faint transition-colors"
            >
              <GripVertical size={14} className="text-text-tertiary cursor-grab" />
              
              <div className="flex-1">
                {getItemPreview(item)}
                {item.description && (
                  <p className="text-video-title text-text-tertiary">{item.description.slice(0, 80)}...</p>
                )}
              </div>

              <div className="flex items-center gap-sm">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`p-sm rounded-corner-sm ${item.is_featured ? "text-brand-primary" : "text-text-tertiary"}`}
                  title={item.is_featured ? "Featured" : "Not featured"}
                >
                  <Star size={16} className={item.is_featured ? "fill-brand-primary" : ""} />
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className={`p-sm rounded-corner-sm ${item.is_active ? "text-success" : "text-text-tertiary"}`}
                  title={item.is_active ? "Active" : "Inactive"}
                >
                  {item.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </button>
                <Button variant="neutral" size="small" iconStart={<Pencil size={12} />} onClick={() => onEditItem(item)}>
                  Edit
                </Button>
                <Button variant="subtle" size="small" iconStart={<Trash2 size={12} />} onClick={() => deleteItem(item)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  section,
  pageSlug,
  token,
  onBack,
  onSectionPatched,
  onAddItem,
  onEditItem,
  onRefreshItems,
}: {
  section: ContentSection;
  pageSlug: string;
  token: string;
  onBack: () => void;
  onSectionPatched: (section: ContentSection) => void;
  onAddItem: () => void;
  onEditItem: (item: ContentItem) => void;
  onRefreshItems: () => void;
}) {
  const [localSection, setLocalSection] = useState<ContentSection>(section);
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>(sectionToDraft(section));
  const [activeTab, setActiveTab] = useState<"settings" | "items">("settings");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalSection(section);
    setSectionDraft(sectionToDraft(section));
  }, [section]);

  function parseFields(input: string): Record<string, unknown> {
    const trimmed = input.trim();
    if (!trimmed) return {};
    try {
      const parsed = JSON.parse(trimmed);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        throw new Error("Fields must be a JSON object.");
      }
      return parsed as Record<string, unknown>;
    } catch {
      throw new Error("Invalid JSON format.");
    }
  }

  const generateSectionContent = () => {
    setIsGeneratingContent(true);
    setTimeout(() => {
      setSectionDraft(prev => ({ ...prev, content: "This section provides comprehensive information about the topic. Our expert team has crafted detailed content that covers all essential aspects, helping visitors understand the value and benefits clearly." }));
      setIsGeneratingContent(false);
    }, 1500);
  };

  async function saveSection() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const fields = parseFields(sectionDraft.fields_text);
      
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(pageSlug)}/sections/${localSection.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section_key: sectionDraft.section_key || localSection.section_key,
          section_type: sectionDraft.section_type,
          title: sectionDraft.title,
          name: sectionDraft.name,
          content: sectionDraft.content,
          is_visible: sectionDraft.is_visible === "true",
          sort_order: Number(sectionDraft.sort_order || "0"),
          fields,
        }),
      });
      
      const payload: ApiResponse<{ section: ApiContentSection }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save section");
      }
      
      const updated = mapSection(payload.data.section, localSection.sort_order);
      setLocalSection(updated);
      onSectionPatched(updated);
      setMessage("Section updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSection() {
    if (!confirm("Delete this section and all its items?")) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(pageSlug)}/sections/${localSection.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload: ApiResponse<null> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete section");
      }
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-center gap-lg">
        <Button variant="neutral" size="small" onClick={onBack}>
          ← Back
        </Button>
        <span className="text-label text-text-primary">{localSection.title}</span>
        <Badge label={localSection.section_type} variant="secondary" />
        {!localSection.is_visible && <Badge label="Hidden" variant="default" />}
      </div>

      {error && <p className="text-label-sm text-danger">{error}</p>}
      {message && <p className="text-label-sm text-success">{message}</p>}

      <div className="flex gap-sm">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-lg py-sm rounded-corner-md text-label-sm transition-colors ${
            activeTab === "settings" ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10"
          }`}
        >
          Section Settings
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-lg py-sm rounded-corner-md text-label-sm transition-colors ${
            activeTab === "items" ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10"
          }`}
        >
          Manage Items ({localSection.items?.length || 0})
        </button>
      </div>

      {activeTab === "settings" ? (
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg">
          <h3 className="text-label text-text-primary font-semibold">Section Configuration</h3>
          
          <div className="grid grid-cols-2 gap-lg">
            <InputField 
              label="Section Key" 
              value={sectionDraft.section_key} 
              onChange={(v) => setSectionDraft((s) => ({ ...s, section_key: v }))} 
            />
            <SelectField
              label="Section Type"
              options={sectionTypeOptions}
              value={sectionDraft.section_type}
              onChange={(v) => setSectionDraft((s) => ({ ...s, section_type: v as SectionType }))}
            />
          </div>

          <InputField 
            label="Title" 
            value={sectionDraft.title} 
            onChange={(v) => setSectionDraft((s) => ({ ...s, title: v }))} 
          />
          <InputField 
            label="Internal Name" 
            value={sectionDraft.name} 
            onChange={(v) => setSectionDraft((s) => ({ ...s, name: v }))} 
          />

          <div className="flex items-center gap-sm">
            <div className="flex-1">
              <TextareaField 
                label="Content" 
                rows={4} 
                value={sectionDraft.content} 
                onChange={(v) => setSectionDraft((s) => ({ ...s, content: v }))} 
              />
            </div>
            <FloatingAiButton onGenerate={generateSectionContent} isLoading={isGeneratingContent} className="mt-6" />
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <SelectField
              label="Visible"
              options={[
                { value: "true", label: "Visible" },
                { value: "false", label: "Hidden" },
              ]}
              value={sectionDraft.is_visible}
              onChange={(v) => setSectionDraft((s) => ({ ...s, is_visible: v as "true" | "false" }))}
            />
            <InputField 
              label="Sort Order" 
              value={sectionDraft.sort_order} 
              onChange={(v) => setSectionDraft((s) => ({ ...s, sort_order: v }))} 
            />
          </div>

          <TextareaField 
            label="Dynamic Fields (JSON)"
            rows={4}
            placeholder={'{"homepage_limit": 6, "show_on_homepage": true}'}
            value={sectionDraft.fields_text} 
            onChange={(v) => setSectionDraft((s) => ({ ...s, fields_text: v }))} 
          />

          <div className="flex items-center justify-end gap-sm">
            <Button variant="subtle" iconStart={<Trash2 size={14} />} onClick={deleteSection} disabled={isSaving}>
              Delete Section
            </Button>
            <Button variant="primary" iconStart={<Save size={14} />} onClick={saveSection} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Section"}
            </Button>
          </div>
        </div>
      ) : (
        <SectionItemsList
          section={localSection}
          token={token}
          onEditItem={onEditItem}
          onAddItem={onAddItem}
          onRefresh={onRefreshItems}
        />
      )}
    </div>
  );
}

// Page Editor Component
function PageEditor({
  page,
  token,
  services,
  onBack,
  onPagePatched,
}: {
  page: PageContent;
  token: string;
  services: ServiceItem[];
  onBack: () => void;
  onPagePatched: (page: PageContent) => void;
}) {
  const [localPage, setLocalPage] = useState<PageContent>(page);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"page" | "sections">("page");
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>(emptySectionDraft);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [seoDraft, setSeoDraft] = useState({
    title: page.title,
    slug: page.slug,
    status: page.status,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    meta_keywords: page.meta_keywords,
    service_id: page.service_id ? String(page.service_id) : "",
  });
  // Separate state for heading-text fields
  const [headingTextFields, setHeadingTextFields] = useState({
    description: "",
    tag: "",
    subheading1: "",
    subheading2: "",
    subtext: "",
  });
  // Separate state for approach-table fields
  const [approachTableFields, setApproachTableFields] = useState({
    left_heading: "",
    right_heading: "",
    left_points: "",
    right_points: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSectionDraft, setNewSectionDraft] = useState<SectionDraft>({
    ...emptySectionDraft,
    sort_order: String(page.sections.length),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const canManage = token.trim().length > 0;
  const isMounted = useRef(false);

  const activeSection = useMemo(
    () => localPage.sections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId, localPage.sections]
  );

  useEffect(() => {
    // Only run once on mount, not on every page update
    if (!isMounted.current) {
      isMounted.current = true;
      setLocalPage(page);
      setActiveSectionId(page.sections[0]?.id ?? null);
      setSectionDraft(page.sections[0] ? sectionToDraft(page.sections[0]) : emptySectionDraft);
      setSeoDraft({
        title: page.title,
        slug: page.slug,
        status: page.status,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        meta_keywords: page.meta_keywords,
        service_id: page.service_id ? String(page.service_id) : "",
      });
      // Initialize heading-text fields from section.fields
      if (page.sections[0]?.fields) {
        setHeadingTextFields({
          description: (page.sections[0].fields.description as string) || "",
          tag: (page.sections[0].fields.tag as string) || "",
          subheading1: (page.sections[0].fields.subheading1 as string) || "",
          subheading2: (page.sections[0].fields.subheading2 as string) || "",
          subtext: (page.sections[0].fields.subtext as string) || "",
        });
      }
    }
  }, [page]);

  useEffect(() => {
    if (activeSection) {
      setSectionDraft(sectionToDraft(activeSection));
      
      // Only update heading-text fields from API if they have values - preserve existing values
      const apiDescription = (activeSection.fields.description as string) || activeSection.description || "";
      const apiTag = (activeSection.fields.tag as string) || activeSection.tag || "";
      const apiSubheading1 = (activeSection.fields.subheading1 as string) || activeSection.subheading1 || "";
      const apiSubheading2 = (activeSection.fields.subheading2 as string) || activeSection.subheading2 || "";
      const apiSubtext = (activeSection.fields.subtext as string) || activeSection.subtext || "";
      
      setHeadingTextFields(prev => ({
        description: apiDescription || prev.description,
        tag: apiTag || prev.tag,
        subheading1: apiSubheading1 || prev.subheading1,
        subheading2: apiSubheading2 || prev.subheading2,
        subtext: apiSubtext || prev.subtext,
      }));
      
      // Only update approach-table fields from API if they have values - preserve existing values
      const leftPointsArray = (activeSection.fields.left_points as string[] | undefined) || activeSection.left_points || [];
      const rightPointsArray = (activeSection.fields.right_points as string[] | undefined) || activeSection.right_points || [];
      const apiLeftHeading = (activeSection.fields.left_heading as string) || activeSection.left_heading || "";
      const apiRightHeading = (activeSection.fields.right_heading as string) || activeSection.right_heading || "";
      
      setApproachTableFields(prev => ({
        left_heading: apiLeftHeading || prev.left_heading,
        right_heading: apiRightHeading || prev.right_heading,
        left_points: Array.isArray(leftPointsArray) && leftPointsArray.length > 0 ? leftPointsArray.join("\n") : prev.left_points,
        right_points: Array.isArray(rightPointsArray) && rightPointsArray.length > 0 ? rightPointsArray.join("\n") : prev.right_points,
      }));
    }
  }, [activeSection?.id]);

  function authHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function refreshCurrentPage() {
    const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}`);
    const payload: ApiResponse<ApiContentPage> = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || "Failed to refresh page.");
    }
    const mapped = mapPage(payload.data);
    setLocalPage(mapped);
    onPagePatched(mapped);
    return mapped;
  }

  function parseFields(input: string): Record<string, unknown> {
    const trimmed = input.trim();
    if (!trimmed) return {};
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error("Fields must be a JSON object.");
    }
  }

  async function savePageMeta() {
    if (!canManage) {
      setErrorText("Set admin token to update page content.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setMessageText("");
    try {
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          title: seoDraft.title,
          status: seoDraft.status,
          seo_title: seoDraft.seo_title,
          seo_description: seoDraft.seo_description,
          meta_keywords: seoDraft.meta_keywords,
          service_id: seoDraft.service_id ? Number(seoDraft.service_id) : null,
        }),
      });
      const payload: ApiResponse<ApiContentPage> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save page.");
      }
      const mapped = mapPage(payload.data);
      setLocalPage(mapped);
      onPagePatched(mapped);
      setMessageText("Page content updated.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save page.");
    } finally {
      setIsSaving(false);
    }
  }

  async function createSection() {
    if (!canManage) {
      setErrorText("Set admin token to create section.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setMessageText("");
    try {
      const payloadBody = {
        section_key: newSectionDraft.section_key || slugify(newSectionDraft.title || `${newSectionDraft.section_type}-section`),
        section_type: newSectionDraft.section_type,
        title: newSectionDraft.title,
        name: newSectionDraft.name,
        content: newSectionDraft.content,
        is_visible: newSectionDraft.is_visible === "true",
        sort_order: Number(newSectionDraft.sort_order || "0"),
        fields: parseFields(newSectionDraft.fields_text),
      };
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}/sections`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payloadBody),
      });
      const payload: ApiResponse<{ section: ApiContentSection }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to add section.");
      }
      const refreshed = await refreshCurrentPage();
      const newestSection = refreshed.sections.find((section) => section.section_key === payloadBody.section_key);
      if (newestSection) {
        setActiveSectionId(newestSection.id);
      }
      setNewSectionDraft({ ...emptySectionDraft, sort_order: String(refreshed.sections.length) });
      setIsAddModalOpen(false);
      setMessageText("Section added.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to add section.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveSection() {
    if (!activeSection) return;
    if (!canManage) {
      setErrorText("Set admin token to update section.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setMessageText("");
    try {
      // Build fields object based on section type
      let fields: Record<string, unknown> = {};
      if (sectionDraft.section_type === "heading-text") {
        fields = { ...headingTextFields };
      } else if (sectionDraft.section_type === "approach-table") {
        // Convert line-by-line text to array of strings
        const leftPoints = approachTableFields.left_points
          .split("\n")
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
        const rightPoints = approachTableFields.right_points
          .split("\n")
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
        fields = {
          left_heading: approachTableFields.left_heading,
          right_heading: approachTableFields.right_heading,
          left_points: leftPoints,
          right_points: rightPoints,
        };
      } else {
        fields = parseFields(sectionDraft.fields_text);
      }
      
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}/sections/${activeSection.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          section_key: sectionDraft.section_key || activeSection.section_key,
          section_type: sectionDraft.section_type,
          title: sectionDraft.title,
          name: sectionDraft.name,
          content: sectionDraft.content,
          is_visible: sectionDraft.is_visible === "true",
          sort_order: Number(sectionDraft.sort_order || "0"),
          fields,
        }),
      });
      const payload: ApiResponse<{ section: ApiContentSection }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to save section.");
      }
      // Update local state with the saved values immediately - don't wait for API refresh
      const savedFields = fields;
      // Manually update the local page's section to reflect saved data without refetching
      setLocalPage(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === activeSection.id 
            ? { ...s, ...payload.data.section, fields: savedFields, content: sectionDraft.content }
            : s
        )
      }));
      setMessageText("Section updated.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to save section.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSection() {
    if (!activeSection) return;
    if (!canManage) {
      setErrorText("Set admin token to delete section.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setMessageText("");
    try {
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}/sections/${activeSection.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload: ApiResponse<{ section_id: number }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete section.");
      }
      const refreshed = await refreshCurrentPage();
      setActiveSectionId(refreshed.sections[0]?.id ?? null);
      setMessageText("Section deleted.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete section.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePage() {
    if (!canManage) {
      setErrorText("Set admin token to delete page.");
      return;
    }
    if (!confirm(`Delete page "${localPage.title}"? This cannot be undone.`)) return;
    setIsSaving(true);
    setErrorText("");
    setMessageText("");
    try {
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(localPage.slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload: ApiResponse<{ page_id: number }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete page.");
      }

      // Clear the public API cache to ensure the page is gone from the frontend
      try {
        await fetch(`${API_BASE_URL}/settings/cache/clear`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ type: "content" }),
        });
      } catch (e) {
        console.warn("Could not clear cache, but page was deleted.", e);
      }

      onBack();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete page.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddItem() {
    setAddingItem(true);
    setEditingItem(null);
  }

  function handleEditItem(item: ContentItem) {
    setEditingItem(item);
    setAddingItem(false);
  }

  function handleItemBack() {
    setEditingItem(null);
    setAddingItem(false);
  }

  function handleItemSaved() {
    void refreshCurrentPage();
    handleItemBack();
  }

  function handleItemDeleted() {
    void refreshCurrentPage();
    handleItemBack();
  }

  function handleSectionPatched(patched: ContentSection) {
    setLocalPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === patched.id ? patched : s)),
    }));
    setMessageText("Section updated.");
  }

  if (editingItem || addingItem) {
    const section = activeSection!;
    return (
      <ItemEditor
        section={section}
        item={editingItem}
        token={token}
        onBack={handleItemBack}
        onSaved={handleItemSaved}
        onDeleted={handleItemDeleted}
      />
    );
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-center gap-lg">
        <Button variant="neutral" size="small" onClick={onBack}>
          ← Back to Pages
        </Button>
        <span className="text-label text-text-primary font-semibold">Editing: {localPage.title}</span>
        <Badge label={`/${localPage.slug}`} variant="secondary" />
        <Badge label={localPage.status} variant={localPage.status === "published" ? "success" : "default"} />
      </div>

      {errorText && <p className="text-label-sm text-danger">{errorText}</p>}
      {messageText && <p className="text-label-sm text-success">{messageText}</p>}

      {/* Tab buttons for Page Details and Sections */}
      <div className="flex gap-sm">
        <button
          onClick={() => setActiveTab("page")}
          className={`px-lg py-sm rounded-corner-md text-label-sm transition-colors ${
            activeTab === "page" ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10"
          }`}
        >
          Page Details
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-lg py-sm rounded-corner-md text-label-sm transition-colors ${
            activeTab === "sections" ? "bg-brand-primary text-on-brand" : "bg-bg-faint text-text-secondary hover:bg-brand-primary/10"
          }`}
        >
          Sections ({localPage.sections.length})
        </button>
      </div>

      <div className="grid grid-cols-3 gap-xl">
        {/* Left Panel - Sections List (only shown in sections tab) */}
        {activeTab === "sections" && (
          <div className="bg-surface-bg rounded-corner-lg p-lg flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h3 className="text-label text-text-primary font-semibold">Sections</h3>
              <Button variant="primary" size="small" iconStart={<Plus size={14} />} onClick={() => setIsAddModalOpen(true)} disabled={!canManage}>
                Add
              </Button>
            </div>

            <div className="flex flex-col gap-sm">
              {localPage.sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-md rounded-corner-md transition-colors flex items-center gap-sm ${
                    activeSectionId === section.id
                      ? "bg-brand-primary text-on-brand"
                      : "bg-bg-faint hover:bg-brand-primary/10 text-text-primary"
                  }`}
                >
                  <button
                    onClick={() => setActiveSectionId(section.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    {sectionTypeIcons[section.section_type]}
                    <div className="inline-flex flex-col ml-sm">
                      <p className="text-label-sm font-semibold truncate">{section.title}</p>
                      <p className={`text-video-title truncate ${activeSectionId === section.id ? "text-on-brand/70" : "text-text-tertiary"}`}>
                        {section.items?.length || 0} items
                      </p>
                    </div>
                  </button>
                  {!section.is_visible && <EyeOff size={14} />}
                  {canManage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSectionId(section.id);
                        setEditingSectionId(section.id);
                      }}
                      className={`p-xs rounded hover:bg-brand-muted transition-colors ${activeSectionId === section.id ? "text-on-brand" : "text-text-tertiary"}`}
                      title="Edit section"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Middle Panel - Content based on active tab */}
        <div className="col-span-2 bg-surface-bg rounded-corner-lg p-lg flex flex-col gap-lg">
          {/* Page Details Tab Content */}
          {activeTab === "page" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-label text-text-primary font-semibold">Page Information</h3>
              </div>

              <InputField
                label="Page Title *"
                value={seoDraft.title}
                onChange={(v) => setSeoDraft((s) => ({ ...s, title: v }))}
              />

              <InputField
                label="Slug"
                placeholder="page-url-slug"
                value={seoDraft.slug}
                onChange={(v) => setSeoDraft((s) => ({ ...s, slug: v }))}
              />

              <SelectField
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
                value={seoDraft.status}
                onChange={(v) => setSeoDraft((s) => ({ ...s, status: v as "published" | "draft" }))}
              />

              <InputField
                label="SEO Title"
                placeholder="SEO title for search engines"
                value={seoDraft.seo_title}
                onChange={(v) => setSeoDraft((s) => ({ ...s, seo_title: v }))}
              />

              <TextareaField
                label="SEO Description"
                rows={3}
                placeholder="Meta description for SEO"
                value={seoDraft.seo_description}
                onChange={(v) => setSeoDraft((s) => ({ ...s, seo_description: v }))}
              />

              <InputField
                label="Meta Keywords"
                placeholder="keyword1, keyword2, keyword3"
                value={seoDraft.meta_keywords}
                onChange={(v) => setSeoDraft((s) => ({ ...s, meta_keywords: v }))}
              />

              <SelectField
                label="Link to Service (optional)"
                options={[{ value: "", label: "None" }, ...services.map(s => ({ value: String(s.id), label: s.name }))]}
                value={seoDraft.service_id}
                onChange={(v) => setSeoDraft((s) => ({ ...s, service_id: v }))}
              />

              <div className="flex items-center justify-end gap-sm">
                <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={deletePage} disabled={!canManage}>
                  Delete Page
                </Button>
                <Button variant="primary" iconStart={<Save size={14} />} onClick={savePageMeta} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Page"}
                </Button>
              </div>

              <hr className="border-border-secondary" />

              <div className="flex items-center justify-between">
                <h3 className="text-label text-text-primary font-semibold">Page Statistics</h3>
              </div>

              <div className="grid grid-cols-3 gap-lg">
                <div className="bg-bg-faint rounded-corner-md p-lg text-center">
                  <span className="text-title text-text-primary">{localPage.sections.length}</span>
                  <p className="text-video-title text-text-secondary mt-xs">Sections</p>
                </div>
                <div className="bg-bg-faint rounded-corner-md p-lg text-center">
                  <span className="text-title text-text-primary">{localPage.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0)}</span>
                  <p className="text-video-title text-text-secondary mt-xs">Items</p>
                </div>
                <div className="bg-bg-faint rounded-corner-md p-lg text-center">
                  <span className="text-title text-text-primary">{localPage.updated_at ? formatDate(localPage.updated_at) : "N/A"}</span>
                  <p className="text-video-title text-text-secondary mt-xs">Last Updated</p>
                </div>
              </div>
            </>
          )}

          {/* Sections Tab Content */}
          {activeTab === "sections" && activeSection && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-label text-text-primary font-semibold">Section Settings</h3>
                <div className="flex gap-sm">
                  <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={deleteSection} disabled={!canManage}>
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-lg">
                <InputField
                  label="Section Key"
                  value={sectionDraft.section_key}
                  onChange={(v) => setSectionDraft((s) => ({ ...s, section_key: v }))}
                />
                <SelectField
                  label="Type"
                  options={sectionTypeOptions}
                  value={sectionDraft.section_type}
                  onChange={(v) => setSectionDraft((s) => ({ ...s, section_type: v as SectionType }))}
                />
              </div>

              <InputField
                label="Title"
                value={sectionDraft.title}
                onChange={(v) => setSectionDraft((s) => ({ ...s, title: v }))}
              />

              <InputField
                label="Name"
                value={sectionDraft.name}
                onChange={(v) => setSectionDraft((s) => ({ ...s, name: v }))}
              />

              {/* Show section-type specific fields */}
              {sectionDraft.section_type === "heading-text" && (
                <>
                  <InputField
                    label="Description"
                    value={headingTextFields.description}
                    onChange={(v) => setHeadingTextFields((f) => ({ ...f, description: v }))}
                  />
                  <InputField
                    label="Tag"
                    placeholder="Tag text"
                    value={headingTextFields.tag}
                    onChange={(v) => setHeadingTextFields((f) => ({ ...f, tag: v }))}
                  />
                  <div className="grid grid-cols-2 gap-lg">
                    <InputField
                      label="Subheading 1"
                      placeholder="First part of subheading"
                      value={headingTextFields.subheading1}
                      onChange={(v) => setHeadingTextFields((f) => ({ ...f, subheading1: v }))}
                    />
                    <InputField
                      label="Subheading 2"
                      placeholder="Second part of subheading"
                      value={headingTextFields.subheading2}
                      onChange={(v) => setHeadingTextFields((f) => ({ ...f, subheading2: v }))}
                    />
                  </div>
                  <TextareaField
                    label="Subtext"
                    rows={3}
                    placeholder="Description text under the heading"
                    value={headingTextFields.subtext}
                    onChange={(v) => setHeadingTextFields((f) => ({ ...f, subtext: v }))}
                  />
                </>
              )}

              {sectionDraft.section_type === "approach-table" && (
                <>
                  <div className="grid grid-cols-2 gap-lg">
                    <InputField
                      label="Left Heading"
                      placeholder="Heading for left column"
                      value={approachTableFields.left_heading}
                      onChange={(v) => setApproachTableFields((f) => ({ ...f, left_heading: v }))}
                    />
                    <InputField
                      label="Right Heading"
                      placeholder="Heading for right column"
                      value={approachTableFields.right_heading}
                      onChange={(v) => setApproachTableFields((f) => ({ ...f, right_heading: v }))}
                    />
                  </div>
                  <TextareaField
                    label="Left Points (one point per line)"
                    rows={6}
                    placeholder="Point 1&#10;Point 2&#10;Point 3"
                    value={approachTableFields.left_points}
                    onChange={(v) => setApproachTableFields((f) => ({ ...f, left_points: v }))}
                  />
                  <TextareaField
                    label="Right Points (one point per line)"
                    rows={6}
                    placeholder="Point 1&#10;Point 2&#10;Point 3"
                    value={approachTableFields.right_points}
                    onChange={(v) => setApproachTableFields((f) => ({ ...f, right_points: v }))}
                  />
                </>
              )}

              <div className="grid grid-cols-2 gap-lg">
                <SelectField
                  label="Visible"
                  options={[
                    { value: "true", label: "Visible" },
                    { value: "false", label: "Hidden" },
                  ]}
                  value={sectionDraft.is_visible}
                  onChange={(v) => setSectionDraft((s) => ({ ...s, is_visible: v as "true" | "false" }))}
                />
                <InputField
                  label="Sort Order"
                  value={sectionDraft.sort_order}
                  onChange={(v) => setSectionDraft((s) => ({ ...s, sort_order: v }))}
                />
              </div>

              <TextareaField
                label="Fields (JSON)"
                rows={3}
                placeholder={'{"limit": 6}'}
                value={sectionDraft.fields_text}
                onChange={(v) => setSectionDraft((s) => ({ ...s, fields_text: v }))}
              />

              <Button variant="primary" iconStart={<Save size={14} />} onClick={saveSection} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Section"}
              </Button>

              <hr className="border-border-secondary" />

              <div className="flex items-center justify-between">
                <h3 className="text-label text-text-primary font-semibold">Items ({activeSection.items?.length || 0})</h3>
                <Button variant="primary" size="small" iconStart={<Plus size={14} />} onClick={handleAddItem} disabled={!canManage}>
                  Add Item
                </Button>
              </div>

              {activeSection.items && activeSection.items.length > 0 ? (
                <div className="flex flex-col gap-sm max-h-96 overflow-y-auto">
                  {activeSection.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-bg-faint rounded-corner-md p-md flex items-center justify-between"
                    >
                      <div>
                        <p className="text-label-sm text-text-primary font-semibold">{item.title}</p>
                        <p className="text-video-title text-text-tertiary">{item.description?.slice(0, 50) || "No description"}...</p>
                      </div>
                      <div className="flex gap-sm">
                        <Button variant="neutral" size="small" iconStart={<Pencil size={12} />} onClick={() => handleEditItem(item)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-label-sm text-text-secondary text-center py-xl">No items yet</p>
              )}
            </div>
          ) }:{ (
            <p className="text-label-sm text-text-secondary text-center py-xl">Select a section to edit</p>
          )}
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Section"
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createSection} disabled={isSaving}>
              {isSaving ? "Adding..." : "Add Section"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <div className="grid grid-cols-2 gap-lg">
            <InputField
              label="Section Key"
              placeholder="unique-key"
              value={newSectionDraft.section_key}
              onChange={(v) => setNewSectionDraft((s) => ({ ...s, section_key: v }))}
            />
            <SelectField
              label="Section Type"
              options={sectionTypeOptions}
              value={newSectionDraft.section_type}
              onChange={(v) => setNewSectionDraft((s) => ({ ...s, section_type: v as SectionType }))}
            />
          </div>
          <InputField
            label="Title"
            placeholder="Section Title"
            value={newSectionDraft.title}
            onChange={(v) => setNewSectionDraft((s) => ({ ...s, title: v }))}
          />
          <InputField
            label="Name"
            placeholder="Internal Name"
            value={newSectionDraft.name}
            onChange={(v) => setNewSectionDraft((s) => ({ ...s, name: v }))}
          />
          <TextareaField
            label="Content"
            rows={3}
            value={newSectionDraft.content}
            onChange={(v) => setNewSectionDraft((s) => ({ ...s, content: v }))}
          />
          <div className="grid grid-cols-2 gap-lg">
            <SelectField
              label="Visible"
              options={[
                { value: "true", label: "Visible" },
                { value: "false", label: "Hidden" },
              ]}
              value={newSectionDraft.is_visible}
              onChange={(v) => setNewSectionDraft((s) => ({ ...s, is_visible: v as "true" | "false" }))}
            />
            <InputField
              label="Sort Order"
              value={newSectionDraft.sort_order}
              onChange={(v) => setNewSectionDraft((s) => ({ ...s, sort_order: v }))}
            />
          </div>
          <TextareaField
            label="Fields (JSON)"
            rows={3}
            placeholder={'{"limit": 6}'}
            value={newSectionDraft.fields_text}
            onChange={(v) => setNewSectionDraft((s) => ({ ...s, fields_text: v }))}
          />
        </div>
      </Modal>
    </div>
  );
}

// Types for clipboard operations
type CopiedSection = {
  section_key: string;
  section_type: SectionType;
  title: string;
  name: string;
  content: string;
  description: string;
  tag: string;
  subheading1: string;
  subheading2: string;
  subtext: string;
  left_heading: string;
  right_heading: string;
  left_points: string;
  right_points: string;
  is_visible: "true" | "false";
  sort_order: string;
  fields_text: string;
};

type CopiedItem = {
  item_type: ItemType;
  item_key: string;
  sort_order: string;
  is_featured: "true" | "false";
  is_active: "true" | "false";
  question: string;
  answer: string;
  pro_name: string;
  pro_category: string;
  pro_url: string;
  pro_description: string;
  pro_results: string;
  pro_tag: string;
  pro_badge: string;
  test_name: string;
  test_company: string;
  test_role: string;
  test_description: string;
  test_url: string;
  test_rate: string;
  tile_name: string;
  tile_url: string;
  tile_description: string;
  ser_name: string;
  ser_url: string;
  ser_description: string;
  ser_icon: string;
  ser_tag: string;
  cc_name: string;
  cc_description: string;
  cc_icon: string;
  pc_name: string;
  pc_number: string;
  pc_description: string;
  pc_icon: string;
  pc_timeline: string;
};

type ClipboardContent = {
  type: "section" | "item" | null;
  data: CopiedSection | CopiedItem | null;
  sourcePageSlug: string | null;
  sourceSectionId: number | null;
};

// Main ContentModule Component - Restructured to match ServicesModule pattern
export function ContentModule() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState(() => getStoredToken());
  const [hasSessionAuth, setHasSessionAuth] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  
  // Add page modal state
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageDraft, setNewPageDraft] = useState({
    title: "",
    slug: "",
    status: "draft" as "published" | "draft",
    seo_title: "",
    seo_description: "",
    meta_keywords: "",
    service_id: "",
  });
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  
  // Clipboard state for copy/paste
  const [clipboard, setClipboard] = useState<ClipboardContent>({ type: null, data: null, sourcePageSlug: null, sourceSectionId: null });
  const [copiedSectionId, setCopiedSectionId] = useState<number | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<number | null>(null);
  const [clipboardMessage, setClipboardMessage] = useState("");
  const [isPasting, setIsPasting] = useState(false);

  const hasToken = adminToken.trim().length > 0;
  const canManage = hasToken || hasSessionAuth;

  const filteredPages = pages.filter((page) => {
    return page.title.toLowerCase().includes(search.toLowerCase()) || page.slug.toLowerCase().includes(search.toLowerCase());
  });

  const hasSelections = selectedSlugs.length > 0;

  const authHeaders = useMemo(() => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (hasToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken, hasToken]);

  const deleteHeaders = useMemo(() => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (hasToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken, hasToken]);

  async function fetchPages() {
    setIsLoading(true);
    setErrorText("");
    try {
      // Use the centralized contentApi for better error handling
      const pagesData = await contentApi.pages.list();
      // Map the API response to the local PageContent type
      const mappedPages = pagesData.map((page: ApiContentPageType) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        meta_keywords: page.meta_keywords,
        service_id: page.service_id,
        service_name: page.service?.name ?? null,
        sync_token: page.sync_token,
        updated_at: page.updated_at,
        sections: (page.sections || []).map((section: ApiContentSectionType) => ({
          id: section.id,
          content_page_id: section.content_page_id ?? 0,
          section_key: section.section_key || "",
          section_type: section.section_type || "heading-text",
          title: section.title || "",
          name: section.name ?? "",
          content: section.content ?? "",
          is_visible: section.is_visible ?? true,
          sort_order: section.sort_order ?? 0,
          fields: section.fields ?? {},
          updated_at: section.updated_at ?? null,
          items: (section.items || []).map((item: ApiContentItemType) => ({
            id: item.id,
            item_key: item.item_key ?? null,
            title: item.title ?? "",
            content: item.content ?? null,
            category: item.category ?? null,
            url: item.url ?? null,
            description: item.description ?? null,
            results: item.results ?? null,
            tags: item.tags ?? null,
            badge: item.badge ?? null,
            avatar: item.avatar ?? null,
            client_name: item.client_name ?? null,
            client_role: item.client_role ?? null,
            company: item.company ?? null,
            rating: item.rating ?? null,
            duration: item.duration ?? null,
            sort_order: item.sort_order ?? 0,
            is_featured: item.is_featured ?? false,
            is_active: item.is_active ?? true,
            custom_fields: item.custom_fields ?? null,
            external_id: item.external_id ?? null,
            updated_by: item.updated_by ?? null,
            created_at: item.created_at ?? null,
            updated_at: item.updated_at ?? null,
            deleted_at: item.deleted_at ?? null,
            question: item.question ?? null,
            answer: item.answer ?? null,
            pro_name: item.pro_name ?? null,
            pro_category: item.pro_category ?? null,
            pro_url: item.pro_url ?? null,
            pro_description: item.pro_description ?? null,
            pro_results: item.pro_results ?? null,
            pro_tag: item.pro_tag ?? null,
            pro_badge: item.pro_badge ?? null,
            test_name: item.test_name ?? null,
            test_company: item.test_company ?? null,
            test_role: item.test_role ?? null,
            test_description: item.test_description ?? null,
            test_url: item.test_url ?? null,
            test_rate: item.test_rate ?? null,
            tile_name: item.tile_name ?? null,
            tile_url: item.tile_url ?? null,
            tile_description: item.tile_description ?? null,
            ser_name: item.ser_name ?? null,
            ser_url: item.ser_url ?? null,
            ser_description: item.ser_description ?? null,
            ser_icon: item.ser_icon ?? null,
            ser_tag: item.ser_tag ?? null,
            cc_name: item.cc_name ?? null,
            cc_description: item.cc_description ?? null,
            cc_icon: item.cc_icon ?? null,
            pc_name: item.pc_name ?? null,
            pc_number: item.pc_number ?? null,
            pc_description: item.pc_description ?? null,
            pc_icon: item.pc_icon ?? null,
            pc_timeline: item.pc_timeline ?? null,
          })),
          description: section.description ?? null,
          tag: section.tag ?? null,
          subheading1: section.subheading1 ?? null,
          subheading2: section.subheading2 ?? null,
          subtext: section.subtext ?? null,
          left_heading: section.left_heading ?? null,
          right_heading: section.right_heading ?? null,
          left_points: section.left_points ?? null,
          right_points: section.right_points ?? null,
        })),
      }));
      setPages(mappedPages);
      setSelectedSlugs((current) => current.filter((slug) => mappedPages.some((page) => page.slug === slug)));
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorText("Session expired. Please log in again.");
        clearToken();
      } else if (error instanceof ForbiddenError) {
        setErrorText("Administrator access required.");
      } else if (error instanceof ApiError) {
        setErrorText(error.message);
      } else {
        setErrorText("Failed to load pages. Please check if the API is running.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const response = await fetch(`${API_BASE_URL}/services?limit=1000`);
      const payload: ApiResponse<{ data: ServiceItem[] }> = await response.json();
      if (payload.success && payload.data?.data) {
        setServices(payload.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  }

  useEffect(() => {
    fetchPages();
    fetchServices();
  }, []);

  useEffect(() => {
    async function syncAdminAuth() {
      const resolved = getStoredToken();
      setAdminToken(resolved);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: resolved ? { Authorization: `Bearer ${resolved}` } : {},
          credentials: "include",
        });
        if (response.ok) {
          setHasSessionAuth(true);
        } else {
          setHasSessionAuth(false);
        }
      } catch {
        setHasSessionAuth(false);
      }
    }

    void syncAdminAuth();
  }, []);

  function handleEditPage(page: PageContent) {
    setEditingPage(page);
  }

  function handlePagePatched(patched: PageContent) {
    setPages((prev) => prev.map((p) => (p.slug === patched.slug ? patched : p)));
    setEditingPage(patched);
  }

  function handlePageDeleted() {
    if (editingPage) {
      setEditingPage(null);
      void fetchPages();
    }
  }

  async function deletePage(page: PageContent) {
    const token = getStoredToken();
    if (!token) {
      setErrorText("Set an admin API token to delete pages.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(page.slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload: ApiResponse<null> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete page.");
      }
      await fetchPages();
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to delete page.");
    }
  }

  function togglePageSelection(slug: string) {
    setSelectedSlugs((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));
  }

  function toggleSelectAllFiltered() {
    const filteredSlugs = filteredPages.map((page) => page.slug);
    const allSelected = filteredSlugs.every((slug) => selectedSlugs.includes(slug));
    if (allSelected) {
      setSelectedSlugs((current) => current.filter((slug) => !filteredSlugs.includes(slug)));
      return;
    }
    setSelectedSlugs((current) => Array.from(new Set([...current, ...filteredSlugs])));
  }

  function setToken() {
    const value = window.prompt("Paste admin API token")?.trim() ?? "";
    if (!value) {
      return;
    }
    setStoredToken(value);
    setAdminToken(value);
    setHasSessionAuth(true);
    setErrorText("");
  }

  function clearToken() {
    clearStoredAuth();
    setAdminToken("");
    setHasSessionAuth(false);
  }

  // Create new page
  async function createPage() {
    if (!canManage) {
      setErrorText("Set admin token to create page.");
      return;
    }
    if (!newPageDraft.title.trim()) {
      setErrorText("Page title is required.");
      return;
    }
    setIsCreatingPage(true);
    setErrorText("");
    try {
      const slug = newPageDraft.slug || slugify(newPageDraft.title);
      const response = await fetch(`${API_BASE_URL}/content-pages`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: newPageDraft.title,
          slug,
          status: newPageDraft.status,
          seo_title: newPageDraft.seo_title || newPageDraft.title,
          seo_description: newPageDraft.seo_description,
          meta_keywords: newPageDraft.meta_keywords,
          service_id: newPageDraft.service_id ? Number(newPageDraft.service_id) : null,
        }),
      });
      const payload: ApiResponse<ApiContentPage> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to create page.");
      }
      await fetchPages();
      setIsAddPageModalOpen(false);
      setNewPageDraft({
        title: "",
        slug: "",
        status: "draft",
        seo_title: "",
        seo_description: "",
        meta_keywords: "",
        service_id: "",
      });
      // Edit the newly created page
      const newPage = mapPage(payload.data);
      setEditingPage(newPage);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to create page.");
    } finally {
      setIsCreatingPage(false);
    }
  }

  // Copy section
  function copySection(section: ContentSection, pageSlug: string) {
    const draft = sectionToDraft(section);
    setClipboard({
      type: "section",
      data: draft as unknown as CopiedSection,
      sourcePageSlug: pageSlug,
      sourceSectionId: section.id,
    });
    setCopiedSectionId(section.id);
    setCopiedItemId(null);
    setClipboardMessage(`Copied section: ${section.title}`);
    setTimeout(() => setClipboardMessage(""), 2000);
  }

  // Copy item
  function copyItem(item: ContentItem, sectionId: number, pageSlug: string) {
    const itemType = detectItemType(item);
    const form = itemToForm(item, itemType);
    setClipboard({
      type: "item",
      data: form as unknown as CopiedItem,
      sourcePageSlug: pageSlug,
      sourceSectionId: sectionId,
    });
    setCopiedItemId(item.id);
    setCopiedSectionId(null);
    setClipboardMessage(`Copied item: ${item.title || "Item"}`);
    setTimeout(() => setClipboardMessage(""), 2000);
  }

  // Paste section to a page
  async function pasteSectionToPage(targetPageSlug: string) {
    if (!clipboard || clipboard.type !== "section" || !canManage) {
      setErrorText("No section copied or no admin token.");
      return;
    }
    const sectionData = clipboard.data as CopiedSection;
    setIsPasting(true);
    setErrorText("");
    try {
      // Generate new section key to avoid conflicts
      const newSectionKey = slugify(sectionData.title) + "-" + Date.now();
      const response = await fetch(`${API_BASE_URL}/content-pages/${encodeURIComponent(targetPageSlug)}/sections`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          section_key: newSectionKey,
          section_type: sectionData.section_type,
          title: sectionData.title + " (Copy)",
          name: sectionData.name,
          content: sectionData.content,
          is_visible: sectionData.is_visible === "true",
          sort_order: Number(sectionData.sort_order) + 1,
          fields: JSON.parse(sectionData.fields_text || "{}"),
        }),
      });
      const payload: ApiResponse<{ section: ApiContentSection }> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to paste section.");
      }
      // Refresh pages and edit the target page
      await fetchPages();
      const targetPage = pages.find(p => p.slug === targetPageSlug);
      if (targetPage) {
        setEditingPage(targetPage);
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to paste section.");
    } finally {
      setIsPasting(false);
    }
  }

  // Paste item to a section
  async function pasteItemToSection(targetSectionId: number, targetPageSlug: string) {
    if (!clipboard || clipboard.type !== "item" || !canManage) {
      setErrorText("No item copied or no admin token.");
      return;
    }
    const itemData = clipboard.data as CopiedItem;
    setIsPasting(true);
    setErrorText("");
    try {
      // Build payload based on item type
      const payload = buildPayload(itemData as unknown as ItemForm, itemData.item_type);
      // Add item_key with new timestamp to avoid conflicts
      payload.item_key = (payload.item_key as string || "item") + "-" + Date.now();
      
      const response = await fetch(`${API_BASE_URL}/content-sections/${targetSectionId}/items`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const apiResponse: ApiResponse<{ item: ContentItem }> = await response.json();
      if (!response.ok || !apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to paste item.");
      }
      // Refresh the current page if editing
      if (editingPage && editingPage.slug === targetPageSlug) {
        await fetchPages();
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to paste item.");
    } finally {
      setIsPasting(false);
    }
  }

  // Clear clipboard
  function clearClipboard() {
    setClipboard({ type: null, data: null, sourcePageSlug: null, sourceSectionId: null });
    setCopiedSectionId(null);
    setCopiedItemId(null);
  }

  if (editingPage) {
    return (
      <PageEditor
        page={editingPage}
        token={adminToken}
        services={services}
        onBack={() => setEditingPage(null)}
        onPagePatched={handlePagePatched}
      />
    );
  }

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Content Pages</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Manage page content, sections, and items.</p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="neutral" iconStart={<RefreshCw size={16} />} onClick={fetchPages}>
            Refresh
          </Button>
          {canManage && (
            <Button variant="primary" iconStart={<Plus size={16} />} onClick={() => setIsAddPageModalOpen(true)}>
              Add Page
            </Button>
          )}
          {!hasToken ? (
            <Button variant="neutral" onClick={setToken}>
              Set Admin Token
            </Button>
          ) : (
            <Button variant="neutral" onClick={clearToken}>
              Clear Token
            </Button>
          )}
        </div>
      </div>

      {/* Clipboard status bar */}
      {clipboard.type && (
        <div className="bg-brand-muted border border-brand-primary rounded-corner-md p-md flex items-center justify-between">
          <div className="flex items-center gap-md">
            <Clipboard size={16} className="text-brand-primary" />
            <span className="text-label-sm text-text-primary">
              {clipboard.type === "section" ? "Section copied" : "Item copied"}
            </span>
            {clipboardMessage && (
              <span className="text-label-sm text-success flex items-center gap-xs">
                <Check size={14} /> {clipboardMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-sm">
            <span className="text-video-title text-text-secondary">Paste to:</span>
            <select 
              className="bg-surface-bg border border-border-primary rounded-corner-sm px-sm py-xs text-label-sm"
              onChange={(e) => {
                if (e.target.value) {
                  if (clipboard.type === "section") {
                    void pasteSectionToPage(e.target.value);
                  } else {
                    setErrorText("Select a section to paste item to");
                  }
                }
              }}
              defaultValue=""
            >
              <option value="">Select target page...</option>
              {pages.filter(p => p.slug !== clipboard.sourcePageSlug).map(p => (
                <option key={p.slug} value={p.slug}>{p.title}</option>
              ))}
            </select>
            <Button variant="subtle" size="small" onClick={clearClipboard}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-xl">
        {[
          { label: "Total Pages", value: pages.length },
          { label: "Published", value: pages.filter((p) => p.status === "published").length },
          { label: "Total Sections", value: pages.reduce((acc, p) => acc + p.sections.length, 0) },
          { label: "Total Items", value: pages.reduce((acc, p) => acc + p.sections.reduce((a, s) => a + (s.items?.length || 0), 0), 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-lg">
        <InputField prefix={<Search size={16} />} placeholder="Search pages..." value={search} onChange={setSearch} />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-sm text-label-sm text-text-secondary">
            <input type="checkbox" checked={filteredPages.length > 0 && filteredPages.every((page) => selectedSlugs.includes(page.slug))} onChange={toggleSelectAllFiltered} />
            Select all filtered
          </label>
        </div>
        {errorText && <p className="text-label-sm text-danger">{errorText}</p>}
      </div>

      <div className="grid grid-cols-2 gap-xl">
        {isLoading && (
          <div className="col-span-2 bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">Loading pages...</p>
          </div>
        )}
        {!isLoading &&
          filteredPages.map((page) => (
            <div key={page.id} className="relative">
              <label className="absolute top-lg right-lg z-10 bg-surface-bg/90 px-sm py-xs rounded-corner-sm text-video-title text-text-secondary flex items-center gap-xs">
                <input type="checkbox" checked={selectedSlugs.includes(page.slug)} onChange={() => togglePageSelection(page.slug)} />
                Select
              </label>
              <PageCardWithCopy 
                page={page} 
                onEdit={handleEditPage} 
                onDelete={deletePage} 
                onCopySection={(section) => copySection(section, page.slug)}
                onCopyItem={(item, sectionId) => copyItem(item, sectionId, page.slug)}
                canManage={canManage}
                copiedSectionId={copiedSectionId}
                copiedItemId={copiedItemId}
              />
            </div>
          ))}
        {!isLoading && filteredPages.length === 0 && (
          <div className="col-span-2 bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No pages found.</p>
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      <Modal
        isOpen={isAddPageModalOpen}
        onClose={() => setIsAddPageModalOpen(false)}
        title="Create New Page"
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsAddPageModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createPage} disabled={isCreatingPage}>
              {isCreatingPage ? "Creating..." : "Create Page"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          <InputField
            label="Page Title *"
            placeholder="Enter page title"
            value={newPageDraft.title}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, title: v }))}
          />
          <InputField
            label="Slug (optional)"
            placeholder="auto-generated-from-title"
            value={newPageDraft.slug}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, slug: v }))}
          />
          <SelectField
            label="Status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
            value={newPageDraft.status}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, status: v as "published" | "draft" }))}
          />
          <InputField
            label="SEO Title"
            placeholder="SEO title (defaults to page title)"
            value={newPageDraft.seo_title}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, seo_title: v }))}
          />
          <TextareaField
            label="SEO Description"
            rows={3}
            placeholder="Meta description for SEO"
            value={newPageDraft.seo_description}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, seo_description: v }))}
          />
          <InputField
            label="Meta Keywords"
            placeholder="keyword1, keyword2, keyword3"
            value={newPageDraft.meta_keywords}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, meta_keywords: v }))}
          />
          <SelectField
            label="Link to Service (optional)"
            options={[{ value: "", label: "None" }, ...services.map(s => ({ value: String(s.id), label: s.name }))]}
            value={newPageDraft.service_id}
            onChange={(v) => setNewPageDraft((s) => ({ ...s, service_id: v }))}
          />
        </div>
      </Modal>
    </div>
  );
}
