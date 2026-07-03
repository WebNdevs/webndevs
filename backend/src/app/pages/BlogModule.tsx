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
  Calendar,
  Tag,
  Image,
  Sparkles,
} from "lucide-react";
import { api, type Paginated } from "../utils/api";
import { SparkleButton } from "../components/ai";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string;
  status: "draft" | "published";
  tags: string[];
  published_at: string | null;
};

const statusColors = {
  published: "success" as const,
  draft: "default" as const,
};

type FormData = {
  title: string;
  slug: string;
  author_name: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: "draft" | "published";
  published_at: string;
  tagsText: string;
};

const emptyForm: FormData = {
  title: "",
  slug: "",
  author_name: "",
  excerpt: "",
  content: "",
  featured_image: "",
  status: "draft",
  published_at: "",
  tagsText: "",
};

function postToForm(post: BlogPost): FormData {
  return {
    title: post.title,
    slug: post.slug,
    author_name: post.author_name,
    excerpt: post.excerpt ?? "",
    content: post.content,
    featured_image: post.featured_image ?? "",
    status: post.status,
    published_at: post.published_at ? post.published_at.slice(0, 10) : "",
    tagsText: (post.tags ?? []).join(", "),
  };
}

function PostRow({
  post,
  onEdit,
  onDelete,
}: {
  post: BlogPost;
  onEdit: (p: BlogPost) => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <div
      className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary hover:bg-bg-faint transition-colors cursor-pointer"
      onClick={() => onEdit(post)}
    >
      <div className="flex items-start gap-xl">
        <div className="w-[120px] h-[72px] bg-bg-subtle rounded-corner-md flex items-center justify-center flex-shrink-0 overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <Image size={24} className="text-text-tertiary" />
          )}
        </div>

        <div className="flex-1 flex flex-col gap-sm">
          <div className="flex items-start justify-between gap-xl">
            <div>
              <h3 className="text-label text-text-primary font-semibold leading-tight">{post.title}</h3>
              <p className="text-video-title text-text-tertiary mt-xs">/{post.slug}</p>
            </div>
            <div className="flex items-center gap-sm flex-shrink-0">
              <Badge label={post.status} variant={statusColors[post.status]} />
              <Button variant="subtle" size="small" iconStart={<Pencil size={16} />} onClick={(e) => { e.stopPropagation(); onEdit(post); }}>Edit</Button>
              <Button variant="subtle" size="small" iconStart={<Trash2 size={16} />} onClick={(e) => { e.stopPropagation(); void onDelete(post.slug); }}>Delete</Button>
            </div>
          </div>

          {post.excerpt && <p className="text-label-sm text-text-secondary">{post.excerpt}</p>}

          <div className="flex items-center gap-xl">
            <div className="flex items-center gap-xs text-text-tertiary">
              <Tag size={12} />
              <span className="text-video-title">{post.author_name}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-xs text-text-tertiary">
                <Calendar size={12} />
                <span className="text-video-title">{post.published_at.slice(0, 10)}</span>
              </div>
            )}
            {(post.tags ?? []).length > 0 && (
              <div className="flex gap-xs ml-auto">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag} className="bg-bg-faint border border-border-secondary rounded-corner-md px-sm py-xs text-video-title text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.get<Paginated<BlogPost>>("/blog-posts?per_page=100")
      .then((res) => { setPosts(res.data); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const openCreate = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setSaveError(null);
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(postToForm(post));
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.del(`/blog-posts/${slug}`);
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    const tags = formData.tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      author_name: formData.author_name,
      status,
      tags,
      ...(formData.published_at ? { published_at: formData.published_at } : {}),
      ...(formData.featured_image ? { featured_image: formData.featured_image } : {}),
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingPost) {
        const updated = await api.put<BlogPost>(`/blog-posts/${editingPost.slug}`, payload);
        setPosts((prev) => prev.map((p) => p.id === editingPost.id ? updated : p));
      } else {
        const created = await api.post<BlogPost>("/blog-posts", payload);
        setPosts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const makeTabContent = (statusFilter: string) => {
    const filtered = posts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return (
      <div className="flex flex-col gap-lg">
        {filtered.map((post) => (
          <PostRow key={post.id} post={post} onEdit={openEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
            <p className="text-label text-text-secondary">No posts found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2xl flex flex-col gap-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title text-text-primary">Blog Management</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Create, schedule, and manage blog posts with SEO optimization.
          </p>
        </div>
        <Button variant="primary" iconStart={<Plus size={16} />} onClick={openCreate}>
          New Post
        </Button>
      </div>

      <div className="flex gap-xl">
        {[
          { label: "Total Posts", value: posts.length },
          { label: "Published", value: posts.filter((p) => p.status === "published").length },
          { label: "Drafts", value: posts.filter((p) => p.status === "draft").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-bg rounded-corner-lg p-xl flex-1 text-center">
            <span className="text-title text-text-primary">{stat.value}</span>
            <p className="text-video-title text-text-secondary mt-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl">
        <InputField
          prefix={<Search size={16} />}
          placeholder="Search posts..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {isLoading ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-text-secondary">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="bg-surface-bg rounded-corner-lg p-2xl text-center">
          <p className="text-label text-red-500">{error}</p>
        </div>
      ) : (
        <Tabs
          tabs={[
            { id: "all", label: "All Posts", content: makeTabContent("") },
            { id: "published", label: "Published", content: makeTabContent("published") },
            { id: "draft", label: "Drafts", content: makeTabContent("draft") },
          ]}
          defaultTab="all"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Edit Blog Post" : "Create New Post"}
        size="large"
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="neutral" onClick={() => void handleSave("draft")} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="primary" onClick={() => void handleSave("published")} disabled={isSaving}>
              {editingPost?.status === "published" ? "Update Post" : "Publish"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-lg">
          {formData.title && (
            <div className="flex justify-end">
              <SparkleButton
                context={{
                  entityName: formData.title,
                  entityType: "blog",
                  fields: [
                    { key: "title", label: "Post Title", type: "text", value: formData.title },
                    { key: "slug", label: "URL Slug", type: "slug", value: formData.slug },
                    { key: "content", label: "Content", type: "textarea", value: formData.content },
                    { key: "excerpt", label: "Excerpt", type: "textarea", value: formData.excerpt },
                    { key: "author_name", label: "Author Name", type: "text", value: formData.author_name },
                  ],
                }}
                onApplyField={(fieldKey, value) => updateForm(fieldKey as keyof FormData, value)}
              />
            </div>
          )}
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-corner-md p-md">
              <p className="text-label-sm text-red-600">{saveError}</p>
            </div>
          )}
          <InputField
            label="Post Title"
            placeholder="Enter post title..."
            value={formData.title}
            onChange={(v) => {
              updateForm("title", v);
              if (!editingPost) {
                updateForm("slug", v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
              }
            }}
          />
          <div className="flex gap-xl">
            <div className="flex-1">
              <InputField label="URL Slug" placeholder="post-url-slug" value={formData.slug} onChange={(v) => updateForm("slug", v)} />
            </div>
            <div className="flex-1">
              <InputField label="Author Name" placeholder="Author name" value={formData.author_name} onChange={(v) => updateForm("author_name", v)} />
            </div>
          </div>
          <TextareaField
            label="Content *"
            placeholder="Write the full blog post content here..."
            value={formData.content}
            rows={8}
            onChange={(v) => updateForm("content", v)}
          />
          
          {/* AI Helper for Content */}
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => {
                if (!formData.title) return;
                setIsGenerating(true);
                fetch("/api/v1/ai/generate", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("auth_token") ?? ""}`,
                  },
                  body: JSON.stringify({
                    entity_type: "blog",
                    entity_id: editingPost?.id ?? 0,
                    section_key: "content",
                    prompt_template: "entity_overview",
                    entity_name: formData.title,
                    prompt: `Write a comprehensive blog post for "${formData.title}". Include an introduction, 3-4 main sections with subheadings, and a conclusion. Make it engaging and informative. 400-600 words.`,
                  }),
                }).then(r => r.json()).then(r => {
                  if (r.content) updateForm("content", r.content);
                }).catch(console.error).finally(() => setIsGenerating(false));
              }}
              disabled={!formData.title || isGenerating}
              className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary text-label-sm disabled:opacity-50"
            >
              <Sparkles size={13} className="text-brand-primary" />
              {isGenerating ? "Generating..." : "AI Write Content"}
            </button>
          </div>

          <TextareaField
            label="Excerpt"
            placeholder="Brief summary of the post..."
            value={formData.excerpt}
            rows={2}
            onChange={(v) => updateForm("excerpt", v)}
          />
          
          {/* AI Helper for Excerpt */}
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => {
                if (!formData.content) return;
                // Extract first ~150 chars as excerpt
                const excerpt = formData.content.slice(0, 150).trim() + "...";
                updateForm("excerpt", excerpt);
              }}
              disabled={!formData.content}
              className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary text-label-sm disabled:opacity-50"
            >
              <Sparkles size={13} className="text-brand-primary" />
              Generate from Content
            </button>
          </div>
          <InputField
            label="Featured Image URL"
            placeholder="https://webndevs.com/image.jpg"
            value={formData.featured_image}
            onChange={(v) => updateForm("featured_image", v)}
          />
          <div className="flex gap-xl">
            <div className="flex-1">
              <SelectField
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
                value={formData.status}
                onChange={(v) => updateForm("status", v as FormData["status"])}
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
          <InputField
            label="Tags (comma separated)"
            placeholder="React, Next.js, Performance"
            value={formData.tagsText}
            onChange={(v) => updateForm("tagsText", v)}
          />
        </div>
      </Modal>
    </div>
  );
}
