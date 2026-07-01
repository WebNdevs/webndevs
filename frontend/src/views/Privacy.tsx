import { ContentTile, DSTiles } from "@/components/cards/DScomponents";
import { HeaderSection } from "@/components/cards/header-card";
import { PageHero, PageHeroProps } from "@/components/sections/pagehero";
import { getHome } from "@/data/homedata";

export function PrivacyPolicyPage() {
  const section = getHome("privacy");

  if(!section) return null;

  return (
    <section aria-label="Privacy Policy Page" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300">
          <DSTiles items={section?.items as ContentTile[]} />
        </div>

      </div>
    </section>
  );
}