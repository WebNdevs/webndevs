import React, { useState } from 'react';
import { DSButton } from './ds-button';
import { DSInput } from './ds-input';
import { ArrowRight, Calendar, Check, Mail, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.config';

const SERVICES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'AI & Automation',
  'Data Analytics',
  'Digital Marketing',
  'Branding & Design',
  'Not Sure / Multiple Services',
];

const EMPTY_FORM = { name: '', email: '', phone: '', service: SERVICES[0], message: '' };

type Status = { state: 'idle' } | { state: 'loading' } | { state: 'success' } | { state: 'error'; message: string };

export function CTASection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const set = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      const res = await fetch(`${API_BASE_URL}/service-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          service_name: form.service,
          project_brief: form.message,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || 'Something went wrong. Please try again.');
      }
      setForm(EMPTY_FORM);
      setStatus({ state: 'success' });
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Unable to submit. Please email us directly.' });
    }
  };

  return (
    <section id="get-started" className="py-20 px-6 bg-[#111827] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
              <span className="text-[14px] font-medium text-[#22C55E]">Let's Build Something Amazing</span>
            </div>

            <h2 style={{ fontSize: '48px' }} className="font-bold text-[#F9FAFB] mb-4 leading-tight">
              Ready to{' '}
              <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                Transform Your Business?
              </span>
            </h2>

            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] mb-8 leading-relaxed">
              Stop wasting time with multiple freelancers. Get a dedicated team that handles
              everything from design to development to marketing.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: 'Free 30-Minute Consultation', desc: 'No commitment. Just an honest conversation about your project.' },
                { title: 'Detailed Project Proposal', desc: 'Clear timeline, transparent pricing, and actionable roadmap.' },
                { title: 'Fast Response Time', desc: 'We reply within 24 hours, usually much faster.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                <MessageSquare className="w-4 h-4" /> <h4>US</h4>
                +1 (762) 760-3015
              </a>
              <a href="tel:+919887603015" rel="noopener noreferrer" className="flex items-center gap-2 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                <MessageSquare className="w-4 h-4" /> <h4>IN</h4>
                +91 (988) 760-3015
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-[#1F2937] rounded-2xl p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] border border-[#374151]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px' }} className="font-bold text-[#F9FAFB]">Get Started Today</h3>
                <p className="text-[14px] text-[#9CA3AF]">Fill out the form below</p>
              </div>
            </div>

            {status.state === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#22C55E]" />
                </div>
                <p className="text-[18px] font-semibold text-[#F9FAFB]">Request Sent!</p>
                <p className="text-[14px] text-[#9CA3AF]">We'll get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setStatus({ state: 'idle' })}
                  className="text-[14px] text-[#22C55E] hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <DSInput label="Full Name" type="text" placeholder="John Smith" required value={form.name} onChange={set('name')} />
                <DSInput label="Email Address" type="email" placeholder="john@company.com" required value={form.email} onChange={set('email')} />
                <DSInput label="Phone Number" type="tel" placeholder="+1 (234) 567-890" value={form.phone} onChange={set('phone')} />

                <div>
                  <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">
                    What service are you interested in?
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-colors"
                    value={form.service}
                    onChange={set('service')}
                  >
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-[#F9FAFB] text-[16px] placeholder:text-[#6B7280] outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-colors resize-none"
                    rows={4}
                    placeholder="Describe your project goals, timeline, and any specific requirements..."
                    required
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                {status.state === 'error' && (
                  <p className="text-[13px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {status.message}
                  </p>
                )}

                <DSButton type="submit" size="lg" className="w-full" disabled={status.state === 'loading'}>
                  {status.state === 'loading' ? 'Sending…' : 'Schedule Free Consultation'}
                  {status.state !== 'loading' && <ArrowRight className="ml-2 w-5 h-5" />}
                </DSButton>

                <p className="text-[12px] text-[#6B7280] text-center">
                  By submitting, you agree to our privacy policy. We never share your information.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
