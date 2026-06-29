import Image from "next/image";
import type { ReactNode } from "react";

export type OrbitNode = {
  label: string;
  icon?: ReactNode;
  imageUrl?: string;

  angle: number;

  radius?: number;

  speed?: string;
};

type HeroNodeProps = {
  node: OrbitNode;
};

export default function HeroNode({
  node,
}: HeroNodeProps) {
  return (
    <div
      className="
        absolute

        left-1/2
        top-1/2

        -translate-x-1/2
        -translate-y-1/2

        animate-orbit

        will-change-transform
      "
      style={
        {
          "--orbit-start": `${node.angle}deg`,
          "--orbit-radius": `${node.radius ?? 240}px`,
          "--orbit-speed": node.speed ?? "22s",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col items-center">

        {/* =====================================================
            Bubble
        ===================================================== */}

        <div
          title={node.label}
          className="
            group

            relative

            flex

            h-14
            w-14

            items-center
            justify-center

            rounded-2xl

            border
            border-[#22C55E]/20

            bg-[#111827]/80

            backdrop-blur-xl

            shadow-[0_15px_35px_rgba(0,0,0,.35)]

            transition-all
            duration-500

            hover:scale-110

            hover:border-[#22C55E]/40

            hover:shadow-[0_0_40px_rgba(34,197,94,.30)]

            overflow-hidden
          "
        >

          {/* Gradient */}

          <div
            className="
              absolute

              inset-0

              rounded-2xl

              bg-linear-to-br

              from-[#22C55E]/10

              via-transparent

              to-[#06B6D4]/10
            "
          />

          {/* Inner Border */}

          <div
            className="
              absolute

              inset-px

              rounded-[14px]

              border

              border-white/5
            "
          />

          {/* Icon */}

          {node.imageUrl ? (
            <Image
              src={node.imageUrl}
              alt={node.label}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="
                relative

                text-[#22C55E]

                [&>svg]:h-7
                [&>svg]:w-7
              "
            >
              {node.icon}
            </div>
          )}

          {/* Hover Glow */}

          <div
            className="
              absolute

              inset-0

              rounded-2xl

              opacity-0

              transition-opacity
              duration-500

              group-hover:opacity-100

              bg-radial

              from-[#22C55E]/20

              to-transparent
            "
          />

        </div>

        {/* =====================================================
            Label
        ===================================================== */}

        <span
          className="
            mt-3

            whitespace-nowrap

            text-[11px]

            font-semibold

            uppercase

            tracking-[0.18em]

            text-[#D1D5DB]
          "
        >
          {node.label}
        </span>

      </div>
    </div>
  );
}