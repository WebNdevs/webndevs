// AI Settings utility for storing and retrieving AI API keys
// The keys are stored in localStorage and also fetched from backend settings

const STORAGE_KEY_ANTHROPIC = "wnd_anthropic_api_key";
const STORAGE_KEY_OPENAI = "wnd_openai_api_key";

export type AiProvider = "anthropic" | "openai";

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
}

/**
 * Get stored API key from localStorage
 */
export function getStoredAiKey(provider: AiProvider): string {
  const key = provider === "anthropic" ? STORAGE_KEY_ANTHROPIC : STORAGE_KEY_OPENAI;
  return localStorage.getItem(key) || "";
}

/**
 * Store API key in localStorage
 */
export function setStoredAiKey(provider: AiProvider, apiKey: string): void {
  const key = provider === "anthropic" ? STORAGE_KEY_ANTHROPIC : STORAGE_KEY_OPENAI;
  if (apiKey) {
    localStorage.setItem(key, apiKey);
  } else {
    localStorage.removeItem(key);
  }
}

/**
 * Clear all stored AI keys
 */
export function clearStoredAiKeys(): void {
  localStorage.removeItem(STORAGE_KEY_ANTHROPIC);
  localStorage.removeItem(STORAGE_KEY_OPENAI);
}

/**
 * Check if any AI API key is configured
 */
export function hasAiKeyConfigured(): boolean {
  return !!(getStoredAiKey("anthropic") || getStoredAiKey("openai"));
}

/**
 * Get the preferred AI key (anthropic first, then openai)
 */
export function getActiveAiKey(): { provider: AiProvider; apiKey: string } | null {
  const anthropicKey = getStoredAiKey("anthropic");
  if (anthropicKey) {
    return { provider: "anthropic", apiKey: anthropicKey };
  }
  const openaiKey = getStoredAiKey("openai");
  if (openaiKey) {
    return { provider: "openai", apiKey: openaiKey };
  }
  return null;
}

/**
 * Sync AI keys from backend settings
 * Call this on app load to get keys from backend
 */
export async function syncAiKeysFromBackend(): Promise<void> {
  try {
    const response = await fetch("/api/v1/settings/api-keys");
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const apiKeys = data.data;
        if (apiKeys.claude_api_key) {
          setStoredAiKey("anthropic", apiKeys.claude_api_key);
        }
        if (apiKeys.openai_api_key) {
          setStoredAiKey("openai", apiKeys.openai_api_key);
        }
      }
    }
  } catch {
    // Silently fail - keys might not be available yet
  }
}

/**
 * Generate content using AI (calls our backend proxy which uses the stored API key)
 * Falls back to mock generation if no API key is configured
 */
export async function generateContent(
  prompt: string,
  fieldContext?: string
): Promise<string> {
  const config = getActiveAiKey();

  if (!config) {
    // Return mock content if no API key configured
    return getMockContent(prompt, fieldContext);
  }

  try {
    // Call our backend AI proxy endpoint
    const response = await fetch("/api/v1/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: config.provider,
        prompt: prompt,
        context: fieldContext,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.content) {
        return data.data.content;
      }
    }

    // Fall back to mock if response is not as expected
    return getMockContent(prompt, fieldContext);
  } catch {
    // Return mock content on error
    return getMockContent(prompt, fieldContext);
  }
}

/**
 * Generate content directly using API key (for when backend proxy isn't available)
 */
export async function generateContentDirect(
  provider: AiProvider,
  apiKey: string,
  prompt: string,
  fieldContext?: string
): Promise<string> {
  if (provider === "anthropic") {
    return generateWithAnthropic(apiKey, prompt, fieldContext);
  } else {
    return generateWithOpenAI(apiKey, prompt, fieldContext);
  }
}

async function generateWithAnthropic(apiKey: string, prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: buildPrompt(prompt, context),
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.content?.[0]?.text || getMockContent(prompt, context);
    }
  } catch {
    // Fall through to mock
  }
  return getMockContent(prompt, context);
}

async function generateWithOpenAI(apiKey: string, prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates SEO-optimized content for a web development agency. Generate concise, professional content suitable for business websites.",
          },
          {
            role: "user",
            content: buildPrompt(prompt, context),
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || getMockContent(prompt, context);
    }
  } catch {
    // Fall through to mock
  }
  return getMockContent(prompt, context);
}

function buildPrompt(prompt: string, context?: string): string {
  let fullPrompt = prompt;
  if (context) {
    fullPrompt = `Context: ${context}\n\nTask: ${prompt}`;
  }
  return fullPrompt;
}

function getMockContent(prompt: string, context?: string): string {
  // Return contextual mock content based on the prompt
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("description")) {
    return "A comprehensive solution designed to help businesses streamline operations and achieve better results through modern automation and integration techniques.";
  }
  
  if (promptLower.includes("content")) {
    return "This solution provides powerful capabilities that enable organizations to transform their workflows. With advanced features and seamless integration, it helps drive efficiency and growth.";
  }
  
  if (promptLower.includes("challenge")) {
    return "Client faced challenges with manual processes, leading to inefficiency, errors, and delays in operations.";
  }
  
  if (promptLower.includes("solution")) {
    return "We implemented a custom automation solution using modern tools that streamlined workflows, reduced manual effort, and improved accuracy across all operations.";
  }
  
  if (promptLower.includes("result")) {
    return "After implementing the solution, client achieved significant improvements in efficiency and productivity, with measurable ROI within the first quarter.";
  }
  
  if (promptLower.includes("meta title") || promptLower.includes("seo title")) {
    return "Professional Integration Services | WebNDevs Agency";
  }
  
  if (promptLower.includes("meta description") || promptLower.includes("seo description")) {
    return "Expert integration, automation, and custom development services. Build better with our production-ready solutions.";
  }
  
  if (promptLower.includes("overview")) {
    return "This integration provides comprehensive capabilities for connecting and automating workflows between platforms. Designed for scalability and reliability.";
  }
  
  if (promptLower.includes("section")) {
    return "This section provides detailed information covering all essential aspects of the topic, helping visitors understand the value and benefits clearly.";
  }
  
  // Generic fallback
  return "Professional content generated for your website. This text can be customized to better match your specific requirements and brand voice.";
}