import NotFoundPage from "@/views/NotFound";
import { ServicePages } from "@/data/services";
import { Metadata } from "next";
import { DynamicService, DynamicServiceProps } from "@/components/sections/dynamic-service-section";
import { generateSEO } from "@/data/seo";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const service = ServicePages.find(
    (item) => item.slug === slug
  );

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return generateSEO({
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    image: service.seo.image,
    path: `/services/${service.slug}`,
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const service = ServicePages.find(
    (item) => item.slug === slug
  );

  if (!service) {
    return <NotFoundPage />;
  }

  return <DynamicService section={service as DynamicServiceProps["section"]} />;
}