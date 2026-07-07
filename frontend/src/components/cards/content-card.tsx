import { DSCard } from "./DScomponents";
import Image from "next/image";
import { ScrollReveal } from "../animations/scroll-reveal";

export type ContentCardProps = {
  title?: string;
  excerpt?: string;
  image?: string;
  slug?: string;
  content?: string;
  date?: string;
  featured?: boolean;
  tags?: string[];
  onClick?: () => void;
};

export function ContentCard({ title, excerpt, image, tags, onClick, }: ContentCardProps) {
  return (
    <DSCard
      hoverable
      onClick={onClick}
      className="cursor-pointer bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Image
        width={300}
        height={48}
        src={image || "/logo.png"}
        alt={title || "WebNDevs Project Showcase"}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">
        {title}
      </h3>

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

      <p className="text-[#9CA3AF] line-clamp-3">
        {excerpt}
      </p>
    </DSCard>
  );
}

type ContentCardGridProps = {
  items?: ContentCardProps[];
  onSelect?: (content: ContentCardProps) => void;
};

export function ContentCardGrid({ items = [], onSelect }: ContentCardGridProps) {
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
            onClick={() => onSelect?.(item)}
          />
        </ScrollReveal>
      ))}
    </div>
  );
}