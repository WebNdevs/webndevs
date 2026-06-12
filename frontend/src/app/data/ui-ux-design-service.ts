import { ServicePageData } from '../types/service-page';

export const uiUxDesignService: ServicePageData = {
  seo: {
    metaTitle: 'UI/UX Design Services | Modern User Experience Design | WebNDevs',
    metaDescription: 'Professional UI/UX design services for websites, mobile apps, dashboards, and SaaS products focused on user experience and conversions.',
    urlSlug: 'ui-ux-design',
    keywords: [
      'UI UX design services',
      'website UI design',
      'mobile app UX design',
      'dashboard design',
      'Figma UI design',
      'user experience design',
      'web app design'
    ],
    internalLinks: [
      { text: 'Web Development Services', url: '/services/web-development' },
      { text: 'Automation Services', url: '/services/automation-services' }
    ],
    blogSuggestions: [
      'Why UI/UX Design Matters for Business Growth',
      'Top UI Design Trends in 2026',
      'How Better UX Improves Conversion Rates'
    ]
  },

  hero: {
    serviceName: 'UI/UX Design Services',
    valueProposition: 'Design modern digital experiences users love and businesses grow from',
    ctaText: 'Start Designing',
    ctaSecondaryText: 'View Design Work'
  },

  introduction: {
    paragraph: 'We design clean, modern, and conversion-focused interfaces that improve user experience and strengthen your brand identity.',
    benefits: [
      'Modern and professional visuals',
      'Improved user engagement',
      'Better conversion rates',
      'Mobile-first responsive layouts',
      'User-focused interface strategy'
    ]
  },

  keyBenefits: [
    {
      icon: '🎨',
      title: 'Modern Visual Design',
      description: 'Clean, premium interfaces designed for today’s digital standards.'
    },
    {
      icon: '📱',
      title: 'Responsive Experience',
      description: 'Consistent UI experience across all devices and screen sizes.'
    },
    {
      icon: '🧠',
      title: 'User-Centered UX',
      description: 'Every design decision is focused around user behavior and usability.'
    },
    {
      icon: '⚡',
      title: 'Higher Conversions',
      description: 'Strategic layouts designed to improve user actions and sales.'
    }
  ],

  servicesBreakdown: {
    heading: 'Design Services We Offer',
    items: [
      {
        title: 'Website UI Design',
        description: 'Modern website interfaces focused on branding and usability.'
      },
      {
        title: 'Mobile App Design',
        description: 'Smooth and engaging mobile app experiences for Android and iOS.'
      },
      {
        title: 'Dashboard Design',
        description: 'Professional admin panels and SaaS dashboard interfaces.'
      },
      {
        title: 'Landing Page Design',
        description: 'Conversion-focused layouts for campaigns and advertisements.'
      },
      {
        title: 'Wireframing & Prototyping',
        description: 'Interactive prototypes before development begins.'
      }
    ]
  },

  process: [
    {
      number: '01',
      title: 'Research & Planning',
      description: 'Understanding users, business goals, and competitors.'
    },
    {
      number: '02',
      title: 'Wireframes',
      description: 'Structuring layouts and user flows for best usability.'
    },
    {
      number: '03',
      title: 'Visual Design',
      description: 'Creating polished interfaces and brand-consistent designs.'
    },
    {
      number: '04',
      title: 'Prototype & Testing',
      description: 'Testing interactions and improving user experience.'
    }
  ],

  useCases: {
    heading: 'Perfect For',
    audiences: [
      {
        title: 'Startups',
        description: 'Launch products with polished and modern interfaces.'
      },
      {
        title: 'SaaS Products',
        description: 'Improve dashboard usability and user retention.'
      },
      {
        title: 'E-commerce Brands',
        description: 'Create shopping experiences that increase conversions.'
      }
    ]
  },

  results: {
    heading: 'Design Results',
    projects: [
      {
        title: 'SaaS Dashboard Redesign',
        result: 'Improved usability and navigation flow',
        metric: '+45% user engagement'
      }
    ]
  },

  faq: [
    {
      question: 'What is UI/UX design?',
      answer: 'UI design focuses on visuals and interface appearance while UX design focuses on user experience and usability.'
    },
    {
      question: 'Which tools do you use?',
      answer: 'We mainly use Figma and modern design systems for scalable UI/UX workflows.'
    }
  ],

  finalCTA: {
    headline: 'Ready to Design Better Experiences?',
    subtext: 'Let’s create interfaces users enjoy using.',
    buttonText: 'Start Your Design Project'
  },

  stats: [
    { value: '100+', label: 'Design Screens Created' },
    { value: '95%', label: 'User Satisfaction' },
    { value: '2x', label: 'Better Engagement' }
  ]
};