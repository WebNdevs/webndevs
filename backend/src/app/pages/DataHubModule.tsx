import { useEffect, useMemo, useState } from "react";
import { Badge, InputField, SelectField, TextareaField } from "@figma/astraui";
import {
  Globe,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api.config";
import { clearStoredAuth, fetchAuthenticatedUser, getStoredToken, setStoredToken, TOKEN_KEYS } from "../auth";
import { Pill, Tabs, Card, Button as CustomButton, ConfirmModal, Input } from "../components/blocks";

type PageStatus = "published" | "draft";

type DataHubItemModel = {
  id: number;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  data: Record<string, unknown>;
  updated_at: string | null;
};

type DataHubSectionModel = {
  id: number;
  datahub_page_id: number;
  section_key: string;
  section_type: string;
  is_visible: boolean;
  sort_order: number;
  data: Record<string, unknown>;
  items?: DataHubItemModel[];
  updated_at: string | null;
};

type DataHubPageModel = {
  id: number;
  title: string;
  slug: string;
  status: PageStatus;
  seo_title: string | null;
  seo_description: string | null;
  meta_keywords: string | null;
  service_id: number | null;
  sync_token: string | null;
  updated_at: string | null;
  sections: DataHubSectionModel[];
};

type SectionKey =
  | "hero"
  | "header"
  | "stats"
  | "comparison"
  | "featured"
  | "directory"
  | "benefits"
  | "faq"
  | "cta";

type EditableSectionItem = {
  row_id: string;
  id?: number;
  title?: string;
  description?: string;
  value?: string;
  icon?: string;
  href?: string;
  question?: string;
  answer?: string;
  tags?: string[];
  tagsText?: string;
  badge?: string;
  // Comparison
  leftHeading?: string;
  rightHeading?: string;
  leftPointsText?: string;
  rightPointsText?: string;
  is_active: boolean;
  is_featured: boolean;
};

type EditableManagedSection = {
  id?: number;
  section_key: SectionKey;
  label: string;
  subheading: string;
  title: string;
  title1: string;
  title2: string;
  subheading1: string;
  subheading2: string;
  description: string;
  tag: string;
  subtext: string;
  is_active: boolean;
  items: EditableSectionItem[];
  ctaPreviewText?: string;
  ctaPreviewUrl?: string;
  ctaFullDescription?: string;
  ctaFullText?: string;
  ctaFullUrl?: string;
};

const SECTION_KEYS: SectionKey[] = [
  "hero",
  "header",
  "stats",
  "comparison",
  "featured",
  "directory",
  "benefits",
  "faq",
  "cta",
];

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero Section",
  header: "Header Section",
  stats: "Stats Section",
  comparison: "Comparison Section",
  featured: "Featured Section",
  directory: "Directory Section",
  benefits: "Benefits Section",
  faq: "FAQ Section",
  cta: "CTA Section",
};

export function DataHubModule() {
  const [pages, setPages] = useState<DataHubPageModel[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<DataHubPageModel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("publishing_workflow");
  const [managedSections, setManagedSections] = useState<EditableManagedSection[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [adminToken, setAdminToken] = useState(() => getStoredToken() ?? "");
  const [hasSessionAuth, setHasSessionAuth] = useState(false);

  const [showPageModal, setShowPageModal] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    status: "draft" as PageStatus,
    seo_title: "",
    seo_description: "",
    meta_keywords: "",
    hero_tag: "",
    hero_title1: "",
    hero_title2: "",
    hero_description: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const hasToken = adminToken.trim().length > 0;
  const canManage = hasToken || hasSessionAuth;

  const authHeaders = useMemo(() => {
    return {
      "DataHub-Type": "application/json",
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    };
  }, [adminToken]);

  const requestJson = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const payload = await response.json();
        message = payload.message || message;
      } catch {
        // ignore
      }
      if (response.status === 401) {
        clearStoredAuth();
        setAdminToken("");
      }
      throw new Error(message);
    }

    const payload = await response.json();
    if (payload?.success) {
      return payload.data as T;
    }
    throw new Error(payload?.message || "Request failed");
  };

  function omitEmptyKeys(obj: any): any {
    if (Array.isArray(obj)) {
      const items = obj.map(omitEmptyKeys).filter((v) => v !== null && v !== undefined);
      return items.length > 0 ? items : null;
    }
    if (obj !== null && typeof obj === "object") {
      const result: Record<string, any> = {};
      Object.keys(obj).forEach((key) => {
        const value = omitEmptyKeys(obj[key]);
        if (value !== null && value !== undefined && value !== "") {
          result[key] = value;
        }
      });
      return Object.keys(result).length > 0 ? result : null;
    }
    return obj;
  }

  // Pre-formatted JSON preview compiler based on sections.ts & homeData structures
  const previewJson = useMemo(() => {
    if (!selectedPage) return null;

    const rawJson: Record<string, any> = {
      section_key: selectedPage.slug,
    };

    managedSections.forEach((sec) => {
      if (!sec.is_active) {
        return;
      }

      const cleanedItems = sec.items
        .map((item) => {
          const itemData: Record<string, any> = {};
          if (sec.section_key === "featured" || sec.section_key === "directory" || sec.section_key === "benefits") {
            itemData.icon = item.icon?.trim() || null;
            itemData.title = item.title?.trim() || null;
            itemData.description = item.description?.trim() || null;
            itemData.href = item.href?.trim() || null;
            itemData.is_featured = item.is_featured;
            itemData.badge = item.badge?.trim() || null;
            itemData.tags = item.tagsText ? item.tagsText.split(",").map((s) => s.trim()).filter(Boolean) : (Array.isArray(item.tags) ? item.tags : null);
          } else if (sec.section_key === "stats") {
            itemData.icon = item.icon?.trim() || null;
            itemData.title = item.title?.trim() || null;
            itemData.value = item.value?.trim() || null;
          } else if (sec.section_key === "comparison") {
            itemData.leftHeading = item.leftHeading?.trim() || null;
            itemData.rightHeading = item.rightHeading?.trim() || null;
            itemData.leftPoints = item.leftPointsText ? item.leftPointsText.split("\n").map((s) => s.trim()).filter(Boolean) : null;
            itemData.rightPoints = item.rightPointsText ? item.rightPointsText.split("\n").map((s) => s.trim()).filter(Boolean) : null;
          } else if (sec.section_key === "faq") {
            itemData.question = item.question?.trim() || null;
            itemData.answer = item.answer?.trim() || null;
          } else {
            itemData.title = item.title?.trim() || null;
            itemData.description = item.description?.trim() || null;
          }

          return omitEmptyKeys(itemData);
        })
        .filter((item) => item !== null && Object.keys(item).length > 0);

      if (sec.section_key === "hero") {
        rawJson.hero = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          title1: sec.title1?.trim() || null,
          title2: sec.title2?.trim() || null,
          description: sec.description?.trim() || null,
        });
      } else if (sec.section_key === "header") {
        rawJson.header = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          subheading1: sec.subheading1?.trim() || null,
          subheading2: sec.subheading2?.trim() || null,
          subtext: sec.subtext?.trim() || null,
        });
      } else if (sec.section_key === "featured") {
        rawJson.featured = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          subheading1: sec.subheading1?.trim() || null,
          subheading2: sec.subheading2?.trim() || null,
          subtext: sec.subtext?.trim() || null,
          items: cleanedItems.length > 0 ? cleanedItems : null,
        });
      } else if (sec.section_key === "comparison") {
        rawJson.comparison = omitEmptyKeys({
          title: sec.title?.trim() || null,
          tag: sec.tag?.trim() || null,
          description: sec.description?.trim() || null,
        });
      } else if (sec.section_key === "directory") {
        rawJson.directory = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          subheading1: sec.subheading1?.trim() || null,
          subheading2: sec.subheading2?.trim() || null,
          subtext: sec.subtext?.trim() || null,
          items: cleanedItems.length > 0 ? cleanedItems : null,
        });
      } else if (sec.section_key === "stats") {
        if (cleanedItems.length > 0) {
          rawJson.stats = cleanedItems;
        }
      } else if (sec.section_key === "benefits") {
        rawJson.benefits = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          subheading1: sec.subheading1?.trim() || null,
          subheading2: sec.subheading2?.trim() || null,
          subtext: sec.subtext?.trim() || null,
          items: cleanedItems.length > 0 ? cleanedItems : null,

        });
      } else if (sec.section_key === "faq") {
        rawJson.faq = omitEmptyKeys({
          tag: sec.tag?.trim() || null,
          subheading1: sec.subheading1?.trim() || null,
          subheading2: sec.subheading2?.trim() || null,
          subtext: sec.subtext?.trim() || null,
          items: cleanedItems.length > 0 ? cleanedItems : null,
        });
      } else if (sec.section_key === "cta") {
        rawJson.cta = omitEmptyKeys({
          preview: omitEmptyKeys({
            text: sec.ctaPreviewText?.trim() || null,
            url: sec.ctaPreviewUrl?.trim() || null,
          }),
          full: omitEmptyKeys({
            description: sec.ctaFullDescription?.trim() || null,
            text: sec.ctaFullText?.trim() || null,
            url: sec.ctaFullUrl?.trim() || null,
          }),
        });
      }
    });

    return omitEmptyKeys(rawJson);
  }, [managedSections, selectedPage]);

  async function loadPages() {
    setIsLoading(true);
    setErrorText("");
    try {
      const data = await requestJson<DataHubPageModel[]>("/datahub-pages");
      setPages(data);
      if (!selectedPageSlug && data.length > 0) {
        setSelectedPageSlug(data[0].slug);
      }
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to load pages");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadPage(slug: string) {
    setIsLoading(true);
    setErrorText("");
    try {
      const pageData = await requestJson<DataHubPageModel>(`/datahub-pages/${encodeURIComponent(slug)}`);
      setSelectedPage(pageData);

      // Map dynamic database sections to frontend sections
      const apiSections = pageData.sections || [];
      const initialManagedSections = SECTION_KEYS.map((key) => {
        const match = apiSections.find((s) => s.section_key === key);
        const data = (match?.data || {}) as Record<string, any>;
        
        // Map database section items to local layout fields
        const items = (match?.items || []).map((item) => {
          const itemData = (item.data || {}) as Record<string, any>;
          return {
            row_id: `item-${item.id}`,
            id: item.id,
            is_active: item.is_active,
            is_featured: item.is_featured,
            ...itemData,
            tagsText: Array.isArray(itemData.tags) ? itemData.tags.join(", ") : "",
            leftPointsText: Array.isArray(itemData.leftPoints) ? itemData.leftPoints.join("\n") : "",
            rightPointsText: Array.isArray(itemData.rightPoints) ? itemData.rightPoints.join("\n") : "",
          };
        });

        const cta = key === "cta" ? data : {};
        const preview = cta.preview || {};
        const full = cta.full || {};

        return {
          id: match?.id,
          section_key: key,
          label: SECTION_LABELS[key],
          subheading1: data.subheading1 || "",
          subheading2: data.subheading2 || "",
          title: data.title || "",
          title1: data.title1 || "",
          title2: data.title2 || "",
          description: data.description || "",
          subheading: data.subheading || "",
          tag: data.tag || "",
          subtext: data.subtext || "",
          is_featured: match ? Boolean(match.is_visible) : true,
          is_active: match ? Boolean(match.is_visible) : true,
          items,

          // cta
          ctaPreviewText: preview.text || "",
          ctaPreviewUrl: preview.url || "",
          ctaFullDescription: full.description || "",
          ctaFullText: full.text || "",
          ctaFullUrl: full.url || "",
        };
      });

      setManagedSections(initialManagedSections);
      setDeletedItemIds([]);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to load page datahub.");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageSelect = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveTab("publishing_workflow");
  };

  const openCreatePage = () => {
    setPageForm({
      title: "",
      slug: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
      meta_keywords: "",
      hero_tag: "",
      hero_title1: "",
      hero_title2: "",
      hero_description: "",
    });
    setIsEditingPage(false);
    setShowPageModal(true);
  };

  const openEditPage = () => {
    if (!selectedPage) return;
    const heroSec = managedSections.find((s) => s.section_key === "hero");
    setPageForm({
      title: selectedPage.title,
      slug: selectedPage.slug,
      status: selectedPage.status,
      seo_title: selectedPage.seo_title || "",
      seo_description: selectedPage.seo_description || "",
      meta_keywords: selectedPage.meta_keywords || "",
      hero_tag: heroSec?.tag || "",
      hero_title1: heroSec?.title1 || "",
      hero_title2: heroSec?.title2 || "",
      hero_description: heroSec?.description || "",
    });
    setIsEditingPage(true);
    setShowPageModal(true);
  };

  const handleSavePage = async () => {
    if (!canManage) {
      setErrorText("Set admin API token first.");
      return;
    }
    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      let savedSlug = pageForm.slug;
      if (isEditingPage && selectedPage) {
        await requestJson(`/datahub-pages/${encodeURIComponent(selectedPage.slug)}`, {
          method: "PUT",
          body: JSON.stringify({
            title: pageForm.title,
            slug: pageForm.slug,
            status: pageForm.status,
            seo_title: pageForm.seo_title,
            seo_description: pageForm.seo_description,
            meta_keywords: pageForm.meta_keywords,
          }),
        });
        setSuccessText("Page updated successfully.");
      } else {
        const created = await requestJson<DataHubPageModel>("/datahub-pages", {
          method: "POST",
          body: JSON.stringify({
            title: pageForm.title,
            slug: pageForm.slug,
            status: pageForm.status,
            seo_title: pageForm.seo_title,
            seo_description: pageForm.seo_description,
            meta_keywords: pageForm.meta_keywords,
          }),
        });
        savedSlug = created.slug;
        setSuccessText("Page created successfully.");
      }

      // Synchronize Hero details to the "hero" section on the page
      const updatedHeroSectionPayload = {
        section_key: "hero",
        section_type: "hero",
        data: omitEmptyKeys({
          tag: pageForm.hero_tag?.trim() || null,
          title1: pageForm.hero_title1?.trim() || null,
          title2: pageForm.hero_title2?.trim() || null,
          description: pageForm.hero_description?.trim() || null,
        }) || {},
        is_visible: true,
        sort_order: 0,
      };

      const currentHeroSec = managedSections.find((s) => s.section_key === "hero");
      if (currentHeroSec?.id) {
        await requestJson(`/datahub-pages/${encodeURIComponent(savedSlug)}/sections/${currentHeroSec.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedHeroSectionPayload),
        });
      } else {
        await requestJson(`/datahub-pages/${encodeURIComponent(savedSlug)}/sections`, {
          method: "POST",
          body: JSON.stringify(updatedHeroSectionPayload),
        });
      }

      setShowPageModal(false);
      setSelectedPageSlug(savedSlug);
      await loadPages();
      await loadPage(savedSlug);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeletePage = () => {
    if (!selectedPage) return;
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Page",
      message: `Are you sure you want to delete page "${selectedPage.title}"? This will permanently delete the page and all its datahub sections.`,
      onConfirm: async () => {
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
        setIsSaving(true);
        setErrorText("");
        setSuccessText("");
        try {
          await requestJson(`/datahub-pages/${encodeURIComponent(selectedPage.slug)}`, {
            method: "DELETE",
          });
          setSuccessText(`Page "${selectedPage.title}" deleted.`);
          
          const data = await requestJson<DataHubPageModel[]>("/datahub-pages");
          setPages(data);
          if (data.length > 0) {
            setSelectedPageSlug(data[0].slug);
          } else {
            setSelectedPageSlug("");
            setSelectedPage(null);
            setManagedSections([]);
          }
        } catch (err) {
          setErrorText(err instanceof Error ? err.message : "Failed to delete page");
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  const handleClearCache = async () => {
    setIsSaving(true);
    setErrorText("");
    setSuccessText("");
    try {
      await requestJson("/settings/cache/clear", { method: "POST" });
      setSuccessText("Frontend cache cleared successfully. All changes are now live!");
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to clear cache");
    } finally {
      setIsSaving(false);
    }
  };

  // Section Save handler
  async function saveManagedSection(secKey: SectionKey) {
    if (!canManage || !selectedPage) return;
    const secIndex = managedSections.findIndex((s) => s.section_key === secKey);
    if (secIndex === -1) return;
    const sec = managedSections[secIndex];

    setIsSaving(true);
    setErrorText("");
    setSuccessText("");

    try {
      const dataPayload: Record<string, any> = {};

      if (sec.section_key === "hero") {
        dataPayload.tag = sec.tag?.trim() || null;
        dataPayload.title1 = sec.title1?.trim() || null;
        dataPayload.title2 = sec.title2?.trim() || null;
        dataPayload.description = sec.description?.trim() || null;
      } else if (sec.section_key === "header") {
        dataPayload.tag = sec.tag?.trim() || null;
        dataPayload.subheading1 = sec.subheading1?.trim() || null;
        dataPayload.subheading2 = sec.subheading2?.trim() || null;
        dataPayload.subtext = sec.subtext?.trim() || null;
      } else if (sec.section_key === "featured" || sec.section_key === "directory" || sec.section_key === "benefits" ) {
        dataPayload.tag = sec.tag?.trim() || null;
        dataPayload.subheading1 = sec.subheading1?.trim() || null;
        dataPayload.subheading2 = sec.subheading2?.trim() || null;
        dataPayload.subtext = sec.subtext?.trim() || null;
      } else if (sec.section_key === "comparison") {
        dataPayload.title = sec.title?.trim() || null;
        dataPayload.tag = sec.tag?.trim() || null;
        dataPayload.description = sec.description?.trim() || null;
      } else if (sec.section_key === "faq") {
        dataPayload.tag = sec.tag?.trim() || null;
        dataPayload.subheading1 = sec.subheading1?.trim() || null;
        dataPayload.subheading2 = sec.subheading2?.trim() || null;
        dataPayload.subtext = sec.subtext?.trim() || null;
      } else if (sec.section_key === "cta") {
        dataPayload.preview = omitEmptyKeys({
          text: sec.ctaPreviewText?.trim() || null,
          url: sec.ctaPreviewUrl?.trim() || null,
        });
        dataPayload.full = omitEmptyKeys({
          description: sec.ctaFullDescription?.trim() || null,
          text: sec.ctaFullText?.trim() || null,
          url: sec.ctaFullUrl?.trim() || null,
        });
      }

      const sectionPayload = {
        section_key: sec.section_key,
        section_type: ["hero", "header", "cta"].includes(sec.section_key) ? sec.section_key : "items",
        data: omitEmptyKeys(dataPayload) || {},
        is_visible: sec.is_active,
        sort_order: 0,
      };

      let sectionId = sec.id;
      if (sectionId) {
        await requestJson(`/datahub-pages/${encodeURIComponent(selectedPage.slug)}/sections/${sectionId}`, {
          method: "PUT",
          body: JSON.stringify(sectionPayload),
        });
      } else {
        const createdSection = await requestJson<{ section: DataHubSectionModel }>(`/datahub-pages/${encodeURIComponent(selectedPage.slug)}/sections`, {
          method: "POST",
          body: JSON.stringify(sectionPayload),
        });
        sectionId = createdSection.section.id;
        setManagedSections((current) => current.map((s) => s.section_key === secKey ? { ...s, id: sectionId } : s));
      }

      // Save list items
      const savePromises = sec.items.map(async (item) => {
        const itemData: Record<string, any> = {};

        if (sec.section_key === "featured" || sec.section_key === "directory" || sec.section_key === "benefits") {
          itemData.icon = item.icon?.trim() || null;
          itemData.title = item.title?.trim() || null;
          itemData.description = item.description?.trim() || null;
          itemData.badge = item.badge?.trim() || null;
          itemData.href = item.href?.trim() || null;
          itemData.tags = item.tagsText ? item.tagsText.split(",").map((s) => s.trim()).filter(Boolean) : null;
        } else if (sec.section_key === "stats") {
          itemData.icon = item.icon?.trim() || null;
          itemData.title = item.title?.trim() || null;
          itemData.value = item.value?.trim() || null;
        } else if (sec.section_key === "comparison") {
          itemData.leftHeading = item.leftHeading?.trim() || null;
          itemData.rightHeading = item.rightHeading?.trim() || null;
          itemData.leftPoints = item.leftPointsText ? item.leftPointsText.split("\n").map((s) => s.trim()).filter(Boolean) : null;
          itemData.rightPoints = item.rightPointsText ? item.rightPointsText.split("\n").map((s) => s.trim()).filter(Boolean) : null;
        } else if (sec.section_key === "faq") {
          itemData.question = item.question?.trim() || null;
          itemData.answer = item.answer?.trim() || null;
        } else {
          itemData.title = item.title?.trim() || null;
          itemData.description = item.description?.trim() || null;
        }

        const itemPayload = {
          data: omitEmptyKeys(itemData) || {},
          sort_order: 0,
          is_featured: item.is_featured,
          is_active: item.is_active,
        };

        if (item.id && item.id > 0) {
          await requestJson(`/datahub-sections/${sectionId}/items/${item.id}`, {
            method: "PUT",
            body: JSON.stringify(itemPayload),
          });
        } else {
          await requestJson(`/datahub-sections/${sectionId}/items`, {
            method: "POST",
            body: JSON.stringify(itemPayload),
          });
        }
      });

      // Handle deleted items
      const deletedPromises = deletedItemIds.map(async (id) => {
        if (id > 0) {
          await requestJson(`/datahub-sections/${sectionId}/items/${id}`, {
            method: "DELETE",
          });
        }
      });

      await Promise.all([...savePromises, ...deletedPromises]);
      setDeletedItemIds([]);

      setSuccessText(`Section "${sec.label}" saved successfully.`);
      await loadPage(selectedPage.slug);
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : "Failed to save section data.");
    } finally {
      setIsSaving(false);
    }
  }

  // Clear Active Section Controls
  function clearActiveSection() {
    if (activeTab === "publishing_workflow") return;
    
    const activeSectionIndex = managedSections.findIndex((s) => s.section_key === activeTab);
    if (activeSectionIndex === -1) return;
    
    const sec = managedSections[activeSectionIndex];
    const itemIds = sec.items.map((item) => item.id).filter((id): id is number => !!id && id > 0);
    setDeletedItemIds((prev) => [...prev, ...itemIds]);

    setManagedSections((current) =>
      current.map((s, idx) => {
        if (idx === activeSectionIndex) {
          return {
            ...s,
            title: "",
            subheading1: "",
            subheading2: "",
            title1: "",
            title2: "",
            description: "",
            tag: "",
            subtext: "",
            ctaPreviewText: "",
            ctaPreviewUrl: "",
            ctaFullDescription: "",
            ctaFullText: "",
            ctaFullUrl: "",
            items: [],
          };
        }
        return s;
      })
    );
    setSuccessText(`Active section "${sec.label}" inputs cleared.`);
  }

  function updateSectionHeader(field: keyof Omit<EditableManagedSection, "items" | "id" | "section_key" | "label">, value: any) {
    const activeSectionIndex = managedSections.findIndex((s) => s.section_key === activeTab);
    if (activeSectionIndex === -1) return;

    setManagedSections((current) =>
      current.map((s, idx) => {
        if (idx === activeSectionIndex) {
          return {
            ...s,
            [field]: value,
          };
        }
        return s;
      })
    );
  }

  function addManagedSectionItem() {
    const activeSectionIndex = managedSections.findIndex((s) => s.section_key === activeTab);
    if (activeSectionIndex === -1) return;

    const newItem: EditableSectionItem = {
      row_id: `temp-${Date.now()}`,
      is_active: true,
      is_featured: false,
    };

    setManagedSections((current) =>
      current.map((s, idx) => {
        if (idx === activeSectionIndex) {
          return {
            ...s,
            items: [...s.items, newItem],
          };
        }
        return s;
      })
    );
  }

  function updateManagedSectionItem(itemIndex: number, field: keyof EditableSectionItem, value: any) {
    const activeSectionIndex = managedSections.findIndex((s) => s.section_key === activeTab);
    if (activeSectionIndex === -1) return;

    setManagedSections((current) =>
      current.map((s, idx) => {
        if (idx === activeSectionIndex) {
          const nextItems = s.items.map((item, i) => {
            if (i === itemIndex) {
              return {
                ...item,
                [field]: value,
              };
            }
            return item;
          });
          return {
            ...s,
            items: nextItems,
          };
        }
        return s;
      })
    );
  }

  function removeManagedSectionItem(sectionIndex: number, itemIndex: number) {
    const item = managedSections[sectionIndex].items[itemIndex];
    if (item.id && item.id > 0) {
      setDeletedItemIds((prev) => [...prev, item.id]);
    }
    setManagedSections((current) =>
      current.map((s, idx) => {
        if (idx === sectionIndex) {
          return {
            ...s,
            items: s.items.filter((_, i) => i !== itemIndex),
          };
        }
        return s;
      })
    );
  }

  useEffect(() => {
    void loadPages();
  }, []);

  useEffect(() => {
    if (selectedPageSlug) {
      void loadPage(selectedPageSlug);
    }
  }, [selectedPageSlug]);

  useEffect(() => {
    async function syncAdminAuth() {
      const resolved = getStoredToken();
      setAdminToken(resolved);

      try {
        await fetchAuthenticatedUser(resolved || undefined);
        setHasSessionAuth(true);
      } catch {
        setHasSessionAuth(false);
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (!event.key || TOKEN_KEYS.includes(event.key as (typeof TOKEN_KEYS)[number])) {
        void syncAdminAuth();
      }
    }

    function handleWindowFocus() {
      void syncAdminAuth();
    }

    void syncAdminAuth();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  function setToken() {
    const value = window.prompt("Paste admin API token")?.trim() ?? "";
    if (!value) {
      return;
    }
    setStoredToken(value);
    setAdminToken(value);
    setHasSessionAuth(true);
  }

  function clearToken() {
    clearStoredAuth();
    setAdminToken("");
    setHasSessionAuth(false);
    setErrorText("");
    setSuccessText("");
  }

  const sectionTabs = useMemo(() => {
    return [
      { value: "publishing_workflow", label: "Publishing Workflow" },
      ...SECTION_KEYS.map((key) => ({ value: key, label: SECTION_LABELS[key] })),
    ];
  }, []);

  const isPublishingWorkflowActive = activeTab === "publishing_workflow";
  const activeManagedSectionIndex = managedSections.findIndex((s) => s.section_key === activeTab);
  const activeManagedSection = activeManagedSectionIndex !== -1 ? managedSections[activeManagedSectionIndex] : null;

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        onConfirm={deleteConfirm.onConfirm}
        onCancel={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-md">
        <div>
          <h1 className="text-title text-text-primary">DataHub Pages</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Manage your website pages and sections datahub dynamically.</p>
        </div>
        <div className="flex items-center gap-md">
          <CustomButton variant="primary" iconStart={<RefreshCw size={16} />} onClick={loadPages}>
            Refresh
          </CustomButton>
          {!hasToken ? (
            <CustomButton variant="primary" onClick={setToken}>
              Set Admin Token
            </CustomButton>
          ) : (
            <CustomButton variant="primary" onClick={clearToken}>
              Clear Token
            </CustomButton>
          )}
        </div>
      </div>
      
      {/* Page Pills */}
      <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-wrap gap-sm">
        {pages.map((page) => (
          <Pill
            key={page.id}
            label={page.title}
            active={selectedPageSlug === page.slug}
            onClick={() => handlePageSelect(page.slug)}
          />
        ))}
      </div>

      {/* Active Page Card */}
      {selectedPage && (
        <div className="bg-surface-bg rounded-corner-lg p-xl flex items-center justify-between flex-wrap gap-md">
          <div>
            <p className="text-label text-text-primary">{selectedPage.title}</p>
            <p className="text-video-title text-text-tertiary">{selectedPage.slug}</p>
          </div>
          <div className="flex items-center gap-md">
            <Badge label={selectedPage.status} variant={selectedPage.status === "published" ? "success" : "default"} />
            <CustomButton variant="danger" iconStart={<Trash2 size={16} />} onClick={triggerDeletePage} disabled={!canManage}>
              Delete Page
            </CustomButton>
            <CustomButton variant="primary" iconStart={<Pencil size={16} />} onClick={openEditPage} disabled={!canManage}>
              Edit Page
            </CustomButton>
            <CustomButton variant="primary" iconStart={<Plus size={16} />} onClick={openCreatePage}>
              Add Page
            </CustomButton>
          </div>
        </div>
      )}

      {/* Alerts */}
      {errorText && (
        <div className="bg-danger/10 border border-danger/20 rounded-corner-lg p-lg text-label-sm text-danger">
          {errorText}
        </div>
      )}
      {successText && (
        <div className="bg-success/10 border border-success/20 rounded-corner-lg p-lg flex items-center gap-sm text-label-sm text-success">
          <CheckCircle2 size={16} />
          {successText}
        </div>
      )}

      {/* Tabs */}
      {selectedPage && (
        <>
          <div className="bg-surface-bg rounded-corner-lg p-md border border-border-primary">
            <Tabs
              options={sectionTabs}
              activeTab={activeTab}
              onChange={(value) => setActiveTab(value)}
            />
          </div>

          {/* Tab Panels */}
          {isPublishingWorkflowActive ? (
            <div className="flex flex-col gap-xl">
              <h2 className="text-label text-text-primary">Publishing Workflow</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Save Draft & Publish */}
                <div className="flex flex-col gap-lg">
                  <Card title="Page Publish Control">
                    <p className="text-label-sm text-text-secondary mb-md">
                      Clear the frontend cache to publish all saved datahub changes live.
                    </p>
                    <div className="flex gap-md">
                      <CustomButton
                        variant="primary"
                        iconStart={<Globe size={16} />}
                        onClick={handleClearCache}
                        disabled={isSaving || !canManage}
                      >
                        Publish Changes (Clear Cache)
                      </CustomButton>
                    </div>
                  </Card>
                </div>

                {/* JSON Preview */}
                <div className="flex flex-col gap-lg">
                  <Card title="JSON Preview Compilation">
                    <p className="text-label-sm text-text-secondary mb-sm">
                      Real-time compiled schema output.
                    </p>
                    <pre className="bg-bg-faint border border-border-primary rounded-corner-md p-md text-[11px] font-mono overflow-auto max-h-[300px] text-text-primary whitespace-pre-wrap">
                      {JSON.stringify(previewJson, null, 2)}
                    </pre>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Active Section Panel */
            activeManagedSection && (
              <div className="flex flex-col gap-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-label text-text-primary">{activeManagedSection.label}</h3>
                  <div className="flex items-center gap-sm">
                    <CustomButton
                      variant="primary"
                      size="small"
                      onClick={clearActiveSection}
                    >
                      Clear All
                    </CustomButton>
                    <CustomButton
                      variant="primary"
                      size="small"
                      iconStart={<Save size={16} />}
                      onClick={() => saveManagedSection(activeManagedSection.section_key)}
                      disabled={isSaving || !canManage}
                    >
                      Save Section
                    </CustomButton>
                  </div>
                </div>

                <Card>
                  {/* Section is_active toggle */}
                  <div className="flex items-center gap-sm pb-md border-b border-border-secondary mb-lg">
                    <label className="flex items-center gap-sm text-label-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={activeManagedSection.is_active}
                        onChange={(e) => updateSectionHeader("is_active", e.target.checked)}
                      />
                      Section Active (Visible in public output)
                    </label>
                  </div>

                  {/* Dynamic inputs based on activeTab */}
                  {activeTab === "hero" ? (
                    <div className="flex flex-col gap-lg mb-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <InputField
                          label="Hero Tag"
                          placeholder="e.g. WHO WE ARE"
                          value={activeManagedSection.tag}
                          onChange={(value) => updateSectionHeader("tag", value)}
                        />
                        <InputField
                          label="Hero Title Part 1"
                          placeholder="e.g. We Build Things"
                          value={activeManagedSection.title1}
                          onChange={(value) => updateSectionHeader("title1", value)}
                        />
                        <InputField
                          label="Hero Title Part 2"
                          placeholder="e.g. That Scale"
                          value={activeManagedSection.title2}
                          onChange={(value) => updateSectionHeader("title2", value)}
                        />
                      </div>
                      <div className="w-full">
                        <TextareaField
                          label="Hero Description"
                          placeholder="Explain the page focus..."
                          value={activeManagedSection.description}
                          rows={3}
                          onChange={(value) => updateSectionHeader("description", value)}
                        />
                      </div>
                    </div>
                  ) : activeTab === "header" ? (
                    <div className="flex flex-col gap-lg mb-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <InputField
                          label="Section Tag"
                          placeholder="e.g. FEATURES"
                          value={activeManagedSection.tag}
                          onChange={(value) => updateSectionHeader("tag", value)}
                        />
                        <InputField
                          label="Heading / Subheading 1"
                          placeholder="e.g. What We Offer"
                          value={activeManagedSection.subheading1}
                          onChange={(value) => updateSectionHeader("subheading1", value)}
                        />
                        <InputField
                          label="Subheading / Subheading 2"
                          placeholder="e.g. Tailored Services"
                          value={activeManagedSection.subheading2}
                          onChange={(value) => updateSectionHeader("subheading2", value)}
                        />
                      </div>
                      <div className="w-full">
                        <TextareaField
                          label="Subtext / Description"
                          placeholder="Explain this section..."
                          value={activeManagedSection.subtext}
                          rows={3}
                          onChange={(value) => updateSectionHeader("subtext", value)}
                        />
                      </div>
                    </div>
                  ) : activeTab === "featured" || activeTab === "directory" || activeTab === "benefits" ? (
                    <div className="flex flex-col gap-lg mb-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <InputField
                          label="Section Tag"
                          placeholder="e.g. WHY US"
                          value={activeManagedSection.tag}
                          onChange={(value) => updateSectionHeader("tag", value)}
                        />
                        <InputField
                          label="Subheading 1"
                          placeholder="e.g. Why Choose Us"
                          value={activeManagedSection.subheading1}
                          onChange={(value) => updateSectionHeader("subheading1", value)}
                        />
                        <InputField
                          label="Subheading 2"
                          placeholder="e.g. The Best Choice"
                          value={activeManagedSection.subheading2}
                          onChange={(value) => updateSectionHeader("subheading2", value)}
                        />
                      </div>
                      <div className="w-full">
                        <TextareaField
                          label="Subtext"
                          placeholder="Explain this section..."
                          value={activeManagedSection.subtext}
                          rows={3}
                          onChange={(value) => updateSectionHeader("subtext", value)}
                        />
                      </div>
                    </div>
                  ) : activeTab === "comparison" ? (
                    <div className="border-t border-border-secondary pt-md mt-md flex flex-col gap-lg bg-bg-faint p-lg rounded-corner-lg border border-border-primary">
                      <p className="font-semibold text-label-sm text-text-primary">Comparison Table details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <InputField
                          label="Title"
                          placeholder="ChatGPT vs Claude"
                          value={activeManagedSection.title || ""}
                          onChange={(value) => updateSectionHeader("title", value)}
                        />
                        <InputField
                          label="Short Description"
                          placeholder="ChatGPT is a language model that uses machine learning to generate human-like text..."
                          value={activeManagedSection.description || ""}
                          onChange={(value) => updateSectionHeader("description", value)}
                        />
                        <InputField
                          label="Tag"
                          placeholder="Artificial Intelligence"
                          value={activeManagedSection.tag || ""}
                          onChange={(value) => updateSectionHeader("tag", value)}
                        />
                      </div>
                    </div>
                  ) : activeTab === "faq" ? (
                    <div className="flex flex-col gap-lg mb-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <InputField
                          label="Section Tag"
                          placeholder="e.g. FAQ"
                          value={activeManagedSection.tag}
                          onChange={(value) => updateSectionHeader("tag", value)}
                        />
                        <InputField
                          label="Heading / Subheading 1"
                          placeholder="e.g. FAQ"
                          value={activeManagedSection.subheading1}
                          onChange={(value) => updateSectionHeader("subheading1", value)}
                        />
                        <InputField
                          label="Subheading / Subheading 2"
                          placeholder="e.g. General Questions"
                          value={activeManagedSection.subheading2}
                          onChange={(value) => updateSectionHeader("subheading2", value)}
                        />
                      </div>
                      <div className="w-full">
                        <TextareaField
                          label="Subtext / Description"
                          placeholder="Explain this section..."
                          value={activeManagedSection.subtext}
                          rows={3}
                          onChange={(value) => updateSectionHeader("subtext", value)}
                        />
                      </div>
                    </div>
                  ) : activeTab === "cta" ? (
                    <div className="flex flex-col gap-lg mb-lg border border-border-primary rounded-corner-lg p-lg bg-bg-faint">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg border-t border-border-secondary pt-md">
                        <div>
                          <p className="font-semibold text-label-sm mb-md text-text-primary">Preview CTA Link</p>
                          <div className="grid gap-md">
                            <InputField
                              label="Button Text"
                              placeholder="Explore Services"
                              value={activeManagedSection.ctaPreviewText || ""}
                              onChange={(value) => updateSectionHeader("ctaPreviewText", value)}
                            />
                            <InputField
                              label="Button URL"
                              placeholder="/services"
                              value={activeManagedSection.ctaPreviewUrl || ""}
                              onChange={(value) => updateSectionHeader("ctaPreviewUrl", value)}
                            />
                          </div>
                        </div>

                        <div>
                          <p className="font-semibold text-label-sm mb-md text-text-primary">Full CTA Link</p>
                          <div className="grid gap-md">
                            <InputField
                              label="CTA Description"
                              placeholder="Liked this? Tell us more..."
                              value={activeManagedSection.ctaFullDescription || ""}
                              onChange={(value) => updateSectionHeader("ctaFullDescription", value)}
                            />
                            <InputField
                              label="Button Text"
                              placeholder="Or Talk to Our Team"
                              value={activeManagedSection.ctaFullText || ""}
                              onChange={(value) => updateSectionHeader("ctaFullText", value)}
                            />
                            <InputField
                              label="Button URL"
                              placeholder="#get-started"
                              value={activeManagedSection.ctaFullUrl || ""}
                              onChange={(value) => updateSectionHeader("ctaFullUrl", value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Section Items */}
                  {!["hero", "header", "featured", "cta"].includes(activeTab) && (
                    <div className="border-t border-border-secondary pt-lg flex flex-col gap-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-label-sm font-semibold text-text-primary">Card Items</p>
                        <CustomButton
                          variant="primary"
                          size="small"
                          iconStart={<Plus size={16} />}
                          onClick={addManagedSectionItem}
                        >
                          Add Card Item
                        </CustomButton>
                      </div>

                      <div className="flex flex-col gap-lg">
                        {activeManagedSection.items.length === 0 && (
                          <p className="text-label-sm text-text-secondary">No items in this section.</p>
                        )}
                        {activeManagedSection.items.map((item, itemIndex) => (
                          <div
                            key={item.row_id}
                            className="bg-bg-faint rounded-corner-lg p-lg border border-border-primary flex flex-col gap-md"
                          >
                            <div className="flex justify-between items-center pb-sm border-b border-border-secondary">
                              <span className="text-label-xs font-semibold text-text-primary">Item #{itemIndex + 1}</span>
                              <div className="flex items-center gap-md">
                                <label className="flex items-center gap-sm text-label-xs text-text-secondary">
                                  <input
                                    type="checkbox"
                                    checked={item.is_active}
                                    onChange={(e) => updateManagedSectionItem(itemIndex, "is_active", e.target.checked)}
                                  />
                                  Active
                                </label>
                                <label className="flex items-center gap-sm text-label-xs text-text-secondary">
                                  <input
                                    type="checkbox"
                                    checked={item.is_featured}
                                    onChange={(e) => updateManagedSectionItem(itemIndex, "is_featured", e.target.checked)}
                                  />
                                  Featured
                                </label>
                              </div>
                            </div>

                            {/* Standard Fields layout for Card Items based on sections.ts props */}
                            {activeManagedSection.section_key === "faq" ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                <TextareaField
                                  label="Question"
                                  placeholder="e.g. What is the process?"
                                  value={item.question || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "question", v)}
                                />
                                <TextareaField
                                  label="Answer"
                                  placeholder="e.g. The process is..."
                                  value={item.answer || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "answer", v)}
                                />
                              </div>
                            ) : activeManagedSection.section_key === "featured" || activeManagedSection.section_key === "directory" || activeManagedSection.section_key === "benefits" ? (
                              <div className="flex flex-col gap-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                                  <InputField
                                    label="Icon Name"
                                    placeholder="Users, Clock, Rocket"
                                    value={item.icon || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "icon", v)}
                                  />
                                  <InputField
                                    label="Title"
                                    placeholder="Clear Communication"
                                    value={item.title || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "title", v)}
                                  />
                                  <InputField
                                    label="URL link"
                                    placeholder="/about"
                                    value={item.href || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "href", v)}
                                  />
                                  <InputField
                                    label="Tags (comma separated)"
                                    placeholder="E-Commerce, WordPress"
                                    value={item.tagsText || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "tagsText", v)}
                                  />
                                  <InputField
                                    label="Badge"
                                    placeholder="featured / premium"
                                    value={item.badge || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "badge", v)}
                                  />
                                </div>
                                <TextareaField
                                  label="Description"
                                  placeholder="Enter description..."
                                  value={item.description || ""}
                                  rows={2}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "description", v)}
                                />
                              </div>
                            ) : activeManagedSection.section_key === "stats" ? (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
                                <InputField
                                  label="Stat Value"
                                  placeholder="e.g. 50+ or 98%"
                                  value={item.value || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "value", v)}
                                />
                                <InputField
                                  label="Stat Title"
                                  placeholder="Projects Completed"
                                  value={item.title || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "title", v)}
                                />
                                <InputField
                                  label="Icon Name"
                                  placeholder="Star, Target"
                                  value={item.icon || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "icon", v)}
                                />
                                <InputField
                                  label="URL link"
                                  placeholder="/about"
                                  value={item.href || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "href", v)}
                                />
                              </div>
                            ) : activeManagedSection.section_key === "comparison" ? (
                              <div className="flex flex-col gap-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                                  <InputField
                                    label="leftHeading"
                                    placeholder="Other Approach"
                                    value={item.leftHeading || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "leftHeading", v)}
                                  />
                                  <InputField
                                    label="rightHeading"
                                    placeholder="The WebNDevs Way"
                                    value={item.rightHeading || ""}
                                    onChange={(v) => updateManagedSectionItem(itemIndex, "rightHeading", v)}
                                  />
                                </div>
                                <TextareaField
                                  label="Left Points (one per line)"
                                  placeholder="Point 1&#10;Point 2"
                                  value={item.leftPointsText || ""}
                                  rows={4}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "leftPointsText", v)}
                                />
                                <TextareaField
                                  label="Right Points (one per line)"
                                  placeholder="Point 1&#10;Point 2"
                                  value={item.rightPointsText || ""}
                                  rows={4}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "rightPointsText", v)}
                                />
                              </div>
                            ) : (
                              /* Default Generic Card layout */
                              <div className="flex flex-col gap-lg">
                                <InputField
                                  label="Item Title"
                                  placeholder="Card Title"
                                  value={item.title || ""}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "title", v)}
                                />
                                <TextareaField
                                  label="Item Description"
                                  placeholder="Card Description"
                                  value={item.description || ""}
                                  rows={3}
                                  onChange={(v) => updateManagedSectionItem(itemIndex, "description", v)}
                                />
                              </div>
                            )}

                            <div className="flex justify-end pt-md border-t border-border-secondary mt-sm">
                              <CustomButton
                                variant="danger"
                                size="small"
                                iconStart={<Trash2 size={16} />}
                                onClick={() => removeManagedSectionItem(activeManagedSectionIndex, itemIndex)}
                              >
                                Remove Card Item
                              </CustomButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )
          )}
        </>
      )}

      {/* Create / Edit Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
          <div className="bg-surface-bg border border-border-primary rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-xl">
            <div className="border-b border-border-secondary pb-md flex justify-between items-center">
              <div>
                <h3 className="text-label font-bold text-text-primary">
                  {isEditingPage ? "Edit Page Details" : "Create New Page"}
                </h3>
                <p className="text-label-sm text-text-secondary mt-1">
                  Define the page URL (slug), name, SEO configurations, and hero info.
                </p>
              </div>
              <button
                className="text-text-secondary hover:text-text-primary text-xl font-bold p-xs cursor-pointer animate-fade-in"
                onClick={() => setShowPageModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col gap-lg overflow-y-auto max-h-[50vh] pr-sm">
              <h4 className="text-label-sm font-semibold text-text-primary">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <InputField
                  label="Page Name / Title"
                  placeholder="e.g. About Us"
                  value={pageForm.title}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, title: v }))}
                />
                <InputField
                  label="Page URL / Slug"
                  placeholder="e.g. /about or /"
                  value={pageForm.slug}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, slug: v }))}
                />
              </div>

              <div>
                <label className="mb-xs block text-label-sm font-medium text-text-secondary">Status</label>
                <select
                  className="w-full rounded-lg border border-border-primary bg-bg-faint px-md py-sm text-text-primary select-none"
                  value={pageForm.status}
                  onChange={(e) => setPageForm((prev) => ({ ...prev, status: e.target.value as PageStatus }))}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <h4 className="text-label-sm font-semibold text-text-primary pt-md border-t border-border-secondary">
                SEO Metadata
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <InputField
                  label="SEO Title"
                  placeholder="SEO Search Engine Title"
                  value={pageForm.seo_title}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, seo_title: v }))}
                />
                <InputField
                  label="Meta Keywords"
                  placeholder="keywords, comma separated"
                  value={pageForm.meta_keywords}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, meta_keywords: v }))}
                />
              </div>
              <TextareaField
                label="SEO Description"
                placeholder="Brief SEO meta description..."
                value={pageForm.seo_description}
                rows={2}
                onChange={(v) => setPageForm((prev) => ({ ...prev, seo_description: v }))}
              />

              <h4 className="text-label-sm font-semibold text-text-primary pt-md border-t border-border-secondary">
                Initial Hero Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <InputField
                  label="Hero Tag"
                  placeholder="e.g. WHO WE ARE"
                  value={pageForm.hero_tag}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, hero_tag: v }))}
                />
                <InputField
                  label="Title 1"
                  placeholder="e.g. We Build Things"
                  value={pageForm.hero_title1}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, hero_title1: v }))}
                />
                <InputField
                  label="Title 2"
                  placeholder="e.g. That Scale"
                  value={pageForm.hero_title2}
                  onChange={(v) => setPageForm((prev) => ({ ...prev, hero_title2: v }))}
                />
              </div>
              <TextareaField
                label="Hero Description"
                placeholder="Explain the page focus..."
                value={pageForm.hero_description}
                rows={2}
                onChange={(v) => setPageForm((prev) => ({ ...prev, hero_description: v }))}
              />
            </div>

            <div className="flex items-center justify-end gap-md pt-lg border-t border-border-secondary">
              <CustomButton variant="primary" onClick={() => setShowPageModal(false)}>
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleSavePage}
                disabled={!pageForm.title.trim() || !pageForm.slug.trim() || isSaving || !canManage}
              >
                {isSaving ? "Saving..." : isEditingPage ? "Save Changes" : "Create Page"}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataHubModule;
