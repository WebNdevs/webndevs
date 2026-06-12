import React from 'react';

interface DSCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function DSCard({ children, className = '', hover = false, onClick }: DSCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#1F2937] 
        rounded-xl 
        p-6 
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.3)]
        ${hover ? 'transition-all duration-200 hover:bg-[#273449] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
