export const homeData = {
  sections: [
    {
      section_key: "why-choose",
      tag: "Why Us?",
      subheading1: "Why Choose",
      subheading2: "WebNDevs?",
      subtext:
        "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
      items: [
        {
          icon: "Users",
          title: "One Team for Everything",
          description:
            "No more coordinating between designers, developers, and marketers. We handle it all seamlessly under one roof.",
        },
        {
          icon: "MessageCircle",
          title: "Clear Communication",
          description:
            "Direct access to your project manager. No middlemen, no confusion.",
        },
        {
          icon: "Rocket",
          title: "Scalable Solutions",
          description:
            "Start small, grow big. Our solutions scale with your business.",
        },
        {
          icon: "Handshake",
          title: "Long-Term Partnership",
          description:
            "We don't just build and leave. We support your growth.",
        },
        {
          icon: "Clock",
          title: "Fast Turnaround",
          description:
            "Streamlined processes help us deliver faster.",
        },
        {
          icon: "Target",
          title: "Results-Focused Approach",
          description:
            "We focus on conversions, growth, and ROI.",
        },
      ],
      comparison: {
        leftHeading: "Traditional Approach",

        rightHeading: "The WebNDevs Way",

        leftPoints: [
          "Hire separate freelancers for each task",
          "Manage multiple contracts and invoices",
          "Hope everyone communicates properly",
          "Deal with inconsistent quality and delays",
          "Rebuild from scratch when you need changes",
        ],

        rightPoints: [
          "One expert team handles everything",
          "Single point of contact, simple billing",
          "Seamless collaboration built into our process",
          "Consistent quality and on-time delivery",
          "Scalable solutions that grow with you",
        ],
      },
    },
    {
      section_key: "portfolio",
      tag: "Our Work",
      subheading1: "Real Results for",
      subheading2: "Real Businesses",
      subtext: "See how we've helped companies grow through design, development, automation, and data-driven solutions.",
      items: [
        {
          title: "Healthcare Patient Portal",
          category: "Web Development",
          badge: "premium",
          description: "Built a secure healthcare platform that streamlined patient appointments, records management, and communication.",
          results: [
            "42% increase in online bookings",
            "65% reduction in admin workload",
            "98% patient satisfaction rate"
          ],
          tags: ["Next.js", "Laravel", "AWS"],
          url: "https://example.com"
        },
        {
          title: "AI Lead Qualification System",
          category: "AI & Automation",
          badge: "featured",
          description: "Implemented AI-powered lead scoring and automated follow-up workflows for a B2B company.",
          results: [
            "3x faster lead response time",
            "28% increase in qualified leads",
            "75% reduction in manual tasks"
          ],
          tags: ["OpenAI", "n8n", "HubSpot"],
          url: "https://example.com"
        },
        {
          title: "E-Commerce Growth Platform",
          category: "Web Development",
          badge: "premium",
          description: "Developed a custom e-commerce solution focused on performance, conversions, and customer retention.",
          results: [
            "58% increase in sales",
            "34% higher conversion rate",
            "2.1s average page load time"
          ],
          tags: ["Next.js", "Stripe", "PostgreSQL"],
          url: "https://example.com"
        },
        {
          title: "Real Estate CRM Dashboard",
          category: "Data Analytics",
          badge: "growth",
          description: "Created a centralized dashboard for property management, lead tracking, and reporting.",
          results: [
            "50% faster reporting process",
            "22% increase in agent productivity",
            "100% centralized data visibility"
          ],
          tags: ["React", "Node.js", "Power BI"],
          url: "https://example.com"
        },
        {
          title: "Restaurant Mobile Ordering App",
          category: "Mobile Development",
          badge: "enterprise",
          description: "Designed and launched a mobile app that simplified ordering, loyalty rewards, and customer engagement.",
          results: [
            "70% increase in repeat orders",
            "45% growth in app users",
            "30% higher average order value"
          ],
          tags: ["React Native", "Firebase", "Stripe"],
          url: "https://example.com"
        },
        {
          title: "Manufacturing Workflow Automation",
          category: "AI & Automation",
          badge: "featured",
          description: "Automated internal approval workflows, reporting, and inventory notifications across departments.",
          results: [
            "80% reduction in manual approvals",
            "35 hours saved per week",
            "99.9% process accuracy"
          ],
          tags: ["n8n", "ERP Integration", "APIs"],
          url: "https://example.com"
        }
      ],
      hero: {
        tag: "OUR WORK",
        title1: "Selected",
        title2: "Digital Legacies.",
        description:
          "Every project is built to solve real business problems, improve user experiences, and deliver measurable results that last beyond launch."
      },
      stats: [
        { value: '50+', title: 'Projects Completed' },
        { value: '98%', title: 'Client Satisfaction' },
        { value: '2.5x', title: 'Average ROI Increase' },
        { value: '24/7', title: 'Support Available' },
      ],
      cta: {
        preview: {
          text: "More Projects",
          url: "/portfolio"
        },
        full: {
          description: "Want to achieve results like these for your business?",
          text: "Talk To Our Team",
          url: "#get-started"
        }
      }
    },
    {
      section_key: "process",
      tag: "Our Process",
      subheading1: "From Idea to Launch in",
      subheading2: "5 Simple Steps",
      subtext:
        "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
      items:[
          {
            number: '01',
            icon: 'Search',
            title: 'Discover',
            description: 'We start by understanding your business, goals, and challenges. A quick call helps us map out exactly what you need.',
            duration: '1-2 days'
          },
          {
            number: '02',
            icon: 'FileText',
            title: 'Plan',
            description: 'We create a detailed project roadmap with timelines, milestones, and deliverables. You know exactly what to expect.',
            duration: '3-5 days'
          },
          {
            number: '03',
            icon: 'Hammer',
            title: 'Build',
            description: 'Our team gets to work designing, developing, and testing. You get regular updates and can provide feedback along the way.',
            duration: '2-8 weeks'
          },
          {
            number: '04',
            icon: 'Rocket',
            title: 'Launch',
            description: 'We handle deployment, testing, and ensure everything runs smoothly. Your project goes live without a hitch.',
            duration: '1-3 days'
          },
          {
            number: '05',
            icon: 'HeadphonesIcon',
            title: 'Support',
            description: 'We don\'t disappear after launch. Ongoing support, updates, and improvements keep your solution running at its best.',
            duration: 'Ongoing'
          }
      ],
      cta: {
        preview: {
          text: "More Projects",
          url: "/portfolio"
        },
        full: {
          description: "Ready to get started? Book a free 30-minute consultation and let's discuss your project.",
          text: "Schedule Your Free Call",
          url: "#get-started"
        }
      },
    },
    {
      section_key: "testimonials",
      tag: "Client Success Stories",
      subheading1: "Don't Just Take",
      subheading2: "Our Word for It",
      subtext:
        "Hear from the founders and business owners who trusted us with their digital growth.",
      items:[
        {
          id: 1,
          name: 'Sarah Mitchell',
          company: 'TechStart Inc.',
          content: 'WebNDevs transformed our outdated website into a modern, high-converting platform. Within 3 months, we saw a 180% increase in qualified leads. They understood our business and delivered beyond expectations.',
          rating: 5,
          photo_url: null,
          role: 'CEO, TechStart Inc.',
        },
        {
          id: 2,
          name: 'James Rodriguez',
          company: 'FitLife App',
          content: 'I was juggling 4 different freelancers before finding WebNDevs. Now I have one team handling design, development, and marketing. The relief of having clear communication and consistent quality is priceless.',
          rating: 5,
          photo_url: null,
          role: 'Founder, FitLife App',
        },
        {
          id: 3,
          name: 'Emily Chen',
          company: 'RetailPro',
          content: 'The Power BI dashboard they built saves our team 15+ hours every week. We can now make data-driven decisions in real-time instead of waiting days for reports. Best investment we\'ve made this year.',
          rating: 5,
          photo_url: null,
          role: 'Marketing Director, RetailPro',
        },
        {
          id: 4,
          name: 'Michael Foster',
          company: 'EcoShop',
          content: 'Our e-commerce sales tripled after WebNDevs optimized our store. They didn\'t just make it look good—they focused on conversion rates, page speed, and user experience. The results speak for themselves.',
          rating: 5,
          photo_url: null,
          role: 'Owner, EcoShop',
        },
        {
          id: 5,
          name: 'Lisa Thompson',
          company: 'AutoCorp',
          content: 'The automation workflows WebNDevs set up have been game-changing. Tasks that used to take hours now happen automatically. We\'ve reduced errors by 90% and our team can focus on what actually matters.',
          rating: 5,
          photo_url: null,
          role: 'Operations Manager, AutoCorp',
        },
        {
          id: 6,
          name: 'David Park',
          company: 'BrandHub',
          content: 'From logo to website to marketing materials, WebNDevs nailed our brand identity. They took time to understand our vision and created something that truly represents who we are. Couldn\'t be happier.',
          rating: 5,
          photo_url: null,
          role: 'Founder, BrandHub',
        }
      ],
      hero: {
        tag: "CLIENT SUCCESS",
        title1: "Trusted By",
        title2: "Growing Businesses.",
        description:
          "The strongest proof of our work comes from the businesses we've helped grow. Hear directly from our clients about their experience with WebNDevs."
      },
      stats:[
        {
          icon: "Star",
          value: "4.9/5",
          title: "Average Rating"
        },
        {
          icon: "RotateCw",
          value: "85%",
          title: "Repeat Clients"
        },
        {
          icon: "Target",
          value: "100%",
          title: "On-Time Delivery"
        }
      ],
      cta: {
        preview: {
          text: "More Testimonials",
          url: "/testimonials"
        },
        full: {
          description: "Want to buy back your time and scale your revenue?",
          text: "Let's build your system",
          url: "#get-started"
        }
      },
    },
    {
      section_key: "privacy",
      tag: "Privacy Policy",
      subheading1: "Concerned About Your Data?",
      subheading2: "Let Us Reassure You",
      subtext:
        "Your privacy is important to us. This policy explains how we handle your data.",
      items:[
        {
          title: "Introduction",
          description: "This Privacy Policy describes how WebNDevs (\"we,\" \"us,\" or \"our\") collects, uses, and discloses your personal information when you visit our website webndevs.com (the \"Site\") and use our services."
        },
        {
          title: "Information We Collect",
          description: "We collect information you provide directly to us, such as your name, email address, phone number, and project details when you fill out our contact forms or subscribe to our newsletter. We also collect usage data automatically as you interact with our Site."
        },
        {
          title: "How We Use Your Information",
          description: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, to process your inquiries, and for marketing purposes."
        },
        {
          title: "Data Security",
          description: "We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."
        }
      ],
      hero: {
        tag: "YOUR PRIVACY",
        title1: "Built On",
        title2: "Trust & Transparency.",
        description:
          "Your privacy matters. Learn how we collect, use, protect, and responsibly manage your information while delivering our services."
      },
    },
    {
      section_key: "terms",
      tag: "Terms of Service",
      subheading1: "Using Our Services? Then Check",
      subheading2: "Terms of Use",
      subtext:
        "By using our services, you agree to the following terms and conditions.",
      items:[
        {
          title: "Agreement to Terms",
          description: "By accessing or using our website and services, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to these terms, you may not access or use our services."
        },
        {
          title: "Changes to Terms",
          description: "We reserve the right to modify or update these Terms at any time. We will notify you of any changes by posting the new Terms on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms."
        },
        {
          title: "User Conduct",
          description: "You agree not to use the Site for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Site."
        },
        {
          title: "Intellectual Property",
          description: "All content on the Site, including text, graphics, logos, and images, is our property or the property of our licensors and is protected by copyright and other intellectual property laws."
        }
      ],
      hero: {
        tag: "TERMS OF SERVICE",
        title1: "Clear Terms.",
        title2: "Confident Partnerships.",
        description:
          "These terms outline the responsibilities, expectations, and commitments that help create successful and transparent working relationships."
      },
    },
    {
      section_key: "contact-us",
      tag: "Contact Us",
      subheading1: "Got Any Doubts? No Worries",
      subheading2: "We Are Here For You",
      subtext:
        "Ready to build something great together? Contact us to discuss your project, get a quote, or just say hello.",
      items:[
        {
          title: "Don't Hesitate To Reach Out to Us",
          description: "Thank you for expressing your interest in webndevs.com. Whether you're looking for web development projects, graphic design, digital marketing, or other technology solutions, we're here to assist you. Our team is eager to share its expertise and help bring your ideas to life. Let's collaborate and create something amazing together."
        },
        {
          title: "Our Email",
          description: "sales@webndevs.com"
        },
        {
          title: "Indian Contact Number",
          description: "+91 (988) 760-3015"
        },
        {
          title: "International Contact Number",
          description: "+1 (762) 760-3015"
        }
      ],
      hero: {
        tag: "LET'S CONNECT",
        title1: "Let's Build",
        title2: "Something Great.",
        description:
          "Whether you're launching a startup, modernizing your business, or scaling with AI and automation, we're ready to help bring your vision to life."
      },
    },
    {
      section_key: "faq",
      tag: "Question & Answers",
      subheading1: "Got Questions?",
      subheading2: "We Might Have Answers",
      subtext:
        "Everything you need to know about working with WebNDevs. Can't find your answer? Just reach out",
      items:[
        {
          question: 'What services does WebNDevs offer?',
          answer: 'We offer complete digital solutions including web development (WordPress, React, Next.js, Laravel), UI/UX design, mobile app development (iOS & Android), AI & automation, Power BI data analytics dashboards, digital marketing & SEO, social media management, and branding & graphic design. Think of us as your all-in-one digital team.'
        },
        {
          question: 'How much does a typical project cost?',
          answer: 'Project costs vary based on scope and complexity. A basic website starts around $3,000-$5,000, while full web applications can range from $10,000-$50,000+. Mobile apps typically start at $15,000. We provide detailed quotes after understanding your specific needs. The investment depends on features, integrations, and timeline—but we always prioritize delivering maximum value for your budget.'
        },
        {
          question: 'How long does it take to complete a project?',
          answer: 'Timeline depends on project complexity. A standard website takes 2-4 weeks, web applications 6-12 weeks, and mobile apps 8-16 weeks. We provide accurate timelines during our planning phase and keep you updated throughout. Rush projects can be accommodated with adjusted pricing.'
        },
        {
          question: 'Do you provide ongoing support after launch?',
          answer: 'Absolutely! We don\'t disappear after launch. Every project includes a post-launch support period. We also offer monthly maintenance packages that include updates, security monitoring, backups, performance optimization, and technical support. We\'re here for the long term—not just for the initial build.'
        },
        {
          question: 'Can you handle my complete digital solution from start to finish?',
          answer: 'Yes, that\'s exactly what we do best. Unlike hiring separate freelancers for design, development, and marketing, WebNDevs handles everything under one roof. From initial concept and design through development, launch, and ongoing marketing—you work with one team, one point of contact, and one streamlined process.'
        },
        {
          question: 'What makes WebNDevs different from other agencies?',
          answer: 'We focus on being a long-term partner, not just a vendor. You get clear communication, honest timelines, and solutions built to scale. We\'re small enough to care about your success but experienced enough to handle complex projects. Plus, our one-team approach means no coordination headaches between multiple freelancers.'
        },
        {
          question: 'Do I need to provide content and images?',
          answer: 'We can work either way. If you have existing content, great—we\'ll work with it. If not, we can help create professional content including copywriting, photography coordination, and graphic design. Many clients prefer our full-service approach where we handle everything.'
        },
        {
          question: 'What technologies do you work with?',
          answer: 'We use modern, proven technologies: WordPress, React, Next.js, Laravel, Node.js for web development; React Native and native iOS/Android for mobile apps; Power BI and Tableau for analytics; Zapier, Make, and custom APIs for automation. We choose the right tech stack based on your specific needs—not just what\'s trendy.'
        },
        {
          question: 'Can you help with digital marketing and SEO?',
          answer: 'Yes! We provide comprehensive digital marketing services including SEO optimization, Google Ads management, social media marketing, email campaigns, and content strategy. We don\'t just build your digital presence—we help you grow it and get found by your target audience.'
        },
        {
          question: 'How do I get started with WebNDevs?',
          answer: 'Simple! Click the "Get Started" button to book a free 30-minute consultation call. We\'ll discuss your goals, challenges, and what you\'re looking to build. Then we\'ll provide a detailed proposal with timeline and pricing. No pressure, no commitments until you\'re ready to move forward.'
        }
      ],
      hero: {
        tag: "HELP CENTER",
        title1: "Questions",
        title2: "Answered.",
        description:
          "Find answers to the most common questions about our services, process, pricing, timelines, and ongoing support."
      },
      cta: {
        preview: {
          text: "More FAQs",
          url: "/faq"
        },
        full: {
          description: "Still have questions? Book a free consultation and let's chat about your project.",
          text: "Schedule a Call",
          url: "#get-started"
        },
      },
    },
    {
      section_key: "error",
      tag: "404 Error",
      subheading1: "The Page Is Gone.",
      subheading2: "The Solution Probably Isn't.",
      subtext: "Let's help you find what you were actually looking for.",
      items: [
        {
          icon: "Briefcase",
          title: "Services",
          description: "Explore our development, AI, and analytics services.",
          url: "/services",
        },
        {
          icon: "FolderOpen",
          title: "Portfolio",
          description: "See real projects and business results.",
          url: "/portfolio",
        },
        {
          icon: "Database",
          title: "Data Hub",
          description: "Guides, resources, comparisons, and insights.",
          url: "/data-hub",
        },
        {
          icon: "Wrench",
          title: "Tools",
          description: "Find calculators, resources, and utilities.",
          url: "/tools",
        },
        {
          icon: "GitCompare",
          title: "Comparisons",
          description: "Compare platforms, services, and solutions.",
          url: "/comparisons",
        },
        {
          icon: "Building2",
          title: "Industries",
          description: "Industry-specific solutions and case studies.",
          url: "/industries",
        },
      ],
      cta: {
        preview: {
          text: "Back Home",
          url: "/",
        },
        full: {
          description: "Still can't find what you need?",
          text: "Talk to Our Team",
        },
      }
    },
    {
      section_key: "services",
      tag: "Professional Services",
      subheading1: "Technology Services",
      subheading2: "Built for Growth",
      subtext:
        "From websites and custom software to AI automation and cloud infrastructure, we build scalable digital solutions that help businesses innovate, automate, and grow.",
      hero: {
        tag: "OUR SERVICES",
        title1: "Technology That",
        title2: "Moves Business Forward",
        description:
          "We design, develop, integrate, and optimize digital solutions that solve real business challenges using modern technologies."
      },
      items: [
        {
          icon: 'Laptop',
          title: 'Web Development',
          description: 'Custom websites and web applications built with WordPress, React, Next.js, and Laravel. Fast, secure, and scalable solutions that convert visitors into customers.',
          tags: ['WordPress', 'React', 'Laravel', 'Next.js'],
          url: '/services/web-development',
        },
        {
          icon: 'Palette',
          title: 'UI/UX Design',
          slug: 'ui-ux-design',
          description: 'Beautiful, user-friendly interfaces that keep your customers engaged. We design experiences that look amazing and actually work for your business goals.',
          tags: ['Figma', 'Adobe XD', 'Prototyping'],
          url: '/services/ui-ux-design',
        },
        {
          icon: 'ChartNoAxesCombined',
          title: 'Data Analytics & Power BI',
          slug: 'data-analytics',
          description: 'Turn your data into actionable insights with custom Power BI dashboards. See your business metrics in real-time and make smarter decisions.',
          tags: ['Power BI', 'Dashboards', 'Reports'],
          url: '/services/data-analytics',
        },
        {
          icon: 'Smartphone',
          title: 'Mobile App Development',
          slug: 'mobile-app-development',
          description: 'Native iOS and Android apps that your users will love. From concept to App Store, we handle the entire mobile development process.',
          tags: ['iOS', 'Android', 'React Native'],
          url: '/services/mobile-app-development',
        },
        {
          icon: 'Bot',
          title: 'AI & Automation',
          slug: 'ai-automation',
          description: 'Save time and reduce costs with smart automation. We integrate AI tools and build custom workflows that handle repetitive tasks for you.',
          tags: ['Zapier', 'Make', 'Custom APIs'],
          url: '/services/ai-automation',
        },
        {
          icon: 'Megaphone',
          title: 'Digital Marketing & SEO',
          slug: 'digital-marketing',
          description: 'Get found online and grow your audience. From SEO to social media management, we help you reach the right people at the right time.',
          tags: ['SEO', 'Social Media', 'Ads'],
          url: '/services/digital-marketing',
        },
        {
          icon: 'PenTool',
          title: 'Branding & Graphic Design',
          slug: 'branding-design',
          description: 'Stand out with a memorable brand identity. We create logos, brand guidelines, and marketing materials that make your business unforgettable.',
          tags: ['Logo Design', 'Brand Identity'],
          url: '/services/branding-design',
        }
      ],
      techspec: {
        techtag: "Tech Specs",
        techHeading1: "Our Technology",

        techHeading2: "Stack & Expertise",

        techSubtext:
          "We use modern frameworks, cloud platforms, AI services, and development tools to build secure, scalable, and future-ready digital products.",

        tags: [
          "Next.js",
          "React",
          "TypeScript",
          "Laravel",
          "PHP",
          "Node.js",
          "Python",
          "WordPress",
          "WooCommerce",
          "Shopify",
          "Tailwind CSS",
          "Figma",
          "Power BI",
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Firebase",
          "Supabase",
          "AWS",
          "Cloudflare",
          "Docker",
          "OpenAI",
          "Claude",
          "Gemini",
          "Zapier",
          "Make",
          "GitHub",
          "Vercel"
        ]
      },
      faq: {
        tag: "FAQs",

        subheading1: "Frequently Asked",

        subheading2: "Questions",

        subtext:
          "Answers to common questions about our services and development process.",

        items: [
          {
            question: "Do you provide end-to-end project development?",
            answer:
              "Yes. From discovery and UI/UX design to development, deployment, testing, and ongoing maintenance, we manage the complete project lifecycle."
          },
          {
            question: "Can you work with our existing website or software?",
            answer:
              "Absolutely. Whether you need improvements, integrations, redesigns, or additional functionality, we can work with existing platforms and codebases."
          },
          {
            question: "Do you offer custom solutions or only predefined packages?",
            answer:
              "Every business is different. We primarily build custom solutions tailored to your goals, workflows, and technical requirements."
          },
          {
            question: "Do you provide ongoing support after launch?",
            answer:
              "Yes. We offer maintenance, performance optimization, security updates, feature enhancements, and technical support to ensure your solution continues to perform reliably."
          }
        ]
      },
      cta: {
        preview: {
          text: "Explore Our Solutions",
          url: "/datahub"
        },

        full: {
          description:
            "Have a project in mind? Let's discuss your goals and build a solution that helps your business grow. Or you can seek some more information.",
          text: "Let's Build Something Great",
          url: "#get-started"
        }
      }
    },
  ],
};

export type Section = {
  section_key: string;

  // HeaderSection
  tag?: string;
  subheading1?: string;
  subheading2?: string;
  subtext?: string;

  // Card/Grid data
  items?: unknown[];

  // CompareTable
  comparison?: {
    leftHeading?: string;
    rightHeading?: string;
    leftPoints?: string[];
    rightPoints?: string[];
  };

  // StatsCardGrid
  stats?: {
    icon?: string;
    value?: string;
    title?: string;
    url?: string;
  }[];

  // TechSpecs
  techspec?: {
    techHeading1?: string;
    techHeading2?: string;
    techSubtext?: string;
    tags?: string[];
  }
  // SectionCTA
  cta?: {
    preview?: {
      text?: string;
      url: string;
    };
    full?: {
      description?: string;
      text?: string;
      url?: string;
    };
  };

  // Future-proof
  [key: string]: unknown;
};

export function getHome(
  key: string
) : Section | undefined {
  return homeData.sections.find(
    (section) => section.section_key === key
  );
}