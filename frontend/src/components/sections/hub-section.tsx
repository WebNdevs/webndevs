import { getPage } from '@/data/content';
import { ContentSections } from './content-sections';

export async function HubSection() {
  const page = await getPage("content", "/datahub");
  if (!page) return null;

  return (
    <section id='datahub' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <ContentSections page={page} />
      </div>
    </section>
  );
}