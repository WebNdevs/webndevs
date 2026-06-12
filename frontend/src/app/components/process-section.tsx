import React from 'react';
import { DSCard } from './ds-card';
import { Search, FileText, Hammer, Rocket, HeadphonesIcon } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover',
    description: 'We start by understanding your business, goals, and challenges. A quick call helps us map out exactly what you need.',
    duration: '1-2 days'
  },
  {
    number: '02',
    icon: FileText,
    title: 'Plan',
    description: 'We create a detailed project roadmap with timelines, milestones, and deliverables. You know exactly what to expect.',
    duration: '3-5 days'
  },
  {
    number: '03',
    icon: Hammer,
    title: 'Build',
    description: 'Our team gets to work designing, developing, and testing. You get regular updates and can provide feedback along the way.',
    duration: '2-8 weeks'
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch',
    description: 'We handle deployment, testing, and ensure everything runs smoothly. Your project goes live without a hitch.',
    duration: '1-3 days'
  },
  {
    number: '05',
    icon: HeadphonesIcon,
    title: 'Support',
    description: 'We don\'t disappear after launch. Ongoing support, updates, and improvements keep your solution running at its best.',
    duration: 'Ongoing'
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 px-6 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Our Process
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            From Idea to Launch in{' '}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              5 Simple Steps
            </span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#22C55E] to-[#06B6D4]" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="relative">
                  {/* Desktop Layout */}
                  <div className={`hidden lg:grid grid-cols-2 gap-12 items-center ${isEven ? '' : 'direction-rtl'}`}>
                    {isEven ? (
                      <>
                        {/* Left Content */}
                        <div className="text-right">
                          <DSCard hover>
                            <div className="flex items-start gap-4 flex-row-reverse">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-7 h-7 text-[#22C55E]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-end gap-3 mb-3">
                                  <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                    {step.title}
                                  </h3>
                                  <span className="text-[32px] font-bold text-[#22C55E]/20">
                                    {step.number}
                                  </span>
                                </div>
                                <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                  {step.description}
                                </p>
                                <p className="text-[12px] text-[#22C55E] font-medium">
                                  Timeline: {step.duration}
                                </p>
                              </div>
                            </div>
                          </DSCard>
                        </div>

                        {/* Center Dot */}
                        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" />

                        {/* Right Empty */}
                        <div />
                      </>
                    ) : (
                      <>
                        {/* Left Empty */}
                        <div />

                        {/* Center Dot */}
                        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" />

                        {/* Right Content */}
                        <div>
                          <DSCard hover>
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-7 h-7 text-[#22C55E]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-[32px] font-bold text-[#22C55E]/20">
                                    {step.number}
                                  </span>
                                  <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                    {step.title}
                                  </h3>
                                </div>
                                <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                  {step.description}
                                </p>
                                <p className="text-[12px] text-[#22C55E] font-medium">
                                  Timeline: {step.duration}
                                </p>
                              </div>
                            </div>
                          </DSCard>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <DSCard hover>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-[#22C55E]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[32px] font-bold text-[#22C55E]/20">
                              {step.number}
                            </span>
                            <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB]">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                            {step.description}
                          </p>
                          <p className="text-[12px] text-[#22C55E] font-medium">
                            Timeline: {step.duration}
                          </p>
                        </div>
                      </div>
                    </DSCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <DSCard className="max-w-2xl mx-auto bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border border-[#22C55E]/20">
            <p style={{ fontSize: '18px' }} className="text-[#F9FAFB] font-semibold mb-2">
              Ready to get started?
            </p>
            <p className="text-[14px] text-[#9CA3AF] mb-4">
              Book a free 30-minute consultation and let's discuss your project.
            </p>
            <button 
              onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors"
            >
              Schedule Your Free Call →
            </button>
          </DSCard>
        </div>
      </div>
    </section>
  );
}
