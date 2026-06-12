import { ServicePageData } from '../types/service-page';

/**
 * EXAMPLE: Web Development Service Page Data
 * 
 * This demonstrates how to populate the service page template
 * with real, SEO-optimized, conversion-focused content.
 * 
 * Copy this structure for other services:
 * - mobile-app-service.ts
 * - ui-ux-design-service.ts
 * - ai-automation-service.ts
 * etc.
 */

export const webDevelopmentService: ServicePageData = {
  // SEO & Meta
  seo: {
    metaTitle: 'Professional Web Development Services | Custom Websites & Web Apps | WebNDevs',
    metaDescription: 'Get fast, secure, and scalable web development services. We build custom websites, web applications, and e-commerce stores using React, Next.js, WordPress, and Laravel.',
    urlSlug: 'web-development',
    keywords: [
      'web development services',
      'custom website development',
      'web application development',
      'React development',
      'Next.js development',
      'WordPress development',
      'Laravel development',
      'e-commerce development'
    ],
    internalLinks: [
      { text: 'UI/UX Design Services', url: '/services/ui-ux-design' },
      { text: 'Mobile App Development', url: '/services/mobile-app-development' },
      { text: 'View Our Portfolio', url: '/#portfolio' }
    ],
    blogSuggestions: [
      'React vs Next.js: Which Framework Should You Choose in 2026?',
      '10 Web Development Trends That Will Dominate This Year',
      'How to Choose the Right Web Development Partner for Your Startup'
    ]
  },

  // Hero Section
  hero: {
    serviceName: 'Web Development Services',
    valueProposition: 'Build fast, secure, and scalable websites that turn visitors into customers',
    ctaText: 'Start Your Project',
    ctaSecondaryText: 'View Our Work'
  },

  // Introduction
  introduction: {
    paragraph: 'We build modern websites and web applications that actually work for your business. Whether you need a simple landing page or a complex web platform, our expert developers use proven technologies to deliver fast, secure, and scalable solutions.',
    benefits: [
      'Custom-coded solutions built for your specific needs',
      'SEO-optimized from day one to rank on Google',
      'Mobile-responsive design that works on any device',
      'Fast loading speeds that keep visitors engaged',
      'Secure code with regular updates and maintenance'
    ]
  },

  // Key Benefits
  keyBenefits: [
    {
      icon: '⚡',
      title: 'Lightning-Fast Performance',
      description: 'Optimized code and modern frameworks ensure your website loads in under 2 seconds.'
    },
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      description: 'SSL certificates, secure hosting, and regular security updates protect your business.'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Perfect experience on smartphones, tablets, and desktops—no matter the screen size.'
    },
    {
      icon: '🎯',
      title: 'Conversion-Optimized',
      description: 'Every element is designed to guide visitors toward becoming paying customers.'
    },
    {
      icon: '♾️',
      title: 'Infinitely Scalable',
      description: 'Start small and grow big—your website scales with your business needs.'
    },
    {
      icon: '🛠️',
      title: 'Easy to Update',
      description: 'User-friendly CMS or custom admin panel makes managing content simple.'
    }
  ],

  // Services Breakdown
  servicesBreakdown: {
    heading: 'What We Build',
    items: [
      {
        title: 'Custom Business Websites',
        description: 'Professional websites built from scratch to match your brand and convert visitors into leads.'
      },
      {
        title: 'E-commerce Stores',
        description: 'Complete online stores with secure payments, inventory management, and order tracking.'
      },
      {
        title: 'Web Applications',
        description: 'Custom SaaS platforms, dashboards, and tools that solve your specific business problems.'
      },
      {
        title: 'WordPress Development',
        description: 'Custom WordPress sites with themes, plugins, and functionality tailored to your needs.'
      },
      {
        title: 'API Integration',
        description: 'Connect your website to payment gateways, CRMs, marketing tools, and third-party services.'
      },
      {
        title: 'Website Redesign',
        description: 'Transform outdated websites into modern, high-performing digital experiences.'
      },
      {
        title: 'Landing Pages',
        description: 'Conversion-focused pages designed specifically for marketing campaigns and ads.'
      },
      {
        title: 'Maintenance & Support',
        description: 'Ongoing updates, security patches, backups, and technical support after launch.'
      }
    ]
  },

  // Process
  process: [
    {
      number: '01',
      title: 'Discovery & Planning',
      description: 'We learn about your business, goals, and target audience to create the perfect strategy.'
    },
    {
      number: '02',
      title: 'Design & Prototype',
      description: 'Visual mockups and interactive prototypes show exactly how your website will look and work.'
    },
    {
      number: '03',
      title: 'Development',
      description: 'Our developers build your website using clean, modern code and best practices.'
    },
    {
      number: '04',
      title: 'Testing & Quality Assurance',
      description: 'Rigorous testing across devices and browsers ensures everything works perfectly.'
    },
    {
      number: '05',
      title: 'Launch & Support',
      description: 'We handle deployment and provide ongoing support to keep your website running smoothly.'
    }
  ],

  // Use Cases
  useCases: {
    heading: 'Who Is This For?',
    audiences: [
      {
        title: 'Startups & Founders',
        description: 'Launch your MVP quickly with a scalable website that grows with your business.'
      },
      {
        title: 'Small Businesses',
        description: 'Get a professional online presence that competes with larger companies.'
      },
      {
        title: 'E-commerce Brands',
        description: 'Sell products online with a secure, high-converting online store.'
      },
      {
        title: 'SaaS Companies',
        description: 'Build custom web applications and user dashboards for your software.'
      },
      {
        title: 'Marketing Agencies',
        description: 'White-label web development services for your clients.'
      },
      {
        title: 'Enterprises',
        description: 'Large-scale web platforms with complex integrations and workflows.'
      }
    ]
  },

  // Results
  results: {
    heading: 'Real Results We\'ve Delivered',
    projects: [
      {
        title: 'FinanceFlow SaaS Platform',
        result: 'Built complete financial management platform with real-time analytics',
        metric: '10K+ users in 6 months'
      },
      {
        title: 'EcoShop E-commerce Store',
        result: 'Custom online store with optimized checkout flow',
        metric: '+250% sales increase'
      },
      {
        title: 'TechStart Landing Page',
        result: 'High-converting landing page for startup launch',
        metric: '+180% qualified leads'
      },
      {
        title: 'HealthHub Web Application',
        result: 'Patient management system with appointment scheduling',
        metric: '20 hours/week saved'
      }
    ]
  },

  // FAQ (AEO Critical)
  faq: [
    {
      question: 'What is web development?',
      answer: 'Web development is the process of building websites and web applications. It includes everything from simple landing pages to complex platforms like e-commerce stores, SaaS applications, and custom dashboards. At WebNDevs, we handle both frontend (what users see) and backend (server and database) development.'
    },
    {
      question: 'How much does web development cost?',
      answer: 'Web development costs vary based on complexity. A basic business website starts around $3,000-$5,000. Custom web applications range from $10,000-$50,000+. E-commerce stores typically start at $8,000. We provide detailed quotes after understanding your specific requirements and features needed.'
    },
    {
      question: 'How long does it take to build a website?',
      answer: 'A standard business website takes 2-4 weeks. E-commerce stores take 4-6 weeks. Complex web applications typically take 8-16 weeks. Timeline depends on features, design complexity, and content readiness. We provide accurate timelines during our planning phase and keep you updated throughout development.'
    },
    {
      question: 'What technologies do you use for web development?',
      answer: 'We use modern, proven technologies including React, Next.js, WordPress, Laravel, Node.js, and PostgreSQL. We choose the right tech stack based on your specific needs—not just what\'s trendy. Our focus is on performance, security, and scalability.'
    },
    {
      question: 'Do you provide website maintenance after launch?',
      answer: 'Yes! Every project includes post-launch support. We also offer monthly maintenance packages that include security updates, backups, performance monitoring, content updates, and technical support. We\'re here for the long term, not just the initial build.'
    },
    {
      question: 'Will my website be mobile-friendly?',
      answer: 'Absolutely. All our websites are built with a mobile-first approach, meaning they work perfectly on smartphones, tablets, and desktops. With over 60% of web traffic coming from mobile devices, responsive design is standard in every project we build.'
    },
    {
      question: 'Can you help with SEO for my website?',
      answer: 'Yes. We build SEO-friendly websites from the ground up with clean code, fast loading speeds, proper heading structure, and meta tags. We can also provide ongoing SEO services including keyword optimization, content strategy, and technical SEO improvements.'
    },
    {
      question: 'What makes WebNDevs different from other web development agencies?',
      answer: 'We focus on being a long-term partner, not just a vendor. You get one dedicated team handling design, development, and launch—no coordination headaches. We prioritize clear communication, realistic timelines, and building solutions that actually solve your business problems and generate ROI.'
    }
  ],

  // Final CTA
  finalCTA: {
    headline: 'Ready to Build Your Website?',
    subtext: 'Get a free consultation and detailed project proposal within 24 hours',
    buttonText: 'Start Your Project Today'
  },

  // Stats
  stats: [
    { value: '2-4 weeks', label: 'Average Delivery Time' },
    { value: '50+', label: 'Websites Built' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '<2s', label: 'Page Load Speed' }
  ]
};
