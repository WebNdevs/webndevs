export default function GlobalOrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://webndevs.com/#organization",
            "name": "WebNDevs",
            "url": "https://webndevs.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://webndevs.com/logo.png",
              "caption": "WebNDevs Logo"
            },
            "description": "Enterprise-grade web development, custom software engineering, and AI workflow automation agency.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9950916258",
              "contactType": "sales",
              "email": "hitesh@webndevs.com",
              "areaServed": "Worldwide",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://github.com/webndevs",
              "https://twitter.com/webndevs",
              "https://linkedin.com/company/webndevs"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://webndevs.com/#website",
            "url": "https://webndevs.com",
            "name": "WebNDevs",
            "description": "Custom Software, Web Development & AI Automation Agency",
            "publisher": {
              "@id": "https://webndevs.com/#organization"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://webndevs.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://webndevs.com/#localbusiness",
            "name": "WebNDevs",
            "image": "https://webndevs.com/logo.png",
            "url": "https://webndevs.com",
            "telephone": "+91-9950916258",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Malviya Nagar",
              "addressLocality": "Jaipur",
              "addressRegion": "Rajasthan",
              "postalCode": "302017",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 26.8530,
              "longitude": 75.8252
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            }
          }
        ]),
      }}
    />
  );
}