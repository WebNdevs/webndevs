/**
 * SERVICE PAGE DATA STRUCTURE
 * 
 * This TypeScript interface defines the complete data structure
 * for service pages. Perfect for:
 * - CMS integration
 * - API-driven content
 * - AI-generated pages
 * - Database-backed services
 */

export interface ServicePageData {
  // SEO & Meta
  seo: {
    metaTitle: string;
    metaDescription: string;
    urlSlug: string;
    keywords: string[];
    internalLinks: Array<{
      text: string;
      url: string;
    }>;
    blogSuggestions: string[];
  };

  // Hero Section
  hero: {
    serviceName: string; // Main H1
    valueProposition: string; // Short tagline
    ctaText: string;
    ctaSecondaryText?: string;
  };

  // Introduction
  introduction: {
    paragraph: string;
    benefits: string[]; // 3-5 bullet points
  };

  // Key Benefits
  keyBenefits: Array<{
    icon?: string; // Emoji or icon name
    title: string;
    description: string;
  }>;

  // Services Breakdown (Sub-services)
  servicesBreakdown: {
    heading: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };

  // Process Steps
  processSection?: {
    heading: string;
    subheading: string;
  };

  process: Array<{
    number: string;
    title: string;
    description: string;
  }>;

  // Use Cases / Target Audience
  useCases: {
    heading: string;
    audiences: Array<{
      title: string;
      description: string;
    }>;
  };

  // Portfolio / Results
  results: {
    heading: string;
    subheading?: string;
    projects: Array<{
      title: string;
      result: string;
      metric?: string; // e.g., "+40% conversions"
    }>;
  };

  // FAQ Section (AEO Critical)
  faqSection?: {
    heading: string;
    subheading: string;
  };

  faq: Array<{
    question: string;
    answer: string;
  }>;

  testimonials?: Array<{
    name: string;
    role: string;
    quote: string;
  }>;

  technologies?: string[];
  technologiesSection?: {
    heading: string;
    subheading: string;
  };

  testimonialsSection?: {
    heading: string;
    subheading: string;
  };

  whyChooseSection?: {
    heading: string;
    subheading: string;
  };

  // Final CTA
  finalCTA: {
    headline: string;
    subtext: string;
    buttonText: string;
  };

  // Stats (optional)
  stats?: Array<{
    value: string;
    label: string;
  }>;
}
