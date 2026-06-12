import { useState } from "react";
import { Button } from "@figma/astraui";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";

type GenerateState = "idle" | "loading" | "streaming" | "done" | "error";

type AiGenerateButtonProps = {
  onGenerate: () => Promise<void>;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

/**
 * P4-AI-29 — Reusable AI generate trigger with loading/streaming/done states.
 * Caller provides onGenerate() which resolves when generation completes.
 */
export function AiGenerateButton({
  onGenerate,
  label = "Generate with AI",
  size = "md",
  disabled = false,
  className = "",
}: AiGenerateButtonProps) {
  const [state, setState] = useState<GenerateState>("idle");

  const handleClick = async () => {
    if (state === "loading" || state === "streaming") return;
    setState("loading");
    try {
      await onGenerate();
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const iconSize = size === "sm" ? 14 : 16;
  const isActive = state === "loading" || state === "streaming";

  const icon = {
    idle:      <Sparkles size={iconSize} />,
    loading:   <Loader2 size={iconSize} className="animate-spin" />,
    streaming: <Loader2 size={iconSize} className="animate-spin" />,
    done:      <Check size={iconSize} />,
    error:     <AlertCircle size={iconSize} />,
  }[state];

  const buttonLabel = {
    idle:      label,
    loading:   "Generating…",
    streaming: "Streaming…",
    done:      "Generated",
    error:     "Failed — retry?",
  }[state];

  const colorClass = {
    idle:      "",
    loading:   "",
    streaming: "",
    done:      "!bg-success-subtle !text-success-default !border-success-default",
    error:     "!bg-error-subtle !text-error-default !border-error-default",
  }[state];

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isActive}
      className={[
        "inline-flex items-center gap-xs font-medium transition-all duration-200 rounded-corner-sm border",
        size === "sm"
          ? "px-sm py-xs text-label-sm"
          : "px-md py-sm text-label",
        "bg-brand-subtle text-brand-default border-brand-default hover:bg-brand-primary hover:text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        colorClass,
        className,
      ].join(" ")}
    >
      {icon}
      {buttonLabel}
    </button>
  );
}
