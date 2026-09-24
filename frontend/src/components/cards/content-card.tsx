import { DSCard } from "./DScomponents";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "../animations/scroll-reveal";

export type ContentCardProps = {
  title?: string;
  excerpt?: string;
  author?: string;
  image?: string;
  slug?: string;
  content?: string;
  date?: string;
  featured?: boolean;
  tags?: string[];
  category?: "blogs" | "case-studies";
  onClick?: () => void;
};

export function ContentCard({
  title,
  excerpt,
  author,
  image,
  slug,
  tags,
  category = "blogs",
  onClick,
}: ContentCardProps) {
  const rawSlug = (slug || "").trim().replace(/^\/+/, "");
  const detectedCategory = rawSlug.startsWith("case-studies/")
    ? "case-studies"
    : rawSlug.startsWith("blogs/")
    ? "blogs"
    : category;
  const cleanSlug = rawSlug.replace(/^(blogs|case-studies)\//, "");
  const href = `/${detectedCategory}/${cleanSlug}`;

  const cardElement = (
    <DSCard
      hoverable
      className="h-full bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5 overflow-hidden focus-visible:outline-2 focus-visible:outline-[#22C55E]"
    >
      <Image
        width={300}
        height={48}
        src={image || "/logo.png"}
        alt={title || "WebNDevs Content"}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2 group-hover:text-[#22C55E] transition-colors">
        {title}
      </h3>
      <p className="text-[#9CA3AF] text-sm mb-2 font-medium">
        {author}
      </p>

      {tags?.length ? (
        <div className="flex flex-wrap gap-2 my-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[11px] rounded-full border border-[#22C55E]/70 text-[#22C55E]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-[#9CA3AF] line-clamp-3 text-sm">
        {excerpt}
      </p>
    </DSCard>
  );

  if (cleanSlug) {
    return (
      <Link href={href} className="block h-full group text-left">
        {cardElement}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="cursor-pointer h-full text-left"
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {cardElement}
    </div>
  );
}

type ContentCardGridProps = {
  items?: ContentCardProps[];
  category?: "blogs" | "case-studies";
  onSelect?: (content: ContentCardProps) => void;
};

export function ContentCardGrid({ items = [], category = "blogs", onSelect }: ContentCardGridProps) {
  if (!items) return null;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <ScrollReveal
          key={item.slug || index}
          direction="up"
          delay={(index % 3) * 0.1}
          duration={0.6}
        >
          <ContentCard
            {...item}
            category={category}
            onClick={() => onSelect?.(item)}
          />
        </ScrollReveal>
      ))}
    </div>
  );
}