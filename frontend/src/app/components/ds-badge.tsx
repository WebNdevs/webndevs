import React from 'react';

interface DSBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  className?: string;
}

export function DSBadge({ children, variant = 'default', className = '' }: DSBadgeProps) {
  const variantStyles = {
    premium:    'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20', // Purple
    featured:   'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', // Cyan
    enterprise: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20', // Indigo
    ai:         'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20', // Violet
    new:        'bg-[#14B8A6]/10 text-[#14B8A6] border-[#14B8A6]/20', // Teal
    hot:        'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20', // Orange
    growth:     'bg-[#84CC16]/10 text-[#84CC16] border-[#84CC16]/20', // Lime
    dark:       'bg-[#1F2937]/50 text-[#E5E7EB] border-[#4B5563]',    // Slate
    success:    'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20', // Green
    error:      'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', // Red
    warning:    'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', // Amber
    info:       'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', // Blue
    default:    'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]', // Gray
  };
  
  return (
    <span 
      className={`
        inline-flex 
        items-center 
        px-3 
        py-1 
        rounded-md 
        text-[12px] 
        font-medium 
        border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
