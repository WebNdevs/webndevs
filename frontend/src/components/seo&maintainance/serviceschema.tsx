export type ServiceSchemaProps = {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
};

export default function ServiceSchema({
  name,
  description,
  url,
  category = "Technology Services",
  image = "https://webndevs.com/images/og/default.jpg",
}: ServiceSchemaProps) {
  const fullUrl = url.startsWith("http") ? url : `https://webndevs.com${url.startsWith("/") ? url : "/" + url}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${fullUrl}#service`,
    "name": name,
    "description": description,
    "url": fullUrl,
    "category": category,
    "image": image,
    "provider": {
      "@type": "Organization",
      "@id": "https://webndevs.com/#organization",
      "name": "WebNDevs",
      "url": "https://webndevs.com"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development & Technology Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": name
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
