import React, { useState } from 'react';
import { DSCard } from './ds-card';
import { ChevronDown } from 'lucide-react';

const faqs = [
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
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Questions & Answers
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Questions? <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>We Have Answers</span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-2xl mx-auto">
            Everything you need to know about working with WebNDevs. 
            Can't find your answer? Just reach out.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <DSCard 
              key={index} 
              className="cursor-pointer transition-all"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 
                    style={{ fontSize: '18px' }} 
                    className="font-semibold text-[#F9FAFB] mb-2"
                  >
                    {faq.question}
                  </h3>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <button className="flex-shrink-0 text-[#22C55E]">
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </DSCard>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center">
          <DSCard className="bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border border-[#22C55E]/20">
            <p style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
              Still have questions?
            </p>
            <p className="text-[14px] text-[#9CA3AF] mb-4">
              Book a free consultation and let's chat about your project.
            </p>
            <button 
              onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors"
            >
              Schedule a Call →
            </button>
          </DSCard>
        </div>
      </div>
    </section>
  );
}
