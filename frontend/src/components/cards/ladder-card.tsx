import { DSCard } from "./DScomponents";
import { ICONS } from "../../data/icons";

export type LadderCardProps = {
  icon?: string;
  title?: string;
  number?: string;
  description?: string;
  text?: string;
  align?: 'left' | 'right';
}

export function LadderCard({icon, title, number, description, text, align} : LadderCardProps) {
  const Icon =  ICONS[icon as keyof typeof ICONS];
  const isLeft = align === 'left';
  const card = (
    <DSCard hoverable>
      <div className={`flex items-start gap-4 ${isLeft ? "flex-row-reverse" : "" }`}>
        {icon && (
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-[#22C55E]" />
          </div>
        )}
        <div className={`flex-1 ${isLeft ? "text-right" : "text-left" }`}>
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? "justify-end" : "justify-start" }`}>
            {isLeft ? (
              <>
                <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                  {title}
                </h3>
                <span className="text-[32px] font-bold text-[#22C55E]/20">
                  {number}
                </span>
              </>
            ) : (
              <>
              <span className="text-[32px] font-bold text-[#22C55E]/20">
                {number}
              </span>
              <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                {title}
              </h3>
            </>
            )}
          </div>
          <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
            {description}
          </p>
          <p className="text-[12px] text-[#22C55E] font-medium">
            {text}
          </p>
        </div>
      </div>
    </DSCard>
  );

  return(
    <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
      {isLeft ? (
        <>
          <div>
            {card}
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div>
            {card}
          </div>
        </>
      )}
    </div>
  )
}


export function LadderSection({items} : {items: LadderCardProps[]}) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-linear-to-b from-[#22C55E] to-[#06B6D4]" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Center Dot */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" />

            <LadderCard
              {...item}
              align={index % 2 === 0 ? "left" : "right"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

