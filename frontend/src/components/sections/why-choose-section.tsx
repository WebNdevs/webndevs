import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { getPage, getPageSection } from '@/data/content';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { CompareTable, CompareTableItem } from '../cards/compare-table';


export async function WhyChooseSection() {
  const page = await getPage("content", "/");
  const whyus = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "whyus");
  const compare = getPageSection<HeaderSectionProps & { items?: CompareTableItem[] }>(page, "comparison");
  
  if (!page) return null;

  return (
    <section aria-label="Why Choose Us" className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {whyus && <HeaderSection {...whyus} />}

        {/* Benefits Grid */}
        {whyus?.items && <IconCardGrid items={whyus.items} />}

        {/* Comparison Section */}
        {compare && (
          <>
            {compare.items && <CompareTable items={compare.items} />}
          </>
        )}
      </div>
    </section>
  );
}
