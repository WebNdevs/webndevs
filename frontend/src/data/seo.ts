import { Metadata } from "next";

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