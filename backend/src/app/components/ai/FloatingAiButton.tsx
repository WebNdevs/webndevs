import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

type FloatingAiButtonProps = {
  onGenerate?: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function FloatingAiButton({
  onGenerate,
  isLoading = false,
  disabled = false,
  className = "",
}: FloatingAiButtonProps) {

  const handleClick = async () => {
    if (isLoading || disabled || !onGenerate) return;
    await onGenerate();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      style={{
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
      }}
      title="AI Generate Content"
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Sparkles size={16} />
      )}
    </button>
  );
}