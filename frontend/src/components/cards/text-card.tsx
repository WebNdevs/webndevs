"use client";

// -----------------
type TextProps = {
  children: React.ReactNode;
  target?: string;
};

export function Text({children, target = "get-started",}: TextProps) {
  return (
    <button
      onClick={() =>
        document
          .getElementById(target)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
      }
      className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors inline-flex items-center gap-2">
      {children}
    </button>
  );
}