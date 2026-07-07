"use client";
import { DSButton } from '../cards/DScomponents';
import { ArrowRight, Play, Code, Smartphone, Palette, TrendingUp, BarChart3, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '../../../public/logo.png';

interface OrbitPathProps {
  size: string;
  duration: number;
  reverse?: boolean;
  children: React.ReactNode;
}

function OrbitPath({ size, duration, reverse = false, children }: OrbitPathProps) {
  return (
    <div 
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10"
      style={{ width: size, height: size }}
    >
      {/* Rotating layer */}
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="w-full h-full relative"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface PlanetProps {
  icon: React.ReactNode;
  name: string;
  duration: number;
  reverse?: boolean;
  isBottom?: boolean;
}

function SolarSystemPlanet({ icon, name, duration, reverse = false, isBottom = false }: PlanetProps) {
  return (
    <motion.div
      animate={{ rotate: reverse ? 360 : -360 }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={{
        position: "absolute",
        left: "50%",
        top: isBottom ? "auto" : 0,
        bottom: isBottom ? 0 : "auto",
        transform: isBottom ? "translate(-50%, 50%)" : "translate(-50%, -50%)",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.12, borderColor: "#22C55E" }}
        className="flex items-center gap-1.5 px-2.5 py-1 sm:gap-2 sm:px-3.5 sm:py-1.5 bg-[#1F2937] rounded-full border border-gray-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer select-none whitespace-nowrap group hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-shadow duration-300 z-20"
      >
        <div className="w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center bg-gray-800 text-[#22C55E] group-hover:text-[#06B6D4] shrink-0 border border-gray-700/50 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] sm:text-[12.5px] font-semibold text-gray-200 group-hover:text-white transition-colors pr-0.5">
          {name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {

  return (
    <section aria-label="Introduction Hero" className="relative px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
      {/* Background gradient effect */}
      <>
        <div className="absolute top-0 right-0 w-150 h-150 bg-[#22C55E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#06B6D4]/5 rounded-full blur-3xl" />
        
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-150 h-150 bg-[#22C55E]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#06B6D4]/5 rounded-full blur-3xl" />
        </div>
      </>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="text-[14px] font-medium text-[#22C55E]">
                Your Complete Digital Partner
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#F9FAFB] sm:text-5xl lg:text-[56px]">
              Stop Hiring Multiple Freelancers.{' '}
              <span className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                Get One Expert Team.
              </span>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-[#D1D5DB] sm:text-lg">
              We build websites, apps, and automation systems that actually grow your business. 
              From design to deployment to marketing—everything under one roof.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <DSButton asChild size="lg">
                <a href="#get-started">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </DSButton>
              <DSButton asChild variant="secondary" size="lg">
                <a href="#portfolio">
                  <Play className="mr-2 w-5 h-5" />
                  See Our Work
                </a>
              </DSButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 border-t border-[#374151] pt-8 sm:gap-8">
              <div>
                <p className="mb-1 text-2xl font-bold text-[#F9FAFB] sm:text-[28px]">50+</p>
                <p className="text-[14px] text-[#9CA3AF]">Projects Delivered</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-[#F9FAFB] sm:text-[28px]">98%</p>
                <p className="text-[14px] text-[#9CA3AF]">Client Satisfaction</p>
              </div>
              <div>
                <p className="mb-1 text-2xl font-bold text-[#F9FAFB] sm:text-[28px]">24/7</p>
                <p className="text-[14px] text-[#9CA3AF]">Support Available</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual (Interactive Services Solar System) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center select-none overflow-visible py-10">
              {/* Radial glow background */}
              <div className="absolute w-[280px] h-[280px] rounded-full bg-[#22C55E]/5 blur-3xl pointer-events-none" />

              {/* Static Orbit Rings in Background */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] h-[38%] rounded-full border border-dashed border-gray-700/80 pointer-events-none z-0" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66%] h-[66%] rounded-full border border-dashed border-gray-700/80 pointer-events-none z-0" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] h-[94%] rounded-full border border-dashed border-gray-700/80 pointer-events-none z-0" />

              {/* Orbit 1: Inner (38%) */}
              <OrbitPath size="38%" duration={20} reverse={false}>
                <SolarSystemPlanet 
                  name="Web Dev" 
                  icon={<Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={20} 
                  reverse={false} 
                  isBottom={false} 
                />
                <SolarSystemPlanet 
                  name="AI & Automation" 
                  icon={<Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={20} 
                  reverse={false} 
                  isBottom={true} 
                />
              </OrbitPath>

              {/* Orbit 2: Middle (66%) */}
              <OrbitPath size="66%" duration={30} reverse={true}>
                <SolarSystemPlanet 
                  name="Mobile Apps" 
                  icon={<Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={30} 
                  reverse={true} 
                  isBottom={false} 
                />
                <SolarSystemPlanet 
                  name="UI/UX Design" 
                  icon={<Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={30} 
                  reverse={true} 
                  isBottom={true} 
                />
              </OrbitPath>

              {/* Orbit 3: Outer (94%) */}
              <OrbitPath size="94%" duration={40} reverse={false}>
                <SolarSystemPlanet 
                  name="Digital Marketing" 
                  icon={<TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={40} 
                  reverse={false} 
                  isBottom={false} 
                />
                <SolarSystemPlanet 
                  name="Data Analytics" 
                  icon={<BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />} 
                  duration={40} 
                  reverse={false} 
                  isBottom={true} 
                />
              </OrbitPath>

              {/* Center "Sun": logo.png */}
              <div className="absolute w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#111827] border-2 border-[#22C55E]/60 flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,0.35)] z-20">
                <Image 
                  className="rounded-full h-12 w-12 sm:h-16 sm:w-16 object-cover" 
                  src={logo} 
                  alt="WebNDevs Logo" 
                  priority
                />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 bg-[#22C55E] text-[#0B0F14] px-3.5 py-1.5 rounded-lg font-bold text-[13px] shadow-lg cursor-default select-none z-30"
            >
              ✓ Trusted by 50+ Companies
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
