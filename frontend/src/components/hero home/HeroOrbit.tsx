import type { ReactNode } from "react";

import HeroConnections from "./HeroConnections";
import HeroCenter from "./HeroCenter";
import HeroNode, { OrbitNode } from "./HeroNode";

type HeroOrbitProps = {
  centerNode?: ReactNode;
  logo?: string;
  nodes: OrbitNode[];
};

export default function HeroOrbit({
  centerNode,
  logo,
  nodes,
}: HeroOrbitProps) {
  return (
    <div
      aria-hidden
      className="
        relative

        mx-auto

        aspect-square

        w-[320px]

        sm:w-105

        lg:w-140

        xl:w-155
      "
    >
      {/* =====================================================
          BACK NETWORK
      ===================================================== */}

      <HeroConnections />

      {/* =====================================================
          AMBIENT GLOW
      ===================================================== */}

      <div
        className="
          absolute

          -inset-20

          rounded-full

          bg-[#22C55E]/5

          blur-[140px]
        "
      />

      {/* =====================================================
          OUTER GLOW
      ===================================================== */}

      <div
        className="
          absolute

          -inset-8

          rounded-full

          bg-linear-to-r

          from-[#22C55E]/5

          via-transparent

          to-[#06B6D4]/5

          blur-3xl

          animate-pulse-ring
        "
      />

      {/* =====================================================
          RING 1
      ===================================================== */}

      <div
        className="
          absolute

          inset-0

          rounded-full

          border

          border-dashed

          border-[#22C55E]/20

          animate-spin-slow
        "
      />

      {/* =====================================================
          RING 2
      ===================================================== */}

      <div
        className="
          absolute

          inset-8

          rounded-full

          border

          border-[#22C55E]/10
        "
      />

      {/* =====================================================
          RING 3
      ===================================================== */}

      <div
        className="
          absolute

          inset-16

          rounded-full

          border

          border-white/5

          animate-spin-slow-reverse
        "
      />

      {/* =====================================================
          RING 4
      ===================================================== */}

      <div
        className="
          absolute

          inset-24

          rounded-full

          border

          border-[#22C55E]/15

          animate-pulse-ring
        "
      />

      {/* =====================================================
          RING 5
      ===================================================== */}

      <div
        className="
          absolute

          inset-32

          rounded-full

          border

          border-white/5
        "
      />

      {/* =====================================================
          DECORATIVE MARKERS
      ===================================================== */}

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <div
          key={angle}
          className="
            absolute

            left-1/2
            top-1/2

            h-3
            w-3

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            border

            border-[#22C55E]/30

            bg-[#111827]

            shadow-[0_0_15px_rgba(34,197,94,.45)]
          "
          style={{
            transform: `
              translate(-50%,-50%)
              rotate(${angle}deg)
              translateY(-240px)
            `,
          }}
        >
          <div
            className="
              absolute

              left-1/2
              top-1/2

              h-1.5
              w-1.5

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-[#22C55E]
            "
          />
        </div>
      ))}

      {/* =====================================================
          ORBIT NODES
      ===================================================== */}

      {nodes.map((node) => (
        <HeroNode
          key={node.label}
          node={node}
        />
      ))}

      {/* =====================================================
          CENTER
      ===================================================== */}

      <HeroCenter logo={logo}>
        {centerNode}
      </HeroCenter>
    </div>
  );
}