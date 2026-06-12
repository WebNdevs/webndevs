import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Instagram } from 'lucide-react';
import logo from '../../assets/logo.png';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#0B0F14] border-t border-[#374151]" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" onClick={() => window.scrollTo({ top:0, behavior: 'smooth'})} className="flex items-center gap-3 mb-4">
              <img src={logo} className="w-12 h-12 rounded object-cover" alt="WebNDevs Logo" />
              <span style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB]">
                WebNDevs
              </span>
            </Link>
            <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
              Your complete digital partner for web development, mobile apps, 
              design, automation, and marketing.
            </p>
            <div className="flex gap-3">
              <a
                aria-label="Open LinkedIn profile" 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                aria-label="Open Twitter profile" 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                aria-label="Open GitHub profile" 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                aria-label="Open Instagram profile" 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services/web-development"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/mobile-app-development"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link to="/services/ui-ux-design"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/services/automation"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  AI & Automation
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/portfolio"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blogs"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/faq" 
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/testimonials"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/data"
                  
                  className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  Data Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[16px] font-semibold text-[#F9FAFB] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:sales@webndevs.com"
                  className="flex items-start gap-3 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>sales@webndevs.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+17627603015"
                  className="flex items-start gap-3 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+1 (762) 760-3015</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919887603015" 
                  className="flex items-start gap-3 text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+91 (988) 760-3015</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#374151] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-[#6B7280]">
            © 2026 WebNDevs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-[14px] text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
