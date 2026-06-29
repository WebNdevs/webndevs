import { Metadata } from "next";

type SEOProps = {
  title: string;
  description: string;
  canonical: string;

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
  return {
    title,

    description,

    keywords,

    robots: {
      index: !noIndex,
      follow: !noIndex,
    },

    alternates: {
      canonical: path,
    },

    openGraph: {
      title,
      description,
      url: path,
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