import { DSCard } from "./DScomponents";
import Image from "next/image";

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

export function ContentCard({title, excerpt, image, tags, onClick,} : ContentCardProps) {
  return (
    <DSCard
      hoverable
      onClick={onClick}
      className="cursor-pointer overflow-hidden"
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
              className="px-2 py-1 text-[11px] rounded-full bg-[#111827] border border-[#374151] text-[#22C55E]"
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

export function ContentCardGrid({items = [], onSelect} : ContentCardGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentCard
          key={item.slug}
          {...item}
          onClick={() => onSelect?.(item)}
        />
      ))}
    </div>
  );
}