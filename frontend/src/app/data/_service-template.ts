import { ServicePageData } from '../types/service-page';

/**
 * SERVICE PAGE DATA TEMPLATE
 * 
 * Copy this file to create new service pages.
 * 
 * Instructions:
 * 1. Copy this file: cp _service-template.ts your-service-name.ts
 * 2. Replace all [PLACEHOLDER] values with your content
 * 3. Remove this comment block
 * 4. Export and use with ServicePageTemplate component
 * 
 * See web-development-service.ts and mobile-app-service.ts for examples.
 */

export const yourServiceName: ServicePageData = {
  // ========================================
  // SEO & META
  // ========================================
  seo: {
    metaTitle: '[Service Name] | [Key Benefit] | WebNDevs',
    // Example: "Web Development Services | Custom Websites & Apps | WebNDevs"
    // Max 60 characters including company name
    
    metaDescription: '[Action] [service] using [technologies]. [Key benefit] for [target audience].',
    // Example: "Get professional web development services using React, Next.js, and WordPress. Fast, secure websites that convert visitors into customers."
    // Max 155 characters
    
    urlSlug: '[service-name-services]',
    // Example: "web-development"
    // Use hyphens, all lowercase
    
    keywords: [
      '[main keyword]',
      '[secondary keyword]',
      '[long-tail variation 1]',
      '[long-tail variation 2]',
      // Add 4-8 keywords total
    ],
    
    internalLinks: [
      { text: '[Related Service 1]', url: '/services/[slug]' },
      { text: '[Related Service 2]', url: '/services/[slug]' },
      { text: 'View Our Portfolio', url: '/#portfolio' },
    ],
    
    blogSuggestions: [
      '[How to Choose the Right [Service] for Your Business]',
      '[Top Trends in [Service] for 2026]',
      '[Service] Cost Guide: What to Expect in 2026',
    ]
  },

  // ========================================
  // HERO SECTION
  // ========================================
  hero: {
    serviceName: '[Service Name] Services',
    // Example: "Web Development Services"
    // Keep it simple, include main keyword
    
    valueProposition: '[What you build] that [key benefit for customer]',
    // Example: "Build fast, secure websites that turn visitors into customers"
    // Focus on outcome, not process
    
    ctaText: 'Start Your [Service] Project',
    // Example: "Start Your Web Project"
    
    ctaSecondaryText: 'See Our Work'
    // Optional, use "View Projects" or "See Examples"
  },

  // ========================================
  // INTRODUCTION
  // ========================================
  introduction: {
    paragraph: 'We [action verb] [what] that [benefit]. Whether you need [option A] or [option B], our expert team [process] to deliver [specific outcomes].',
    // Example: "We build modern websites that actually work for your business. Whether you need a simple landing page or complex platform, our expert developers deliver fast, secure solutions."
    // Keep to 2-3 sentences
    
    benefits: [
      '[Benefit 1 - be specific]',
      '[Benefit 2 - include outcome]',
      '[Benefit 3 - add technical detail]',
      '[Benefit 4 - mention speed/quality]',
      '[Benefit 5 - address common concern]',
      // 4-6 benefits, each starting with action verb or outcome
    ]
  },

  // ========================================
  // KEY BENEFITS (4-6 cards)
  // ========================================
  keyBenefits: [
    {
      icon: '⚡', // Choose relevant emoji
      title: '[Result/Outcome]',
      description: '[How it helps their business in 1-2 sentences with specific details].'
    },
    {
      icon: '🎯',
      title: '[Business Impact]',
      description: '[Quantify when possible, explain the benefit].'
    },
    {
      icon: '🔒',
      title: '[Trust/Quality Factor]',
      description: '[Address common concern or fear].'
    },
    {
      icon: '📱',
      title: '[Technical Advantage]',
      description: '[Explain technical benefit in simple terms].'
    },
    {
      icon: '♾️',
      title: '[Scalability/Future-proofing]',
      description: '[Show long-term value].'
    },
    {
      icon: '🛠️',
      title: '[Ease of Use/Support]',
      description: '[Highlight convenience or ongoing benefit].'
    },
  ],

  // ========================================
  // SERVICES BREAKDOWN (6-8 items)
  // ========================================
  servicesBreakdown: {
    heading: 'What We [Build/Create/Deliver]',
    // Example: "What We Build" or "Our Services"
    
    items: [
      {
        title: '[Specific Service Type]',
        description: '[What you deliver] for [use case].'
      },
      {
        title: '[Another Service Type]',
        description: '[Specific outcome] with [key features].'
      },
      {
        title: '[Third Service Type]',
        description: '[Clear value proposition] for [target use].'
      },
      {
        title: '[Fourth Service Type]',
        description: '[Benefits] and [features].'
      },
      {
        title: '[Fifth Service Type]',
        description: '[What makes it special].'
      },
      {
        title: '[Sixth Service Type]',
        description: '[Integration or additional value].'
      },
      {
        title: '[Seventh Service Type]',
        description: '[Nice-to-have or premium option].'
      },
      {
        title: '[Eighth Service Type]',
        description: '[Ongoing service or support].'
      },
    ]
  },

  // ========================================
  // PROCESS (5 steps)
  // ========================================
  process: [
    {
      number: '01',
      title: 'Discovery & [Strategy/Planning]',
      description: 'We [learn/understand/analyze] [what] to [create/develop] [outcome].'
    },
    {
      number: '02',
      title: '[Design/Planning] & [Prototype/Strategy]',
      description: '[What you create] that shows exactly [what they get].'
    },
    {
      number: '03',
      title: '[Development/Build] & [Implementation]',
      description: 'Our team [builds/creates] using [methodology/tools].'
    },
    {
      number: '04',
      title: '[Testing/Quality] & [Launch/Deployment]',
      description: '[QA process] ensures [outcome/quality standard].'
    },
    {
      number: '05',
      title: '[Support/Optimization] & [Growth]',
      description: '[Ongoing service] to [maintain/improve/grow].'
    }
  ],

  // ========================================
  // USE CASES (4-6 audiences)
  // ========================================
  useCases: {
    heading: 'Who [Needs/Benefits From] This?',
    
    audiences: [
      {
        title: '[Audience Type 1]',
        description: '[How this service helps them specifically].'
      },
      {
        title: '[Audience Type 2]',
        description: '[Their unique benefit or use case].'
      },
      {
        title: '[Audience Type 3]',
        description: '[Why this works for them].'
      },
      {
        title: '[Audience Type 4]',
        description: '[Specific outcome for this group].'
      },
      {
        title: '[Audience Type 5]',
        description: '[Another use case or benefit].'
      },
      {
        title: '[Audience Type 6]',
        description: '[Final audience or enterprise option].'
      },
    ]
  },

  // ========================================
  // RESULTS / PORTFOLIO (4-6 projects)
  // ========================================
  results: {
    heading: 'Real Results We\'ve Delivered',
    
    projects: [
      {
        title: '[Project Name]',
        result: '[What you built and achieved]',
        metric: '[+X% metric] or [X users/revenue]'
      },
      {
        title: '[Project Name]',
        result: '[Technical achievement or feature]',
        metric: '[Quantifiable result]'
      },
      {
        title: '[Project Name]',
        result: '[Business outcome delivered]',
        metric: '[Growth or improvement]'
      },
      {
        title: '[Project Name]',
        result: '[Another success story]',
        metric: '[Time saved or efficiency gained]'
      },
    ]
  },

  // ========================================
  // FAQ (6-10 questions) - CRITICAL FOR AEO
  // ========================================
  faq: [
    {
      question: 'What is [service name]?',
      answer: '[Service name] is [definition]. It includes [scope]. At WebNDevs, we [what you deliver].'
    },
    {
      question: 'How much does [service] cost?',
      answer: '[Service] costs typically range from $[low] for [simple option] to $[high]+ for [complex option]. The final price depends on [factors]. We provide detailed quotes after understanding your specific requirements.'
    },
    {
      question: 'How long does it take to [complete service]?',
      answer: 'A [simple project] takes [X weeks]. [Medium complexity] takes [Y weeks]. [Complex projects] typically take [Z weeks]. This includes [phases]. We provide realistic timelines during planning.'
    },
    {
      question: '[Technology question specific to service]?',
      answer: '[Direct answer about technology/approach]. [Brief explanation]. [How it benefits them].'
    },
    {
      question: 'Do you provide [support/maintenance/updates]?',
      answer: 'Yes! [What\'s included]. We also offer [ongoing services]. We\'re here for the long term.'
    },
    {
      question: '[Feature availability question]?',
      answer: '[Yes/No, direct answer]. [Explanation]. [Additional context if needed].'
    },
    {
      question: '[Common objection or concern]?',
      answer: '[Address the concern directly]. [Provide reassurance]. [Highlight your advantage].'
    },
    {
      question: 'What makes WebNDevs different for [service]?',
      answer: '[Your unique approach]. [Key differentiator]. [Why clients choose you].'
    },
  ],

  // ========================================
  // FINAL CTA
  // ========================================
  finalCTA: {
    headline: 'Ready to [Start/Build/Launch] Your [Service]?',
    subtext: 'Get a free [consultation/proposal/quote] and [benefit] within [timeframe]',
    buttonText: 'Start Your [Service] Today'
  },

  // ========================================
  // STATS (optional but recommended)
  // ========================================
  stats: [
    { value: '[X weeks/months]', label: '[Metric Name]' },
    { value: '[Number]+', label: '[Achievement]' },
    { value: '[Percentage]%', label: '[Quality Metric]' },
    { value: '[Speed/Time]', label: '[Performance Metric]' }
  ]
};

/**
 * CONTENT WRITING TIPS:
 * 
 * 1. Be Specific
 *    ✅ "2-4 weeks for standard websites"
 *    ❌ "Fast delivery"
 * 
 * 2. Use Numbers
 *    ✅ "+250% sales increase"
 *    ❌ "Significant improvement"
 * 
 * 3. Focus on Benefits
 *    ✅ "Save 15 hours per week"
 *    ❌ "Automation features"
 * 
 * 4. Keep It Simple
 *    ✅ "We build websites that convert"
 *    ❌ "We leverage cutting-edge paradigms"
 * 
 * 5. Answer Directly
 *    ✅ "Yes, we provide ongoing support..."
 *    ❌ "Support is available in certain circumstances..."
 * 
 * See CONTENT-CREATION-GUIDE.md for detailed writing guidelines.
 */
