import { useState, useEffect } from "react";
import {
  Button,
  Badge,
  InputField,
  TextareaField,
  SelectField,
  Modal,
  Tabs,
} from "@figma/astraui";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Link2,
  GripVertical,
  Sparkles,
  Eye,
  Send,
  FileText,
  AlertCircle,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { FloatingAiButton } from "../components/ai";

type EntityType = "tool" | "industry";

type EntityOption = { type: EntityType; id: number; slug: string; name: string };

type CrossRefSection = {
  id?: number;
  section_key: string;
  title: string;
  content: string;
  sort_order: number;
};

type CrossRefPage = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  entity_a: { type: string; id: number; name?: string; slug?: string };
  entity_b: { type: string; id: number; name?: string; slug?: string };
  sections: CrossRefSection[];
};

const API_MODEL_MAP: Record<EntityType, string> = {
  tool: "App\\Models\\Tool",
  industry: "App\\Models\\Industry",
};

const defaultSections: CrossRefSection[] = [
  { section_key: "overview", title: "Overview", content: "", sort_order: 1 },
  { section_key: "use_cases", title: "Use Cases", content: "", sort_order: 2 },
  { section_key: "integration_guide", title: "Integration Guide", content: "", sort_order: 3 },
  { section_key: "faq", title: "Frequently Asked Questions", content: "", sort_order: 4 },
  { section_key: "benefits", title: "Key Benefits", content: "", sort_order: 5 },
];

const statusColors: Record<CrossRefPage["status"], "success" | "warning" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

type FormData = {
  entity_a_type: EntityType;
  entity_a_id: string;
  entity_b_type: EntityType;
  entity_b_id: string;
  title: string;
  slug: string;
  status: CrossRefPage["status"];
  published_at: string;
  sections: CrossRefSection[];
};

const emptyForm: FormData = {
  entity_a_type: "tool",
  entity_a_id: "",
  entity_b_type: "industry",
  entity_b_id: "",
  title: "",
  slug: "",
  status: "draft",
  published_at: "",
  sections: defaultSections.map((s) => ({ ...s })),
};

const entityTypeOptions: { value: EntityType; label: string }[] = [
  { value: "tool", label: "Tool" },
  { value: "industry", label: "Industry" },
];

function buildSlug(aSlug: string, bSlug: string) {
  return `${aSlug}-${bSlug}`;
}

function buildTitle(aName: string, bName: string) {
  return `${aName} for ${bName} — Integration Guide`;
}

function normalizeList<T>(response: T[] | Paginated<T> | undefined | null): T[] {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray((response as Paginated<T>).data)) return (response as Paginated<T>).data;
  return [];
}

function SectionEditor({ sections, onChange }: {
  sections: CrossRefSection[];
  onChange: (sections: CrossRefSection[]) => void;
}) {
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const updateSection = (key: string, field: keyof CrossRefSection, value: string) => {
    onChange(sections.map((s) => s.section_key === key ? { ...s, [field]: value } : s));
  };

  const generateSection = (key: string, title: string) => {
    setGeneratingKey(key);
    setTimeout(() => {
      const mockContent = `This section covers ${title.toLowerCase()}. AI-generated content will appear here based on the selected entities and context. The content is SEO-optimized and structured for AI search engine visibility.`;
      updateSection(key, "content", mockContent);
      setGeneratingKey(null);
    }, 1500);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newSections = [...sections];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= newSections.length) return;
    [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
    onChange(newSections.map((s, i) => ({ ...s, sort_order: i + 1 })));
  };

  return (
    <div className="flex flex-col gap-md">
      <p className="text-label text-text-primary font-semibold">Page Sections</p>
      {sections.map((section, idx) => (
        <div key={section.section_key} className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
          <div className="flex items-center gap-sm mb-md">
            <div className="flex flex-col gap-xs">
              <GripVertical size={14} className="text-text-tertiary" />
            </div>
            <div className="flex-1">
              <InputField
                placeholder="Section title"
                value={section.title}
                onChange={(v) => updateSection(section.section_key, "title", v)}
              />
            </div>
            <FloatingAiButton 
              onGenerate={() => generateSection(section.section_key, section.title)}
              isLoading={generatingKey === section.section_key}
            />
            <Button
              variant="subtle"
              size="small"
              iconStart={<Sparkles size={14} />}
              onClick={() => generateSection(section.section_key, section.title)}
              disabled={generatingKey !== null}
            >
              {generatingKey === section.section_key ? "Writing..." : "AI Generate"}
            </Button>
            <Button variant="subtle" size="small" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}>↓</Button>
            <Button variant="subtle" size="small" onClick={() => moveSection(idx, -1)} disabled={idx === 0}>↑</Button>
          </div>
          <TextareaField
            placeholder="Section content..."
            value={section.content}
            rows={4}
            onChange={(v) => updateSection(section.section_key, "content", v)}
          />
        </div>
      ))}
    </div>
  );
}

function entityDisplayName(entity: CrossRefPage["entity_a"]): string {
  return entity.name ?? entity.slug ?? `${entity.type} #${entity.id}`;
}

function CrossRefRow({ page, onEdit, onDelete }: {
  page: CrossRefPage;
  onEdit: (p: CrossRefPage) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors">
      <div className="flex items-center gap-xl">
        <div className="flex items-center gap-sm flex-shrink-0">
          <span className="bg-blue-100 text-blue-700 text-video-title px-lg py-xs rounded-corner-md border border-blue-200">
            {entityDisplayName(page.entity_a)}
          </span>
          <Link2 size={16} className="text-text-tertiary" />
          <span className="bg-purple-100 text-purple-700 text-video-title px-lg py-xs rounded-corner-md border border-purple-200">
            {entityDisplayName(page.entity_b)}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-label text-text-primary font-semibold">{page.title}</p>
          <p className="text-video-title text-text-tertiary mt-xs">/{page.slug}</p>
          <div className="flex items-center gap-md mt-sm">
            <Badge label={page.status} variant={statusColors[page.status]} />
            <span className="text-video-title text-text-tertiary">{page.sections.length} sections</span>
            {page.published_at && (
              <span className="text-video-title text-text-tertiary">
                Published: {new Date(page.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-sm flex-shrink-0">
          <Button variant="subtle" size="small" iconStart={<Eye size={14} />}>Preview</Button>
          <Button variant="subtle" size="small" iconStart={<Pencil size={14} />} onClick={() => onEdit(page)}>Edit</Button>
          <Button variant="subtle" size="small" iconStart={<Trash2 size={14} />} onClick={() => onDelete(page.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function CrossReferenceModule() {
  const [pages, setPages] = useState<CrossRefPage[]>([]);
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CrossRefPage | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isLoadingEntities, setIsLoadingEntities] = useState(true);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [entitiesError, setEntitiesError] = useState<string | null>(null);
  const [pagesError, setPagesError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingEntities(true);
    Promise.all([
      api.get<Paginated<{ id: number; name: string; slug: string }>>("/tools?per_page=200"),
      api.get<Paginated<{ id: number; name: string; slug: string }>>("/industries?per_page=200"),
    ])
      .then(([toolsResp, industriesResp]) => {
        const tools = normalizeList(toolsResp).map<EntityOption>((t) => ({
          type: "tool",
          id: t.id,
          slug: t.slug,
          name: t.name,
        }));
        const industries = normalizeList(industriesResp).map<EntityOption>((i) => ({
          type: "industry",
          id: i.id,
          slug: i.slug,
          name: i.name,
        }));
        setEntityOptions([...tools, ...industries]);
        setEntitiesError(null);
      })
      .catch((err: Error) => setEntitiesError(err.message))
      .finally(() => setIsLoadingEntities(false));
  }, []);

  useEffect(() => {
    setIsLoadingPages(true);
    api.get<Paginated<CrossRefPage>>("/cross-reference-pages?per_page=100")
      .then((resp) => {
        setPages(normalizeList(resp).map((p) => ({ ...p, sections: p.sections ?? [] })));
        setPagesError(null);
      })
      .catch((err: Error) => setPagesError(err.message))
      .finally(() => setIsLoadingPages(false));
  }, []);

  const updateForm = (key: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getEntityOption = (type: EntityType, id: string) =>
    entityOptions.find((e) => e.type === type && String(e.id) === id);

  const getOptionsForType = (type: EntityType) =>
    entityOptions
      .filter((e) => e.type === type)
      .map((e) => ({ value: String(e.id), label: e.name }));

  const openCreate = () => {
    setEditingPage(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (page: CrossRefPage) => {
    setEditingPage(page);
    const aType = (page.entity_a.type === "tool" ? "tool" : "industry") as EntityType;
    const bType = (page.entity_b.type === "tool" ? "tool" : "industry") as EntityType;
    setFormData({
      entity_a_type: aType,
      entity_a_id: String(page.entity_a.id),
      entity_b_type: bType,
      entity_b_id: String(page.entity_b.id),
      title: page.title,
      slug: page.slug,
      status: page.status,
      published_at: page.published_at ? page.published_at.split("T")[0] : "",
      sections: page.sections.length > 0 ? page.sections : defaultSections.map((s) => ({ ...s })),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this cross-reference page?")) return;
    try {
      await api.del(`/cross-reference-pages/${id}`);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEntityChange = (side: "a" | "b", field: "type" | "id", value: string) => {
    const typeKey = `entity_${side}_type` as keyof FormData;
    const idKey = `entity_${side}_id` as keyof FormData;

    if (field === "type") {
      updateForm(typeKey, value as EntityType);
      updateForm(idKey, "");
    } else {
      updateForm(idKey, value);
      const currentAType = side === "a" ? (value as unknown as EntityType) : formData.entity_a_type;
      const currentBType = side === "b" ? (value as unknown as EntityType) : formData.entity_b_type;
      const aId = side === "a" ? value : formData.entity_a_id;
      const bId = side === "b" ? value : formData.entity_b_id;
      const aEntity = getEntityOption(formData.entity_a_type, side === "a" ? value : aId);
      const bEntity = getEntityOption(formData.entity_b_type, side === "b" ? value : bId);
      void currentAType; void currentBType;
      if (aEntity && bEntity && !editingPage) {
        updateForm("title", buildTitle(aEntity.name, bEntity.name));
        updateForm("slug", buildSlug(aEntity.slug, bEntity.slug));
      }
    }
  };

  const handleSave = async (status: CrossRefPage["status"]) => {
    setIsSaving(true);
    try {
      if (editingPage) {
        const updated = await api.put<CrossRefPage>(`/cross-reference-pages/${editingPage.id}`, {
        title: formData.title,
        slug: formData.slug || undefined,
        status,
        published_at:
          status === "published"
            ? (formData.published_at || new Date().toISOString())
            : formData.published_at || undefined,

        sections: formData.sections
          .filter((s) => s.title || s.content)
          .map((s) => ({
            section_key: s.section_key,
            title: s.title,
            content: s.content,
            sort_order: s.sort_order,
          })),
      });
        setPages((prev) => prev.map((p) => p.id === editingPage.id ? { ...p, ...updated, sections: p.sections } : p));
      } else {
        const payload = {
          entity_a_type: API_MODEL_MAP[formData.entity_a_type],
          entity_a_id: parseInt(formData.entity_a_id),
          entity_b_type: API_MODEL_MAP[formData.entity_b_type],
          entity_b_id: parseInt(formData.entity_b_id),
          title: formData.title,
          slug: formData.slug || undefined,
          status,
          published_at: status === "published" ? new Date().toISOString() : undefined,
          sections: formData.sections
            .filter((s) => s.title || s.content)
            .map((s) => ({
              section_key: s.section_key,
              title: s.title,
              content: s.content,
              sort_order: s.sort_order,
            })),
        };
        const created = await api.post<CrossRefPage>("/cross-reference-pages", payload);
        setPages((prev) => [{ ...created, sections: created.sections ?? [] }, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const aEntity = getEntityOption(formData.entity_a_type, formData.entity_a_id);
  const bEntity = getEntityOption(formData.entity_b_type, formData.entity_b_id);
  const urlPreview = aEntity && bEntity
    ? `/${formData.entity_a_type}s/${aEntity.slug}/${bEntity.slug}`
    : "Select entities to preview URL";

  const makeTabContent = (statusFilter: string) => {
    const filtered = pages.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        entityDisplayName(p.entity_a).toLowerCase().includes(search.toLowerCase()) ||
        entityDisplayName(p.entity_b).toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });

    if (isLoadingPages) {
      return (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading pages...</p>
        </div>
      );
    }

    if (pagesError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-corner-lg p-xl flex items-center gap-md">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-label-sm text-red-600">{pagesError}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((page) => (
          <CrossRefRow key={page.id} page={page} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No cross-reference pages found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Cross-Reference Builder</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Build interlinked pages combining two entities (Tool × Industry, Tool × Tool, etc.)
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>
          New Cross-Ref Page
        </Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Pages", value: pages.length },
          { label: "Published", value: pages.filter((p) => p.status === "published").length },
          { label: "Drafts", value: pages.filter((p) => p.status === "draft").length },
          { label: "Archived", value: pages.filter((p) => p.status === "archived").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField prefix={<Search size={16} />} placeholder="Search pages..." value={search} onChange={setSearch} />
      </div>

      <Tabs
        tabs={[
          { id: "all", label: "All Pages", content: makeTabContent("") },
          { id: "published", label: "Published", content: makeTabContent("published") },
          { id: "draft", label: "Drafts", content: makeTabContent("draft") },
          { id: "archived", label: "Archived", content: makeTabContent("archived") },
        ]}
        defaultTab="all"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? "Edit Cross-Reference Page" : "Create Cross-Reference Page"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button variant="neutral" iconStart={<FileText size={14} />} onClick={() => void handleSave("draft")} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="neutral" iconStart={<Send size={14} />} onClick={() => void handleSave("archived")} disabled={isSaving}>Archive</Button>
            <Button variant="primary" iconStart={<Eye size={14} />} onClick={() => void handleSave("published")} disabled={isSaving}>Publish</Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          {/* Entity selectors */}
          <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg">
            <p className="text-label text-text-primary font-semibold mb-md">Entity Selection</p>

            {entitiesError && (
              <div className="bg-red-50 border border-red-200 rounded-corner-md p-md mb-md flex items-center gap-sm">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-label-sm text-red-600">Could not load entities: {entitiesError}</p>
              </div>
            )}

            {editingPage ? (
              <div className="flex items-center gap-lg">
                <div className="flex-1 bg-surface-bg border border-border-primary rounded-corner-md px-md py-sm">
                  <p className="text-video-title text-text-tertiary mb-xs">Entity A ({formData.entity_a_type})</p>
                  <p className="text-label text-text-primary">
                    {aEntity?.name ?? `ID: ${formData.entity_a_id}`}
                  </p>
                </div>
                <Link2 size={24} className="text-text-tertiary flex-shrink-0" />
                <div className="flex-1 bg-surface-bg border border-border-primary rounded-corner-md px-md py-sm">
                  <p className="text-video-title text-text-tertiary mb-xs">Entity B ({formData.entity_b_type})</p>
                  <p className="text-label text-text-primary">
                    {bEntity?.name ?? `ID: ${formData.entity_b_id}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-lg">
                <div className="flex-1 flex flex-col gap-sm">
                  <SelectField
                    label="Entity A Type"
                    options={entityTypeOptions}
                    value={formData.entity_a_type}
                    onChange={(v) => handleEntityChange("a", "type", v)}
                  />
                  <SelectField
                    label="Entity A"
                    options={[
                      { value: "", label: isLoadingEntities ? "Loading..." : "Select..." },
                      ...getOptionsForType(formData.entity_a_type),
                    ]}
                    value={formData.entity_a_id}
                    onChange={(v) => handleEntityChange("a", "id", v)}
                  />
                </div>
                <div className="flex-shrink-0 pt-6">
                  <Link2 size={24} className="text-text-tertiary" />
                </div>
                <div className="flex-1 flex flex-col gap-sm">
                  <SelectField
                    label="Entity B Type"
                    options={entityTypeOptions}
                    value={formData.entity_b_type}
                    onChange={(v) => handleEntityChange("b", "type", v)}
                  />
                  <SelectField
                    label="Entity B"
                    options={[
                      { value: "", label: isLoadingEntities ? "Loading..." : "Select..." },
                      ...getOptionsForType(formData.entity_b_type),
                    ]}
                    value={formData.entity_b_id}
                    onChange={(v) => handleEntityChange("b", "id", v)}
                  />
                </div>
              </div>
            )}

            {/* URL Preview */}
            <div className="mt-md bg-surface-bg border border-border-primary rounded-corner-md px-md py-sm">
              <p className="text-video-title text-text-tertiary">
                URL Preview: <span className="text-brand-primary font-mono">{urlPreview}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-sm">
            <div className="flex-1">
              <InputField
                label="Page Title"
                placeholder="Auto-generated from entity names"
                value={formData.title}
                onChange={(v) => updateForm("title", v)}
              />
            </div>
            <FloatingAiButton 
              onGenerate={() => updateForm("title", aEntity && bEntity ? buildTitle(aEntity.name, bEntity.name) : "Integration Guide")}
              isLoading={false}
              className="mt-6"
            />
          </div>

          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField
                label="URL Slug"
                placeholder="entity-a-vs-entity-b"
                value={formData.slug}
                onChange={(v) => updateForm("slug", v)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as CrossRefPage["status"])}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Publish Date"
                type="date"
                value={formData.published_at}
                onChange={(v) => updateForm("published_at", v)}
              />
            </div>
          </div>

          {!editingPage && (
            <SectionEditor
              sections={formData.sections}
              onChange={(sections) => updateForm("sections", sections)}
            />
          )}

          {editingPage && (
            <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-md">
              <p className="text-label-sm text-text-tertiary">
                Sections can be edited via the AI Content module after saving.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}