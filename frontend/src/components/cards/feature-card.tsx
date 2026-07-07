import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DSCard } from "./DScomponents";
import { ICONS } from "@/data/icons";
import { ScrollReveal } from "../animations/scroll-reveal";

export type FeatureCardProps = {
  icon?: string;

  title?: string;
  description?: string;

  footer?: string;

  href?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  footer,
  href,
}: FeatureCardProps) {
  const Icon =
    icon && ICONS[icon as keyof typeof ICONS];

  const card = (
    <DSCard hoverable className="group h-full transition-all duration-300">
      <div className="flex h-full flex-col">

        {/* Icon */}

        {Icon && (
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#22C55E]/20 bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10">
            <Icon className="h-7 w-7 text-[#22C55E]" />
          </div>
        )}

        {/* Content */}

        <h3 className="text-xl font-bold text-[#F9FAFB]">
          {title}
        </h3>

        <p className="mt-4 flex-1 text-[15px] leading-7 text-[#9CA3AF]">
          {description}
        </p>

        {/* Footer */}

        {(footer || href) && (
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">

            {footer && (
              <span className="text-sm font-medium text-[#22C55E]">
                {footer}
              </span>
            )}

            {href && (
              <ArrowUpRight className="h-5 w-5 text-[#22C55E] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            )}

          </div>
        )}

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

type FeatureGridProps = {
  items: FeatureCardProps[];
};

export function FeatureGrid({
  items,
}: FeatureGridProps) {
  if (!items) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <ScrollReveal
          key={index}
          direction="up"
          delay={(index % 3) * 0.1}
          duration={0.6}
        >
          <FeatureCard
            {...item}
          />
        </ScrollReveal>
      ))}
    </div>
  );
}