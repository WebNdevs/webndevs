import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ChevronDown, ChevronLeft, Menu, X } from 'lucide-react';
import { DSButton } from './ds-button';
import logo from '../../assets/logo.png';


export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const goHomeAndScroll = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const scrollToCta = () => {
  setMobileMenuOpen(false);

  const cta = document.getElementById("get-started");

  if (cta) {
    const top = cta.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }

  navigate("/contact");
};

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-sm border-b border-[#374151]" aria-label="Primary navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
            <img className='w-12 h-12 rounded object-cover' src={logo} alt="" />
            <span style={{ fontSize: '22px' }} className="font-bold text-[#F9FAFB]">
              WebNDevs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ">
            <Link to="/" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              Home
            </Link>

            <Link to="/services" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              Services
            </Link>

            <Link to="/blogs" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              Blogs
            </Link>

            <Link to="/portfolio" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              Portfolio
            </Link>

            <div className="relative group" onMouseEnter={() => setDataOpen(true)} onMouseLeave={() => setDataOpen(false)}>
              <button
                className="flex items-center gap-1 min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
              >
                <Link to="/data" className=" flex gap-2 items-center rounded-lg hover:bg-white/5">
                  Data Hub <ChevronDown size={16} />
                </Link>
              </button>
              {dataOpen &&(
              <div className="absolute left-0 top-full  hidden group-hover:block w-64 rounded-xl border border-white/10 bg-[#111827] p-2 shadow-xl z-50">

                <Link to="/tools" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Tools
                </Link>

                <Link to="/industries" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Industries
                </Link>

                <Link to="/solutions" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Solutions
                </Link>

                <Link to="/compare" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Comparisons
                </Link>

                <Link to="/case-studies" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Case Studies
                </Link>

                <Link to="/cross-reference" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Cross References
                </Link>

                <Link to="/free-tools" className="block rounded-lg px-3 py-2 hover:bg-white/5">
                  Free Tools
                </Link>
              </div>)}
            </div>

            <Link to="/contact" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              Contact Us
            </Link>
            <Link to="/faq" className="min-h-[20px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
              FAQ
            </Link>
            <DSButton size="sm" onClick={scrollToCta}>
              Get Started
            </DSButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#F9FAFB] min-h-[44px] min-w-[44px]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 top-[72px] z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'pointer-events-auto bg-black/50 opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden={!mobileMenuOpen}
        />
        <div
          className={`md:hidden fixed right-0 top-[72px] z-50 h-[calc(100vh-72px)] w-[280px] border-l border-[#374151] bg-[#111827] p-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex flex-col gap-4">
            {!isHome && (
              <button
                aria-label="Go back"
                onClick={goBack}
                className="flex items-center gap-1 min-h-[44px] text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors text-left"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}
            <button
              aria-label="Navigate to services"
                onClick={() => goHomeAndScroll('services')}
                className="min-h-[44px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-left"
              >
                Services
            </button>
            <button
              aria-label="Navigate to process"
                onClick={() => goHomeAndScroll('process')}
                className="min-h-[44px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-left"
              >
                Process
            </button>
            <button
              aria-label="Open blogs page"
                onClick={() => goHomeAndScroll('blogs')}
                className="min-h-[44px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-left"
              >
                Blogs
            </button>
            <button
              aria-label="Navigate to portfolio"
                onClick={() => goHomeAndScroll('portfolio')}
                className="min-h-[44px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-left"
              >
                Portfolio
            </button>
            <button
              aria-label="Navigate to frequently asked questions"
                onClick={() => goHomeAndScroll('faq')}
                className="min-h-[44px] text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors text-left"
              >
                FAQ
            </button>
            <DSButton size="sm" onClick={() => goHomeAndScroll('get-started')} className="w-full min-h-[44px]">
              Get Started
            </DSButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
