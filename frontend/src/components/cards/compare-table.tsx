import { DSCard, DSBadge } from "./DScomponents";
import { ScrollReveal } from "../animations/scroll-reveal"

export type ComparisonItem = {
  leftHeading?: string;
  rightHeading?: string;
  leftPoints?: string[];
  rightPoints?: string[];
};

export type CompareTableItem = {
  tag?: string;
  title?: string;
  description?: string;
  comparison?: ComparisonItem;
};

export type CompareTableProps = {
  items?: CompareTableItem[];
};

export function CompareTable({items}: CompareTableProps) {
  const validItems = items?.filter((item) => Boolean(item.title?.trim() || item.comparison?.leftHeading)) || [];
  if (validItems.length === 0) return null;

  return(
    <div className="mb-16">
    {validItems.map((item, i) => (
    <div key={i} className="mb-8"> 
      {/* Title Card */}
      {item.title && (
        <div className="space-y-6 mb-3">
          <ScrollReveal
            direction="up"
            duration={0.5}
          >
            <DSCard className="bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5">
              {item.title && (
                <h2
                  style={{ fontSize: "24px" }}
                  className="font-bold text-[#F9FAFB] mb-4"
                >
                  {item.title}
                  {item.tag && (
                    <DSBadge variant="success" className="ml-2">
                      {item.tag}
                    </DSBadge>
                  )}
                </h2>
              )}
  
              {item.description && (
                <p className="text-[15px] leading-relaxed text-[#9CA3AF]">
                  {item.description}
                </p>
              )}
            </DSCard>
          </ScrollReveal>
        </div>
      )}
      {item.comparison?.leftHeading && (
        <ScrollReveal direction="up" duration={0.8}>
        <DSCard className="overflow-hidden bg-transparent">
          <div key={i} className="grid md:grid-cols-2 gap-0">
          {/* Left Side */}
          { item.comparison?.leftHeading && (
            <div className="p-8 bg-linear-to-br from-[#EF4444]/5 to-[#F97316]/5">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
                  <span className="text-[#EF4444] text-[20px]">✗</span>
                </div>
                <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                  {item.comparison?.leftHeading}
                </h3>
              </div>
            
              <ul className="space-y-3">
                {item.comparison.leftPoints?.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] shrink-0">✗</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

            </div>
          )}
          {/* Right SIde */}
          { item.comparison?.rightHeading && (
            <div className="p-8 bg-linear-to-br from-[#22C55E]/5 to-[#06B6D4]/5">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                  <span className="text-[#22C55E] text-[20px]">✓</span>
                </div>
                <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                  {item.comparison?.rightHeading}
                </h3>
              </div>

              <ul className="space-y-3">
                {item.comparison?.rightPoints?.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              
            </div>
          )}
          </div>
        </DSCard>
      </ScrollReveal>
      )}
    </div>
    ))}
    </div>
  )
}