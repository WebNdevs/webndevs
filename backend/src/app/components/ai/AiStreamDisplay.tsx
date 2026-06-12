import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

type AiStreamDisplayProps = {
  content: string;
  isStreaming: boolean;
  placeholder?: string;
};

/**
 * P4-AI-28 — Real-time streaming token display.
 * Auto-scrolls as content arrives. Shows animated cursor while streaming.
 */
export function AiStreamDisplay({ content, isStreaming, placeholder = "AI content will appear here..." }: AiStreamDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="bg-bg-faint border border-border-secondary rounded-corner-md p-lg min-h-[120px] max-h-[400px] overflow-y-auto font-mono text-label-sm text-text-primary relative"
    >
      {!content && !isStreaming && (
        <span className="text-text-tertiary">{placeholder}</span>
      )}
      {content && (
        <pre className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-brand-primary ml-px animate-pulse align-middle" />
          )}
        </pre>
      )}
      {isStreaming && !content && (
        <div className="flex items-center gap-sm text-text-secondary">
          <div className="w-3 h-3 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <span>Generating...</span>
        </div>
      )}
    </div>
  );
}
