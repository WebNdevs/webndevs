import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DynamicService } from "@/components/sections/dynamic-service-section";
import { generateSEOFromCMS } from "@/data/seo";
import { getPage, getModule } from "@/data/content";

async function resolveServicePage(slug: string) {
  const pathname = `/services/${slug}`;
  return (
    (await getPage("service", pathname)) ||
    (await getPage("service", slug)) ||
    (await getPage("service", `/${slug}`))
  );
}

export async function generateStaticParams() {
  const pages = await getModule("service");

  return pages.map((item) => ({
    slug: (item.slug || "").replace(/^\/+/, ""),
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await resolveServicePage(slug);

  return generateSEOFromCMS(
    { title: "Service Not Found", description: "", path: `/services/${slug}`, keywords: [] },
    service
  );
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await resolveServicePage(slug);

  if (!page) {
    notFound();
  }

  return <DynamicService page={page} />;
}