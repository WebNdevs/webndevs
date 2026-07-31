import { ContentSections } from "@/components/sections/content-sections";
import { getPage } from "@/data/content";

export async function TermsPage() {
  const page = await getPage("content", "/terms");
  if (!page) return null;

  return (
    <section aria-label="Terms of Service Page" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ContentSections page={page} />
      </div>
    </section>
  )
}