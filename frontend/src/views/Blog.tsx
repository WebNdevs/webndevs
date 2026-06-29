import { CTASection } from '@/components/sections/cta-section';
import { BlogSection } from '@/components/sections/blog-section';

export function BlogPage() {
  return (
    <section className="space-y-10">
      <BlogSection/>
      <CTASection/>
    </section>
  );
}
