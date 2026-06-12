import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, X, Check, RefreshCw } from "lucide-react";

type FieldSchema = {
  key: string;
  label: string;
  type: "text" | "textarea" | "slug" | "url" | "number" | "boolean" | "select";
  value: string | boolean | number;
  options?: string[];
  required?: boolean;
};

type SparkleContext = {
  entityName: string;
  entityType: string;
  fields: FieldSchema[];
};

type SparkleButtonProps = {
  context: SparkleContext;
  onApplyField: (fieldKey: string, value: string) => void;
  apiBase?: string;
  className?: string;
};

export function SparkleButton({
  context,
  onApplyField,
  apiBase = "/api/v1",
  className = "",
}: SparkleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState("");
  const [generatingAll, setGeneratingAll] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getFieldTypeLabel = (type: string): string => {
    switch (type) {
      case "textarea":
        return "Long Text";
      case "slug":
        return "URL Slug";
      case "url":
        return "URL Link";
      case "number":
        return "Number";
      case "boolean":
        return "Yes/No";
      case "select":
        return "Select";
      default:
        return "Text";
    }
  };

  const generateForField = async (field: FieldSchema) => {
    if (!context.entityName) return;
    
    setSelectedField(field.key);
    setIsGenerating(true);
    setGenerated("");

    try {
      const token = localStorage.getItem("auth_token") ?? "";

      // Build context-aware prompt based on field type
      let prompt = "";
      switch (field.type) {
        case "textarea":
        case "text":
          if (field.label.toLowerCase().includes("overview") || field.label.toLowerCase().includes("description")) {
            prompt = `Write a comprehensive ${field.label.toLowerCase()} for ${context.entityName}. 
Include: What it is, key capabilities, who uses it, and why an agency would implement it.
Be specific and practical. 150-250 words. Answer-first structure.`;
          } else if (field.label.toLowerCase().includes("content")) {
            prompt = `Write engaging content for the ${field.label} field of ${context.entityName}.
Focus on value proposition and practical benefits. 100-150 words.`;
          } else if (field.label.toLowerCase().includes("summary")) {
            prompt = `Write a concise ${field.label.toLowerCase()} for ${context.entityName}.
One paragraph, 50-100 words. Highlight key points.`;
          } else {
            prompt = `Generate ${field.label} content for ${context.entityName}.
Be specific, practical, and SEO-friendly. 50-100 words.`;
          }
          break;
        case "slug":
          prompt = `Generate a URL slug for ${context.entityName}. 
Rules: lowercase, hyphens only, no special characters, max 50 chars, descriptive.
Output only the slug, nothing else.`;
          break;
        case "url":
          prompt = `The ${context.entityName} is an entity. Suggest a placeholder URL for testing purposes.
Format: https://example.com (use a realistic domain).
Output only the URL.`;
          break;
        default:
          prompt = `Generate content for the ${field.label} field of ${context.entityName}.
Be concise and practical.`;
      }

      const response = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          entity_type: context.entityType,
          entity_id: 0,
          section_key: field.key,
          prompt_template: field.type === "textarea" || field.type === "text" ? "entity_overview" : "default",
          prompt,
          entity_name: context.entityName,
          context: field.label,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGenerated(result.content || "");
      } else {
        setGenerated("Failed to generate. Please check your AI configuration.");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      setGenerated("Failed to generate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGenerated = () => {
    if (selectedField && generated) {
      onApplyField(selectedField, generated);
      setGenerated("");
      setSelectedField(null);
    }
  };

  const generateAllFields = async () => {
    const textFields = context.fields.filter(f => f.type === "textarea" || f.type === "text");
    if (textFields.length === 0) return;

    setGeneratingAll(true);
    setProgress({ current: 0, total: textFields.length });

    for (let i = 0; i < textFields.length; i++) {
      setProgress({ current: i + 1, total: textFields.length });
      await generateForField(textFields[i]);
      if (generated) {
        onApplyField(textFields[i].key, generated);
        setGenerated("");
      }
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setGeneratingAll(false);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      {/* Sparkle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-xs px-md py-sm rounded-corner-md bg-gradient-to-r from-brand-primary/10 to-brand-tertiary/10 border border-brand-primary/30 hover:border-brand-primary hover:from-brand-primary/20 hover:to-brand-tertiary/20 text-brand-primary transition-all group"
        title="AI Content Assistant"
      >
        <Sparkles size={14} className="group-hover:animate-pulse" />
        <span className="text-label-sm font-medium">AI Assist</span>
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-sm w-[450px] bg-surface-bg border border-border-primary rounded-corner-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-lg py-md bg-gradient-to-r from-brand-primary/5 to-transparent border-b border-border-secondary">
            <div className="flex items-center gap-sm">
              <Sparkles size={16} className="text-brand-primary" />
              <span className="text-label text-text-primary font-semibold">AI Content Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-text-tertiary hover:text-text-secondary transition-colors p-xs rounded-corner-sm hover:bg-bg-faint"
            >
              <X size={16} />
            </button>
          </div>

          {/* Entity Context */}
          <div className="px-lg py-md bg-bg-faint border-b border-border-secondary">
            <p className="text-label-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{context.entityName || "No entity name"}</span>
              <span className="mx-sm text-text-tertiary">•</span>
              <span className="capitalize">{context.entityType}</span>
              <span className="mx-sm text-text-tertiary">•</span>
              <span>{context.fields.length} fields detected</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="px-lg py-md border-b border-border-secondary">
            <p className="text-label-sm text-text-tertiary mb-sm">Quick Actions</p>
            <div className="flex flex-wrap gap-sm">
              <button
                type="button"
                onClick={generateAllFields}
                disabled={generatingAll || !context.entityName}
                className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm bg-brand-primary text-white text-label-sm hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                {generatingAll ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Generating... {progress.current}/{progress.total}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>Fill All Text Fields</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Field List */}
          <div className="max-h-[300px] overflow-y-auto">
            <div className="px-lg py-md">
              <p className="text-label-sm text-text-tertiary mb-sm">Select a field to generate content:</p>
              <div className="space-y-xs">
                {context.fields.map((field) => (
                  <div
                    key={field.key}
                    className={`flex items-center justify-between p-sm rounded-corner-md border transition-colors ${
                      selectedField === field.key
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-border-secondary hover:border-brand-primary/50 hover:bg-bg-faint"
                    }`}
                  >
                    <div className="flex items-center gap-sm flex-1 min-w-0">
                      <span className="text-label-sm text-text-primary font-medium truncate">{field.label}</span>
                      <span className="text-video-title text-text-tertiary px-sm py-xs rounded-corner-sm bg-bg-subtle">
                        {getFieldTypeLabel(field.type)}
                      </span>
                      {field.value && String(field.value).length > 0 && (
                        <span className="text-video-title text-text-tertiary flex items-center gap-xs">
                          <Check size={10} className="text-success" />
                          Has content
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => generateForField(field)}
                      disabled={isGenerating || !context.entityName}
                      className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm bg-bg-subtle hover:bg-brand-primary hover:text-white text-text-secondary text-label-sm transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      {selectedField === field.key && isGenerating ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Sparkles size={11} />
                      )}
                      <span>Generate</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Content Preview */}
          {generated && (
            <div className="border-t border-border-secondary bg-bg-faint">
              <div className="px-lg py-md">
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-label-sm text-brand-primary font-medium">AI Suggestion</span>
                  <button
                    type="button"
                    onClick={() => { setGenerated(""); setSelectedField(null); }}
                    className="text-video-title text-text-tertiary hover:text-text-secondary"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="bg-surface-bg border border-border-secondary rounded-corner-md p-md max-h-[150px] overflow-y-auto">
                  <p className="text-label-sm text-text-primary whitespace-pre-wrap">{generated}</p>
                </div>
                <div className="flex items-center gap-sm mt-md">
                  <button
                    type="button"
                    onClick={applyGenerated}
                    className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm bg-brand-primary text-white text-label-sm hover:bg-brand-hover transition-colors"
                  >
                    <Check size={12} />
                    <span>Apply to Field</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedField) generateForField(context.fields.find(f => f.key === selectedField)!);
                    }}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm bg-bg-subtle text-text-secondary text-label-sm hover:text-text-primary transition-colors"
                  >
                    <RefreshCw size={11} />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to create field schema from form data
 */
export function useFieldSchema<T extends Record<string, unknown>>(
  fields: Array<{ key: keyof T; label: string; type: FieldSchema["type"] }>
): (data: T) => FieldSchema[] {
  return (data: T) =>
    fields.map((f) => ({
      key: f.key as string,
      label: f.label,
      type: f.type,
      value: data[f.key] as string | boolean | number,
    }));
}