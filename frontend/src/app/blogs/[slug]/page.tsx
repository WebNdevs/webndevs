import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPage } from "@/data/content";
import { ContentCardProps } from "@/components/cards/content-card";
import { ArticleDetail } from "@/components/sections/article-detail";

async function getBlogArticles(): Promise<ContentCardProps[]> {
  const page = await getPage("article", "/blogs");
  if (!page) return [];
  const contentSection = page.content as { items?: ContentCardProps[] } | undefined;
  return contentSection?.items || (page as unknown as { items?: ContentCardProps[] }).items || (page as any).items || [];
}

function findMatchingArticle(articles: ContentCardProps[], slugParam: string): ContentCardProps | undefined {
  const target = slugParam.trim().replace(/^\/+/, "").replace(/^blogs\//, "");
  return articles.find((a) => {
    const itemSlug = (a.slug || "").trim().replace(/^\/+/, "").replace(/^blogs\//, "");
    return itemSlug === target;
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles
    .filter((a) => Boolean(a.slug))
    .map((a) => ({
      slug: (a.slug || "").trim().replace(/^\/+/, "").replace(/^blogs\//, ""),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getBlogArticles();
  const article = findMatchingArticle(articles, slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
    keywords: article.tags || ["web development", "software", "tech blog"],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      images: article.image ? [{ url: article.image }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const articles = await getBlogArticles();
  const article = findMatchingArticle(articles, slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} category="blogs" />;
}
