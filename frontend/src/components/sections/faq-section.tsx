import { FAQItemProps } from '../cards/faq-card';
import { getPage } from '@/data/content';
import { ContentSections } from './content-sections';

export async function FAQSection() {
  const page = await getPage("content", "/faq");
  if (!page) return null;

  const faqItems = ((page.faq as { items?: FAQItemProps[] } | undefined)?.items || []);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer || "",
      },
    })),
  };

  return (
    <section id="faq" className="py-20 px-6 bg-[#0B0F14]">
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <ContentSections page={page} />
      </div>
    </section>
  )
}
