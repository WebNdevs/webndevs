import { getPage } from '@/data/content';
import { DataHubSections } from './datahub-sections';

export async function SolutionSection() {
  const page = await getPage("datahub", "/solutions");
  if (!page) return null;

  return (
    <section id='solutions' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <DataHubSections page={page} />
      </div>
    </section>
  );
}