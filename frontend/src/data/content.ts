import { cache } from "react";
import { API_BASE_URL } from "@/config/api";
import { mergeSectionData, mergeItemData } from "@/data/schema";

// `next.config.ts` builds this app with `output: "export"` (a static HTML
// export, no Next.js server in production), so this `revalidate` value has
// no runtime effect on the deployed site today — every module is fetched
// exactly once, at build time. It's kept so the same fetch call behaves
// correctly (background revalidation, no request-time caching surprises)
// if this app is ever deployed as a server instead of a static export.
// Under the static export, CMS edits only appear after a rebuild+redeploy.
const MODULE_REVALIDATE_SECONDS = 60;


// ========================================================
// TypeScript Interface for Normalized Page
// ========================================================

type SectionRecord = Record<string, unknown>;

export type NormalizedSection = {
  section_key?: string | null;
  section_type?: string | null;
  title?: string | null;
  description?: string | null;
  tag?: string | null;
  subheading1?: string | null;
  subheading2?: string | null;
  subtext?: string | null;
  header?: SectionRecord;
  items?: unknown[];
  cta?: SectionRecord;
  techspec?: SectionRecord;
  hero?: unknown;
  stats?: unknown[];
  [key: string]: unknown;
};

export type ModuleName =
  | "content"
  | "service"
  | "article"
  | "singlepage"
  | "datahub";

export type NormalizedPage = {
  id?: number | string;
  title?: string;
  slug: string;
  category_slug?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  meta_keywords?: string | null;
  [section_key: string]: NormalizedSection | unknown;
};

function isRecord(value: unknown): value is SectionRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRecord(value: unknown): SectionRecord {
  return isRecord(value) ? value : {};
}

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toStringArray(value: unknown, delimiter = "\n"): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function getNestedValue(value: unknown, ...path: string[]): unknown {
  let current = value;

  for (const key of path) {
    if (!isRecord(current) || !(key in current)) {
      return undefined;
    }

    current = current[key];
  }

  return current;
}

function getNestedStringValue(value: unknown, ...path: string[]): string {
  return toString(getNestedValue(value, ...path));
}

function getDefaultSection(key: string): SectionRecord | undefined {
  const value = (defaultStaticHomePage as Record<string, unknown>)[key];
  return isRecord(value) ? value : undefined;
}

// Default Static Fallback Page for "/"
const defaultStaticHomePage: NormalizedPage = {
  title: "Home",
  slug: "/",
  category_slug: null,
  whyus: {
    section_key: "whyus",
    tag: "Why Us?",
    subheading1: "Why Choose",
    subheading2: "WebNDevs?",
    subtext: "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
    header: {
      tag: "Why Us?",
      subheading1: "Why Choose",
      subheading2: "WebNDevs?",
      subtext: "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
    },
    items: [
      {
        icon: "Users",
        title: "On Everything",
        description: "No more coordinating between designers, developers, and marketers. We handle it all seamlessly under one roof.",
      },
      {
        icon: "MessageCircle",
        title: "Clear Communication",
        description: "Direct access to your project manager. No middlemen, no confusion.",
      },
    ],
  },
  process: {
    section_key: "process",
    tag: "Our Process",
    subheading1: "From Idea to Launch in",
    subheading2: "5 Simple Steps",
    subtext: "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
    header: {
      tag: "Our Process",
      subheading1: "From Idea to Launch in",
      subheading2: "5 Simple Steps",
      subtext: "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
    },
    items: [
      {
        number: "01",
        icon: "Search",
        title: "Discover",
        description: "We start by understanding your business, goals, and challenges.",
        duration: "1-2 days",
      },
    ],
    cta: {
      preview: { text: "More Projects", url: "/portfolio" },
      full: { description: "Ready to get started?", text: "Schedule Your Free Call", url: "#get-started" },
    },
  },
  result: {
    section_key: "result",
    header: {
      tag: "Our Work",
      subheading1: "Real Results for",
      subheading2: "Real Businesses",
      subtext: "See how we've helped companies grow through design, development, automation, and data-driven solutions.",
    },
    items: [],
    cta: {
      preview: { text: "More Projects", url: "/portfolio" },
      full: { description: "Want results like these?", text: "Talk To Our Team", url: "#get-started" },
    },
  },
  comparison: {
    section_key: "comparison",
    tag: "Comparison",
    subheading1: "Why We Stand Out",
    subheading2: "Against Alternatives",
    subtext: "Compare our dedicated approach with traditional agencies or freelancers.",
    header: {
      tag: "Comparison",
      subheading1: "Why We Stand Out",
      subheading2: "Against Alternatives",
      subtext: "Compare our dedicated approach with traditional agencies or freelancers.",
    },
    items: [
      {
        title: "Traditional Agencies vs WebNDevs",
        description: "See why fast-growing companies choose our integrated digital model.",
        tag: "Comparison",
        comparison: {
          leftHeading: "Traditional Agencies",
          rightHeading: "WebNDevs Team",
          leftPoints: ["Slow communication", "High overhead costs", "Separated teams"],
          rightPoints: ["Direct communication", "Transparent pricing", "Dedicated full-stack team"],
        },
      },
    ],
  },
};

// ========================================================
// Section & Page Normalizers
// ========================================================

export function normalizeSection(rawSection: SectionRecord | null | undefined): NormalizedSection | null {
  if (!rawSection) return null;

  const sectionKey = toString(rawSection.section_key);
  const data = mergeSectionData(sectionKey, toRecord(rawSection.data));
  const fallbackSection = getDefaultSection(sectionKey);
  const fallbackItems = Array.isArray(fallbackSection?.items) ? fallbackSection.items : [];

  const rawItems = Array.isArray(rawSection.items) && rawSection.items.length > 0
    ? rawSection.items
    : Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : fallbackItems;


  const items = Array.isArray(rawItems)
    ? rawItems.map((item: unknown) => {
      const itemRecord = toRecord(item);
      const itemData = toRecord(itemRecord.data ?? itemRecord);
      const resultsArray = toStringArray(itemData.results);
      const tagsArray = toStringArray(itemData.tags, ",");
      const comp = toRecord(itemData.comparison ?? itemRecord.comparison);

      return {
        ...itemData,
        id: itemRecord.id ?? itemData.id,
        icon: toString(itemData.icon || "Check"),
        number: toString(itemData.number || ""),
        title: toString(itemData.title || itemData.question || itemData.name || ""),
        description: toString(itemData.description || itemData.answer || itemData.content || itemData.text || ""),
        text: toString(itemData.text || itemData.description || ""),
        tag: toString(itemData.tag || itemData.tag || ""),
        url: toString(itemData.url || itemData.href || itemData.project_url || ""),
        results: resultsArray,
        tags: tagsArray,
        comparison: {
          leftHeading: toString(comp.leftHeading || comp.left_heading || null),
          rightHeading: toString(comp.rightHeading || comp.right_heading || null),
          leftPoints: toStringArray(comp.leftPoints || comp.left_points),
          rightPoints: toStringArray(comp.rightPoints || comp.right_points),
        },
      };

    })
    : [];

  const header: SectionRecord = {
    tag: rawSection.tag || data.tag || null,
    subheading1: rawSection.subheading1 || data.heading || data.title || data.subheading1 || null,
    subheading2: rawSection.subheading2 || data.subheading || data.content || data.subheading2 || null,
    subtext: rawSection.subtext || data.subtext || data.description || null,
  };

  const ctaData = toRecord(data.cta ?? rawSection.cta);
  const cta: SectionRecord = {
    preview: {
      text: toString(ctaData.cta_preview_text || ctaData.preview_text || getNestedStringValue(ctaData, "preview", "text") || null),
      url: toString(ctaData.cta_preview_url || ctaData.preview_url || getNestedStringValue(ctaData, "preview", "url") || null),
    },
    full: {
      description: toString(ctaData.cta_full_description || ctaData.full_description || getNestedStringValue(ctaData, "full", "description") || null),
      text: toString(ctaData.cta_full_text || ctaData.full_text || getNestedStringValue(ctaData, "full", "text") || null),
      url: toString(ctaData.cta_full_url || ctaData.full_url || getNestedStringValue(ctaData, "full", "url") || null),
    },
  };
  const sectionObj: NormalizedSection = {
    ...data,
    section_key: toString(rawSection.section_key),
    section_type: toString(rawSection.section_type),
    tag: toString(rawSection.tag || data.tag || null),
    subheading1: toString(rawSection.subheading1 || data.heading || data.title || data.subheading1 || null),
    subheading2: toString(rawSection.subheading2 || data.subheading || data.content || data.subheading2 || null),
    subtext: toString(rawSection.subtext || data.subtext || data.description || null),
    header,
    items,
    cta,
  };


  if (data.techspec || rawSection.techspec) {
    const ts = toRecord(data.techspec ?? rawSection.techspec);
    sectionObj.techspec = {
      techHeading1: toString(ts.techHeading1 || ts.tech_heading1 || null),
      techHeading2: toString(ts.techHeading2 || ts.tech_heading2 || null),
      techSubtext: toString(ts.techSubtext || ts.tech_subtext || null),
      tags: toStringArray(ts.tags),
    };
  }

  return sectionObj;
}

export function normalizePage(rawPage: SectionRecord | null | undefined): NormalizedPage {
  if (!rawPage) return { slug: "/" };

  const page: NormalizedPage = {
    id: rawPage.id as number | string | undefined,
    title: toString(rawPage.title || ""),
    slug: toString(rawPage.slug || ""),
    category_slug: toString(rawPage.category_slug || getNestedStringValue(rawPage, "category", "slug") || null),
    seo_title: toString(rawPage.seo_title || null),
    seo_description: toString(rawPage.seo_description || null),
    meta_keywords: toString(rawPage.meta_keywords || null),
  };

  if (Array.isArray(rawPage.sections)) {
    rawPage.sections.forEach((section: unknown) => {
      const sectionRecord = toRecord(section);
      if (sectionRecord.is_visible !== false && typeof sectionRecord.section_key === "string") {
        page[sectionRecord.section_key as string] = normalizeSection(sectionRecord);
      }
    });
  } else {
    Object.keys(rawPage).forEach((key) => {
      if (!["id", "title", "slug", "category_slug", "seo_title", "seo_description", "meta_keywords"].includes(key)) {
        page[key] = rawPage[key];
      }
    });
  }

  return page;
}

// ========================================================
// Generic Module Fetcher (fetchModulePages)
// ========================================================
//
// Fetches fresh from the API on every call, relying on Next.js's fetch
// Data Cache + `revalidate` for cross-request caching (so published CMS
// edits appear within MODULE_REVALIDATE_SECONDS instead of requiring a
// server restart). `cache()` from "react" memoizes the parsed/normalized
// result across the many section components that request the same
// module within a single render pass, without leaking state across
// requests.

async function fetchModulePagesUncached(moduleName: string): Promise<NormalizedPage[]> {
  try {
    const endpointName = moduleName.endsWith("-pages") ? moduleName : `${moduleName}-pages`;
    const res = await fetch(`${API_BASE_URL}/${endpointName}`, {
      next: { revalidate: MODULE_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      return [];
    }

    const payload: unknown = await res.json();
    let rawPages: unknown[] = [];

    if (Array.isArray(payload)) {
      rawPages = payload;
    } else if (isRecord(payload)) {
      if (Array.isArray(payload.data)) {
        rawPages = payload.data;
      } else if (Array.isArray(payload[endpointName])) {
        rawPages = payload[endpointName] as unknown[];
      } else {
        rawPages = Object.values(payload);
      }
    }

    return rawPages.map((rawPage: unknown) => normalizePage(toRecord(rawPage)));
  } catch (e) {
    console.warn(`Failed to fetch module pages for ${moduleName}:`, e);
    return [];
  }
}

export const fetchModulePages = cache(fetchModulePagesUncached);

// ========================================================
// Generic Route Helper (buildRoute)
// ========================================================

export function buildRoute(
  page: NormalizedPage,
  module: ModuleName
): string {
  if (!page) return "/";

  const categorySlug = (page.category_slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  const slug = (page.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  // Home
  if (!slug || slug === "home" || slug === "homepage") {
    return "/";
  }

  // Category pages take priority
  if (categorySlug && categorySlug !== "null") {
    return `/${categorySlug}/${slug}`;
  }

  // Module-based routes
  switch (module) {
    case "service":
      return `/services/${slug}`;

    case "article":
      return `/${slug}`;

    default:
      return `/${slug}`;
  }
}

// ========================================================
// Generic Route Resolver (findPageByRoute)
// ========================================================

export function findPageByRoute(
  pages: NormalizedPage[],
  module: ModuleName,
  pathname: string
): NormalizedPage | undefined {
  const cleanPath =
    (pathname || "/")
      .trim()
      .toLowerCase()
      .replace(/\/+$/, "") || "/";

  return pages.find((page) => {
    const route =
      buildRoute(page, module)
        .toLowerCase()
        .replace(/\/+$/, "") || "/";

    return route === cleanPath;
  });
}

// ========================================================
// Public API Functions (getModule, getPage & getSection)
// ========================================================
export async function getModule(module: ModuleName): Promise<NormalizedPage[]> {
  return fetchModulePages(module);
}

export async function getPage(
  module: ModuleName,
  pathname: string
): Promise<NormalizedPage | undefined> {
  const pages = await getModule(module);
  const page = findPageByRoute(pages, module, pathname);

  if (page) return page;

  const cleanPath = (pathname || "/").trim().replace(/^\/+/, "");

  if (cleanPath === "" || cleanPath === "home") {
    return defaultStaticHomePage;
  }

  return undefined;
}

export async function getSection(module: ModuleName, pathname: string, key: string): Promise<NormalizedSection | undefined> {
  const page = await getPage(module, pathname);
  return page?.[key] as NormalizedSection | undefined;
}

export function getPageSection<T = NormalizedSection>(page: NormalizedPage | undefined, key: string): T | undefined {
  const fallbackSection = getDefaultSection(key);
  const section = page?.[key] || fallbackSection;
  if (!section) return undefined;

  const merged = mergeSectionData(key, section as Record<string, unknown>);

  if ((!merged.items || (Array.isArray(merged.items) && merged.items.length === 0)) && Array.isArray(fallbackSection?.items) && fallbackSection.items.length > 0) {
    merged.items = fallbackSection.items.map((item: unknown) => mergeItemData(key, item));
  }

  return merged as unknown as T;
}
