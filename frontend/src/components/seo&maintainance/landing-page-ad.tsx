"use client";
import { DSButton, DSCard, DSInput} from '../pages';

import { Check, ArrowRight, Zap } from 'lucide-react';

export function LandingPageAd() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We\'ll contact you within 24 hours to discuss your project.');
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#0B0F14]">
      {/* Minimal Header */}
      <nav className="py-6 px-6 border-b border-[#374151]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
              <span className="text-white font-bold text-[18px]">WD</span>
            </div>
            <span style={{ fontSize: '22px' }} className="font-bold text-[#F9FAFB]">
              WebNDevs
            </span>
          </div>
          <a href="tel:+1234567890" className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E]">
            +1 (234) 567-890
          </a>
        </div>
      </nav>

      {/* Hero - Above the Fold */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[14px] font-medium text-[#F59E0B]">
                  Limited Spots Available - March 2026
                </span>
              </div>

              <h1 style={{ fontSize: '52px' }} className="font-bold text-[#F9FAFB] mb-4 leading-tight">
                Get a Professional Website That{' '}
                <span className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                  Actually Converts
                </span>
              </h1>

              <p style={{ fontSize: '20px' }} className="text-[#9CA3AF] mb-8 leading-relaxed">
                Stop losing customers to slow, outdated websites. We build fast, 
                modern web solutions that turn visitors into paying customers.
              </p>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-[16px] text-[#F9FAFB]">
                    <strong>2-4 week delivery</strong> (not months like other agencies)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-[16px] text-[#F9FAFB]">
                    <strong>SEO-optimized</strong> to rank on Google from day one
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-[16px] text-[#F9FAFB]">
                    <strong>Mobile-responsive</strong> design that looks great everywhere
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-[16px] text-[#F9FAFB]">
                    <strong>Ongoing support</strong> included for 3 months after launch
                  </span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-6 border-t border-[#374151]">
                <div>
                  <p style={{ fontSize: '28px' }} className="font-bold text-[#22C55E] mb-1">50+</p>
                  <p className="text-[13px] text-[#9CA3AF]">Happy Clients</p>
                </div>
                <div>
                  <p style={{ fontSize: '28px' }} className="font-bold text-[#22C55E] mb-1">98%</p>
                  <p className="text-[13px] text-[#9CA3AF]">Satisfaction Rate</p>
                </div>
                <div>
                  <p style={{ fontSize: '28px' }} className="font-bold text-[#22C55E] mb-1">4.9★</p>
                  <p className="text-[13px] text-[#9CA3AF]">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Form - Conversion Form */}
            <div>
              <DSCard className="bg-[#1F2937] border-2 border-[#22C55E]/30 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                <div className="text-center mb-6">
                  <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB] mb-2">
                    Get Your Free Website Proposal
                  </h3>
                  <p className="text-[14px] text-[#9CA3AF]">
                    No commitment. We'll send you a detailed quote within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <DSInput 
                    type="text"
                    placeholder="Your Name"
                    required
                  />

                  <DSInput 
                    type="email"
                    placeholder="Email Address"
                    required
                  />

                  <DSInput 
                    type="tel"
                    placeholder="Phone Number"
                    required
                  />

                  <div>
                    <select className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-colors">
                      <option>New Website</option>
                      <option>Redesign Existing Site</option>
                      <option>E-commerce Store</option>
                      <option>Landing Page</option>
                      <option>Web Application</option>
                    </select>
                  </div>

                  <DSButton type="submit" size="lg" className="w-full">
                    Get My Free Proposal
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </DSButton>

                  <p className="text-[11px] text-[#6B7280] text-center">
                    🔒 Your information is secure. We never share your data.
                  </p>
                </form>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-[#374151] flex justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    No Hidden Fees
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    100% Satisfaction
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                    <Check className="w-4 h-4 text-[#22C55E]" />
                    Fast Delivery
                  </div>
                </div>
              </DSCard>

              {/* Urgency Message */}
              <p className="text-center text-[14px] text-[#F59E0B] mt-4">
                ⚡ Only 3 spots left this month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits Section */}
      <section className="py-16 px-6 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '36px' }} className="font-bold text-[#F9FAFB] text-center mb-12">
            Why Choose WebNDevs?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <DSCard hover className="text-center">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-[28px]">⚡</span>
              </div>
              <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                Lightning Fast
              </h3>
              <p className="text-[14px] text-[#9CA3AF]">
                We deliver in weeks, not months. Your website will be live before you know it.
              </p>
            </DSCard>

            <DSCard hover className="text-center">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-[28px]">🎯</span>
              </div>
              <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                Conversion-Focused
              </h3>
              <p className="text-[14px] text-[#9CA3AF]">
                Every design decision is made to turn visitors into customers.
              </p>
            </DSCard>

            <DSCard hover className="text-center">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-[28px]">💬</span>
              </div>
              <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                Always Available
              </h3>
              <p className="text-[14px] text-[#9CA3AF]">
                Direct access to your project manager. No waiting days for responses.
              </p>
            </DSCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <DSCard className="bg-linear-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border-2 border-[#22C55E]/30">
            <h2 style={{ fontSize: '36px' }} className="font-bold text-[#F9FAFB] mb-4">
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] mb-8">
              Join 50+ businesses that chose WebNDevs for their web development needs.
            </p>
            <DSButton 
              size="lg"
              onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Your Free Proposal Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </DSButton>
          </DSCard>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 px-6 border-t border-[#374151]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[14px] text-[#6B7280]">
            © 2026 WebNDevs • Web Development Services • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
