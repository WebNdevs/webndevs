import { DSCard } from "./DScomponents";
import { ICONS } from "@/data/icons";
import { ScrollReveal } from "../animations/scroll-reveal";

export type ChecklistCardProps = {
  icon?: string;

  title?: string;

  description?: string;

  items?: string[];

  variant?: "success" | "danger" | "neutral";
};

export function ChecklistCard({
  icon,
  title,
  description,
  items = [],
  variant = "success",
}: ChecklistCardProps) {

  const Icon =
    icon && ICONS[icon as keyof typeof ICONS];

  const colors = {
    success: {
      icon: "text-[#22C55E]",
      bg: "bg-[#22C55E]/10",
      border: "border-[#22C55E]/20",
      bullet: "bg-[#22C55E]",
    },

    danger: {
      icon: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      bullet: "bg-red-400",
    },

    neutral: {
      icon: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      bullet: "bg-cyan-400",
    },
  };

  const style = colors[variant];

  return (
    <DSCard hoverable className="h-full">

      <div className="flex flex-col">

        {(Icon || title) && (
          <div className="mb-6 flex items-center gap-4">

            {Icon && (
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
              >
                <Icon className={`h-7 w-7 ${style.icon}`} />
              </div>
            )}

            <div>

              <h3 className="text-2xl font-bold text-[#F9FAFB]">
                {title}
              </h3>

              {description && (
                <p className="mt-1 text-sm text-[#9CA3AF]">
                  {description}
                </p>
              )}

            </div>

          </div>
        )}

        <ul className="space-y-4">

          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-2 h-2.5 w-2.5 rounded-full shrink-0 ${style.bullet}`}
              />

              <span className="leading-7 text-[#D1D5DB]">
                {item}
              </span>

            </li>
          ))}

        </ul>

      </div>

    </DSCard>
  );
}

type ChecklistGridProps = {
  items: ChecklistCardProps[];
};

export function ChecklistGrid({
  items,
}: ChecklistGridProps) {
  if (!items) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {items.map((item, index) => (
        <ScrollReveal
          key={index}
          direction="up"
          delay={index * 0.1}
          duration={0.5}
        >
          <ChecklistCard {...item} />
        </ScrollReveal>
      ))}
    </div>
  );
}