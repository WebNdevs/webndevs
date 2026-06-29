import { DynamicServiceData } from "@/components/sections/dynamic-service-section";

export const ServicePages: DynamicServiceData[] = [
  // web-development
  {
    slug: "web-development",

    seo: {
      title: "Web Development Services | Modern Websites Built to Perform | WebNDevs",
      description: "Build fast, secure, and scalable websites and web applications with WebNDevs. From business websites to custom SaaS platforms.",
      keywords: ["web development", "website development", "web design", "custom web applications", "Next.js development", "React development"],
      image: "/images/web-development.jpg",
      canonical: "/services/web-development"
    },

    // Hero Section
    hero: {
      tag: "WEB DEVELOPMENT",
      title1: "Modern Websites",
      title2: "Built to Perform",
      description:
        "From business websites to custom web applications, we build fast, secure, and scalable digital experiences that engage users and drive business growth."
    },

    tag: "Web Development",

    subheading1: "Modern Websites",

    subheading2: "Built to Perform",

    subtext:
      "We combine modern technologies, user-focused design, and scalable development practices to deliver websites that perform, convert, and grow with your business.",

    // Stats
    stats: [
      { icon: 'Clock', value: '2-4 weeks', title: 'Average Delivery Time' },
      { icon: 'Code', value: '50+', title: 'Websites Built' },
      { icon: 'Star', value: '98%', title: 'Client Satisfaction' },
      { icon: 'Zap', value: '<2s', title: 'Page Load Speed' }
    ],

    // Benefits
    benefits: {
      tag: "WHY CHOOSE US",
      subheading1: "Why Businesses Choose",
      subheading2: "Our Web Development",
      subtext:
        "We combine modern technologies, user-focused design, and scalable development practices to deliver websites that perform, convert, and grow with your business.",
      items: [
        {
          icon: 'Zap',
          title: 'Lightning-Fast Performance',
          description: 'Optimized code and modern frameworks ensure your website loads in under 2 seconds.'
        },
        {
          icon: 'Shield',
          title: 'Bank-Level Security',
          description: 'SSL certificates, secure hosting, and regular security updates protect your business.'
        },
        {
          icon: 'Smartphone',
          title: 'Mobile-First Design',
          description: 'Perfect experience on smartphones, tablets, and desktops—no matter the screen size.'
        },
        {
          icon: 'Target',
          title: 'Conversion-Optimized',
          description: 'Every element is designed to guide visitors toward becoming paying customers.'
        },
        {
          icon: 'TrendingUp',
          title: 'Infinitely Scalable',
          description: 'Start small and grow big—your website scales with your business needs.'
        },
        {
          icon: 'Wrench',
          title: 'Easy to Update',
          description: 'User-friendly CMS or custom admin panel makes managing content simple.'
        }
      ],
    },

    // Delivered (formerly deliverables)
    delivered: {
      tag: "WHAT'S INCLUDED",
      subheading1: "Everything You Need",
      subheading2: "For a Successful Launch",
      subtext:
        "Every website is delivered with the essential features, optimizations, and technical foundations needed for long-term success.",
      items: [
        {
          icon: 'Code',
          title: 'Custom Business Websites',
          description: 'Professional websites built from scratch to match your brand and convert visitors into leads.'
        },
        {
          icon: 'ShoppingCart',
          title: 'E-commerce Stores',
          description: 'Complete online stores with secure payments, inventory management, and order tracking.'
        },
        {
          icon: 'Monitor',
          title: 'Web Applications',
          description: 'Custom SaaS platforms, dashboards, and tools that solve your specific business problems.'
        },
        {
          icon: 'FileCode',
          title: 'WordPress Development',
          description: 'Custom WordPress sites with themes, plugins, and functionality tailored to your needs.'
        },
        {
          icon: 'Link',
          title: 'API Integration',
          description: 'Connect your website to payment gateways, CRMs, marketing tools, and third-party services.'
        },
        {
          icon: 'RefreshCw',
          title: 'Website Redesign',
          description: 'Transform outdated websites into modern, high-performing digital experiences.'
        },
        {
          icon: 'Rocket',
          title: 'Landing Pages',
          description: 'Conversion-focused pages designed specifically for marketing campaigns and ads.'
        },
        {
          icon: 'Headphones',
          title: 'Maintenance & Support',
          description: 'Ongoing updates, security patches, backups, and technical support after launch.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "From Idea",
      subheading2: "To Launch",
      subtext:
        "Our structured development process keeps your project transparent, collaborative, and focused on delivering measurable business results.",
      items: [  
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
        },
      ],
    },

    // Use Cases (now usecase)
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Business",
      subtext:
        "Our web development services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Rocket',
          title: 'Startups & Founders',
          description: 'Launch your MVP quickly with a scalable website that grows with your business.',
          href: '/contact'
        },
        {
          icon: 'Briefcase',
          title: 'Small Businesses',
          description: 'Get a professional online presence that competes with larger companies.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Brands',
          description: 'Sell products online with a secure, high-converting online store.',
          href: '/solutions/ecommerce'
        },
        {
          icon: 'Cpu',
          title: 'SaaS Companies',
          description: 'Build custom web applications and user dashboards for your software.',
          href: '/solutions'
        },
        {
          icon: 'Users',
          title: 'Marketing Agencies',
          description: 'White-label web development services for your clients.',
          href: '/contact'
        },
        {
          icon: 'Building',
          title: 'Enterprises',
          description: 'Large-scale web platforms with complex integrations and workflows.',
          href: '/contact'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses build high-performing websites that improve customer engagement, streamline operations, and support long-term growth.",
      items: [
        {
          title: 'FinanceFlow SaaS Platform',
          description: 'Built complete financial management platform with real-time analytics',
          results: ['10K+ users in 6 months', 'Real-time analytics dashboard', 'Secure payment processing']
        },
        {
          title: 'EcoShop E-commerce Store',
          description: 'Custom online store with optimized checkout flow',
          results: ['+250% sales increase', '2x faster checkout', 'Mobile-optimized design']
        },
        {
          title: 'TechStart Landing Page',
          description: 'High-converting landing page for startup launch',
          results: ['+180% qualified leads', 'Sub-2s load time', 'SEO optimized']
        },
        {
          title: 'HealthHub Web Application',
          description: 'Patient management system with appointment scheduling',
          results: ['20 hours/week saved', 'Automated appointment reminders', 'HIPAA-compliant']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our web development services, process, timelines, and ongoing support.",
      items: [
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
        },
      ],
    },

    // CTA (now structured as ShortCTAProps)
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Build Your Website?',
        description: 'Get a free consultation and detailed project proposal within 24 hours.',
        url: '#get-started'
      }
    },
  },
  // mobile-app-development
  {

    slug: "mobile-app-development",

    seo: {
      title: "Mobile App Development Services | iOS & Android Apps | WebNDevs",
      description: "Professional mobile app development for iOS and Android. We build native and cross-platform apps that users love.",
      keywords: ["mobile app development", "iOS app development", "Android app development", "React Native", "cross-platform app"],
      image: "/images/mobile-app.jpg",
      canonical: "/services/mobile-app-development"
    },

    // Hero Section
    hero: {
      tag: "MOBILE APP DEVELOPMENT",
      title1: "Mobile Apps",
      title2: "Built for Every Platform",
      description:
        "Develop powerful iOS and Android applications with exceptional performance, intuitive user experiences, and scalable architectures that grow with your business."
    },

    tag: "Mobile App Development",

    subheading1: "Mobile Apps",

    subheading2: "Built for Every Platform",

    subtext:
      "We build mobile apps that people actually want to use. Whether you need an iOS app, Android app, or both, our experienced developers create fast, intuitive, and feature-rich mobile experiences that keep users engaged.",

    // Stats
    stats: [
      { icon: 'Clock', value: '8-12 weeks', title: 'Development Time' },
      { icon: 'Smartphone', value: '15+', title: 'Apps Launched' },
      { icon: 'Star', value: '4.8★', title: 'Average Rating' },
      { icon: 'Check', value: '100%', title: 'Store Approval' }
    ],

    // Benefits
    benefits: {
      tag: "WHY MOBILE APPS",
      subheading1: "Why Mobile Apps",
      subheading2: "Matter",
      subtext:
        "Mobile apps help businesses reach customers on-the-go, improve engagement, and provide seamless experiences on smartphones and tablets.",
      items: [
        {
          icon: 'Smartphone',
          title: 'Native Performance',
          description: 'Apps built for speed and smooth user experience, taking full advantage of device capabilities.'
        },
        {
          icon: 'Palette',
          title: 'Beautiful Design',
          description: 'Pixel-perfect interfaces that follow iOS and Android design guidelines while matching your brand.'
        },
        {
          icon: 'Bell',
          title: 'Push Notifications',
          description: 'Keep users engaged with targeted notifications, updates, and personalized messaging.'
        },
        {
          icon: 'Cloud',
          title: 'Cloud Integration',
          description: 'Seamless sync across devices with secure cloud storage and real-time data updates.'
        },
        {
          icon: 'CreditCard',
          title: 'Payment Integration',
          description: 'Accept payments securely with Stripe, PayPal, Apple Pay, and Google Pay integration.'
        },
        {
          icon: 'BarChart3',
          title: 'Analytics Built-In',
          description: 'Track user behavior and app performance to make data-driven improvements.'
        }
      ],
    },

    // Delivered
    delivered: {
      tag: "SOLUTIONS WE BUILD",
      subheading1: "Mobile Apps",
      subheading2: "For Every Need",
      subtext:
        "From e-commerce to healthcare, we build mobile applications tailored to your industry and business requirements.",
      items: [
        {
          icon: 'Smartphone',
          title: 'iOS App Development',
          description: 'Native iPhone and iPad apps built with Swift, optimized for the Apple ecosystem.'
        },
        {
          icon: 'Smartphone',
          title: 'Android App Development',
          description: 'Native Android apps built with Kotlin, compatible with thousands of devices.'
        },
        {
          icon: 'Layers',
          title: 'Cross-Platform Apps',
          description: 'Build once, deploy everywhere with React Native—save time and budget.'
        },
        {
          icon: 'ShoppingCart',
          title: 'E-commerce Apps',
          description: 'Mobile shopping experiences with product catalogs, cart, and secure checkout.'
        },
        {
          icon: 'MessageCircle',
          title: 'Social & Communication Apps',
          description: 'Chat, messaging, and social networking features with real-time updates.'
        },
        {
          icon: 'Map',
          title: 'On-Demand Service Apps',
          description: 'Apps like Uber or DoorDash with GPS tracking, booking, and payments.'
        },
        {
          icon: 'Heart',
          title: 'Health & Fitness Apps',
          description: 'Workout tracking, nutrition planning, and health monitoring applications.'
        },
        {
          icon: 'TrendingUp',
          title: 'App Store Optimization',
          description: 'Help your app get discovered and downloaded with ASO best practices.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "How We",
      subheading2: "Build Apps",
      subtext:
        "Our structured approach ensures every mobile app is designed, built, tested, and launched successfully.",
      items: [  
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
        },
      ],
    },

    // Use Cases
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Business",
      subtext:
        "Our mobile app development services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Rocket',
          title: 'Startups',
          description: 'Launch your MVP quickly and iterate based on user feedback.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Businesses',
          description: 'Give customers a seamless mobile shopping experience.',
          href: '/solutions/ecommerce'
        },
        {
          icon: 'Calendar',
          title: 'Service Providers',
          description: 'Enable booking, scheduling, and service delivery through mobile.',
          href: '/contact'
        },
        {
          icon: 'HeartPulse',
          title: 'Healthcare Companies',
          description: 'Patient portals, telemedicine, and health tracking apps.',
          href: '/industries/healthcare'
        },
        {
          icon: 'BarChart3',
          title: 'Fitness Brands',
          description: 'Workout tracking, coaching, and community engagement apps.',
          href: '/contact'
        },
        {
          icon: 'Users',
          title: 'Content Creators',
          description: 'Deliver exclusive content and build community with a branded app.',
          href: '/contact'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses build successful mobile apps that users love and download.",
      items: [
        {
          title: 'HealthTrack Fitness App',
          description: 'AI-powered workout tracker with personalized recommendations',
          results: ['50K+ downloads', '4.8★ app rating', 'AI personalization engine']
        },
        {
          title: 'QuickFood Delivery App',
          description: 'On-demand food delivery with real-time GPS tracking',
          results: ['10K daily active users', 'Real-time tracking', 'Multi-restaurant support']
        },
        {
          title: 'MindfulMoments Meditation',
          description: 'Guided meditation and wellness app with premium subscriptions',
          results: ['$50K monthly revenue', 'Premium subscription model', 'Guided audio sessions']
        },
        {
          title: 'ShopLocal E-commerce',
          description: 'Mobile shopping app with AR product preview',
          results: ['3x mobile conversion rate', 'AR product preview', 'Seamless checkout']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our mobile app development services.",
      items: [
        {
          question: 'What is mobile app development?',
          answer: 'Mobile app development is the process of creating software applications that run on smartphones and tablets. This includes iOS apps for iPhones and iPads, Android apps for Samsung and other devices, and cross-platform apps that work on both.'
        },
        {
          question: 'How much does it cost to build a mobile app?',
          answer: 'Mobile app development costs typically range from $15,000 for a simple app to $50,000-$150,000+ for complex apps with advanced features. Cross-platform apps using React Native can cost 30-40% less than building separate native apps.'
        },
        {
          question: 'How long does it take to develop a mobile app?',
          answer: 'A simple mobile app takes 8-12 weeks. Medium complexity apps take 12-20 weeks. Complex apps with custom features can take 20-30 weeks. This includes design, development, testing, and App Store submission.'
        },
        {
          question: 'Should I build native or cross-platform?',
          answer: 'Native apps (Swift for iOS, Kotlin for Android) offer best performance and platform-specific features but cost more. Cross-platform apps (React Native) cost less and launch faster on both platforms but may have slight performance trade-offs.'
        },
        {
          question: 'Do you help with App Store submission?',
          answer: 'Yes! We handle the entire App Store and Google Play submission process, including creating app listings, preparing screenshots, writing descriptions, and managing the approval process.'
        },
        {
          question: 'Will my app work on both iPhone and Android?',
          answer: "That depends on your choice. We can build native apps for iOS only, Android only, or both. Alternatively, we can build a cross-platform app using React Native that works on both platforms with a single codebase."
        },
        {
          question: 'Can you add features to my existing app?',
          answer: "Yes! We can take over existing mobile apps and add new features, fix bugs, improve performance, or completely redesign the user experience."
        },
        {
          question: 'What happens after my app launches?',
          answer: 'After launch, we provide ongoing support including bug fixes, performance monitoring, and updates for new iOS and Android versions.'
        }
      ],
    },

    // CTA
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Build Your Mobile App?',
        description: 'Get a free app consultation and detailed development proposal.',
        url: '/contact'
      }
    },

  },
  // ui-ux-design
  {

    slug: "ui-ux-design",

    seo: {
      title: "UI/UX Design Services | User Experience & Interface Design | WebNDevs",
      description: "Professional UI/UX design services for websites and mobile apps. Create intuitive, visually engaging interfaces.",
      keywords: ["UI design", "UX design", "user experience", "interface design", "Figma design", "product design"],
      image: "/images/ui-ux-design.jpg",
      canonical: "/services/ui-ux-design"
    },

    // Hero Section
    hero: {
      tag: "UI/UX DESIGN",
      title1: "Design Experiences",
      title2: "Users Love",
      description:
        "Create intuitive, visually engaging interfaces that improve usability, strengthen your brand, and deliver seamless experiences across every device."
    },

    tag: "UI/UX Design",

    subheading1: "Design Experiences",

    subheading2: "Users Love",

    subtext:
      "We design clean, modern, and conversion-focused interfaces that improve user experience and strengthen your brand identity.",

    // Stats
    stats: [
      { icon: 'Palette', value: '100+', title: 'Design Screens Created' },
      { icon: 'Star', value: '95%', title: 'User Satisfaction' },
      { icon: 'TrendingUp', value: '2x', title: 'Better Engagement' },
      { icon: 'Target', value: '100%', title: 'Mobile-First Design' }
    ],

    // Benefits
    benefits: {
      tag: "WHY UI/UX DESIGN",
      subheading1: "Why UI/UX Design",
      subheading2: "Matters",
      subtext:
        "Good UI/UX design helps businesses create interfaces that users love, improving engagement and conversions.",
      items: [
        {
          icon: 'Palette',
          title: 'Modern Visual Design',
          description: "Clean, premium interfaces designed for today's digital standards."
        },
        {
          icon: 'Smartphone',
          title: 'Responsive Experience',
          description: 'Consistent UI experience across all devices and screen sizes.'
        },
        {
          icon: 'Brain',
          title: 'User-Centered UX',
          description: 'Every design decision is focused around user behavior and usability.'
        },
        {
          icon: 'Zap',
          title: 'Higher Conversions',
          description: 'Strategic layouts designed to improve user actions and sales.'
        }
      ],
    },

    // Delivered
    delivered: {
      tag: "SERVICES WE OFFER",
      subheading1: "Design",
      subheading2: "For Every Need",
      subtext:
        "From website design to mobile apps and dashboards, we offer comprehensive UI/UX design services.",
      items: [
        {
          icon: 'Monitor',
          title: 'Website UI Design',
          description: 'Modern website interfaces focused on branding and usability.'
        },
        {
          icon: 'Smartphone',
          title: 'Mobile App Design',
          description: 'Smooth and engaging mobile app experiences for Android and iOS.'
        },
        {
          icon: 'BarChart3',
          title: 'Dashboard Design',
          description: 'Professional admin panels and SaaS dashboard interfaces.'
        },
        {
          icon: 'Rocket',
          title: 'Landing Page Design',
          description: 'Conversion-focused layouts for campaigns and advertisements.'
        },
        {
          icon: 'FileText',
          title: 'Wireframing & Prototyping',
          description: 'Interactive prototypes before development begins.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "How We",
      subheading2: "Design",
      subtext:
        "Our structured design process ensures every interface is thoughtfully designed and user-tested.",
      items: [  
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
        },
      ],
    },

    // Use Cases
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Business",
      subtext:
        "Our UI/UX design services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Rocket',
          title: 'Startups',
          description: 'Launch products with polished and modern interfaces.',
          href: '/contact'
        },
        {
          icon: 'Cpu',
          title: 'SaaS Products',
          description: 'Improve dashboard usability and user retention.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Brands',
          description: 'Create shopping experiences that increase conversions.',
          href: '/solutions/ecommerce'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses create interfaces that users love and drive conversions.",
      items: [
        {
          title: 'SaaS Dashboard Redesign',
          description: 'Improved usability and navigation flow for a B2B SaaS platform',
          results: ['+45% user engagement', 'Reduced support tickets', 'Faster task completion']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our UI/UX design services.",
      items: [
        {
          question: 'What is UI/UX design?',
          answer: 'UI design focuses on visuals and interface appearance while UX design focuses on user experience and usability.'
        },
        {
          question: 'Which tools do you use?',
          answer: 'We mainly use Figma and modern design systems for scalable UI/UX workflows.'
        }
      ],
    },

    // CTA
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Design Better Experiences?',
        description: "Let's create interfaces users enjoy using.",
        url: '/contact'
      }
    },

  },
  // digital-marketing
  {

    slug: "digital-marketing",

    seo: {
      title: "Digital Marketing Services | SEO, PPC & Growth Marketing | WebNDevs",
      description: "Grow your business with SEO, Google Ads, social media marketing, and performance-driven digital marketing strategies.",
      keywords: ["digital marketing", "SEO services", "Google Ads", "social media marketing", "content marketing", "PPC advertising"],
      image: "/images/digital-marketing.jpg",
      canonical: "/services/digital-marketing"
    },

    // Hero Section
    hero: {
      tag: "DIGITAL MARKETING",
      title1: "Grow Your",
      title2: "Digital Presence",
      description:
        "Increase your visibility, attract qualified traffic, and generate more leads with strategic SEO, content marketing, social media, and digital advertising."
    },

    tag: "Digital Marketing",

    subheading1: "Grow Your",

    subheading2: "Digital Presence",

    subtext:
      "We help businesses grow online through SEO, paid advertising, content marketing, and performance-driven digital strategies.",

    // Stats
    stats: [
      { icon: 'TrendingUp', value: '300%', title: 'Traffic Growth' },
      { icon: 'Zap', value: '4x', title: 'Average ROAS' },
      { icon: 'Target', value: '50+', title: 'Campaigns Managed' },
      { icon: 'Star', value: '90%', title: 'Client Retention' }
    ],

    // Benefits
    benefits: {
      tag: "WHY DIGITAL MARKETING",
      subheading1: "Why Digital Marketing",
      subheading2: "Matters",
      subtext:
        "Digital marketing helps businesses reach more customers, increase visibility, and drive measurable growth.",
      items: [
        {
          icon: 'TrendingUp',
          title: 'Business Growth',
          description: 'Drive more traffic, leads, and conversions consistently.'
        },
        {
          icon: 'Target',
          title: 'Targeted Marketing',
          description: 'Reach the right audience with precision campaigns.'
        },
        {
          icon: 'Search',
          title: 'SEO Optimization',
          description: 'Improve search visibility and organic rankings.'
        },
        {
          icon: 'CreditCard',
          title: 'Better ROI',
          description: 'Performance-focused marketing that maximizes returns.'
        }
      ],
    },

    // Delivered
    delivered: {
      tag: "SERVICES WE OFFER",
      subheading1: "Marketing",
      subheading2: "For Every Need",
      subtext:
        "From SEO to paid advertising, we offer comprehensive digital marketing services to help your business grow.",
      items: [
        {
          icon: 'Search',
          title: 'Search Engine Optimization',
          description: 'Technical SEO, on-page SEO, and content optimization.'
        },
        {
          icon: 'TrendingUp',
          title: 'Google Ads',
          description: 'High-converting PPC campaigns for traffic and sales.'
        },
        {
          icon: 'Users',
          title: 'Meta Ads',
          description: 'Facebook and Instagram ad campaigns focused on growth.'
        },
        {
          icon: 'FileText',
          title: 'Content Marketing',
          description: 'SEO-focused content strategy for long-term growth.'
        },
        {
          icon: 'MessageCircle',
          title: 'Social Media Marketing',
          description: 'Build engagement and visibility across social platforms.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "How We",
      subheading2: "Drive Growth",
      subtext:
        "Our structured approach ensures every marketing campaign is strategically planned and continuously optimized.",
      items: [  
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
        },
      ],
    },

    // Use Cases
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Business",
      subtext:
        "Our digital marketing services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Building',
          title: 'Local Businesses',
          description: 'Increase visibility and generate more local leads.',
          href: '/contact'
        },
        {
          icon: 'Rocket',
          title: 'Startups',
          description: 'Build online presence and attract early customers.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Brands',
          description: 'Scale online sales through paid ads and SEO.',
          href: '/solutions/ecommerce'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses grow their online presence and generate more leads.",
      items: [
        {
          title: 'SEO Growth Campaign',
          description: 'Improved rankings and organic traffic for a local business',
          results: ['+300% website traffic', 'Top 3 Google rankings', 'Sustainable organic growth']
        },
        {
          title: 'Meta Ads Campaign',
          description: 'Generated targeted leads at lower acquisition cost',
          results: ['4x ROAS', '50% lower CPA', 'Scalable ad campaigns']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our digital marketing services.",
      items: [
        {
          question: 'What digital marketing services do you provide?',
          answer: 'We provide SEO, Google Ads, Meta Ads, content marketing, and growth-focused digital marketing services.'
        },
        {
          question: 'How long does SEO take?',
          answer: 'SEO is a long-term strategy and typically starts showing strong results within 3-6 months.'
        }
      ],
    },

    // CTA
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Grow Online?',
        description: "Let's build a digital marketing strategy that drives real business growth.",
        url: '/contact'
      }
    },

  },
  // data-analytics
  {

    slug: "data-analytics",

    seo: {
      title: "Data Analytics Services | Business Dashboards & Insights | WebNDevs",
      description: "Transform your business data into actionable insights with custom dashboards, reports, and analytics solutions.",
      keywords: ["data analytics", "business intelligence", "dashboard development", "data visualization", "Power BI", "reporting automation"],
      image: "/images/data-analytics.jpg",
      canonical: "/services/data-analytics"
    },

    // Hero Section
    hero: {
      tag: "DATA ANALYTICS",
      title1: "Transform Data",
      title2: "Into Better Decisions",
      description:
        "Turn complex business data into interactive dashboards and actionable insights with Power BI solutions designed to support confident, data-driven decisions."
    },

    tag: "Data Analytics",

    subheading1: "Transform Data",

    subheading2: "Into Better Decisions",

    subtext:
      "We help businesses understand their data through dashboards, reports, analytics systems, and automated insights. Instead of guessing, you get clear numbers that show what is working, what is failing, and where to improve.",

    // Stats
    stats: [
      { icon: 'TrendingUp', value: '70%', title: 'Faster Reporting' },
      { icon: 'Clock', value: '15+', title: 'Hours Saved Monthly' },
      { icon: 'BarChart3', value: '24/7', title: 'Live Data Tracking' },
      { icon: 'Zap', value: '3x', title: 'Faster Decisions' }
    ],

    // Benefits
    benefits: {
      tag: "WHY DATA ANALYTICS",
      subheading1: "Why Data Analytics",
      subheading2: "Matters",
      subtext:
        "Data analytics helps businesses make informed decisions based on real numbers rather than guesswork.",
      items: [
        {
          icon: 'BarChart3',
          title: 'Clear Dashboards',
          description: 'Visual dashboards that show your most important business numbers in one place.'
        },
        {
          icon: 'TrendingUp',
          title: 'Smarter Decisions',
          description: 'Use real data to understand growth, performance, and business opportunities.'
        },
        {
          icon: 'RefreshCw',
          title: 'Automated Reports',
          description: 'Save time with reports that update automatically without manual spreadsheet work.'
        },
        {
          icon: 'Search',
          title: 'Deep Business Insights',
          description: 'Find trends, patterns, and hidden problems inside your business data.'
        },
        {
          icon: 'Target',
          title: 'KPI Tracking',
          description: 'Track the numbers that matter most for sales, marketing, operations, and growth.'
        },
        {
          icon: 'Database',
          title: 'Data Integration',
          description: 'Connect data from websites, CRMs, ads, spreadsheets, and business tools.'
        }
      ],
  },

  // Delivered
  delivered: {
    tag: "SOLUTIONS WE BUILD",
    subheading1: "Analytics",
    subheading2: "For Every Need",
    subtext:
      "From business dashboards to automated reporting systems, we offer comprehensive data analytics solutions.",
    items: [
      {
        icon: 'BarChart3',
        title: 'Business Dashboards',
        description: 'Custom dashboards to track sales, revenue, users, leads, operations, and KPIs.'
      },
      {
        icon: 'PieChart',
        title: 'Data Visualization',
        description: 'Charts, graphs, and visual reports that make complex data easy to understand.'
      },
      {
        icon: 'RefreshCw',
        title: 'Reporting Automation',
        description: 'Automated reports that update on schedule and reduce manual work.'
      },
      {
        icon: 'Target',
        title: 'KPI Tracking Systems',
        description: 'Monitor your most important business metrics in real time.'
      },
      {
        icon: 'TrendingUp',
        title: 'Marketing Analytics',
        description: 'Track campaign performance, traffic, conversions, and ad ROI.'
      },
      {
        icon: 'BarChart3',
        title: 'Sales Analytics',
        description: 'Analyze leads, sales performance, revenue, customer behavior, and growth trends.'
      },
      {
        icon: 'Database',
        title: 'Data Cleaning',
        description: 'Organize, clean, and structure messy data for accurate reporting.'
      },
      {
        icon: 'Cpu',
        title: 'Custom Analytics Tools',
        description: 'Build analytics panels and internal tools based on your business workflow.'
      }
    ],
  },

  // Process
  process: {
    tag: "OUR PROCESS",
    subheading1: "How We",
    subheading2: "Build Analytics",
    subtext:
      "Our structured approach ensures every analytics solution is designed, built, and optimized for your specific business needs.",
    items: [  
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
      },
    ],
  },

  // Use Cases
  usecase: {
    tag: "WHO IS THIS FOR",
    subheading1: "Solutions For",
    subheading2: "Every Business",
    subtext:
      "Our data analytics services are tailored to meet the unique needs of businesses across all industries and sizes.",
    items: [
      {
        icon: 'Building',
        title: 'Business Owners',
        description: 'Understand revenue, customers, performance, and growth without spreadsheet confusion.',
        href: '/contact'
      },
      {
        icon: 'Users',
        title: 'Marketing Teams',
        description: 'Track campaign results, leads, conversions, traffic, and advertising performance.',
        href: '/contact'
      },
      {
        icon: 'TrendingUp',
        title: 'Sales Teams',
        description: 'Monitor pipelines, leads, revenue, and customer behavior clearly.',
        href: '/contact'
      },
      {
        icon: 'ShoppingBag',
        title: 'E-commerce Brands',
        description: 'Analyze product sales, customer trends, inventory, and marketing ROI.',
        href: '/solutions/ecommerce'
      },
      {
        icon: 'Rocket',
        title: 'Startups',
        description: 'Track early growth metrics and make better decisions with limited resources.',
        href: '/contact'
      },
      {
        icon: 'Users',
        title: 'Agencies',
        description: 'Create client reporting dashboards and automated performance reports.',
        href: '/contact'
      }
    ]
  },

  // Results
  results: {
    tag: "OUR WORK",
    subheading1: "Real Projects,",
    subheading2: "Real Results",
    subtext:
      "Explore how we've helped businesses turn raw data into actionable insights and smarter decisions.",
    items: [
      {
        title: 'Sales KPI Dashboard',
        description: 'Built real-time dashboard for revenue, leads, and sales performance tracking',
        results: ['15 hours/month saved', 'Real-time sales data', 'Automated reports']
      },
      {
        title: 'Marketing Report Automation',
        description: 'Automated campaign reporting from multiple platforms into one dashboard',
        results: ['70% faster reporting', 'Multi-platform integration', 'Weekly automated insights']
      },
      {
        title: 'E-commerce Analytics Panel',
        description: 'Created product, sales, and customer behavior dashboard for online store',
        results: ['+40% better inventory planning', 'Customer behavior insights', 'Sales trend analysis']
      },
      {
        title: 'Operations Dashboard',
        description: 'Centralized business operations data into clear visual reports',
        results: ['3x faster decisions', 'Real-time operations view', 'Automated alerts']
      }
    ]
  },

  // FAQ
  faq: {
    tag: "FAQs",
    subheading1: "Frequently Asked",
    subheading2: "Questions",
    subtext:
      "Find answers to common questions about our data analytics services.",
    items: [
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
  },

  // CTA
  cta: {
    preview: {
      text: 'Explore All Services',
      url: '/services'
    },
    full: {
      text: 'Ready to Understand Your Data?',
      description: 'Turn raw numbers into dashboards, insights, and smarter business decisions.',
      url: '/contact'
    }
  },

  },
  // branding
  {

    slug: "branding-design",

    seo: {
      title: "Branding & Design Services | Logo Design & Brand Identity | WebNDevs",
      description: "Create memorable brand identities with professional logo design, brand guidelines, and visual identity systems.",
      keywords: ["branding services", "logo design", "brand identity", "brand guidelines", "visual identity", "brand strategy"],
      image: "/images/branding.jpg",
      canonical: "/services/branding-design"
    },

    // Hero Section
    hero: {
      tag: "BRANDING & DESIGN",
      title1: "Build a Brand",
      title2: "People Remember",
      description:
        "Create memorable brand identities, compelling visuals, and professional marketing materials that communicate your story and leave a lasting impression."
    },

    tag: "Branding & Design",

    subheading1: "Build a Brand",

    subheading2: "People Remember",

    subtext:
      "We help businesses create powerful brand identities that look professional, feel consistent, and communicate trust. From logo design to complete brand guidelines, we build branding systems that make your business stand out.",

    // Stats
    stats: [
      { icon: 'Clock', value: '2-4 weeks', title: 'Average Brand Delivery' },
      { icon: 'File', value: '100+', title: 'Brand Assets Created' },
      { icon: 'Star', value: '95%', title: 'Client Satisfaction' },
      { icon: 'TrendingUp', value: '3x', title: 'Better Brand Consistency' }
    ],

    // Benefits
    benefits: {
      tag: "WHY BRANDING",
      subheading1: "Why Branding",
      subheading2: "Matters",
      subtext:
        "Professional branding helps businesses stand out, build trust, and create lasting impressions with their audience.",
      items: [
        {
          icon: 'Target',
          title: 'Clear Brand Positioning',
          description: 'Define how your brand should look, sound, and stand apart from competitors.'
        },
        {
          icon: 'Pen',
          title: 'Professional Logo Design',
          description: 'Get a unique logo that represents your business clearly and memorably.'
        },
        {
          icon: 'BookOpen',
          title: 'Complete Brand Guidelines',
          description: 'Maintain consistency with typography, colors, logo usage, and visual rules.'
        },
        {
          icon: 'Handshake',
          title: 'Stronger Trust',
          description: 'Professional branding helps customers take your business more seriously.'
        },
        {
          icon: 'Smartphone',
          title: 'Platform-Ready Assets',
          description: 'Get branding assets prepared for websites, social media, ads, and print.'
        },
        {
          icon: 'Rocket',
          title: 'Better Market Presence',
          description: 'Stand out with a brand identity designed for long-term recognition.'
        }
      ],
    },

    // Delivered
    delivered: {
      tag: "SERVICES WE OFFER",
      subheading1: "Branding",
      subheading2: "For Every Need",
      subtext:
        "From logo design to complete brand identity systems, we offer comprehensive branding services for businesses of all sizes.",
      items: [
        {
          icon: 'Pen',
          title: 'Logo Design',
          description: 'Custom logo concepts designed to represent your business identity and values.'
        },
        {
          icon: 'Palette',
          title: 'Brand Identity Design',
          description: 'Complete visual identity including colors, typography, icons, and design style.'
        },
        {
          icon: 'Target',
          title: 'Brand Strategy',
          description: 'Define your positioning, audience, messaging, and competitive advantage.'
        },
        {
          icon: 'BookOpen',
          title: 'Brand Guidelines',
          description: 'Clear documentation for logo usage, colors, fonts, and visual consistency.'
        },
        {
          icon: 'Smartphone',
          title: 'Social Media Branding',
          description: 'Profile images, banners, templates, and visual assets for social platforms.'
        },
        {
          icon: 'File',
          title: 'Business Collateral',
          description: 'Designs for business cards, brochures, letterheads, and marketing materials.'
        },
        {
          icon: 'RefreshCw',
          title: 'Rebranding',
          description: 'Refresh outdated branding into a modern and professional identity.'
        },
        {
          icon: 'Rocket',
          title: 'Startup Branding',
          description: 'Launch your new business with a clean, trustworthy, and scalable brand identity.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "How We",
      subheading2: "Build Brands",
      subtext:
        "Our structured branding process ensures every brand is thoughtfully designed and strategically positioned.",
      items: [  
        {
          number: '01',
          title: 'Brand Discovery',
          description: 'We understand your business, audience, goals, competitors, and brand personality.'
        },
        {
          number: '02',
          title: 'Strategy & Direction',
          description: 'We define the visual and messaging direction that fits your market positioning.'
        },
        {
          number: '03',
          title: 'Logo & Identity Design',
          description: 'We create logo concepts, color systems, typography, and visual brand elements.'
        },
        {
          number: '04',
          title: 'Refinement',
          description: 'We improve the selected direction based on feedback and practical brand use cases.'
        },
        {
          number: '05',
          title: 'Final Delivery',
          description: 'You receive final brand files, guidelines, and ready-to-use assets.'
        },
      ],
    },

    // Use Cases
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Business",
      subtext:
        "Our branding services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Rocket',
          title: 'Startups',
          description: 'Launch with a professional identity that builds trust from day one.',
          href: '/contact'
        },
        {
          icon: 'Building',
          title: 'Small Businesses',
          description: 'Upgrade your local business image with clean and consistent branding.',
          href: '/contact'
        },
        {
          icon: 'User',
          title: 'Personal Brands',
          description: 'Create a strong identity for creators, consultants, coaches, and professionals.',
          href: '/contact'
        },
        {
          icon: 'Users',
          title: 'Agencies',
          description: 'Get branding support for client projects and campaign launches.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Brands',
          description: 'Build product-focused branding for social media and online store presence.',
          href: '/solutions/ecommerce'
        },
        {
          icon: 'Building2',
          title: 'Established Businesses',
          description: 'Refresh outdated branding and align your identity with your current business goals.',
          href: '/contact'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses build memorable brand identities that drive recognition and trust.",
      items: [
        {
          title: 'Startup Brand Identity',
          description: 'Created complete brand identity with logo, colors, typography, and social assets',
          results: ['Launched in 2 weeks', 'Professional brand guidelines', 'Social media templates']
        },
        {
          title: 'Local Business Rebrand',
          description: 'Modernized outdated branding for stronger trust and professional appearance',
          results: ['+60% brand recall', 'Improved customer perception', 'Consistent visual identity']
        },
        {
          title: 'E-commerce Visual Identity',
          description: 'Built product-focused branding for social media and online store presence',
          results: ['+35% engagement', 'Consistent product photography', 'Recognizable brand style']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our branding services.",
      items: [
        {
          question: 'What is included in branding services?',
          answer: 'Branding services can include logo design, brand strategy, color palette, typography, brand guidelines, social media assets, business stationery, and complete visual identity design.'
        },
        {
          question: 'Is branding only logo design?',
          answer: 'No. A logo is only one part of branding. Branding includes your visual identity, messaging, positioning, tone, colors, typography, and how customers remember your business.'
        },
        {
          question: 'How long does branding take?',
          answer: 'A basic logo and identity package usually takes 1-2 weeks. A complete brand identity with strategy, guidelines, and multiple assets can take 2-4 weeks depending on complexity.'
        },
        {
          question: 'Do you provide brand guidelines?',
          answer: 'Yes. We provide clear brand guidelines that explain logo usage, color codes, typography, spacing, and visual rules so your brand stays consistent everywhere.'
        },
        {
          question: 'Can you redesign my existing brand?',
          answer: 'Yes. We can refresh or completely redesign your existing brand while keeping the parts your customers already recognize.'
        }
      ],
    },

    // CTA
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Build a Strong Brand?',
        description: 'Create a professional brand identity that customers remember and trust.',
        url: '/contact'
      }
    },

  },
  // automation
  {

    slug: "ai-automation",

    seo: {
      title: "AI & Automation Services | Workflow Automation & Chatbots | WebNDevs",
      description: "Automate business workflows, integrate AI chatbots, and streamline operations with smart automation solutions.",
      keywords: ["AI automation", "workflow automation", "chatbot development", "CRM automation", "business automation", "AI integration"],
      image: "/images/automation.jpg",
      canonical: "/services/ai-automation"
    },

    // Hero Section
    hero: {
      tag: "AI & AUTOMATION",
      title1: "Smarter Workflows",
      title2: "Powered by AI",
      description:
        "Automate repetitive tasks, connect your business systems, and leverage artificial intelligence to improve productivity, accuracy, and operational efficiency."
    },

    tag: "AI & Automation",

    subheading1: "Smarter Workflows",

    subheading2: "Powered by AI",

    subtext:
      "We build smart automation systems that eliminate repetitive tasks, reduce human errors, and improve business efficiency. From CRM workflows to AI-powered systems, we help businesses save time and focus on growth.",

    // Stats
    stats: [
      { icon: 'TrendingDown', value: '80%', title: 'Manual Work Reduced' },
      { icon: 'Clock', value: '24/7', title: 'Automated Operations' },
      { icon: 'Workflow', value: '50+', title: 'Processes Automated' },
      { icon: 'Zap', value: '3x', title: 'Workflow Efficiency' }
    ],

    // Benefits
    benefits: {
      tag: "WHY AUTOMATION",
      subheading1: "Why Businesses",
      subheading2: "Automate",
      subtext:
        "Automation helps businesses save time, reduce costs, and scale operations without increasing headcount.",
      items: [
        {
          icon: 'Bot',
          title: 'AI-Powered Workflows',
          description: 'Automate complex tasks using AI and intelligent business logic.'
        },
        {
          icon: 'Clock',
          title: 'Save Time',
          description: 'Reduce hours of manual work through automated systems and integrations.'
        },
        {
          icon: 'TrendingUp',
          title: 'Scale Faster',
          description: 'Automation helps your business handle more work without increasing workload.'
        },
        {
          icon: 'Link',
          title: 'System Integrations',
          description: 'Connect CRMs, forms, APIs, payment gateways, and marketing tools together.'
        },
        {
          icon: 'MessageSquare',
          title: 'Customer Automation',
          description: 'Automated replies, lead tracking, onboarding, and customer communication.'
        },
        {
          icon: 'Wrench',
          title: 'Custom Solutions',
          description: 'Tailored automation systems designed around your exact workflow.'
        }
      ],
    },

    // Delivered
    delivered: {
      tag: "SOLUTIONS WE BUILD",
      subheading1: "Automation",
      subheading2: "For Every Business",
      subtext:
        "From CRM automation to AI chatbots, we build solutions that streamline operations and improve efficiency.",
      items: [
        {
          icon: 'Users',
          title: 'CRM Automation',
          description: 'Automate lead tracking, follow-ups, customer segmentation, and sales workflows.'
        },
        {
          icon: 'Bot',
          title: 'AI Chatbots',
          description: 'Smart AI assistants for customer support, FAQs, and lead generation.'
        },
        {
          icon: 'Workflow',
          title: 'Workflow Automation',
          description: 'Automate repetitive business operations and internal workflows.'
        },
        {
          icon: 'Link',
          title: 'API Integration',
          description: 'Connect different platforms and tools to work together automatically.'
        },
        {
          icon: 'Mail',
          title: 'Email Automation',
          description: 'Automated marketing campaigns, onboarding emails, and follow-up sequences.'
        },
        {
          icon: 'Database',
          title: 'Data Automation',
          description: 'Automatic syncing, reporting, and management of business data.'
        }
      ],
    },

    // Process
    process: {
      tag: "OUR PROCESS",
      subheading1: "How We",
      subheading2: "Build Automation",
      subtext:
        "Our structured approach ensures every automation is designed, built, and optimized for your specific business needs.",
      items: [  
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
        },
      ],
    },

    // Use Cases
    usecase: {
      tag: "WHO IS THIS FOR",
      subheading1: "Solutions For",
      subheading2: "Every Industry",
      subtext:
        "Our automation services are tailored to meet the unique needs of businesses across all industries and sizes.",
      items: [
        {
          icon: 'Rocket',
          title: 'Startups',
          description: 'Automate workflows early and grow efficiently with smaller teams.',
          href: '/contact'
        },
        {
          icon: 'Users',
          title: 'Agencies',
          description: 'Handle clients, reporting, and leads with automated systems.',
          href: '/contact'
        },
        {
          icon: 'ShoppingBag',
          title: 'E-commerce Businesses',
          description: 'Automate orders, customer communication, and inventory workflows.',
          href: '/solutions/ecommerce'
        },
        {
          icon: 'TrendingUp',
          title: 'Sales Teams',
          description: 'Streamline lead nurturing and follow-up processes.',
          href: '/solutions/crm-solutions'
        }
      ]
    },

    // Results
    results: {
      tag: "OUR WORK",
      subheading1: "Real Projects,",
      subheading2: "Real Results",
      subtext:
        "Explore how we've helped businesses automate workflows and save hundreds of hours of manual work.",
      items: [
        {
          title: 'CRM Lead Automation',
          description: 'Built automated lead assignment and follow-up workflows',
          results: ['70% faster response time', 'Automated lead routing', 'Reduced manual work']
        },
        {
          title: 'AI Support Assistant',
          description: 'Reduced customer support workload using AI chatbot systems',
          results: ['60% fewer manual queries', '24/7 customer support', 'Improved response times']
        }
      ]
    },

    // FAQ
    faq: {
      tag: "FAQs",
      subheading1: "Frequently Asked",
      subheading2: "Questions",
      subtext:
        "Find answers to common questions about our automation services.",
      items: [
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
    },

    // CTA
    cta: {
      preview: {
        text: 'Explore All Services',
        url: '/services'
      },
      full: {
        text: 'Ready to Automate Your Business?',
        description: 'Save time, reduce workload, and scale smarter with automation systems.',
        url: '/contact'
      }
    },

  },
]
