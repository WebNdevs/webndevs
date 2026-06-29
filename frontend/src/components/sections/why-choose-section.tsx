import { HeaderSection } from '../cards/header-card';
import { getHome } from '@/data/homedata';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { CompareTable } from '../cards/compare-table';


export function WhyChooseSection() {
  const section = getHome("why-choose");

  if (!section) return null;

  return (
    <section className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <HeaderSection {...section}/>

        {/* Benefits Grid */}
        <IconCardGrid items={section?.items as IconCardProps[]}/>

        {/* Comparison Section */}
        <CompareTable {...section?.comparison}/>
      </div>
    </section>
  );
}
