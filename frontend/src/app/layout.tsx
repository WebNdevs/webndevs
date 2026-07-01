import Shell from "../components/seo&maintainance/shell";
import "./globals.css"
import GlobalOrganizationSchema from "../components/seo&maintainance/globalschema";
import BreadcrumbSchema from "../components/seo&maintainance/breadcrumbschema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://webndevs.com"),

  title: {
    default: "WebNDevs",
    template: "%s | WebNDevs",
  },

  description:
    "WebNDevs builds modern websites, AI automation, software solutions, and digital products for growing businesses.",

  applicationName: "WebNDevs",

  keywords: [
    "Web Development",
    "AI Automation",
    "Next.js",
    "Laravel",
    "WordPress",
    "Software Development",
  ],

  authors: [
    {
      name: "WebNDevs",
      url: "https://webndevs.com",
    },
  ],

  creator: "WebNDevs",

  publisher: "WebNDevs",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WebNDevs",
    url: "/",
    title: "WebNDevs",
    description:
      "Modern websites, AI automation, business software and digital solutions.",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "WebNDevs",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "WebNDevs",
    description:
      "Modern websites, AI automation, business software and digital solutions.",
    images: ["/images/og/default.jpg"],
  },

  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.png",
  },

  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behaviour="smooth">
      <body>
        <GlobalOrganizationSchema />
        <BreadcrumbSchema />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}