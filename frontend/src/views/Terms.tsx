import { getHome } from "@/data/homedata";
import { HeaderSection } from "@/components/cards/header-card";
import { ContentTile, DSTiles } from "@/components/cards/DScomponents";
import { PageHero, PageHeroProps } from "@/components/sections/pagehero";


export function TermsPage() {
  const section = getHome("terms");

  if(!section) return null;

  return (
    <section className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300">
          <DSTiles items={section?.items as ContentTile[]} />
        </div>

      </div>
    </section>
  )
}