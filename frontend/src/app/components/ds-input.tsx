import React from 'react';

interface DSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function DSInput({ 
  label, 
  error, 
  helperText, 
  className = '',
  ...props 
}: DSInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[#F9FAFB] text-[14px] font-medium mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full
          px-4 
          py-3 
          bg-[#111827] 
          border 
          ${error ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#374151] focus:border-[#22C55E]'}
          rounded-lg 
          text-[#F9FAFB] 
          text-[16px]
          placeholder:text-[#6B7280]
          transition-colors
          duration-200
          outline-none
          focus:ring-2
          ${error ? 'focus:ring-[#EF4444]/20' : 'focus:ring-[#22C55E]/20'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[14px] text-[#EF4444]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-[14px] text-[#9CA3AF]">{helperText}</p>
      )}
    </div>
  );
}
