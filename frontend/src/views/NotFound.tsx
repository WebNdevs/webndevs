import { HeaderSection } from "@/components/cards/header-card";
import { IconCardGrid, IconCardProps } from "@/components/cards/icon-card";
import { GlobalSearch } from "@/components/seo&maintainance/globalsearch";
import { MegaMenu } from "@/components/navigation";
import { CTASection, ShortCTA } from "@/components/sections/cta-section";
import { getHome } from "@/data/homedata";

export default function NotFoundPage() {
  const section = getHome('error')
  return (
    <section aria-label="Page Not Found" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <HeaderSection {...section}/>

        <div className="mb-16">
          <IconCardGrid items={section?.items as IconCardProps[]} />
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <GlobalSearch />
          <ShortCTA variant="full" {...section?.cta}/>
        </div>

        <div className="mb-16">
          <MegaMenu />
        </div>

        <div className="mb-16">
          <ShortCTA variant="preview" {...section?.cta}/>
        </div>

        <CTASection/>

      </div>
    </section>
  );
}