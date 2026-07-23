import React from "react";
import { Search, X, Eye, EyeOff } from "lucide-react";

// ==========================================
// 1. BadgeButton Component
// ==========================================
interface BadgeButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
}

export function BadgeButton({
  label,
  icon,
  variant = "default",
}: BadgeButtonProps) {
  const variantStyles = {
    primary: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300",
    secondary: "bg-purple-500/10 border-purple-500/25 text-purple-300",
    success: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    warning: "bg-amber-500/10 border-amber-500/25 text-amber-300",
    danger: "bg-rose-500/10 border-rose-500/25 text-rose-300",
    default: "bg-white/5 border-white/10 text-neutral-300"
  };

  return (
    <span
      className={`inline-flex w-40 h-8 justify-center items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[14px] font-medium border select-none ${variantStyles[variant]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </span>
  );
}

// ==========================================
// 2. Button Component
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "neutral" | "subtle";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export function Button({
  children,
  variant = "neutral",
  size = "medium",
  isLoading = false,
  iconStart,
  iconEnd,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = `inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] ${
    className.includes("rounded-") ? "" : "rounded-lg"
  }`;
  
  const variants = {
    primary: `bg-indigo-600 border border-indigo-500/30 text-white hover:bg-white hover:text-indigo-600 hover:border-white focus:ring-indigo-500 shadow-md shadow-indigo-500/10 transition-all duration-300 ${
      isLoading ? "bg-white! text-indigo-600! border-white!" : ""
    }`,
    secondary: "bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/30 focus:ring-purple-500 shadow-md shadow-purple-500/10",
    neutral: "bg-white hover:bg-neutral-50 text-indigo-600 hover:text-indigo-600 border border-border-primary hover:border-indigo-500/30 hover:shadow-sm focus:ring-indigo-500",
    danger: "bg-red-600 hover:bg-red-500 text-white border border-red-500/30 focus:ring-red-500 shadow-md shadow-red-500/10",
    subtle: "bg-transparent hover:bg-bg-faint text-text-secondary hover:text-text-primary focus:ring-neutral-400"
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs gap-1.5",
    medium: "px-4 py-2 text-sm gap-2",
    large: "px-5 py-2.5 text-base gap-2.5"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-1.5" />
      ) : (
        iconStart && <span className="flex-shrink-0">{iconStart}</span>
      )}
      {children}
      {!isLoading && iconEnd && <span className="flex-shrink-0">{iconEnd}</span>}
    </button>
  );
}

// ==========================================
// 3. Card Component
// ==========================================
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  description,
  headerActions,
  footer,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`bg-surface-bg rounded-xl border border-border-primary p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300
        ${hoverable || isClickable ? "hover:bg-bg-faint hover:border-border-secondary hover:shadow-md cursor-pointer" : ""}
        ${isClickable ? "active:scale-[0.99]" : ""}
        ${className}
      `}
    >
      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between gap-4 border-b border-border-secondary pb-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-text-primary leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex-shrink-0 flex gap-2">{headerActions}</div>}
        </div>
      )}
      {description && <p className="text-xs text-text-secondary leading-relaxed">{description}</p>}
      <div className="flex-1 flex flex-col">{children}</div>
      {footer && (
        <div className="border-t border-border-secondary pt-3 mt-auto flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. FilterBar Component
// ==========================================
interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  viewMode?: "cards" | "table";
  onViewModeChange?: (mode: "cards" | "table") => void;
  children?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  viewMode,
  onViewModeChange,
  children,
}: FilterBarProps) {
  const hasActiveFilters = searchValue || filters.some((f) => f.value);

  const handleClearAll = () => {
    onSearchChange("");
    filters.forEach((f) => f.onChange(""));
  };

  return (
    <div className="w-full bg-surface-bg border border-border-primary rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex-1 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-bg-subtle border border-border-secondary rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary rounded-full hover:bg-bg-faint transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="relative min-w-[150px]">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full px-3 py-2 bg-bg-subtle border border-border-secondary rounded-lg text-sm text-text-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer pr-8"
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-text-tertiary" />
          </div>
        ))}

        {children}

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium px-2 py-1.5 rounded hover:bg-indigo-50/10 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* View Switcher */}
      {viewMode && onViewModeChange && (
        <div className="flex items-center bg-bg-subtle border border-border-secondary rounded-lg p-0.5 self-end md:self-auto">
          <button
            onClick={() => onViewModeChange("table")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer
              ${viewMode === "table" ? "bg-surface-bg text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}
            `}
          >
            Table
          </button>
          <button
            onClick={() => onViewModeChange("cards")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer
              ${viewMode === "cards" ? "bg-surface-bg text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}
            `}
          >
            Cards
          </button>
        </div>
      )}
    </div>
  );
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "onChange"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorText, prefix, suffix, className = "", id, onChange, value, type, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(!!value);
    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-s text-white font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-text-tertiary flex items-center justify-center pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={inputType}
            value={value}
            onChange={handleChange}
            className={`w-full bg-white border text-sm rounded-lg text-text-primary placeholder-text-tertiary transition-colors focus:outline-none focus:ring-1
              ${prefix ? "pl-9" : "px-3"}
              ${suffix || isPassword ? "pr-9" : "px-3"}
              ${errorText 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50" 
                : "border-border-secondary focus:border-indigo-500 focus:ring-indigo-500"
              }
              py-2 ${className}
            `}
            {...props}
          />
          {suffix && !hasValue && (
            <div className="absolute right-3 text-text-tertiary flex items-center justify-center pointer-events-none select-none">
              {suffix}
            </div>
          )}
          {isPassword && hasValue && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-text-tertiary hover:text-text-primary focus:outline-none flex items-center justify-center cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {errorText ? (
          <p className="text-[11px] text-red-500 mt-0.5 leading-none">{errorText}</p>
        ) : (
          helperText && <p className="text-[11px] text-text-tertiary mt-0.5 leading-none">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ==========================================
// 6. Pill Component
// ==========================================
interface PillProps {
  variant?: "primary" | "secondary" | "danger" | "neutral" | "subtle";
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function Pill({ variant = "primary", label, active = false, onClick, icon }: PillProps) {
  return (
    <Button
      variant={active ? "neutral" : variant}
      onClick={onClick}
      className="rounded-full px-4 py-1.5 text-xs font-semibold"
      iconStart={icon}
    >
      {label}
    </Button>
  );
}

// ==========================================
// 7. Tabs Component
// ==========================================
interface TabOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  options: TabOption[];
  activeTab: string;
  onChange: (value: string) => void;
  isMobile?: boolean;
}

export function Tabs({ options, activeTab, onChange, isMobile = false }: TabsProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {options.map((opt) => {
          const isActive = activeTab === opt.value;
          return (
            <Button
              key={opt.value}
              variant={isActive ? "primary" : "neutral"}
              disabled={opt.disabled}
              onClick={() => onChange(opt.value)}
              className="w-full justify-start text-left px-4 py-3 rounded-lg text-sm"
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border-primary bg-bg-faint p-1.5 w-max max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((opt) => {
        const isActive = activeTab === opt.value;
        return (
          <Button
            key={opt.value}
            variant={isActive ? "primary" : "subtle"}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className="rounded-md px-4 py-1.5 text-xs font-semibold"
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}

// ==========================================
// 8. ConfirmModal Component
// ==========================================
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-bg border border-border-primary rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-zoom-in">
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 mt-2 border-t border-border-secondary pt-4">
          <Button variant="neutral" size="small" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" size="small" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
