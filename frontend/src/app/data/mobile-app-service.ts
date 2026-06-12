import { ServicePageData } from '../types/service-page';

/**
 * EXAMPLE: Mobile App Development Service Page Data
 * 
 * This demonstrates how the same template works for a different service.
 * Just populate the data structure and the template handles the rest!
 */

export const mobileAppService: ServicePageData = {
  // SEO & Meta
  seo: {
    metaTitle: 'Mobile App Development Services | iOS & Android Apps | WebNDevs',
    metaDescription: 'Professional mobile app development for iOS and Android. We build native and cross-platform apps that users love. React Native, Swift, Kotlin development services.',
    urlSlug: 'mobile-app-development',
    keywords: [
      'mobile app development',
      'iOS app development',
      'Android app development',
      'React Native development',
      'cross-platform app development',
      'native app development',
      'mobile application development services'
    ],
    internalLinks: [
      { text: 'Web Development Services', url: '/services/web-development' },
      { text: 'UI/UX Design Services', url: '/services/ui-ux-design' },
      { text: 'View Our Portfolio', url: '/#portfolio' }
    ],
    blogSuggestions: [
      'Native vs Cross-Platform: Which is Right for Your Mobile App?',
      'How Much Does It Cost to Build a Mobile App in 2026?',
      'Mobile App Development Timeline: From Idea to App Store'
    ]
  },

  // Hero Section
  hero: {
    serviceName: 'Mobile App Development Services',
    valueProposition: 'Build powerful iOS and Android apps that your customers will love using',
    ctaText: 'Start Your App Project',
    ctaSecondaryText: 'See Our Apps'
  },

  // Introduction
  introduction: {
    paragraph: 'We build mobile apps that people actually want to use. Whether you need an iOS app, Android app, or both, our experienced developers create fast, intuitive, and feature-rich mobile experiences that keep users engaged.',
    benefits: [
      'Native iOS and Android apps or cross-platform solutions',
      'Intuitive user interfaces designed for mobile',
      'Secure backend infrastructure and API integration',
      'App Store and Google Play submission support',
      'Post-launch updates and ongoing maintenance'
    ]
  },

  // Key Benefits
  keyBenefits: [
    {
      icon: '📱',
      title: 'Native Performance',
      description: 'Apps built for speed and smooth user experience, taking full advantage of device capabilities.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Pixel-perfect interfaces that follow iOS and Android design guidelines while matching your brand.'
    },
    {
      icon: '🔔',
      title: 'Push Notifications',
      description: 'Keep users engaged with targeted notifications, updates, and personalized messaging.'
    },
    {
      icon: '☁️',
      title: 'Cloud Integration',
      description: 'Seamless sync across devices with secure cloud storage and real-time data updates.'
    },
    {
      icon: '💳',
      title: 'Payment Integration',
      description: 'Accept payments securely with Stripe, PayPal, Apple Pay, and Google Pay integration.'
    },
    {
      icon: '📊',
      title: 'Analytics Built-In',
      description: 'Track user behavior and app performance to make data-driven improvements.'
    }
  ],

  // Services Breakdown
  servicesBreakdown: {
    heading: 'Mobile App Solutions We Build',
    items: [
      {
        title: 'iOS App Development',
        description: 'Native iPhone and iPad apps built with Swift, optimized for the Apple ecosystem.'
      },
      {
        title: 'Android App Development',
        description: 'Native Android apps built with Kotlin, compatible with thousands of devices.'
      },
      {
        title: 'Cross-Platform Apps',
        description: 'Build once, deploy everywhere with React Native—save time and budget.'
      },
      {
        title: 'E-commerce Apps',
        description: 'Mobile shopping experiences with product catalogs, cart, and secure checkout.'
      },
      {
        title: 'Social & Communication Apps',
        description: 'Chat, messaging, and social networking features with real-time updates.'
      },
      {
        title: 'On-Demand Service Apps',
        description: 'Apps like Uber or DoorDash with GPS tracking, booking, and payments.'
      },
      {
        title: 'Health & Fitness Apps',
        description: 'Workout tracking, nutrition planning, and health monitoring applications.'
      },
      {
        title: 'App Store Optimization',
        description: 'Help your app get discovered and downloaded with ASO best practices.'
      }
    ]
  },

  // Process
  process: [
    {
      number: '01',
      title: 'Strategy & Planning',
      description: 'We define features, user flows, and technical requirements for your mobile app.'
    },
    {
      number: '02',
      title: 'UI/UX Design',
      description: 'Create wireframes and high-fidelity designs that match platform guidelines.'
    },
    {
      number: '03',
      title: 'Development & Testing',
      description: 'Build your app with clean code and test across real devices and scenarios.'
    },
    {
      number: '04',
      title: 'App Store Launch',
      description: 'Handle submission, approval, and launch on Apple App Store and Google Play.'
    },
    {
      number: '05',
      title: 'Updates & Growth',
      description: 'Continue improving your app with new features, updates, and optimizations.'
    }
  ],

  // Use Cases
  useCases: {
    heading: 'Who Needs Mobile Apps?',
    audiences: [
      {
        title: 'Startups',
        description: 'Launch your MVP quickly and iterate based on user feedback.'
      },
      {
        title: 'E-commerce Businesses',
        description: 'Give customers a seamless mobile shopping experience.'
      },
      {
        title: 'Service Providers',
        description: 'Enable booking, scheduling, and service delivery through mobile.'
      },
      {
        title: 'Healthcare Companies',
        description: 'Patient portals, telemedicine, and health tracking apps.'
      },
      {
        title: 'Fitness Brands',
        description: 'Workout tracking, coaching, and community engagement apps.'
      },
      {
        title: 'Content Creators',
        description: 'Deliver exclusive content and build community with a branded app.'
      }
    ]
  },

  // Results
  results: {
    heading: 'Mobile Apps We\'ve Built',
    projects: [
      {
        title: 'HealthTrack Fitness App',
        result: 'AI-powered workout tracker with personalized recommendations',
        metric: '50K+ downloads, 4.8★'
      },
      {
        title: 'QuickFood Delivery App',
        result: 'On-demand food delivery with real-time GPS tracking',
        metric: '10K daily active users'
      },
      {
        title: 'MindfulMoments Meditation',
        result: 'Guided meditation and wellness app with premium subscriptions',
        metric: '$50K monthly revenue'
      },
      {
        title: 'ShopLocal E-commerce',
        result: 'Mobile shopping app with AR product preview',
        metric: '3x mobile conversion rate'
      }
    ]
  },

  // FAQ (AEO Critical)
  faq: [
    {
      question: 'What is mobile app development?',
      answer: 'Mobile app development is the process of creating software applications that run on smartphones and tablets. This includes iOS apps for iPhones and iPads, Android apps for Samsung and other devices, and cross-platform apps that work on both. At WebNDevs, we handle everything from design to development to App Store submission.'
    },
    {
      question: 'How much does it cost to build a mobile app?',
      answer: 'Mobile app development costs typically range from $15,000 for a simple app to $50,000-$150,000+ for complex apps with advanced features. Cross-platform apps using React Native can cost 30-40% less than building separate native apps. Final cost depends on features, design complexity, and platform choice. We provide detailed quotes after understanding your requirements.'
    },
    {
      question: 'How long does it take to develop a mobile app?',
      answer: 'A simple mobile app takes 8-12 weeks. Medium complexity apps take 12-20 weeks. Complex apps with custom features can take 20-30 weeks. This includes design, development, testing, and App Store submission. We provide realistic timelines during planning and keep you updated throughout development.'
    },
    {
      question: 'Should I build native or cross-platform?',
      answer: 'Native apps (Swift for iOS, Kotlin for Android) offer best performance and platform-specific features but cost more. Cross-platform apps (React Native) cost less and launch faster on both platforms but may have slight performance trade-offs. We help you choose based on your budget, timeline, and feature requirements.'
    },
    {
      question: 'Do you help with App Store submission?',
      answer: 'Yes! We handle the entire App Store and Google Play submission process, including creating app listings, preparing screenshots, writing descriptions, and managing the approval process. We also help with ongoing updates and version management after launch.'
    },
    {
      question: 'Will my app work on both iPhone and Android?',
      answer: 'That depends on your choice. We can build native apps for iOS only, Android only, or both. Alternatively, we can build a cross-platform app using React Native that works on both platforms with a single codebase, saving you time and money.'
    },
    {
      question: 'Can you add features to my existing app?',
      answer: 'Yes! We can take over existing mobile apps and add new features, fix bugs, improve performance, or completely redesign the user experience. We work with apps built in any technology and can migrate them to modern frameworks if needed.'
    },
    {
      question: 'What happens after my app launches?',
      answer: 'After launch, we provide ongoing support including bug fixes, performance monitoring, and updates for new iOS and Android versions. We also offer feature development, analytics implementation, and App Store optimization to help your app succeed long-term.'
    }
  ],

  // Final CTA
  finalCTA: {
    headline: 'Ready to Build Your Mobile App?',
    subtext: 'Get a free app consultation and detailed development proposal',
    buttonText: 'Start Your App Today'
  },

  // Stats
  stats: [
    { value: '8-12 weeks', label: 'Development Time' },
    { value: '15+', label: 'Apps Launched' },
    { value: '4.8★', label: 'Average Rating' },
    { value: '100%', label: 'Store Approval' }
  ]
};
