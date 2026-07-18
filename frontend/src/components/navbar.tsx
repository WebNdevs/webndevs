"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { DSButton } from './cards/DScomponents';
import logo from '../../public/logo.png';

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    type: "link",
  },
  {
    label: "Services",
    href: "/services",
    type: "link",
  },
  {
    label: "About Us",
    href: "/about",
    type: "link",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    type: "link",
  },
  {
    label: "DataHub",
    href: "/datahub",
    type: "dropdown",
    children: [
      { label: "Tools", href: "/tools" },
      { label: "Industries", href: "/industries" },
      { label: "Solutions", href: "/solutions" },
      { label: "Comparisons", href: "/comparisons" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blogs", href: "/blogs" },
      { label: "Free Tools", href: "/free-tools" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    type: "link",
  },
  {
    label: "FAQ",
    href: "/faq",
    type: "link",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (!element) return false;

    const top =
      element.getBoundingClientRect().top +
      window.scrollY -
      72;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    return true;
  };

  const scrollToCta = () => {
    if (!scrollToSection("get-started")) {
      router.push("/contact");
    }
  };
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-[#111827]/95 backdrop-blur-sm border-b border-[#374151]" role="banner">
      <nav className="max-w-7xl mx-auto px-6" aria-label="Primary navigation">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image className='rounded h-14 w-14 object-cover' src={logo} alt="WebNDevs Logo" />
            <span className="font-bold text-2xl text-[#F9FAFB] hover:text-[#22C55E] transition-colors">
              WebNDevs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 ">
            {NAV_ITEMS.map((item) =>
              item.type === "link" ? (
                <Link key={item.label} href={item.href} className="min-h-5 text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <div key={item.label} className="relative group">
                  <Link href={item.href} className=" flex gap-2 items-center rounded-lg hover:bg-white/5 min-h-5 text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                    {item.label} <ChevronDown size={16} />
                  </Link>
                  <div className="absolute left-5 top-full hidden group-hover:block w-64 rounded-xl border border-white/10 bg-[#111827] p-2 shadow-xl z-50">
                    {item.children?.map((child) => (
                      <Link key={child.label} href={child.href} className="block rounded-lg px-3 py-2 text-[#F9FAFB] hover:text-[#F9FAFB] hover:bg-white/5 transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            <DSButton size="sm" onClick={scrollToCta}>
              Get Started
            </DSButton>
          </div>
          {/* Mobile Navigation Controls */}
          <div className="flex lg:hidden items-center">
            <button
              className="text-[#F9FAFB] p-1 focus:outline-none"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-18 bg-black/50 z-40 lg:hidden"
            onClick={() => {
              setMobileMenuOpen(false);
              setOpenDropdown(null);
            }}
          />
        )}

        {/* Side Menu */}
        <div className={`fixed top-18 right-0 h-[calc(100vh-72px)] overflow-y-auto w-72 overscroll-contain bg-[#111827]/90 border-t border-l rounded-xl border-[#374151] z-50 transition-transform duration-300 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col p-6">

            {NAV_ITEMS.map((item) => {

              // ---------- NORMAL LINK ----------
              if (item.type === "link") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              }

              // ---------- DROPDOWN ----------
              return (
                <div key={item.label} className="flex flex-col">

                  <div className="flex items-center justify-between py-3">

                    {/* Go to DataHub */}
                    <Link
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                      className="text-[16px] font-medium text-[#9CA3AF] hover:text-[#F9FAFB]"
                    >
                      {item.label}
                    </Link>

                    {/* Expand children */}
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className="p-1"
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={openDropdown === item.label}
                      aria-controls={`submenu-${item.label.toLowerCase()}`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                  </div>

                  {/* Children */}
                  {openDropdown === item.label && (
                    <div id={`submenu-${item.label.toLowerCase()}`} className="ml-5 flex flex-col border-2 rounded-2xl border-[#374151] pl-4 max-h-64 overflow-y-auto overscroll-contain">

                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                          className="py-2 text-[15px] text-[#9CA3AF] hover:text-[#F9FAFB]"
                        >
                          {child.label}
                        </Link>
                      ))}

                    </div>
                  )}

                </div>
              );
            })}

            {/* Get Started button inside sidebar */}
            <div className="mt-6 pt-6 border-t border-[#374151]">
              <DSButton className="w-full" onClick={scrollToCta}>
                Get Started
              </DSButton>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}
