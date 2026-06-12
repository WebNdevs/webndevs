import { useEffect } from "react";

type SeoOptions = {
  title: string;
  description?: string;
  imageUrl?: string; // New: Optional image URL for social sharing
  canonicalUrl?: string;
  ogType?: string;
};

function upsertMeta(name: string, content: string | null, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (content === null || content === undefined) {
    meta?.remove();
    return;
  }

  if (!meta) {
    meta = document.createElement("meta");
    if (isProperty) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export function useSeo({ title, description, imageUrl, canonicalUrl, ogType = "website" }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta("og:title", title, true);
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("og:type", ogType, true);

    upsertMeta("og:url", canonicalUrl ?? null, true);
    upsertMeta("description", description ?? null);
    upsertMeta("og:description", description ?? null, true);
    upsertMeta("twitter:description", description ?? null);

    // Handle canonical link tag separately from meta tags
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    } else {
      link?.remove();
    }

    upsertMeta("og:image", imageUrl ?? null, true);
    upsertMeta("twitter:image", imageUrl ?? null);
  }, [title, description, imageUrl, canonicalUrl, ogType]);
}
