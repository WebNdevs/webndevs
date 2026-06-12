import { ServicePageData } from '../types/service-page';

export const automationService: ServicePageData = {
  seo: {
    metaTitle: 'AI Automation Services | Workflow & Business Automation | WebNDevs',
    metaDescription: 'Automate repetitive tasks, customer workflows, lead management, and business operations with AI-powered automation solutions by WebNDevs.',
    urlSlug: 'automation-services',
    keywords: [
      'AI automation services',
      'workflow automation',
      'business process automation',
      'CRM automation',
      'chatbot automation',
      'AI workflow systems',
      'automation agency',
      'business automation solutions'
    ],
    internalLinks: [
      { text: 'Web Development Services', url: '/services/web-development' },
      { text: 'UI/UX Design Services', url: '/services/ui-ux-design' },
      { text: 'View Our Portfolio', url: '/#portfolio' }
    ],
    blogSuggestions: [
      'How AI Automation Saves Businesses Hundreds of Hours',
      'Top Business Processes You Should Automate in 2026',
      'AI Automation vs Manual Workflows: What’s Better?'
    ]
  },

  hero: {
    serviceName: 'Automation Services',
    valueProposition: 'Automate repetitive work and scale your business operations efficiently',
    ctaText: 'Automate Your Business',
    ctaSecondaryText: 'See Automation Solutions'
  },

  introduction: {
    paragraph: 'We build smart automation systems that eliminate repetitive tasks, reduce human errors, and improve business efficiency. From CRM workflows to AI-powered systems, we help businesses save time and focus on growth.',
    benefits: [
      'Reduce manual repetitive work',
      'Increase team productivity',
      'Improve workflow efficiency',
      'Save operational costs',
      'Integrate tools into one automated system'
    ]
  },

  keyBenefits: [
    {
      icon: '🤖',
      title: 'AI-Powered Workflows',
      description: 'Automate complex tasks using AI and intelligent business logic.'
    },
    {
      icon: '⏱️',
      title: 'Save Time',
      description: 'Reduce hours of manual work through automated systems and integrations.'
    },
    {
      icon: '📈',
      title: 'Scale Faster',
      description: 'Automation helps your business handle more work without increasing workload.'
    },
    {
      icon: '🔗',
      title: 'System Integrations',
      description: 'Connect CRMs, forms, APIs, payment gateways, and marketing tools together.'
    },
    {
      icon: '💬',
      title: 'Customer Automation',
      description: 'Automated replies, lead tracking, onboarding, and customer communication.'
    },
    {
      icon: '🛠️',
      title: 'Custom Solutions',
      description: 'Tailored automation systems designed around your exact workflow.'
    }
  ],

  servicesBreakdown: {
    heading: 'Automation Solutions We Build',
    items: [
      {
        title: 'CRM Automation',
        description: 'Automate lead tracking, follow-ups, customer segmentation, and sales workflows.'
      },
      {
        title: 'AI Chatbots',
        description: 'Smart AI assistants for customer support, FAQs, and lead generation.'
      },
      {
        title: 'Workflow Automation',
        description: 'Automate repetitive business operations and internal workflows.'
      },
      {
        title: 'API Integration',
        description: 'Connect different platforms and tools to work together automatically.'
      },
      {
        title: 'Email Automation',
        description: 'Automated marketing campaigns, onboarding emails, and follow-up sequences.'
      },
      {
        title: 'Data Automation',
        description: 'Automatic syncing, reporting, and management of business data.'
      }
    ]
  },

  process: [
    {
      number: '01',
      title: 'Workflow Analysis',
      description: 'We study your current process and identify repetitive bottlenecks.'
    },
    {
      number: '02',
      title: 'Automation Strategy',
      description: 'We plan optimized automation systems tailored to your business.'
    },
    {
      number: '03',
      title: 'Development & Integration',
      description: 'We build and connect automation tools, APIs, and workflows.'
    },
    {
      number: '04',
      title: 'Testing & Optimization',
      description: 'Every automation is tested for speed, accuracy, and reliability.'
    },
    {
      number: '05',
      title: 'Deployment & Support',
      description: 'We launch the automation system and provide continuous improvements.'
    }
  ],

  useCases: {
    heading: 'Who Needs Automation?',
    audiences: [
      {
        title: 'Startups',
        description: 'Automate workflows early and grow efficiently with smaller teams.'
      },
      {
        title: 'Agencies',
        description: 'Handle clients, reporting, and leads with automated systems.'
      },
      {
        title: 'E-commerce Businesses',
        description: 'Automate orders, customer communication, and inventory workflows.'
      },
      {
        title: 'Sales Teams',
        description: 'Streamline lead nurturing and follow-up processes.'
      }
    ]
  },

  results: {
    heading: 'Business Results',
    projects: [
      {
        title: 'CRM Lead Automation',
        result: 'Built automated lead assignment and follow-up workflows',
        metric: '70% faster response time'
      },
      {
        title: 'AI Support Assistant',
        result: 'Reduced customer support workload using AI chatbot systems',
        metric: '60% fewer manual queries'
      }
    ]
  },

  faq: [
    {
      question: 'What are automation services?',
      answer: 'Automation services help businesses reduce repetitive manual work using software, AI, workflows, and integrations.'
    },
    {
      question: 'Can automation save business costs?',
      answer: 'Yes. Automation reduces repetitive labor, improves productivity, and minimizes operational inefficiencies.'
    },
    {
      question: 'What tools do you use for automation?',
      answer: 'We use APIs, AI systems, CRMs, workflow tools, custom backend systems, and cloud integrations depending on project needs.'
    }
  ],

  finalCTA: {
    headline: 'Ready to Automate Your Business?',
    subtext: 'Save time, reduce workload, and scale smarter with automation systems.',
    buttonText: 'Get Automation Consultation'
  },

  stats: [
    { value: '80%', label: 'Manual Work Reduced' },
    { value: '24/7', label: 'Automated Operations' },
    { value: '50+', label: 'Processes Automated' },
    { value: '3x', label: 'Workflow Efficiency' }
  ]
};