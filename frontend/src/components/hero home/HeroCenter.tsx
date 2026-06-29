import Image from "next/image";
import type { ReactNode } from "react";

type HeroCenterProps = {
  logo?: string;
  children?: ReactNode;
};

export default function HeroCenter({
  logo,
  children,
}: HeroCenterProps) {
  return (
    <div
      className="
        absolute
        left-1/2
        top-1/2

        z-20

        -translate-x-1/2
        -translate-y-1/2
      "
    >
      {/* ==========================================
          OUTER GLOW
      ========================================== */}

      <div
        className="
          absolute
          -inset-11.25

          rounded-full

          bg-[#22C55E]/10

          blur-3xl

          animate-pulse-ring
        "
      />

      {/* ==========================================
          OUTER RING
      ========================================== */}

      <div
        className="
          absolute

          -inset-4.5

          rounded-full

          border

          border-[#22C55E]/10

          animate-spin-slow
        "
      />

      {/* ==========================================
          MIDDLE RING
      ========================================== */}

      <div
        className="
          absolute

          -inset-2.25

          rounded-full

          border

          border-dashed

          border-[#22C55E]/20

          animate-spin-slow-reverse
        "
      />

      {/* ==========================================
          CENTER CORE
      ========================================== */}

      <div
        className="
          relative

          flex

          h-36
          w-36

          items-center
          justify-center

          rounded-full

          border
          border-[#22C55E]/20

          bg-[#111827]/90

          backdrop-blur-2xl

          shadow-[0_0_80px_rgba(34,197,94,.22)]

          animate-center-glow

          overflow-hidden
        "
      >
        {/* Gradient */}

        <div
          className="
            absolute

            inset-0

            rounded-full

            bg-linear-to-br

            from-[#22C55E]/10

            via-transparent

            to-[#06B6D4]/15
          "
        />

        {/* Inner Ring */}

        <div
          className="
            absolute

            inset-3

            rounded-full

            border

            border-white/5
          "
        />

        {/* Logo */}

        <div className="relative z-10">

          {children ? (
            children
          ) : logo ? (
            <Image
              src={logo}
              alt="WebNDevs"
              width={72}
              height={72}
              className="object-contain"
            />
          ) : (
            <span
              className="
                bg-linear-to-r

                from-[#22C55E]

                via-[#34D399]

                to-[#06B6D4]

                bg-clip-text

                text-5xl

                font-black

                text-transparent
              "
            >
              W
            </span>
          )}

        </div>

        {/* Core Dot */}

        <div
          className="
            absolute

            h-2
            w-2

            rounded-full

            bg-[#22C55E]

            shadow-[0_0_15px_rgba(34,197,94,.8)]
          "
        />
      </div>
    </div>
  );
}