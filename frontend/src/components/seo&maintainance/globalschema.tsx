export default function GlobalOrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "WebNDevs",
          url: "https://webndevs.com",
        }),
      }}
    />
  );
}