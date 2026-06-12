import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";

type AiFieldHelperProps = {
  fieldLabel: string;
  fieldValue: string;
  fieldKey: string;
  entityName?: string;
  entityType?: string;
  onApply?: (value: string) => void;
  apiBase?: string;
  placeholder?: string;
  suggestions?: string[];
};

/**
 * Inline AI helper for individual form fields.
 * Shows AI suggestion button, generates content on click.
 */
export function AiFieldHelper({
  fieldLabel,
  fieldValue,
  fieldKey,
  entityName = "",
  entityType = "tool",
  onApply,
  apiBase = "/api/v1",
  placeholder,
  suggestions = [],
}: AiFieldHelperProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerate = async () => {
    if (!entityName && !fieldValue) return;
    setIsGenerating(true);
    setGenerated("");

    try {
      const token = localStorage.getItem("auth_token") ?? "";

      const prompt = `Generate ${fieldLabel.toLowerCase()} content for: ${entityName || fieldKey}

${fieldValue ? `Current content to improve:\n${fieldValue}\n` : ""}

${suggestions.length > 0 ? `Context/suggestions:\n${suggestions.join("\n")}` : ""}

Requirements:
- Be specific and practical
- SEO-friendly language
- Answer-first structure
- No generic filler
- Length: ${fieldLabel.toLowerCase().includes("description") || fieldLabel.toLowerCase().includes("overview") ? "100-200 words" : "50-100 words"}`;

      const response = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: 0,
          section_key: fieldKey,
          prompt_template: fieldLabel.toLowerCase().includes("overview") ? "entity_overview" : "default",
          prompt,
          entity_name: entityName,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const result = await response.json();
      setGenerated(result.content || "");

    } catch (error) {
      console.error("AI generation failed:", error);
      setGenerated("Failed to generate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply && generated) {
      onApply(generated);
      setGenerated("");
    }
  };

  return (
    <div className="space-y-sm">
      {/* Quick suggestions */}
      {suggestions.length > 0 && !generated && (
        <div className="flex flex-wrap gap-xs">
          {suggestions.slice(0, 3).map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApply?.(suggestion)}
              className="text-video-title px-sm py-xs rounded-corner-sm bg-bg-faint border border-border-secondary text-text-secondary hover:border-brand-default hover:text-brand-default transition-colors"
            >
              {suggestion.length > 30 ? suggestion.slice(0, 30) + "..." : suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Generate button and options */}
      <div className="flex items-center gap-xs">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || (!entityName && !fieldValue)}
          className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary hover:text-brand-default transition-colors text-label-sm disabled:opacity-50"
          title={`Generate ${fieldLabel} with AI`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-brand-primary" />
              <span>AI Suggest</span>
            </>
          )}
        </button>

        {generated && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-label-sm text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {showSuggestions ? "Hide" : "Show"} AI suggestions
          </button>
        )}
      </div>

      {/* Generated content display */}
      {generated && showSuggestions && (
        <div className="bg-bg-faint border border-border-secondary rounded-corner-md p-md">
          <div className="flex items-center justify-between mb-sm">
            <span className="text-label-sm text-text-tertiary">AI Suggestion</span>
            <div className="flex items-center gap-xs">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm text-label-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <p className="text-label-sm text-text-primary whitespace-pre-wrap">{generated}</p>
          <div className="flex items-center gap-sm mt-md pt-sm border-t border-border-secondary">
            <button
              type="button"
              onClick={handleGenerate}
              className="text-label-sm text-text-secondary hover:text-text-primary transition-colors"
              disabled={isGenerating}
            >
              Regenerate
            </button>
            {onApply && (
              <button
                type="button"
                onClick={handleApply}
                className="px-sm py-xs rounded-corner-sm bg-brand-primary text-white text-label-sm hover:bg-brand-hover transition-colors"
              >
                Use This
              </button>
            )}
            <button
              type="button"
              onClick={() => { setGenerated(""); setShowSuggestions(false); }}
              className="text-label-sm text-text-secondary hover:text-text-primary transition-colors ml-auto"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AI Field helper for text inputs - integrates inline with input fields
 */
export function AiTextInputHelper({
  label,
  value,
  onChange,
  entityName,
  fieldKey,
  placeholder,
  suggestions,
  apiBase,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  entityName?: string;
  fieldKey: string;
  placeholder?: string;
  suggestions?: string[];
  apiBase?: string;
}) {
  return (
    <div className="space-y-sm">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(s)}
              className="text-video-title px-sm py-xs rounded-corner-sm bg-bg-faint border border-border-secondary text-text-tertiary hover:border-brand-default hover:text-brand-default transition-colors"
            >
              {s.length > 25 ? s.slice(0, 25) + "..." : s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-xs">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-bg-subtle border border-border-secondary rounded-corner-sm px-sm py-xs text-label-sm text-text-primary focus:outline-none focus:border-brand-default"
        />
        <AiFieldHelper
          fieldLabel={label}
          fieldValue={value}
          fieldKey={fieldKey}
          entityName={entityName}
          onApply={onChange}
          apiBase={apiBase}
        />
      </div>
    </div>
  );
}

/**
 * AI Field helper for textarea fields - integrates inline with textarea
 */
export function AiTextareaHelper({
  label,
  value,
  onChange,
  entityName,
  fieldKey,
  placeholder,
  rows = 3,
  suggestions,
  apiBase,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  entityName?: string;
  fieldKey: string;
  placeholder?: string;
  rows?: number;
  suggestions?: string[];
  apiBase?: string;
}) {
  return (
    <div className="space-y-sm">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(s)}
              className="text-video-title px-sm py-xs rounded-corner-sm bg-bg-faint border border-border-secondary text-text-tertiary hover:border-brand-default hover:text-brand-default transition-colors"
            >
              {s.length > 25 ? s.slice(0, 25) + "..." : s}
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-bg-subtle border border-border-secondary rounded-corner-sm px-sm py-xs text-label-sm text-text-primary resize-none focus:outline-none focus:border-brand-default"
        />
        <div className="absolute bottom-sm right-sm">
          <AiFieldHelper
            fieldLabel={label}
            fieldValue={value}
            fieldKey={fieldKey}
            entityName={entityName}
            onApply={onChange}
            apiBase={apiBase}
          />
        </div>
      </div>
    </div>
  );
}