import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Sparkles, Copy, Check, X } from "lucide-react";
import { AiStreamDisplay } from "./AiStreamDisplay";
import { AiGenerateButton } from "./AiGenerateButton";

type SectionOption = {
  key: string;
  label: string;
  template: string;
};

type AiGenerationPanelProps = {
  entityType: string;
  entityId: number;
  entityName: string;
  sections?: SectionOption[];
  onAccept?: (sectionKey: string, content: string) => void;
  apiBase?: string;
};

const DEFAULT_SECTIONS: SectionOption[] = [
  { key: "overview",       label: "Overview",        template: "entity_overview" },
  { key: "use_cases",      label: "Use Cases",       template: "use_cases" },
  { key: "faq",            label: "FAQ",             template: "faq" },
  { key: "process_steps",  label: "Process Steps",   template: "process_steps" },
  { key: "seo_meta",       label: "SEO Meta",        template: "seo_meta" },
];

/**
 * P4-AI-27 — Collapsible AI generation panel for entity edit pages.
 * Supports section selection, live SSE streaming display, and accept/discard.
 */
export function AiGenerationPanel({
  entityType,
  entityId,
  entityName,
  sections = DEFAULT_SECTIONS,
  onAccept,
  apiBase = "/api/v1",
}: AiGenerationPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(sections[0]?.key ?? "");
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const selectedDef = sections.find((s) => s.key === selectedSection);

  const handleGenerate = async () => {
    if (!selectedDef) return;
    setContent("");
    setIsStreaming(true);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const body = JSON.stringify({
      entity_type:     entityType,
      entity_id:       entityId,
      section_key:     selectedDef.key,
      prompt_template: selectedDef.template,
      entity_name:     entityName,
    });

    const token = localStorage.getItem("auth_token") ?? "";

    return new Promise<void>((resolve, reject) => {
      fetch(`${apiBase}/ai/generate-stream`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept":        "text/event-stream",
        },
        body,
      })
        .then(async (response) => {
          if (!response.ok || !response.body) {
            setIsStreaming(false);
            reject(new Error("Stream failed"));
            return;
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          const read = async (): Promise<void> => {
            const { done, value } = await reader.read();
            if (done) {
              setIsStreaming(false);
              resolve();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;
              try {
                const json = JSON.parse(trimmed.slice(6));
                if (json.type === "content_block_delta" && json.delta?.text) {
                  setContent((prev) => prev + json.delta.text);
                }
                if (json.type === "message_stop") {
                  setIsStreaming(false);
                  resolve();
                  return;
                }
              } catch {
                // partial line, wait for more
              }
            }
            await read();
          };

          try {
            await read();
          } catch (err) {
            setIsStreaming(false);
            reject(err instanceof Error ? err : new Error("Stream read error"));
          }
        })
        .catch((err) => {
          setIsStreaming(false);
          reject(err);
        });
    });
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    if (onAccept && content) {
      onAccept(selectedSection, content);
    }
    setContent("");
  };

  const handleDiscard = () => {
    if (eventSourceRef.current) eventSourceRef.current.close();
    setContent("");
    setIsStreaming(false);
  };

  return (
    <div className="border border-border-secondary rounded-corner-md overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-lg py-md bg-bg-subtle hover:bg-bg-faint transition-colors"
      >
        <div className="flex items-center gap-sm text-label font-medium text-text-primary">
          <Sparkles size={16} className="text-brand-default" />
          AI Content Generation
        </div>
        {open ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="p-lg bg-surface-bg space-y-md">
          {/* Section selector */}
          <div className="flex items-center gap-sm flex-wrap">
            <span className="text-label-sm text-text-secondary shrink-0">Generate:</span>
            <div className="flex gap-xs flex-wrap">
              {sections.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => { setSelectedSection(s.key); setContent(""); }}
                  className={[
                    "px-sm py-xs rounded-corner-sm text-label-sm border transition-colors",
                    selectedSection === s.key
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-bg-subtle text-text-secondary border-border-secondary hover:border-brand-default hover:text-brand-default",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <AiGenerateButton onGenerate={handleGenerate} size="sm" disabled={isStreaming} />
            </div>
          </div>

          {/* Stream display */}
          {(content || isStreaming) && (
            <div className="space-y-sm">
              <AiStreamDisplay
                content={content}
                isStreaming={isStreaming}
                placeholder=""
              />
              {/* Action row */}
              {!isStreaming && content && (
                <div className="flex items-center gap-xs justify-end">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm text-label-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm text-label-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors"
                  >
                    <X size={13} />
                    Discard
                  </button>
                  {onAccept && (
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="inline-flex items-center gap-xs px-sm py-xs rounded-corner-sm text-label-sm border border-brand-primary bg-brand-primary text-white hover:bg-brand-hover transition-colors"
                    >
                      <Check size={13} />
                      Accept
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
