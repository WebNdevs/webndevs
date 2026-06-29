import { ContentTile, DSTiles } from "@/components/cards/DScomponents";
import { HeaderSection } from "@/components/cards/header-card";
import { PageHero, PageHeroProps } from "@/components/sections/pagehero";
import { getDataHub } from "@/data/datahub";
import { CompareTable, CompareTableProps, ComparisonItem } from "../cards/compare-table";

export function ComparisonSection() {
  const section = getDataHub("comparisons");

  if(!section) return null;

  return (
    <section className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300">
          {(section?.items as ComparisonItem[])?.map((item, i) => (
            <div key={i}>
          <DSTiles items={[item as ContentTile]} />
          <CompareTable {...item.comparison as CompareTableProps}/>
          </div>))}
        </div>
        
      </div>
    </section>
  );
}