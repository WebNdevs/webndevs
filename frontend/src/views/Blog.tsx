import { CTASection } from '@/components/sections/cta-section';
import { BlogSection } from '@/components/sections/blog-section';

export function BlogPage() {
  return (
    <div className="space-y-10">
      <BlogSection/>
      <CTASection/>
    </div>
  );
}
