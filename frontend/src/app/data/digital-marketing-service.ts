import { ServicePageData } from '../types/service-page';

export const digitalMarketingService: ServicePageData = {
  seo: {
    metaTitle: 'Digital Marketing Services | SEO, Ads & Growth Marketing | WebNDevs',
    metaDescription: 'Grow your business with SEO, Google Ads, Meta Ads, content marketing, and digital growth strategies by WebNDevs.',
    urlSlug: 'digital-marketing',
    keywords: [
      'digital marketing services',
      'SEO services',
      'Google Ads management',
      'Meta Ads services',
      'social media marketing',
      'online business growth',
      'performance marketing'
    ],
    internalLinks: [
      { text: 'Web Development Services', url: '/services/web-development' },
      { text: 'Automation Services', url: '/services/automation-services' }
    ],
    blogSuggestions: [
      'SEO vs Paid Ads: Which One Is Better?',
      'How Digital Marketing Helps Small Businesses Grow',
      'Top Google Ranking Strategies for 2026'
    ]
  },

  hero: {
    serviceName: 'Digital Marketing Services',
    valueProposition: 'Grow your brand, traffic, and sales with data-driven digital marketing',
    ctaText: 'Grow My Business',
    ctaSecondaryText: 'See Marketing Results'
  },

  introduction: {
    paragraph: 'We help businesses grow online through SEO, paid advertising, content marketing, and performance-driven digital strategies.',
    benefits: [
      'Increase website traffic',
      'Generate qualified leads',
      'Improve Google rankings',
      'Boost sales and conversions',
      'Build strong online presence'
    ]
  },

  keyBenefits: [
    {
      icon: '📈',
      title: 'Business Growth',
      description: 'Drive more traffic, leads, and conversions consistently.'
    },
    {
      icon: '🎯',
      title: 'Targeted Marketing',
      description: 'Reach the right audience with precision campaigns.'
    },
    {
      icon: '🔍',
      title: 'SEO Optimization',
      description: 'Improve search visibility and organic rankings.'
    },
    {
      icon: '💰',
      title: 'Better ROI',
      description: 'Performance-focused marketing that maximizes returns.'
    }
  ],

  servicesBreakdown: {
    heading: 'Marketing Services',
    items: [
      {
        title: 'Search Engine Optimization',
        description: 'Technical SEO, on-page SEO, and content optimization.'
      },
      {
        title: 'Google Ads',
        description: 'High-converting PPC campaigns for traffic and sales.'
      },
      {
        title: 'Meta Ads',
        description: 'Facebook and Instagram ad campaigns focused on growth.'
      },
      {
        title: 'Content Marketing',
        description: 'SEO-focused content strategy for long-term growth.'
      },
      {
        title: 'Social Media Marketing',
        description: 'Build engagement and visibility across social platforms.'
      }
    ]
  },

  process: [
    {
      number: '01',
      title: 'Market Research',
      description: 'Understanding audience, competitors, and opportunities.'
    },
    {
      number: '02',
      title: 'Strategy Planning',
      description: 'Creating targeted growth strategies and campaigns.'
    },
    {
      number: '03',
      title: 'Campaign Execution',
      description: 'Launching SEO, ads, and marketing campaigns.'
    },
    {
      number: '04',
      title: 'Optimization & Reporting',
      description: 'Tracking performance and continuously improving results.'
    }
  ],

  useCases: {
    heading: 'Who Is This For?',
    audiences: [
      {
        title: 'Local Businesses',
        description: 'Increase visibility and generate more local leads.'
      },
      {
        title: 'Startups',
        description: 'Build online presence and attract early customers.'
      },
      {
        title: 'E-commerce Brands',
        description: 'Scale online sales through paid ads and SEO.'
      }
    ]
  },

  results: {
    heading: 'Growth Results',
    projects: [
      {
        title: 'SEO Growth Campaign',
        result: 'Improved rankings and organic traffic',
        metric: '+300% website traffic'
      },
      {
        title: 'Meta Ads Campaign',
        result: 'Generated targeted leads at lower acquisition cost',
        metric: '4x ROAS'
      }
    ]
  },

  faq: [
    {
      question: 'What digital marketing services do you provide?',
      answer: 'We provide SEO, Google Ads, Meta Ads, content marketing, and growth-focused digital marketing services.'
    },
    {
      question: 'How long does SEO take?',
      answer: 'SEO is a long-term strategy and typically starts showing strong results within 3-6 months.'
    }
  ],

  finalCTA: {
    headline: 'Ready to Grow Online?',
    subtext: 'Let’s build a digital marketing strategy that drives real business growth.',
    buttonText: 'Start Marketing Today'
  },

  stats: [
    { value: '300%', label: 'Traffic Growth' },
    { value: '4x', label: 'Average ROAS' },
    { value: '50+', label: 'Campaigns Managed' },
    { value: '90%', label: 'Client Retention' }
  ]
};