import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DSButton, DSCard } from "./DScomponents";
import { ICONS } from "@/data/icons";

export type EntityCardProps = {
  icon?: string;
  badge?: string;

  title?: string;
  description?: string;
  pricing?: string;
  projects?: string;
  tags?: string[];

  href?: string;
};

export function EntityCard({
  icon,
  badge,
  title,
  description,
  tags,
  href,
  pricing,
  projects,
}: EntityCardProps) {
  const Icon =
    icon && ICONS[icon as keyof typeof ICONS];

  const card = (
    <DSCard hoverable className="group h-full transition-all duration-300">
      <div className="flex h-full flex-col">

        {/* Top */}
        <div className="flex items-start justify-between">

          {Icon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#22C55E]/20 bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10">
              <Icon className="h-7 w-7 text-[#22C55E]" />
            </div>
          )}

          {badge && (
            <span className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#22C55E]">
              {badge}
            </span>
          )}
        </div>

        {/* Content */}

        {title && (
          <div className="mt-6 flex-1">

            <h3 className="text-2xl font-bold text-[#F9FAFB]">
              {title}
            </h3>

            <p className="mt-3 text-[15px] leading-7 text-[#9CA3AF]">
              {description}
            </p>

          </div>
        )}

        {/* Pricing */}

        {pricing && (
          <div className="mt-6 flex-1">

            <h3 className="text-2xl font-bold text-[#F9FAFB]">
              {pricing}
            </h3>

            <p className="mt-3 text-[15px] leading-7 text-[#9CA3AF]">
              {projects}
            </p>


          </div>
        )}

        {/* Tags */}

        {tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">

            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#9CA3AF]"
              >
                {tag}
              </span>
            ))}

          </div>
        ) : null}

        {/* Footer */}

        <div className="mt-8 pt-2 flex items-center justify-between border-t border-white/5">

          <DSButton>
            Learn More
          </DSButton>

          <ArrowUpRight className="h-6 w-6 text-[#22C55E] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

        </div>

      </div>
    </DSCard>
  );

  return href ? (
    <Link href={href}>
      {card}
    </Link>
  ) : (
    card
  );
}

type EntityGridProps = {
    items: EntityCardProps[];
};

export function EntityGrid({
    items,
}: EntityGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-16">
            {items.map((item, index) => (
                <EntityCard
                    key={index}
                    {...item}
                />
            ))}
        </div>
    );
}