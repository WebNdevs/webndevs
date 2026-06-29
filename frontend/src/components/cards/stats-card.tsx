import Link from "next/link";
import { DSCard } from "./DScomponents"
import { ICONS } from "../../data/icons";


export type StatsCardProps = {
  icon?: string;
  title?: string;
  value?: string;
  url?: string;
}

export function StatsCard({icon, title, value, url}: StatsCardProps) {
  const Icon =
  ICONS[icon as keyof typeof ICONS];
  const card = (
    <DSCard className="w-full md:w-[calc(33.333%-1rem)]">
    <div className="flex flex-col items-center">

      {icon && (
        <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-[#22C55E]" />
        </div>
      )}

      {value && (
        <p
          style={{ fontSize: "36px" }}
          className="font-bold bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent"
        >
          {value}
        </p>
      )}

      {title && (
        <p className="mt-2 text-[14px] text-white">
          {title}
        </p>
      )}
    </div>
  </DSCard>
  );
  return url ? (
    <Link href={url}>
      {card}
    </Link>
  ) : (
    card
  );
}

export function StatsCardGrid({items} : {items: StatsCardProps[]}) {
  return(
    <div className="mt-16 flex flex-wrap justify-center gap-6 mb-16">
      {items.map((item, index) => (
        <StatsCard key={index} {...item}/>
      ))}
    </div>
  );
}