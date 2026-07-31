import { getPage } from '@/data/content';
import { DataHubSections } from './datahub-sections';

export async function IndustrySection() {
  const page = await getPage("datahub", "/industries");
  if (!page) return null;

  return (
    <section id='industries' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <DataHubSections page={page} />
      </div>
    </section>
  );
}