import React, { useEffect, useMemo, useState } from 'react';
import { DSCard } from './ds-card';
import { DSButton } from './ds-button';
import { API_BASE_URL } from '../../config/api.config';
import { LoadingGame } from './loading-game';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

type Paginated<T> = {
  data: T[];
}
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string;
  tags: string[] | null;
  published_at: string | null;
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How AI Is Transforming Web Development in 2025",
    slug: "ai-transforming-web-development-2025",
    excerpt: "From copilots to full-stack generation — discover how AI is reshaping the way modern websites are built and optimised.",
    content: "Artificial intelligence is no longer a futuristic concept in web development. Teams are now using AI-assisted code generation, automated testing, and intelligent deployment pipelines to ship faster than ever. Tools like GitHub Copilot, Cursor, and Claude are becoming standard in developer workflows, cutting boilerplate time by half and freeing engineers to focus on architecture and user experience. The next wave will bring AI-driven A/B testing, real-time personalisation, and self-healing codebases — making the gap between idea and live product smaller than ever before.",
    featured_image: null,
    author_name: "WND Team",
    tags: ["AI", "Web Development", "Technology"],
    published_at: "2025-03-10T00:00:00Z",
  },
  {
    id: 2,
    title: "Programmatic SEO: Scale Content Without Sacrificing Quality",
    slug: "programmatic-seo-scale-content",
    excerpt: "Learn how to build thousands of high-quality, interlinked pages using structured data and smart templates.",
    content: "Programmatic SEO lets you turn a structured database into hundreds or thousands of targeted landing pages — each one genuinely useful to a specific search query. The key is combining clean entity data (tools, industries, use cases) with well-designed templates that inject real insight, not just word-filled blanks. When done right, the result is a compounding organic traffic engine that outperforms manually written content at scale.",
    featured_image: null,
    author_name: "WND Team",
    tags: ["SEO", "Content Strategy", "Automation"],
    published_at: "2025-02-20T00:00:00Z",
  },
  {
    id: 3,
    title: "Why Laravel Is Still the Best API Backend for Startups",
    slug: "laravel-best-api-backend-startups",
    excerpt: "Despite growing competition from Node and Go, Laravel continues to deliver speed, structure, and developer happiness.",
    content: "Laravel's opinionated structure, first-class ORM, built-in queueing, and powerful CLI make it one of the most productive frameworks available for building REST APIs. For startups that need to move fast without accumulating mountains of tech debt, Laravel's conventions handle the boring parts so your team can focus on business logic. Add Sanctum for auth, Pint for formatting, and PHPUnit for testing — and you have a battle-tested stack ready for production from day one.",
    featured_image: null,
    author_name: "WND Team",
    tags: ["Laravel", "PHP", "Backend", "API"],
    published_at: "2025-01-15T00:00:00Z",
  },
];

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(false);

  const formattedDate = (date: string | null) => {
    if (!date) {
      return 'Recently published';
    }

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/blog-posts`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to load blog posts');
        }

        const payload = await response.json();

        if (!payload.success) {
          throw new Error('Invalid response while fetching blog posts');
        }

        const postsData: BlogPost[] = payload.data?.data ?? [];

        setPosts(postsData);
        setActivePost(postsData[0] ?? null);
      } catch {
        setPosts(FALLBACK_POSTS);
        setActivePost(FALLBACK_POSTS[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  const openPost = async (slug: string) => {
    setIsPostLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blog-posts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to load blog post');
      }

      const payload: ApiResponse<BlogPost> = await response.json();
      if (!payload.success) {
        throw new Error('Invalid response while fetching blog post');
      }

      setActivePost(payload.data);
      document.getElementById('active-blog-post')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } catch {
      // keep the currently displayed post on individual post load failure
    } finally {
      setIsPostLoading(false);
    }
  };

  const hasPosts = useMemo(() => posts.length > 0, [posts]);
  const sidebarCount = activePost?.content && activePost.content.length > 1800 ? 5 : 3;

  const sidebarPosts = posts
    .filter((post) => post.slug !== activePost?.slug)
    .slice(0, sidebarCount);

  const bottomPosts = posts
    .filter((post) => post.slug !== activePost?.slug)
    .slice(sidebarCount);

  return (
    <section id='blogs' className="pt-[120px] pb-[80px] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Our Blogs
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Insights That Drive{' '}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              Real Growth
            </span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            Explore expert insights on web development, AI automation, SEO strategy, scaling systems, and modern digital experiences built for real businesses.
          </p>
        </div>


        {isLoading ? (
          <LoadingGame />
        ) : !hasPosts ? (
          <DSCard>
            <p className="text-[#9CA3AF]">No blog posts have been published yet.</p>
          </DSCard>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top row: featured viewer (left 2/3) + first 3 cards (right 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div id="active-blog-post" className="lg:col-span-2">
                <DSCard className="h-full">
                  {isPostLoading ? (
                    <div className="min-h-[40vh] flex items-center justify-center text-[#9CA3AF] text-[16px]">Loading post...</div>
                  ) : activePost ? (
                    <article>
                      <h2 className="text-[30px] md:text-[36px] font-bold text-[#F9FAFB] leading-tight break-words">{activePost.title}</h2>
                      <div className="mt-3 text-[#9CA3AF] text-[14px]">
                        {formattedDate(activePost.published_at)} • {activePost.author_name}
                      </div>
                      {activePost.tags && activePost.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {activePost.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full text-[12px] bg-[#111827] text-[#22C55E] border border-[#374151]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-6 text-[#D1D5DB] text-[16px] leading-relaxed break-words whitespace-pre-wrap overflow-hidden">{activePost.content}</p>
                    </article>
                  ) : null}
                </DSCard>
              </div>

              {/* Right sidebar — up to 3 cards */}
              <div className="flex flex-col gap-4">
                {sidebarPosts.map((post) => (
                  <DSCard key={post.id} hover className={activePost?.slug === post.slug ? 'border border-[#22C55E]' : 'border border-transparent'}>
                    <h3 className="text-[18px] font-semibold text-[#F9FAFB] leading-snug break-words">{post.title}</h3>
                    <p className="mt-2 text-[#9CA3AF] text-[13px]">{formattedDate(post.published_at)}</p>
                    <p className="mt-3 text-[#D1D5DB] text-[13px] leading-relaxed line-clamp-3 break-words">{post.excerpt ?? 'Read this article for full details.'}</p>
                    <DSButton className="mt-4 w-full" variant="secondary" onClick={() => openPost(post.slug)}>
                      Read Post
                    </DSButton>
                  </DSCard>
                ))}
              </div>
            </div>

            {/* Bottom grid — posts 4 and beyond, 2 per row */}
            {bottomPosts.length > 0 && (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                {bottomPosts.map((post) => (
                  <DSCard key={post.id} hover className={`min-w-[340px] md:min-w-[420px] snap-start ${activePost?.slug === post.slug ? 'border border-[#22C55E]' : 'border border-transparent'}`}>
                    <h3 className="text-[20px] font-semibold text-[#F9FAFB] leading-snug break-words">{post.title}</h3>
                    <p className="mt-2 text-[#9CA3AF] text-[14px]">{formattedDate(post.published_at)}</p>
                    <p className="mt-3 text-[#D1D5DB] text-[14px] leading-relaxed line-clamp-3 break-words">{post.excerpt ?? 'Read this article for full details.'}</p>
                    <DSButton className="mt-4 w-full" variant="secondary" onClick={() => openPost(post.slug)}>
                      Read Post
                    </DSButton>
                  </DSCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
