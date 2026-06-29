import Link from "next/link";
import { Check } from "lucide-react";

import { DSCard } from "./DScomponents";

export type PlanCardProps = {
  badge?: string;

  title: string;

  subtitle?: string;

  price?: string;

  features?: string[];

  buttonText?: string;

  href?: string;

  featured?: boolean;
};

export function PlanCard({
  badge,
  title,
  subtitle,
  price,
  features = [],
  buttonText = "Learn More",
  href,
  featured = false,
}: PlanCardProps) {
  const card = (
    <DSCard
      hoverable
      className={`relative h-full ${
        featured
          ? "border-[#22C55E]/40 shadow-[0_0_40px_rgba(34,197,94,.15)]"
          : ""
      }`}
    >
      {badge && (
        <span
          className={`absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            featured
              ? "bg-[#22C55E] text-[#0B0F14]"
              : "bg-[#22C55E]/10 text-[#22C55E]"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="flex h-full flex-col">

        <div>

          <h3 className="text-3xl font-bold text-white">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-3 text-[#9CA3AF]">
              {subtitle}
            </p>
          )}

        </div>

        {price && (
          <div className="my-8">

            <span className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-5xl font-black text-transparent">
              {price}
            </span>

          </div>
        )}

        <div className="flex-1 space-y-4">

          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3"
            >
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]/10">
                <Check className="h-3 w-3 text-[#22C55E]" />
              </div>

              <span className="text-[#D1D5DB]">
                {feature}
              </span>
            </div>
          ))}

        </div>

        {href && (
          <Link
            href={href}
            className={`mt-10 rounded-xl px-5 py-3 text-center font-semibold transition ${
              featured
                ? "bg-linear-to-r from-[#22C55E] to-[#06B6D4] text-[#0B0F14]"
                : "border border-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/10"
            }`}
          >
            {buttonText}
          </Link>
        )}

      </div>
    </DSCard>
  );

  return card;
}

type PlanGridProps = {
  items: PlanCardProps[];
};

export function PlanGrid({
  items,
}: PlanGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {items.map((item, index) => (
        <PlanCard
          key={index}
          {...item}
        />
      ))}
    </div>
  );
}