import { DSCard } from "./DScomponents";
import { ICONS } from "@/data/icons";

export type ScoreCardProps = {
  icon?: string;

  title?: string;

  value?: string;

  score?: number;

  description?: string;
};

export function ScoreCard({
  icon,
  title,
  value,
  score,
  description,
}: ScoreCardProps) {
  const Icon =
    icon && ICONS[icon as keyof typeof ICONS];

  return (
    <DSCard hoverable className="h-full">
      <div className="flex flex-col items-center text-center">

        {Icon && (
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#22C55E]/20 bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10">
            <Icon className="h-7 w-7 text-[#22C55E]" />
          </div>
        )}

        <h3 className="text-lg font-semibold text-[#F9FAFB]">
          {title}
        </h3>

        <div className="mt-5">

          <div className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-5xl font-black text-transparent">
            {value}
          </div>

          {score && (
            <div className="mt-3 flex justify-center gap-1">

              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`text-xl ${
                    index < score
                      ? "text-[#22C55E]"
                      : "text-[#374151]"
                  }`}
                >
                  ★
                </span>
              ))}

            </div>
          )}

        </div>

        {description && (
          <p className="mt-5 text-sm leading-6 text-[#9CA3AF]">
            {description}
          </p>
        )}

      </div>
    </DSCard>
  );
}

type ScoreGridProps = {
  items: ScoreCardProps[];
};

export function ScoreGrid({
  items,
}: ScoreGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <ScoreCard
          key={index}
          {...item}
        />
      ))}
    </div>
  );
}