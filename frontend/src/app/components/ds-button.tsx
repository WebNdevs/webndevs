import React from 'react';

interface DSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function DSButton({ 
  variant = 'primary', 
  size = 'md',
  loading = false,
  children, 
  className = '',
  disabled,
  ...props 
}: DSButtonProps) {
  const isDisabled = disabled || loading;
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]';
  
  const variantStyles = {
    primary: isDisabled 
      ? 'bg-[#374151] text-[#6B7280] cursor-not-allowed'
      : 'bg-gradient-to-r from-[#22C55E] via-[#34D399] to-[#06B6D4] bg-[length:200%_100%] text-[#0B0F14] hover:bg-[position:100%_0] active:scale-[0.98]',
    secondary: isDisabled
      ? 'bg-[#374151] text-[#6B7280] cursor-not-allowed'
      : 'bg-[#111827] text-[#F9FAFB] hover:bg-[#273449] border border-[#4B5563] active:scale-[0.98]',
    outline: isDisabled
      ? 'border border-[#374151] text-[#6B7280] cursor-not-allowed'
      : 'border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10 active:scale-[0.98]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-[14px]',
    md: 'px-5 py-3 text-[14px]',
    lg: 'px-6 py-4 text-[16px]',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
