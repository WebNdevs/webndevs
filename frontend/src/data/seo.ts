import { Metadata } from "next";
import { NormalizedPage } from "@/data/content";

type SEOProps = {
  title: string;
  description: string;
  path: string;

  image?: string;

  keywords?: string[];

  noIndex?: boolean;
};

export function generateSEO({
  title,
  description,
  path,
  image = "/images/og/default.jpg",
  keywords = [],
  noIndex = false,
}: SEOProps): Metadata {
  // Enforce clean absolute URL for canonicals
  const cleanPath = path.split("?")[0].replace(/\/+$/, "").replace(/\/+/g, "/");
  const absoluteUrl = `https://webndevs.com${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`;

  return {
    title,

    description,

    keywords,

    robots: {
      index: !noIndex,
      follow: !noIndex,
    },

    alternates: {
      canonical: absoluteUrl,
    },

    openGraph: {
      title,
      description,
      url: absoluteUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// Overlays CMS-sourced SEO fields (seo_title, seo_description, meta_keywords,
// title) from a fetched CMS page onto hardcoded fallback SEOProps. The CMS
// value wins whenever it's present and non-empty; otherwise the hardcoded
// default is used, so every route keeps working even before an admin fills
// in SEO fields for that page.
export function generateSEOFromCMS(
  defaults: SEOProps,
  page: NormalizedPage | undefined
): Metadata {
  if (!page) return generateSEO(defaults);

  const seoTitle = (page.seo_title as string) || (page.title as string) || "";
  const seoDescription = (page.seo_description as string) || "";
  const metaKeywords = page.meta_keywords
    ? (page.meta_keywords as string).split(",").map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  return generateSEO({
    ...defaults,
    title: seoTitle || defaults.title,
    description: seoDescription || defaults.description,
    keywords: metaKeywords.length > 0 ? metaKeywords : defaults.keywords,
  });
}