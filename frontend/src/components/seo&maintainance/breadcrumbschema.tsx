"use client";
import { usePathname } from "next/navigation";

export default function BreadcrumbSchema() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://webndevs.com",
    },
  ];

  let currentUrl = "https://webndevs.com";
  segments.forEach((segment, index) => {
    currentUrl += `/${segment}`;
    // Format segment slug to clean title (e.g. web-development -> Web Development)
    const name = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    items.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": currentUrl,
    });
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
