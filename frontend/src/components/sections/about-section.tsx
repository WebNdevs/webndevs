import { getPage, NormalizedPage } from '@/data/content';
import { ContentSections } from './content-sections';

const defaultAboutPage: NormalizedPage = {
  id: "about-page",
  title: "About WebNDevs",
  slug: "/about",
  sourceId: "about-page",
  sourceModule: "content",
  sourceSlug: "/about",
  sourceTitle: "About WebNDevs",
  hero: {
    tag: "ABOUT US",
    title1: "Engineering Digital Excellence,",
    title2: "Empowering Growth.",
    description: "We are a full-cycle software development and AI automation agency dedicated to building high-performance websites, scalable enterprise software, and automated workflows."
  },
  header: {
    tag: "OUR MISSION",
    subheading1: "Empowering Businesses Through",
    subheading2: "Cutting-Edge Technology",
    subtext: "From startups to enterprises, we eliminate tech friction and build reliable, scalable digital solutions that drive real commercial outcomes."
  },
  whyus: {
    section_key: "whyus",
    tag: "CORE PRINCIPLES",
    subheading1: "The Values That",
    subheading2: "Drive Our Engineering",
    subtext: "Our team operates on transparency, technical rigor, and deep alignment with our clients' business goals.",
    items: [
      {
        icon: "Shield",
        title: "Engineering Excellence",
        description: "We write clean, modular, and well-tested code following best-in-class architectural patterns."
      },
      {
        icon: "Users",
        title: "Dedicated Full-Stack Team",
        description: "You work directly with senior software architects and developers who take ownership of your product."
      },
      {
        icon: "Rocket",
        title: "Speed & Scalability",
        description: "We build systems designed to scale seamlessly from thousands to millions of users without degradation."
      },
      {
        icon: "MessageCircle",
        title: "Transparent Collaboration",
        description: "Weekly milestone demos, clear timelines, and open communication with no bureaucratic barriers."
      }
    ]
  },
  stats: {
    section_key: "stats",
    items: [
      { icon: "Code", value: "50+", title: "Production Deployments" },
      { icon: "Star", value: "99%", title: "Client Satisfaction" },
      { icon: "Clock", value: "24/7", title: "Monitoring & Support" },
      { icon: "Zap", value: "<2s", title: "Average Page Load Speed" }
    ]
  },
  cta: {
    full: {
      text: "Start Your Project",
      description: "Have an ambitious idea or an existing system that needs scaling? Let's talk.",
      url: "/contact"
    },
    preview: {
      text: "Explore Services",
      url: "/services"
    }
  }
};

export async function AboutSection() {
  const page = (await getPage("content", "/about")) || defaultAboutPage;

  return (
    <section id="about" aria-label="About WebNDevs" className="py-20 px-6 bg-transparent text-gray-100">
      <div className="max-w-7xl mx-auto space-y-20">
        <ContentSections page={page} />
      </div>
    </section>
  );
}