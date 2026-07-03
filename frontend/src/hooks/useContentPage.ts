"use client";
import { useMemo } from "react";
import { useApi } from "./useApi";

// Content Item type - matches jsonformat.md structure
export type ContentItem = {
  id: number;
  content_section_id: number;
  item_key: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  custom_fields: Record<string, unknown> | null;
  external_id: string | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  avatar?: string | null; // Add this!
  // Unified title/content fields - mapped from type-specific prefixed fields
  title?: string | null;
  content?: string | null;
  category?: string | null;
  description?: string | null;
  url?: string | null;
  // Q&A specific fields
  question?: string | null;
  answer?: string | null;
  // Project (Pro) fields
  pro_name?: string | null;
  pro_category?: string | null;
  pro_url?: string | null;
  pro_description?: string | null;
  pro_results?: string[] | null;
  pro_tag?: string[] | null;
  pro_badge?: string | null;
  badge?: string | null;
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

// Section types
export type SectionType = "heading-text" | "approach-table" | "hero" | "portfolio" | "cta" | "testimonials" | "items-list" | "trust-badges";

// Content Section
export type ContentSection = {
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
  items: ContentItem[];
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

// Content Page
export type ContentPage = {
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
  section_type?: SectionType;
  title: string;
  name?: string | null;
  content?: string | null;
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

// Normalize item to handle pro_results and pro_tag parsing
function normalizeItem(item: ContentItem): ContentItem {
  let pro_results: string[] = [];
  let pro_tag: string[] = [];

  // Handle pro_results - parse from JSON string or use as array
  if (item.pro_results) {
    if (Array.isArray(item.pro_results)) {
      pro_results = item.pro_results;
    } else if (typeof item.pro_results === 'string') {
      try {
        pro_results = JSON.parse(item.pro_results);
      } catch {
        pro_results = [];
      }
    }
  }

  // Handle pro_tag - parse from JSON string or use as array
  if (item.pro_tag) {
    if (Array.isArray(item.pro_tag)) {
      pro_tag = item.pro_tag;
    } else if (typeof item.pro_tag === 'string') {
      try {
        pro_tag = JSON.parse(item.pro_tag);
      } catch {
        pro_tag = [];
      }
    }
  }

  return {
    ...item,
    pro_results,
    pro_tag,
    avatar: item.avatar ?? null,
  };
}

// Normalize section from API response
function normalizeSection(section: ApiContentSection, index: number): ContentSection {
  const sectionType = section.section_type ?? "heading-text";
  return {
    id: section.id,
    content_page_id: section.content_page_id ?? 0,
    section_key: section.section_key || `section-${section.id}`,
    section_type: sectionType,
    title: section.title || `Section ${index + 1}`,
    name: section.name ?? "",
    content: section.content ?? "",
    is_visible: section.is_visible ?? true,
    sort_order: section.sort_order ?? index,
    fields: section.fields ?? {},
    updated_at: section.updated_at ?? null,
    items: (section.items ?? []).map(normalizeItem),
    // Heading Text fields
    description: section.description ?? null,
    tag: section.tag ?? null,
    subheading1: section.subheading1 ?? null,
    subheading2: section.subheading2 ?? null,
    subtext: section.subtext ?? null,
    // Approach Table fields
    left_heading: section.left_heading ?? null,
    right_heading: section.right_heading ?? null,
    left_points: section.left_points ?? null,
    right_points: section.right_points ?? null,
  };
}

// Normalize page from API response
function normalizePage(page: ApiContentPage): ContentPage {
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
    sections: (page.sections ?? []).map(normalizeSection).sort((a, b) => a.sort_order - b.sort_order),
  };
}

// Helper functions to determine item type
export type ItemType = "qa" | "project" | "testimonial" | "datatile" | "servicecard" | "choosecard" | "processcard";

export function getItemType(item: ContentItem): ItemType {
  if (item.question !== undefined && item.answer !== undefined) return "qa";
  if (item.pro_name !== undefined) return "project";
  if (item.test_name !== undefined) return "testimonial";
  if (item.tile_name !== undefined) return "datatile";
  if (item.ser_name !== undefined) return "servicecard";
  if (item.cc_name !== undefined) return "choosecard";
  if (item.pc_name !== undefined) return "processcard";
  return "qa"; // default
}

type UseContentPageResult = {
  data: ContentPage | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useContentPage(slug: string): UseContentPageResult {
  const { data: apiPage, loading, error, refetch } = useApi<ApiContentPage>(slug ? `/content-pages/${slug}` : null);

  const normalizedPage = useMemo(() => {
    if (!apiPage) return null;
    if (apiPage && apiPage.id) {
      return normalizePage(apiPage);
    }
    return null;
  }, [apiPage]);

  // Combine API error with normalization error
  const combinedError = useMemo(() => {
    if (error) return error;
    // If loading is finished for a valid slug but we have no page, it's a 404.
    if (!loading && slug && !apiPage) return "Page not found or content unavailable";
    return null;
  }, [error, loading, slug, apiPage]);

  return { data: normalizedPage, loading, error: combinedError, refetch };
}