import { DynamicSection } from "@/components/sections/dynamic-content-section";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateSEOFromCMS } from "@/data/seo";
import { buildRoute, getModule } from "@/data/content";

const CATEGORY = "solutions";

async function resolveSolutionPage(slug: string) {
  const pages = await getModule("singlepage");
  return pages.find((page) => buildRoute(page, "singlepage") === `/${CATEGORY}/${slug}`);
}

export async function generateStaticParams() {
  const pages = await getModule("singlepage");

  return pages
    .filter((page) => buildRoute(page, "singlepage").startsWith(`/${CATEGORY}/`))
    .map((page) => ({
      slug: buildRoute(page, "singlepage").slice(`/${CATEGORY}/`.length),
    }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await resolveSolutionPage(slug);

  return generateSEOFromCMS(
    { title: "Solution Not Found", description: "", path: `/${CATEGORY}/${slug}`, keywords: [] },
    solution
  );
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await resolveSolutionPage(slug);

  if (!page) {
    notFound();
  }

  return <DynamicSection page={page} />;
}
