import { getPage, getPageSection } from '@/data/content';
import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { LadderCardProps, LadderSection } from '../cards/ladder-card';


export async function ProcessSection() {
  const page = await getPage("content", "/");
  const process = getPageSection<HeaderSectionProps & { items?: LadderCardProps[] } & { cta?: ShortCTAProps }>(page, "process");

  if (!page) return null;

  return (
    <section id="process" aria-label="Our Process" className="py-20 px-6 bg-linear-to-r from-[#22C55E]/1 to-[#06B6D4]/1">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <HeaderSection {...process as HeaderSectionProps}/>

        {/* Process Timeline */}
        <LadderSection items={process?.items as LadderCardProps[]}/>

        {/* Bottom CTA */}
        <ShortCTA variant="full" {...process?.cta as ShortCTAProps} />
      </div>
    </section>
  );
}
