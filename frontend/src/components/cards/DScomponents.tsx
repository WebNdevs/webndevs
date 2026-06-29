import { ReactNode, useId } from "react";
import { Slot } from "@radix-ui/react-slot";


// ----------------------
interface DSBadgeProps {
  children: ReactNode;
  variant?: keyof typeof badgeVariants;
  className?: string;
};

const badgeVariants = {
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
} as const;

export function DSBadge({ children, variant = 'default', className = '' }: DSBadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium border ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// -----------------------
interface DSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
};


const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]';
  
const variantStyles = {
  primary: 'bg-linear-to-r from-[#22C55E] via-[#34D399] to-[#06B6D4] bg-[length:200%_100%] text-[#0B0F14] hover:bg-[position:100%_0] active:scale-[0.98]',
  secondary: 'bg-[#111827] text-[#F9FAFB] hover:bg-[#273449] border border-[#4B5563] active:scale-[0.98]',
  outline: 'border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10 active:scale-[0.98]',
};
  
const sizeStyles = {
  sm: 'px-4 py-2 text-[14px]',
  md: 'px-5 py-3 text-[14px]',
  lg: 'px-6 py-4 text-[16px]',
};

export function DSButton({ variant = 'primary', size = 'md', loading = false, asChild = false, children, className = '', disabled = false, ...props }: DSButtonProps) {  
  const isDisabled = disabled || loading;
  const disabledStyles = "bg-[#374151] text-[#6B7280] border-[#374151] cursor-not-allowed";
  const buttonClasses = `${baseStyles} ${isDisabled ? disabledStyles : variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  if (asChild) {
    return (
      <Slot className={buttonClasses} {...props}>
        {children}
      </Slot>
    );
  }
  
  return (
    <button 
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" /> : null}
      {children}
    </button>
  );
};

// -----------------------
interface DSCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const Card = 'bg-[#1F2937] rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4),0_2px_4px_-1px_rgba(0,0,0,0.3)]';

const Card_hover = 'transition-all duration-200 hover:bg-[#273449] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]';

export function DSCard({ children, className = '', hoverable = false, onClick }: DSCardProps) {
  return (
    <div onClick={onClick} className={`${Card} ${hoverable ? Card_hover : ''} ${className}`}>
      {children}
    </div>
  );
};

// ------------------
interface DSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
};

export function DSInput({ id,label, error, helperText, className = "", ...props }: DSInputProps) {
  const inputId = id ?? useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-[#F9FAFB]">
          {label}
        </label>
      )}

      <input id={inputId} {...props} aria-invalid={!!error} 
        className={`w-full rounded-lg border bg-[#111827] px-4 py-3 text-base text-[#F9FAFB] placeholder:text-[#6B7280] outline-none transition-colors duration-200 
          ${error ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20" : "border-[#374151] focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"} 
        ${className}`}
        aria-describedby={error ? `${inputId}-error`: helperText ? `${inputId}-helper` : undefined} 
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-[#EF4444]">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-2 text-sm text-[#9CA3AF]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

// -------------------
export type ContentTile = {
  title?: string;
  description?: string;
  tag?: string;
};

type DSTilesProps = {
  items?: ContentTile[];
};

export function DSTiles({items = []}: DSTilesProps) {
  return (
    <div className="space-y-6 mb-3">
      {items.map((item, index) => (
        <DSCard key={index}>
          {item.title && (
            <h2
              style={{ fontSize: "24px" }}
              className="font-bold text-[#F9FAFB] mb-4"
            >
              {item.title}
              {item.tag && (
                <DSBadge variant="success" className="ml-2">
                  {item.tag}
                </DSBadge>
              )}
            </h2>
          )}

          {item.description && (
            <p className="text-[15px] leading-relaxed text-[#9CA3AF]">
              {item.description}
            </p>
          )}
        </DSCard>
      ))}
    </div>
  );
}
