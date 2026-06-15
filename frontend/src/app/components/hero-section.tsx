import React, { useEffect } from 'react';
import { DSButton } from './ds-button';
import { ArrowRight, Play } from 'lucide-react';
import { OptimizedImage } from './optimized-image';

export function HeroSection() {
  const heroIllustration =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%2322C55E'/%3E%3Cstop offset='1' stop-color='%2306B6D4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='%230B0F14'/%3E%3Ccircle cx='900' cy='200' r='220' fill='url(%23g)' opacity='0.25'/%3E%3Ccircle cx='260' cy='620' r='180' fill='url(%23g)' opacity='0.18'/%3E%3C/svg%3E";

  useEffect(() => {
    const existing = document.head.querySelector('link[data-hero-preload="true"]') as HTMLLinkElement | null;
    if (heroIllustration.startsWith("data:")) {
      existing?.remove();
      return;
    }

    let link = existing;
    if (!link) {
      link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.dataset.heroPreload = "true";
      document.head.appendChild(link);
    }
    link.href = heroIllustration;
  }, [heroIllustration]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl" />
      
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <OptimizedImage src={heroIllustration} alt="" eager className="h-full w-full object-cover opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="text-[14px] font-medium text-[#22C55E]">
                Your Complete Digital Partner
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#F9FAFB] sm:text-5xl lg:text-[56px]">
              Stop Hiring Multiple Freelancers.{' '}
              <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                Get One Expert Team.
              </span>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-[#D1D5DB] sm:text-lg">
              We build websites, apps, and automation systems that actually grow your business. 
              From design to deployment to marketing—everything under one roof.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <DSButton size="lg" onClick={() => scrollToSection('get-started')}>
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </DSButton>
              <DSButton variant="secondary" size="lg" onClick={() => scrollToSection('portfolio')}>
                <Play className="mr-2 w-5 h-5" />
                See Our Work
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
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-[#1F2937] rounded-2xl p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)]">
              {/* Mock Dashboard UI */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="text-[12px] text-[#9CA3AF]">dashboard.webdevs.com</div>
                </div>

                {/* Header */}
                <div className="h-12 bg-[#111827] rounded-lg flex items-center px-4 gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-[#22C55E] to-[#06B6D4]" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-[#374151] rounded mb-1" />
                    <div className="h-2 w-32 bg-[#374151]/50 rounded" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111827] rounded-lg p-4">
                    <div className="h-2 w-16 bg-[#374151] rounded mb-3" />
                    <div className="h-6 w-20 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded mb-2" />
                    <div className="h-2 w-12 bg-[#374151]/50 rounded" />
                  </div>
                  <div className="bg-[#111827] rounded-lg p-4">
                    <div className="h-2 w-16 bg-[#374151] rounded mb-3" />
                    <div className="h-6 w-20 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded mb-2" />
                    <div className="h-2 w-12 bg-[#374151]/50 rounded" />
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[#111827] rounded-lg p-4 h-32 flex items-end gap-2">
                  {[40, 70, 45, 80, 60, 90, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#22C55E] to-[#06B6D4] rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>

                {/* List Items */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#111827] rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#374151]" />
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-[#374151] rounded mb-2" />
                        <div className="h-2 w-16 bg-[#374151]/50 rounded" />
                      </div>
                      <div className="w-12 h-6 bg-[#22C55E]/20 rounded flex items-center justify-center">
                        <div className="w-8 h-2 bg-[#22C55E] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#22C55E] text-[#0B0F14] px-4 py-2 rounded-lg font-bold text-[14px] shadow-lg">
              ✓ Trusted by 50+ Companies
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
