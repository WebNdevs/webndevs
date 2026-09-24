import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPage } from "@/data/content";
import { ContentCardProps } from "@/components/cards/content-card";
import { ArticleDetail } from "@/components/sections/article-detail";

async function getCaseStudies(): Promise<ContentCardProps[]> {
  const page = await getPage("article", "/case-studies");
  if (!page) return [];
  const contentSection = page.content as { items?: ContentCardProps[] } | undefined;
  return contentSection?.items || (page as unknown as { items?: ContentCardProps[] }).items || (page as any).items || [];
}

function findMatchingStudy(studies: ContentCardProps[], slugParam: string): ContentCardProps | undefined {
  const target = slugParam.trim().replace(/^\/+/, "").replace(/^case-studies\//, "");
  return studies.find((s) => {
    const itemSlug = (s.slug || "").trim().replace(/^\/+/, "").replace(/^case-studies\//, "");
    return itemSlug === target;
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies
    .filter((s) => Boolean(s.slug))
    .map((s) => ({
      slug: (s.slug || "").trim().replace(/^\/+/, "").replace(/^case-studies\//, ""),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const studies = await getCaseStudies();
  const study = findMatchingStudy(studies, slug);

  if (!study) {
    return {
      title: "Case Study Not Found",
      description: "The requested case study could not be found.",
    };
  }

  return {
    title: study.title,
    description: study.excerpt || study.title,
    keywords: study.tags || ["case study", "client success", "software engineering"],
    openGraph: {
      title: study.title,
      description: study.excerpt,
      type: "article",
      publishedTime: study.date,
      authors: study.author ? [study.author] : undefined,
      images: study.image ? [{ url: study.image }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const studies = await getCaseStudies();
  const study = findMatchingStudy(studies, slug);

  if (!study) {
    notFound();
  }

  return <ArticleDetail article={study} category="case-studies" />;
}
