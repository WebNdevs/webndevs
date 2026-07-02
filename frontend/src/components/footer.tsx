import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone} from 'lucide-react';
import { FaLinkedin, FaXTwitter, FaGithub, FaInstagram, FaThreads, FaFacebook } from 'react-icons/fa6';
import logo from '../../public/logo.png';

const FOOTER_LINKS = {
  services: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "Mobile App Development", href: "/services/mobile-app-development" },
    { label: "UI/UX Design", href: "/services/ui-ux-design" },
    { label: "AI & Automation", href: "/services/ai-automation" },
    { label: "Digital Marketing", href: "/services/digital-marketing" },
  ],

  company: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blogs", href: "/blogs" },
    { label: "FAQ", href: "/faq" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Data Hub", href: "/datahub" },
  ],

  social: [
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/webndevs",
      icon: FaLinkedin,
    },
    {
      label: "X",
      href: "https://X.com/webndevs",
      icon: FaXTwitter,
    },
    {
      label: "Facebook",
      href: "https://facebook.com/profile.php?id=61568037170595",
      icon: FaFacebook,
    },
    {
      label: "GitHub",
      href: "https://github.com/webndevs",
      icon: FaGithub,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/webndevs",
      icon: FaInstagram,
    },
    {
      label: "Threads",
      href: "https://threads.com/@webndevs",
      icon: FaThreads,
    },
  ],

  contact: [
    {
      label: "sales@webndevs.com",
      href: "mailto:sales@webndevs.com",
      icon: Mail,
    },
    {
      label: "+1 (762) 760-3015",
      href: "tel:+17627603015",
      icon: Phone,
    },
    {
      label: "+91 (988) 760-3015",
      href: "tel:+919887603015",
      icon: Phone,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0B0F14] border-t border-[#374151]" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src={logo} className="rounded h-14 w-14 object-cover" alt="WebNDevs Logo" />
              <span className="font-bold text-xl text-[#F9FAFB] hover:text-[#22C55E] transition-colors">
                WebNDevs
              </span>
            </Link>
            <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
              Your complete digital partner for web development, mobile apps, 
              design, automation, and marketing.
            </p>
            {/* Social Icons*/}
            <div className="flex gap-2">
              {FOOTER_LINKS.social.map((item) => {
                const Icon = item.icon;
                return(
                <a key={item.label}
                aria-label={item.label} 
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Services</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Contact</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.contact.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-start gap-3 text-sm text-[#9CA3AF] transition-colors hover:text-[#22C55E]"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#374151] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
            © 2026 WebNDevs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
