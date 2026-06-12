import React from 'react';

interface DSNavbarProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
}

export function DSNavbar({ logo, children }: DSNavbarProps) {
  return (
    <nav className="h-[72px] bg-[#111827] border-b border-[#374151] px-6 flex items-center justify-between">
      {logo && <div className="flex items-center">{logo}</div>}
      {children && <div className="flex items-center gap-6">{children}</div>}
    </nav>
  );
}

export function DSNavLink({ 
  children, 
  active = false,
  onClick
}: { 
  children: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-[16px] 
        font-medium 
        transition-colors 
        duration-200
        ${active ? 'text-[#22C55E]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}
      `}
    >
      {children}
    </button>
  );
}
