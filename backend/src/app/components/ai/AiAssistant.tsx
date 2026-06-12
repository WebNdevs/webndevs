import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";

type AiMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type AiAssistantProps = {
  entityName?: string;
  entityType?: string;
  entityId?: number;
  context?: Record<string, string>;
  onApplyContent?: (content: string, targetField?: string) => void;
  apiBase?: string;
  className?: string;
};

const SYSTEM_PROMPT = `You are an AI writing assistant for a content management system. Your role is to help users fill in form fields by generating content based on their requests. 

Guidelines:
- Ask clarifying questions if the request is vague
- Generate specific, practical, SEO-friendly content
- Format content appropriately (paragraphs, lists, headings)
- Never hallucinate product features or statistics
- If user asks to fill a specific field, focus on that field
- If user wants to fill multiple fields, ask which ones

Available entity types: tool, industry, service, solution, blog, comparison, case_study
User may reference field names directly.`;

export function AiAssistant({
  entityName = "",
  entityType = "tool",
  entityId = 0,
  context = {},
  onApplyContent,
  apiBase = "/api/v1",
  className = "",
}: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI writing assistant. You can ask me to help with:\n• Writing content for specific fields (overview, description, etc.)\n• Generating multiple fields at once\n• Suggesting improvements to existing content\n• Creating content based on the ${entityName || "entity"} name\n\nWhat would you like help with?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: AiMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("auth_token") ?? "";

      // Build context for the AI
      const conversationHistory = messages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

      const prompt = `Current entity: ${entityName || "unknown"} (type: ${entityType})
Entity context: ${JSON.stringify(context)}

Conversation:
${conversationHistory}
User: ${userMessage.content}

Please respond as a helpful AI assistant. Keep responses focused and actionable.`;

      // Use the streaming endpoint for better UX
      const response = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          section_key: "assistant",
          prompt_template: "assistant",
          prompt,
          entity_name: entityName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const result = await response.json();
      const aiContent = result.content || "I'm sorry, I couldn't generate a response. Please try again.";

      const assistantMessage: AiMessage = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: AiMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-xs px-sm py-xs rounded-corner-sm border border-border-secondary bg-bg-subtle hover:bg-bg-faint text-text-secondary transition-colors text-label-sm"
        title="AI Assistant"
      >
        <Sparkles size={14} className="text-brand-primary" />
        <span>AI Help</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-sm w-[400px] h-[500px] bg-surface-bg border border-border-primary rounded-corner-lg shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-md py-sm border-b border-border-secondary bg-bg-subtle">
            <div className="flex items-center gap-sm">
              <Sparkles size={16} className="text-brand-primary" />
              <span className="text-label text-text-primary font-semibold">AI Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-md space-y-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-corner-md px-md py-sm text-label-sm ${
                    msg.role === "user"
                      ? "bg-brand-primary text-white"
                      : "bg-bg-faint border border-border-secondary text-text-primary"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === "assistant" && onApplyContent && (
                    <div className="mt-sm pt-sm border-t border-border-secondary">
                      <button
                        type="button"
                        onClick={() => onApplyContent(msg.content)}
                        className="text-brand-primary hover:text-brand-hover text-label-sm underline"
                      >
                        Use this content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bg-faint border border-border-secondary rounded-corner-md px-md py-sm">
                  <div className="flex items-center gap-xs text-text-secondary">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-label-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-md border-t border-border-secondary bg-bg-subtle">
            <div className="flex items-end gap-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to help with your content..."
                rows={2}
                className="flex-1 bg-bg-faint border border-border-secondary rounded-corner-sm px-sm py-xs text-label-sm text-text-primary resize-none focus:outline-none focus:border-brand-default"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="p-sm rounded-corner-sm bg-brand-primary text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-video-title text-text-tertiary mt-xs">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}