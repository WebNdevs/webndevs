import { DSBadge } from "./DScomponents";
import { HeaderSection } from "./header-card";
import { ScrollReveal } from "../animations/scroll-reveal";

export type TechCardProps = {
  techtag?: string;
  techHeading1?: string;
  techHeading2?: string;
  techSubtext?: string;
  tags?: string[];
}


export function TechCard({techHeading1, techHeading2, techSubtext, tags, techtag}: TechCardProps) {
  return(
    <section className="py-20 px-6 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <HeaderSection tag={techtag} subheading1={techHeading1} subheading2={techHeading2} subtext={techSubtext}/>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {tags?.map((tech, index) => (
              <ScrollReveal key={tech} direction="up" delay={index * 0.04} duration={0.4}>
                <DSBadge className="px-4 py-2 rounded-full border border-[#374151] bg-transparent text-[#F9FAFB] text-[14px] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors">
                  {tech}
                </DSBadge>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
  )
}