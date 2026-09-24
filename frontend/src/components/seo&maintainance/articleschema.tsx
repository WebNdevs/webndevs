export type ArticleSchemaProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  category?: "blogs" | "case-studies";
};

export default function ArticleSchema({
  title,
  description,
  url,
  image = "https://webndevs.com/images/og/default.jpg",
  datePublished,
  dateModified,
  authorName = "WebNDevs Team",
  category = "blogs",
}: ArticleSchemaProps) {
  const fullUrl = url.startsWith("http") ? url : `https://webndevs.com${url.startsWith("/") ? url : "/" + url}`;
  const schemaType = category === "case-studies" ? "CreativeWork" : "BlogPosting";

  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${fullUrl}#article`,
    "headline": title,
    "description": description,
    "url": fullUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "image": [image],
    "datePublished": datePublished || "2026-01-01",
    "dateModified": dateModified || datePublished || "2026-01-01",
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://webndevs.com/#organization",
      "name": "WebNDevs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://webndevs.com/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
