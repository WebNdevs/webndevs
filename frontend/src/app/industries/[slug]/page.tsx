import { DynamicSection, DynamicSectionProps } from "@/components/sections/dynamic-content-section";
import NotFoundPage from "@/views/NotFound";
import { IndustryPages } from "@/data/industry";
import { Metadata } from "next";
import { generateSEO } from "@/data/seo";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const industry = IndustryPages.find(
    (item) => item.slug === slug
  );

  if (!industry) {
    return {
      title: "Industry Not Found",
    };
  }

  return generateSEO({
    title: industry.seo.title,
    description: industry.seo.description,
    keywords: industry.seo.keywords,
    image: industry.seo.image,
    path: `/industries/${industry.slug}`,
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const industry = IndustryPages.find(
    (item) => item.slug === slug
  );

  if (!industry) {
    return <NotFoundPage />;
  }

  return <DynamicSection section={industry as DynamicSectionProps["section"]} />;
}