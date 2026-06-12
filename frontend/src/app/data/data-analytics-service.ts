// data-analytics-service.ts
import { ServicePageData } from '../types/service-page';

export const dataAnalyticsService: ServicePageData = {
  seo: {
    metaTitle: 'Data Analytics Services | Dashboards, Reports & Business Insights | WebNDevs',
    metaDescription: 'Turn raw business data into clear insights with data analytics, dashboards, reporting automation, KPI tracking, and business intelligence solutions by WebNDevs.',
    urlSlug: 'data-analytics',
    keywords: [
      'data analytics services',
      'business intelligence services',
      'dashboard development',
      'data visualization',
      'KPI dashboard',
      'reporting automation',
      'business analytics',
      'data reporting services'
    ],
    internalLinks: [
      { text: 'Automation Services', url: '/services/automation-services' },
      { text: 'Web Development Services', url: '/services/web-development' },
      { text: 'Digital Marketing Services', url: '/services/digital-marketing' }
    ],
    blogSuggestions: [
      'How Data Analytics Helps Businesses Make Better Decisions',
      'Top KPIs Every Business Should Track',
      'Dashboard vs Report: Which One Does Your Business Need?'
    ]
  },

  hero: {
    serviceName: 'Data Analytics Services',
    valueProposition: 'Turn business data into clear dashboards, insights, and smarter decisions',
    ctaText: 'Analyze My Data',
    ctaSecondaryText: 'View Dashboard Solutions'
  },

  introduction: {
    paragraph: 'We help businesses understand their data through dashboards, reports, analytics systems, and automated insights. Instead of guessing, you get clear numbers that show what is working, what is failing, and where to improve.',
    benefits: [
      'Clear dashboards for business decisions',
      'Automated reporting and KPI tracking',
      'Better understanding of sales, users, and performance',
      'Data visualization that is easy to read',
      'Actionable insights instead of raw spreadsheets'
    ]
  },

  keyBenefits: [
    {
      icon: '📊',
      title: 'Clear Dashboards',
      description: 'Visual dashboards that show your most important business numbers in one place.'
    },
    {
      icon: '📈',
      title: 'Smarter Decisions',
      description: 'Use real data to understand growth, performance, and business opportunities.'
    },
    {
      icon: '⚙️',
      title: 'Automated Reports',
      description: 'Save time with reports that update automatically without manual spreadsheet work.'
    },
    {
      icon: '🔍',
      title: 'Deep Business Insights',
      description: 'Find trends, patterns, and hidden problems inside your business data.'
    },
    {
      icon: '🎯',
      title: 'KPI Tracking',
      description: 'Track the numbers that matter most for sales, marketing, operations, and growth.'
    },
    {
      icon: '🔗',
      title: 'Data Integration',
      description: 'Connect data from websites, CRMs, ads, spreadsheets, and business tools.'
    }
  ],

  servicesBreakdown: {
    heading: 'Data Analytics Solutions We Build',
    items: [
      {
        title: 'Business Dashboards',
        description: 'Custom dashboards to track sales, revenue, users, leads, operations, and KPIs.'
      },
      {
        title: 'Data Visualization',
        description: 'Charts, graphs, and visual reports that make complex data easy to understand.'
      },
      {
        title: 'Reporting Automation',
        description: 'Automated reports that update on schedule and reduce manual work.'
      },
      {
        title: 'KPI Tracking Systems',
        description: 'Monitor your most important business metrics in real time.'
      },
      {
        title: 'Marketing Analytics',
        description: 'Track campaign performance, traffic, conversions, and ad ROI.'
      },
      {
        title: 'Sales Analytics',
        description: 'Analyze leads, sales performance, revenue, customer behavior, and growth trends.'
      },
      {
        title: 'Data Cleaning',
        description: 'Organize, clean, and structure messy data for accurate reporting.'
      },
      {
        title: 'Custom Analytics Tools',
        description: 'Build analytics panels and internal tools based on your business workflow.'
      }
    ]
  },

  process: [
    {
      number: '01',
      title: 'Data Discovery',
      description: 'We understand your business goals, available data sources, and reporting needs.'
    },
    {
      number: '02',
      title: 'KPI Planning',
      description: 'We define the most important metrics your business should track.'
    },
    {
      number: '03',
      title: 'Data Setup & Integration',
      description: 'We connect, clean, and structure your data from different platforms.'
    },
    {
      number: '04',
      title: 'Dashboard Development',
      description: 'We build clear, interactive dashboards and reports for decision-making.'
    },
    {
      number: '05',
      title: 'Testing & Optimization',
      description: 'We verify data accuracy, improve performance, and refine visual presentation.'
    }
  ],

  useCases: {
    heading: 'Who Is This For?',
    audiences: [
      {
        title: 'Business Owners',
        description: 'Understand revenue, customers, performance, and growth without spreadsheet confusion.'
      },
      {
        title: 'Marketing Teams',
        description: 'Track campaign results, leads, conversions, traffic, and advertising performance.'
      },
      {
        title: 'Sales Teams',
        description: 'Monitor pipelines, leads, revenue, and customer behavior clearly.'
      },
      {
        title: 'E-commerce Brands',
        description: 'Analyze product sales, customer trends, inventory, and marketing ROI.'
      },
      {
        title: 'Startups',
        description: 'Track early growth metrics and make better decisions with limited resources.'
      },
      {
        title: 'Agencies',
        description: 'Create client reporting dashboards and automated performance reports.'
      }
    ]
  },

  results: {
    heading: 'Analytics Results',
    projects: [
      {
        title: 'Sales KPI Dashboard',
        result: 'Built real-time dashboard for revenue, leads, and sales performance tracking',
        metric: '15 hours/month saved'
      },
      {
        title: 'Marketing Report Automation',
        result: 'Automated campaign reporting from multiple platforms into one dashboard',
        metric: '70% faster reporting'
      },
      {
        title: 'E-commerce Analytics Panel',
        result: 'Created product, sales, and customer behavior dashboard for online store',
        metric: '+40% better inventory planning'
      },
      {
        title: 'Operations Dashboard',
        result: 'Centralized business operations data into clear visual reports',
        metric: '3x faster decisions'
      }
    ]
  },

  faq: [
    {
      question: 'What are data analytics services?',
      answer: 'Data analytics services help businesses collect, clean, analyze, and visualize data so they can make better decisions. This can include dashboards, reports, KPI tracking, data visualization, and automated reporting systems.'
    },
    {
      question: 'What type of data can you analyze?',
      answer: 'We can analyze sales data, website traffic, customer data, marketing campaigns, CRM data, e-commerce data, operations data, financial data, and spreadsheet-based business records.'
    },
    {
      question: 'Can you create custom dashboards?',
      answer: 'Yes. We build custom dashboards based on your business goals and KPIs. Dashboards can include charts, filters, tables, performance metrics, and real-time data updates.'
    },
    {
      question: 'Can reports be automated?',
      answer: 'Yes. We can automate reports so they update daily, weekly, or monthly without manual spreadsheet work. This saves time and reduces reporting errors.'
    },
    {
      question: 'Do I need a large business to use data analytics?',
      answer: 'No. Even small businesses benefit from analytics. If you have sales, leads, customers, website traffic, or marketing campaigns, analytics can help you understand what is working and what needs improvement.'
    },
    {
      question: 'Can you connect data from different platforms?',
      answer: 'Yes. We can connect data from CRMs, websites, Google Analytics, advertising platforms, spreadsheets, databases, and custom APIs depending on your business setup.'
    }
  ],

  finalCTA: {
    headline: 'Ready to Understand Your Data?',
    subtext: 'Turn raw numbers into dashboards, insights, and smarter business decisions.',
    buttonText: 'Start Data Analytics Project'
  },

  stats: [
    { value: '70%', label: 'Faster Reporting' },
    { value: '15+', label: 'Hours Saved Monthly' },
    { value: '24/7', label: 'Live Data Tracking' },
    { value: '3x', label: 'Faster Decisions' }
  ]
};