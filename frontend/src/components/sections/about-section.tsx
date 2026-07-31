import { getPage } from '@/data/content';
import { ContentSections } from './content-sections';

export async function AboutSection() {
  const page = await getPage("content", "/about");
  if (!page) return null;

  return (
    <section id="about" aria-label="About WebNDevs" className="py-20 px-6 bg-transparent text-gray-100">
      <div className="max-w-7xl mx-auto space-y-20">
        <ContentSections page={page} />
      </div>
    </section>
  );
}