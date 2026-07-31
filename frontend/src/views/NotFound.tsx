import { HeaderSection, HeaderSectionProps } from "@/components/cards/header-card";
import { IconCardGrid, IconCardProps } from "@/components/cards/icon-card";
import { GlobalSearch } from "@/components/seo&maintainance/globalsearch";
import { MegaMenu } from "@/components/navigation";
import { CTASection, ShortCTA, ShortCTAProps } from "@/components/sections/cta-section";
import { getPage, NormalizedPage } from "@/data/content";

const DEFAULT_HEADER: HeaderSectionProps = {
  tag: "404",
  subheading1: "Page Not",
  subheading2: "Found",
  subtext: "Sorry, the page you're looking for doesn't exist or has been moved.",
};

export default async function NotFoundPage() {
  const page = await getPage("content", "/404");
  const dat = page?.data as NormalizedPage | undefined;

  const hasCustomHeader = Boolean(dat?.tag || dat?.subheading1 || dat?.subheading2 || dat?.subtext);
  const header = hasCustomHeader ? (dat as unknown as HeaderSectionProps) : DEFAULT_HEADER;

  return (
    <section aria-label="Page Not Found" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <HeaderSection {...header} />

        <div className="mb-16">
          <IconCardGrid items={dat?.items as IconCardProps[]} />
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <GlobalSearch />
          <ShortCTA variant="full" {...page?.cta as ShortCTAProps}/>
        </div>

        <div className="mb-16">
          <MegaMenu />
        </div>

        <div className="mb-16">
          <ShortCTA variant="preview" {...page?.cta as ShortCTAProps}/>
        </div>

        <CTASection/>

      </div>
    </section>
  );
}