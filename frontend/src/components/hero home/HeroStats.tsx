import { CheckCircle2, FolderKanban, Sparkles } from "lucide-react";

type HeroStat = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

type HeroStatsProps = {
  items?: HeroStat[];
};

const DEFAULT_STATS: HeroStat[] = [
  {
    icon: <FolderKanban className="h-5 w-5" />,
    value: "150+",
    label: "Projects Delivered",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    value: "8+",
    label: "Years Experience",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    value: "98%",
    label: "Client Satisfaction",
  },
];

export default function HeroStats({
  items = DEFAULT_STATS,
}: HeroStatsProps) {
  return (
    <div className="mt-16">

      {/* Divider */}

      <div className="mb-8 h-px w-full bg-linear-to-r from-[#22C55E]/20 via-white/10 to-transparent" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        {items.map((item) => (
          <div
            key={item.label}
            className="
              group

              rounded-2xl

              border
              border-white/5

              bg-white/3

              p-5

              backdrop-blur

              transition-all
              duration-300

              hover:border-[#22C55E]/20
              hover:bg-white/5
            "
          >

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E] transition group-hover:scale-110">

              {item.icon}

            </div>

            <h3 className="bg-linear-to-r from-[#22C55E] via-[#34D399] to-[#06B6D4] bg-clip-text text-3xl font-black text-transparent">

              {item.value}

            </h3>

            <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">

              {item.label}

            </p>

          </div>
        ))}

      </div>

    </div>
  );
}