import { Mail, MessageSquare, ArrowDown } from 'lucide-react';
import { DSButton } from '../cards/DScomponents';
import { Text } from '../cards/text-card';
import Link from 'next/link';
import { CTAForm } from '../cards/cta-form';


const Benefits = [
  { title: 'Free 30-Minute Consultation', desc: 'No commitment. Just an honest conversation about your project.' },
  { title: 'Detailed Project Proposal', desc: 'Clear timeline, transparent pricing, and actionable roadmap.' },
  { title: 'Fast Response Time', desc: 'We reply within 24 hours, usually much faster.' },
];

export function CTASection() {
  return (
    <section id="get-started" aria-label="Contact and consultation request" className="py-16 px-4 sm:px-6 bg-[#111827] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#22C55E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#06B6D4]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="text-[14px] font-medium text-[#22C55E]">Let&apos;s Build Something Amazing</span>
            </div>

            <h2 style={{ fontSize: '48px' }} className="font-bold text-[#F9FAFB] mb-4 leading-tight">
              Ready to{' '}
              <span className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                Transform Your Business?
              </span>
            </h2>

            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] mb-8 leading-relaxed">
              Stop wasting time with multiple freelancers. Get a dedicated team that handles
              everything from design to development to marketing.
            </p>

            <div className="space-y-4 mb-8">
              {Benefits.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#22C55E] text-[14px] font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#F9FAFB] text-[16px] mb-1">{item.title}</p>
                    <p className="text-[14px] text-[#9CA3AF]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="mailto:sales@webndevs.com" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                <Mail className="w-4 h-4" />
                sales@webndevs.com
              </a>
              <a href="tel:+17627603015" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                <MessageSquare className="w-4 h-4" /> <strong className="font-semibold">US</strong>
                +1 (762) 760-3015
              </a>
              <a href="tel:+919887603015" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                <MessageSquare className="w-4 h-4" /> <strong className="font-semibold">IN</strong>
                +91 (988) 760-3015
              </a>
            </div>
          </div>  
          {/* Right Content */}
          <div className="w-full max-w-xl mx-auto lg:max-w-none">
            <CTAForm/>
          </div>
        </div>
      </div>
    </section>
  );
}

export type ShortCTAProps = {
  variant?: "preview" | "full",
  preview?: {
    text?: string;
    url: string;
  };
  full?: {
    description?: string;
    text?: string;
    url?: string;
  };
}

export function ShortCTA({ variant = "full", preview, full} : ShortCTAProps) {
  
  if (variant === "preview") {  
    return(
      <div className="text-center mt-12 mb-8">
        { preview && (
          <Link href={preview.url} passHref legacyBehavior={false}>
            <DSButton className="text-xl font-medium" asChild>
              <span>
                {preview.text}
              </span>
            </DSButton>
          </Link>
        )}
      </div>
    )
  }
  
  return(
    <div className="text-center mt-12">
      { full && (
        <>
        <p className="text-[16px] text-[#9CA3AF] mb-4">
        {full.description}
        </p>
        <Text>
          {full.text}
          <ArrowDown />
        </Text>
        </>
      )}
    </div>
  )
}
