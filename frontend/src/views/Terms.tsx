import { getHome } from "@/data/homedata";
import { HeaderSection } from "@/components/cards/header-card";
import { ContentTile, DSTiles } from "@/components/cards/DScomponents";
import { PageHero, PageHeroProps } from "@/components/sections/pagehero";


export function TermsPage() {
  const section = getHome("terms");

  if(!section) return null;

  return (
    <section aria-label="Terms of Service Page" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        <div className="rounded-xl bg-transparent bg-linear-to-r from-[#22C55E]/1 to-[#06B6D4]/1 border border-white/10 p-6 prose prose-invert max-w-none text-slate-300">
          <DSTiles items={section?.items as ContentTile[]} />
        </div>

      </div>
    </section>
  )
}