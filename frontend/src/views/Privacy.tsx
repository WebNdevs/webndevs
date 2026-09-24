import { ContentSections } from "@/components/sections/content-sections";
import { getPage } from "@/data/content";

export async function PrivacyPolicyPage() {
  const page = (await getPage("content", "/privacy-policy")) || (await getPage("content", "/privacy"));
  if (!page) return null;

  return (
    <section aria-label="Privacy Policy Page" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ContentSections page={page} />
      </div>
    </section>
  );
}
