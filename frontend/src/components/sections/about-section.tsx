import React from 'react';
import { DSTiles, ContentTile, DSCard } from '../cards/DScomponents';
import { HeaderSection } from '../cards/header-card';
import { PageHero } from './pagehero';
import { ScrollReveal } from '../animations/scroll-reveal';
import { ICONS } from '@/data/icons';

const ABOUT_DATA = {
  hero: {
    tag: "ABOUT US",
    title1: "Who We Are &",
    title2: "What We Stand For",
    description: "At Webndevs, we believe in creating innovative solutions to help our clients maximize their business potential."
  },

  whoWeAreHeader: {
    tag: "WHO WE ARE",
    subheading1: "Who We Are",
    subheading2: "& Our Vision",
    subtext: "At Webndevs, we believe in creating innovative solutions to help our clients maximize their business potential."
  },
  whoWeAreTiles: [
    {
      title: "Our Philosophy",
      tag: "Vision",
      description: "At Webndevs, we believe in creating innovative solutions to help our clients maximize their business potential. Our team of digital marketing professionals is dedicated to providing top-notch services in Jaipur to ensure that your brand is visible and successful in the online space. We understand that customer satisfaction is of utmost importance. That's why, our team works diligently and intelligently to provide our clients with the highest quality of service that exceeds their expectations. As a result, we have established ourselves as one of the fastest growing digital marketing companies in India."
    },
    {
      title: "Our Dedication",
      tag: "Partnership",
      description: "We are committed to providing our clients with the most effective strategies and tactics to ensure their success. With our innovative approach and cutting-edge technology, we are confident that Webndevs can be your trusted digital marketing partner."
    }
  ] as ContentTile[],

  ratings: [
    { type: "Google", value: "4.8", label: "200+ Reviews" },
    { type: "Facebook", value: "4.6", label: "400+ Reviews" },
    { type: "MapPinned", value: "4.8", label: "100+ Reviews" },
    { type: "Star", value: "4.7", label: "200+ Reviews" }
  ],

  whatWeDoHeader: {
    tag: "WHAT WE DO",
    subheading1: "Full-service Digital Marketing",
    subheading2: "& Software Solutions",
    subtext: "We aim to make a positive impact on society through innovation, technology, quality, and growth in digital marketing services."
  },
  whatWeDoTiles: [
    {
      title: "Our Principles",
      tag: "Principles",
      description: "At Webndevs, we strive to prioritize our clients' needs and objectives by utilizing the best resources and technology available, while fostering a collaborative environment that encourages growth and innovation."
    },
    {
      title: "Work Culture",
      tag: "Culture",
      description: "We believe that every individual contributes to the success of our organization and as such, we foster an environment where each team member is encouraged to participate in the decision-making process."
    },
    {
      title: "The Future",
      tag: "Future",
      description: "Have been in the IT industry for over five years, we are well-equipped to stay ahead of the curve and take advantage of the rapidly changing landscape of the industry. We are dedicated to creating a better future, one minute at a time."
    }
  ] as ContentTile[]
};

export function AboutSection() {
  const GoogleIcon = ICONS.Google || (() => null);
  const FacebookIcon = ICONS.Facebook || (() => null);
  const MapIcon = ICONS.MapPinned || ICONS.Map || (() => null);
  const StarIcon = ICONS.Star || (() => null);

  const getIcon = (type: string) => {
    switch (type) {
      case "Google": return <GoogleIcon className="w-6 h-6 text-[#22C55E]" />;
      case "Facebook": return <FacebookIcon className="w-6 h-6 text-[#22C55E]" />;
      case "MapPinned": return <MapIcon className="w-6 h-6 text-[#22C55E]" />;
      case "Star": return <StarIcon className="w-6 h-6 text-[#22C55E]" />;
      default: return <StarIcon className="w-6 h-6 text-[#22C55E]" />;
    }
  };

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <PageHero 
        tag={ABOUT_DATA.hero.tag}
        title1={ABOUT_DATA.hero.title1}
        title2={ABOUT_DATA.hero.title2}
        description={ABOUT_DATA.hero.description}
      />

      <section id="about" aria-label="About WebNDevs" className="py-20 px-6 bg-transparent text-gray-100">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* 1. Who We Are Section */}
          <div>
            <HeaderSection 
              tag={ABOUT_DATA.whoWeAreHeader.tag}
              subheading1={ABOUT_DATA.whoWeAreHeader.subheading1}
              subheading2={ABOUT_DATA.whoWeAreHeader.subheading2}
              subtext={ABOUT_DATA.whoWeAreHeader.subtext}
            />
            <div className="mt-10">
              <DSTiles items={ABOUT_DATA.whoWeAreTiles} />
            </div>
          </div>

          {/* 2. Ratings / Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ABOUT_DATA.ratings.map((stat, index) => (
              <ScrollReveal 
                key={index} 
                direction="up" 
                delay={index * 0.08} 
                duration={0.5}
              >
                <DSCard hoverable className="p-6 flex flex-col items-center justify-center text-center bg-transparent bg-linear-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4">
                    {getIcon(stat.type)}
                  </div>
                  <h4 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                    {stat.value}
                  </h4>
                  <p className="text-[13px] text-[#9CA3AF] font-medium">
                    {stat.label}
                  </p>
                </DSCard>
              </ScrollReveal>
            ))}
          </div>

          {/* 3. What We Do Section */}
          <div>
            <HeaderSection 
              tag={ABOUT_DATA.whatWeDoHeader.tag}
              subheading1={ABOUT_DATA.whatWeDoHeader.subheading1}
              subheading2={ABOUT_DATA.whatWeDoHeader.subheading2}
              subtext={ABOUT_DATA.whatWeDoHeader.subtext}
            />
            <div className="mt-10">
              <DSTiles items={ABOUT_DATA.whatWeDoTiles} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
