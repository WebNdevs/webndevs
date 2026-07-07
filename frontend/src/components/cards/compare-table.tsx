import { DSCard } from "./DScomponents"
import { ScrollReveal } from "../animations/scroll-reveal"

export type CompareTableProps = {
  leftHeading?: string;
  rightHeading?: string;
  leftPoints?: string[];
  rightPoints?: string[];
}

export type ComparisonItem = {
  tag?: string;
  title?: string;
  description?: string;

  comparison?: CompareTableProps;
};

export function CompareTable({leftHeading, rightHeading, leftPoints, rightPoints} : CompareTableProps) {
  return(
    <div className="mb-10">
      <ScrollReveal direction="up" duration={0.8}>
        <DSCard className="overflow-hidden bg-transparent">
          <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side */}
          { leftHeading && (
            <div className="p-8 bg-linear-to-br from-[#EF4444]/5 to-[#F97316]/5">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
                  <span className="text-[#EF4444] text-[20px]">✗</span>
                </div>
                <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                  {leftHeading}
                </h3>
              </div>
            
              <ul className="space-y-3">
                {leftPoints?.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] shrink-0">✗</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

            </div>
          )}
          {/* Right SIde */}
          { rightHeading && (
            <div className="p-8 bg-linear-to-br from-[#22C55E]/5 to-[#06B6D4]/5">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                  <span className="text-[#22C55E] text-[20px]">✓</span>
                </div>
                <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                  {rightHeading}
                </h3>
              </div>

              <ul className="space-y-3">
                {rightPoints?.map((point, index) => (
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
    </div>
  )
}