import type { CSSProperties } from "react";
import { ScrollReveal } from "../animations/scroll-reveal";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PageHeroProps = {
  tag?: string;
  variant?: 'preview' | 'full';
  title1: string;
  title2: string;
  description: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const G   = "#22C55E";          // primary green
const BG  = "#0B0F14";          // dark background

// Pre-computed scatter dots — avoids SSR / hydration mismatch
const ARC_DOTS = Array.from({ length: 36 }, (_, i) => ({
  cx: 80 + i * 37 + ((i * 11) % 20),
  cy: 170 + ((i * 23 + 9) % 68),
}));

// ─────────────────────────────────────────────────────────────────────────────
export function PageHero({ tag, title1, title2, description, variant = 'full'}: PageHeroProps) {
  if(variant === 'preview') return null;

  return (
    <div
      className="relative w-full bg-transparent overflow-hidden border-b border-white/[0.07] mb-10"
    >

      {/* ══════════════════ BACKGROUND LAYER ══════════════════ */}

      {/* Subtle grid — full bleed */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(to right,  #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Primary radial glow — top right */}
      <div
        className="pointer-events-none absolute -top-40 -right-20 h-140 w-140 rounded-full blur-[130px]"
        style={{ backgroundColor: `${G}18` }}
      />

      {/* Secondary radial glow — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-[90px]"
        style={{ backgroundColor: `${G}0D` }}
      />

      {/* Left edge accent line */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-px"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${G}66 35%, ${G}44 70%, transparent 100%)`,
        }}
      />

      {/* Right edge accent line */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-px"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${G}44 40%, ${G}33 70%, transparent 100%)`,
        }}
      />

      {/* Top edge accent line */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-full h-px"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${G}33 30%, ${G}22 70%, transparent 100%)`,
        }}
      />

      {/* ── Top-right corner: diagonal ray + glowing node ────────────── */}
      <svg
        className="pointer-events-none absolute top-0 right-0 hidden sm:block"
        width="440" height="200" viewBox="0 0 440 200" fill="none" aria-hidden="true"
      >
        <defs>
          <filter id="ph-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <line x1="438" y1="2" x2="180" y2="130" stroke={G} strokeWidth="0.8" strokeOpacity="0.45" />
        <circle cx="438" cy="2" r="10" fill="none" stroke={G} strokeWidth="0.8" strokeOpacity="0.2" />
        <circle cx="438" cy="2" r="4.5" fill={G} filter="url(#ph-node-glow)" />
      </svg>

      {/* ── Corner bracket — top left ─────────────────────────────────── */}
      <CornerBracket pos="tl" className="hidden sm:block" />

      {/* ── Corner bracket — top right ────────────────────────────────── */}
      <CornerBracket pos="tr" className="hidden sm:block" />

      {/* ── Corner bracket — bottom left ──────────────────────────────── */}
      <CornerBracket pos="bl" className="hidden lg:block" />

      {/* ── Dot grid — top centre ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 hidden md:block">
        <DotGrid cols={12} rows={2} />
      </div>

      {/* ── Dot grid — bottom left ────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-24 left-8 opacity-[0.22] hidden sm:block">
        <DotGrid cols={6} rows={5} />
      </div>

      {/* ── Dot grid — top right ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-6 right-8 opacity-[0.18] hidden md:block">
        <DotGrid cols={8} rows={3} />
      </div>

      {/* ── Chevron row — upper-left ──────────────────────────────────── */}
      <div className="pointer-events-none absolute top-37 left-[13%] opacity-40 hidden lg:block">
        <ChevronRow count={6} />
      </div>

      {/* ── Chevron row — lower-right ─────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-28 right-[10%] opacity-40 hidden lg:block">
        <ChevronRow count={6} />
      </div>

      {/* ── Horizontal scan line ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-px hidden md:block"
        style={{ top: "62%", background: `linear-gradient(to right, transparent, ${G}18 30%, ${G}14 70%, transparent)` }}
      />

      {/* ── Plus marks ────────────────────────────────────────────────── */}
      <PlusMark style={{ top: "20%",  left:  "7%" }}  hide="sm" />
      <PlusMark style={{ top: "12%",  left:  "50%" }} hide="md" />
      <PlusMark style={{ top: "48%",  right: "6%" }}  hide="sm" />
      <PlusMark style={{ bottom:"32%",left:  "40%" }} hide="md" />
      <PlusMark style={{ top: "32%",  right: "26%" }} hide="lg" />
      <PlusMark style={{ bottom:"20%",right: "48%" }} hide="lg" />

      {/* ── Circle outlines ───────────────────────────────────────────── */}
      <FloatCircle style={{ top: "26%",  right: "22%" }} size={30}  hide="sm" />
      <FloatCircle style={{ bottom:"28%",left:  "7%" }}  size={22}  hide="md" />
      <FloatCircle style={{ top: "55%",  right: "40%" }} size={38}  hide="lg" color={`${G}18`} />
      <FloatCircle style={{ top: "18%",  left:  "30%" }} size={16}  hide="lg" />


      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      {/*
        Full-bleed: no max-w-* — padding controls the inset.
        Mobile  : px-5   | 1-column stacked
        sm      : px-10  |
        lg      : px-16  | 2-column side-by-side
        xl      : px-24  |
      */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-16 xl:px-24 pt-20 sm:pt-24 lg:pt-32 pb-32 sm:pb-36 lg:pb-48">
        {/* Tag badge */}
        {tag && (
          <div className="mb-8 sm:mb-10">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.75 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em]"
              style={{ borderColor: `${G}40`, backgroundColor: `${G}08`, color: G }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: G }}
              />
              {tag}
            </span>
          </div>
        )}

        {/*
          Two-column layout
          ─────────────────────────────────────────────────────
          [h1: grows, baseline-anchored]  [p: fixed-width right]
          ─────────────────────────────────────────────────────
          On mobile they stack naturally in source order.
        */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-8 mb-5">
          {/* LEFT — display heading */}
          <ScrollReveal direction="right" duration={0.8} className="lg:flex-1">
            <h1
              className="font-bold leading-[0.87] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 4vw, 6rem)" }}
            >
              <span className="block text-white">{title1}</span>
              <span
                className="block italic bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${G}, #06B6D4)`,
                }}
              >
                {title2}
              </span>
            </h1>
          </ScrollReveal>

          {/* RIGHT — description, baseline-aligned on desktop */}
          <ScrollReveal direction="left" duration={0.8} delay={0.15} className="lg:w-75 xl:w-85 2xl:w-95 lg:shrink-0 lg:pb-3">
            <p
              className="text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-[#9CA3AF] max-w-130 lg:max-w-none"
            >
              {description}
            </p>
          </ScrollReveal>
        </div>
      </div>


      {/* ══════════════════ BOTTOM ARC ══════════════════ */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0">
        <BottomArc />
      </div>

    </div>
  );
}


// ─── Sub-components ───────────────────────────────────────────────────────────

/** L-shaped corner bracket */
function CornerBracket({
  pos,
  className = "",
}: {
  pos: "tl" | "tr" | "bl" | "br";
  className?: string;
}) {
  const size   = 20;
  const stroke = G;
  const sw     = 1.5;
  const inset  = 20; // px from corner

  const posMap: Record<typeof pos, CSSProperties> = {
    tl: { top: inset, left: inset },
    tr: { top: inset, right: inset },
    bl: { bottom: inset, left: inset },
    br: { bottom: inset, right: inset },
  };

  // Which direction each arm of the L points
  const d: Record<typeof pos, string> = {
    tl: `M ${size} 0 L 0 0 L 0 ${size}`,
    tr: `M 0 0 L ${size} 0 L ${size} ${size}`,
    bl: `M ${size} ${size} L 0 ${size} L 0 0`,
    br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
  };

  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      style={posMap[pos]}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      <path d={d[pos]} stroke={stroke} strokeWidth={sw} strokeOpacity="0.45" strokeLinecap="square" />
    </svg>
  );
}

/** Dot matrix grid */
function DotGrid({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 3px)` }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="w-0.75 h-0.75 rounded-full bg-white/25" />
      ))}
    </div>
  );
}

/** Chevron arrows › › › */
function ChevronRow({ count }: { count: number }) {
  const W = 11, GAP = 5, H = 10;
  const totalW = count * W + (count - 1) * GAP;
  return (
    <svg width={totalW} height={H} viewBox={`0 0 ${totalW} ${H}`} fill="none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const x = i * (W + GAP);
        return (
          <polyline
            key={i}
            points={`${x},0 ${x + W * 0.65},${H / 2} ${x},${H}`}
            stroke="white"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

/** + crosshair mark */
function PlusMark({
  style,
  hide,
}: {
  style: CSSProperties;
  hide?: "sm" | "md" | "lg";
}) {
  const hideCls = hide === "sm" ? "hidden sm:block"
                : hide === "md" ? "hidden md:block"
                : hide === "lg" ? "hidden lg:block"
                : "";
  return (
    <svg
      className={`pointer-events-none absolute ${hideCls}`}
      style={{ ...style, opacity: 0.2 }}
      width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden="true"
    >
      <line x1="7" y1="0" x2="7" y2="14" stroke="white" strokeWidth="1.2" />
      <line x1="0" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

/** Floating circle outline */
function FloatCircle({
  style,
  size,
  hide,
  color = "rgba(255,255,255,0.08)",
}: {
  style: CSSProperties;
  size: number;
  hide?: "sm" | "md" | "lg";
  color?: string;
}) {
  const hideCls = hide === "sm" ? "hidden sm:block"
                : hide === "md" ? "hidden md:block"
                : hide === "lg" ? "hidden lg:block"
                : "";
  return (
    <div
      className={`pointer-events-none absolute rounded-full border ${hideCls}`}
      style={{ ...style, width: size, height: size, borderColor: color }}
    />
  );
}

/** Layered glowing arc — full viewport width */
function BottomArc() {
  return (
    <svg
      width="100%"
      viewBox="0 0 1440 300"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="ph-arc-glow" x="-4%" y="-60%" width="108%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ph-apex-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Wide ambient halo */}
      <path d="M -80 300 Q 720 -160 1520 300"
        stroke={G} strokeWidth="80" strokeOpacity="0.025" />

      {/* Outer faint arc */}
      <path d="M 0 300 Q 720 -90 1440 300"
        stroke={G} strokeWidth="1" strokeOpacity="0.18" />

      {/* Main glowing arc */}
      <path d="M 60 300 Q 720 10 1380 300"
        stroke={G} strokeWidth="1.5" strokeOpacity="0.9"
        filter="url(#ph-arc-glow)" />

      {/* Inner dotted arc */}
      <path d="M 200 300 Q 720 100 1240 300"
        stroke="white" strokeWidth="0.8" strokeOpacity="0.1"
        strokeDasharray="4 12" />

      {/* Innermost tighter dotted arc */}
      <path d="M 360 300 Q 720 165 1080 300"
        stroke="white" strokeWidth="0.6" strokeOpacity="0.06"
        strokeDasharray="3 16" />

      {/* Dot scatter field */}
      {ARC_DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="1" fill="white" opacity="0.06" />
      ))}

      {/* Apex node: outer ring + inner glow core */}
      <circle cx="720" cy="42" r="13"
        fill={BG} stroke={G} strokeWidth="1.5"
        filter="url(#ph-apex-glow)" />
      <circle cx="720" cy="42" r="4.5" fill={G} filter="url(#ph-apex-glow)" />
    </svg>
  );
}