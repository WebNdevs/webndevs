import { getPage } from '@/data/content';
import { ContentSections } from './content-sections';

export async function ServicesSection() {
  const page = await getPage("content", "/services");
  if (!page) return null;

  return (
    <section id="services" aria-label="Services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ContentSections page={page} />
      </div>
    </section>
  );
}