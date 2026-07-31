import { CTASection } from '@/components/sections/cta-section';
import { ContentSections } from '@/components/sections/content-sections';
import { getPage } from '@/data/content';

export async function ContactPage() {
  const page = await getPage("content", "/contact");
  if (!page) return null;

  return (
    <div className="bg-[#0B0F14]">
      <section aria-label="Contact Us Page" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ContentSections page={page} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
