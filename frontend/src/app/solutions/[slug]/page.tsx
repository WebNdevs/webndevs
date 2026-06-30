import { DynamicSection, DynamicSectionProps } from "@/components/sections/dynamic-content-section";
import NotFoundPage from "@/views/NotFound";
import { solutionPages } from "@/data/solution";
import { Metadata } from "next";
import { generateSEO } from "@/data/seo";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const solution = solutionPages.find(
    (item) => item.slug === slug
  );

  if (!solution) {
    return {
      title: "Solution Not Found",
    };
  }
  return generateSEO({
    title: solution.seo.title,
    description: solution.seo.description,
    keywords: solution.seo.keywords,
    image: solution?.seo?.image,
    path: `/solutions/${solution.slug}`,
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const solution = solutionPages.find(
    (item) => item.slug === slug
  );

  if (!solution) {
    return <NotFoundPage />;
  }

  return <DynamicSection section={solution as DynamicSectionProps["section"]} />;
}