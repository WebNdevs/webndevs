import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// @figma/astraui SelectField attaches a document-level keydown listener that
// calls preventDefault() and opens the dropdown on ANY Space/Enter press —
// even when the user is typing in an <input> or <textarea>. Patch
// document.addEventListener before React mounts so every keydown listener
// registered on document (SelectField, Modal Escape handler, etc.) gets a
// wrapper that skips the call when Space is pressed inside a text field.
const _origDocOn = document.addEventListener.bind(document);
(document as unknown as { addEventListener: typeof document.addEventListener }).addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  if (type === "keydown" && typeof listener === "function") {
    const guarded: EventListener = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === " " || ke.key === "Enter") {
        const target = ke.target as HTMLElement | null;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target?.isContentEditable
        ) {
          return;
        }
      }
      (listener as EventListener)(e);
    };
    return _origDocOn(type, guarded, options);
  }
  return _origDocOn(type, listener as EventListener, options);
};

createRoot(document.getElementById("root")!).render(<App />);
  