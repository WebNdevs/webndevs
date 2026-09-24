import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { ContentCardProps } from "../cards/content-card";
import { CTASection } from "./cta-section";
import ArticleSchema from "../seo&maintainance/articleschema";

type ArticleDetailProps = {
  article: ContentCardProps;
  category: "blogs" | "case-studies";
};

export function ArticleDetail({ article, category }: ArticleDetailProps) {
  const backHref = category === "blogs" ? "/blogs" : "/case-studies";
  const backLabel = category === "blogs" ? "Back to all articles" : "Back to case studies";
  const categoryLabel = category === "blogs" ? "Blog Article" : "Case Study";
  const cleanSlug = (article.slug || "").replace(/^\/+/, "");
  const articleUrl = `/${category}/${cleanSlug}`;

  // Calculate estimated reading time
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <ArticleSchema
        title={article.title || "WebNDevs Article"}
        description={article.excerpt || article.title || "Read insights from WebNDevs."}
        url={articleUrl}
        image={article.image}
        datePublished={article.date}
        authorName={article.author || "WebNDevs Team"}
        category={category}
      />
      <article className="min-h-screen bg-[#0B0F14] text-[#F9FAFB] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#22C55E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{backLabel}</span>
        </Link>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
            {categoryLabel}
          </span>
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs rounded-full bg-[#111827] border border-[#374151] text-[#9CA3AF]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
          {article.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-[#9CA3AF] pb-8 border-b border-[#1F2937] mb-8">
          {article.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#22C55E]" />
              <span>{article.author}</span>
            </div>
          )}
          {article.date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#06B6D4]" />
              <time dateTime={article.date}>{article.date}</time>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9CA3AF]" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden mb-10 border border-[#1F2937]">
            <Image
              src={article.image}
              alt={article.title || "Article Image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt / Lead */}
        {article.excerpt && (
          <p className="text-lg sm:text-xl text-[#D1D5DB] font-medium leading-relaxed mb-8 italic border-l-4 border-[#22C55E] pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="text-[#D1D5DB] leading-relaxed space-y-6 text-base sm:text-lg whitespace-pre-wrap">
          {article.content || "No content available for this article."}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-12 border-t border-[#1F2937]">
          <CTASection />
        </div>
      </div>
    </article>
    </>
  );
}
