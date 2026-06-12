import React from 'react';
import { DSCard } from './ds-card';
import { Users, MessageCircle, Rocket, Shield, Clock, Target } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'One Team for Everything',
    description: 'No more coordinating between designers, developers, and marketers. We handle it all seamlessly under one roof.'
  },
  {
    icon: MessageCircle,
    title: 'Clear Communication',
    description: 'Direct access to your project manager. No middlemen, no confusion—just clear updates and honest timelines.'
  },
  {
    icon: Rocket,
    title: 'Scalable Solutions',
    description: 'Start small, grow big. Our solutions scale with your business without needing to rebuild from scratch.'
  },
  {
    icon: Shield,
    title: 'Long-Term Partnership',
    description: 'We don\'t just build and leave. We stick around to support, maintain, and help you grow for years to come.'
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'We know time is money. Our streamlined process means faster delivery without compromising quality.'
  },
  {
    icon: Target,
    title: 'Results-Focused Approach',
    description: 'Pretty designs are great, but we focus on what really matters—conversions, growth, and ROI.'
  }
];

export function WhyChooseSection() {
  return (
    <section className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Why Choose <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>WebNDevs?</span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            We're not just another agency. We're the reliable digital partner you can count on 
            for the long haul.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <DSCard key={index} hover>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </DSCard>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="mt-16">
          <DSCard className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Traditional Way */}
              <div className="p-8 border-r border-[#374151]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
                    <span className="text-[#EF4444] text-[20px]">✗</span>
                  </div>
                  <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                    Traditional Approach
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] flex-shrink-0">•</span>
                    <span>Hire separate freelancers for each task</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] flex-shrink-0">•</span>
                    <span>Manage multiple contracts and invoices</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] flex-shrink-0">•</span>
                    <span>Hope everyone communicates properly</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] flex-shrink-0">•</span>
                    <span>Deal with inconsistent quality and delays</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                    <span className="text-[#EF4444] flex-shrink-0">•</span>
                    <span>Rebuild from scratch when you need changes</span>
                  </li>
                </ul>
              </div>

              {/* Our Way */}
              <div className="p-8 bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                    <span className="text-[#22C55E] text-[20px]">✓</span>
                  </div>
                  <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                    The WebNDevs Way
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] flex-shrink-0">✓</span>
                    <span>One expert team handles everything</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] flex-shrink-0">✓</span>
                    <span>Single point of contact, simple billing</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] flex-shrink-0">✓</span>
                    <span>Seamless collaboration built into our process</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] flex-shrink-0">✓</span>
                    <span>Consistent quality and on-time delivery</span>
                  </li>
                  <li className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                    <span className="text-[#22C55E] flex-shrink-0">✓</span>
                    <span>Scalable solutions that grow with you</span>
                  </li>
                </ul>
              </div>
            </div>
          </DSCard>
        </div>
      </div>
    </section>
  );
}
