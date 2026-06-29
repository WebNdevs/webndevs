export default function HeroBackground() {
  return (
    <>
      {/* ==========================================================
          Base Background
      ========================================================== */}

      <div className="absolute inset-0 bg-[#0B0F14]" />

      {/* ==========================================================
          Blueprint Grid
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-grid

          absolute
          inset-0

          opacity-[0.07]
        "
      />

      {/* ==========================================================
          Dot Pattern
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-dots

          absolute
          inset-0

          opacity-[0.08]
        "
      />

      {/* ==========================================================
          Aurora Layer
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-aurora

          animate-aurora

          absolute

          inset-0

          opacity-80
        "
      />

      {/* ==========================================================
          Main Right Glow
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-glow

          absolute

          -right-48

          top-1/2

          h-168

          w-2xl

          -translate-y-1/2

          rounded-full

          blur-[170px]

          animate-pulse-ring
        "
      />

      {/* ==========================================================
          Left Accent Glow
      ========================================================== */}

      <div
        aria-hidden
        className="
          absolute

          -left-48

          -bottom-40

          h-112

          w-md

          rounded-full

          blur-[140px]

          bg-[#22C55E]/10
        "
      />

      {/* ==========================================================
          Cyan Accent
      ========================================================== */}

      <div
        aria-hidden
        className="
          absolute

          -right-32

          -top-24

          h-96

          w-[24rem]

          rounded-full

          blur-[140px]

          bg-cyan-400/10
        "
      />

      {/* ==========================================================
          Floating Particles
      ========================================================== */}

      {[
        {
          top: "18%",
          left: "22%",
          delay: "0s",
        },
        {
          top: "72%",
          left: "12%",
          delay: "1.2s",
        },
        {
          top: "14%",
          right: "18%",
          delay: ".8s",
        },
        {
          bottom: "18%",
          right: "10%",
          delay: "1.8s",
        },
        {
          top: "46%",
          left: "58%",
          delay: ".5s",
        },
      ].map((particle, index) => (
        <span
          key={index}
          className="
            absolute

            h-1.5
            w-1.5

            rounded-full

            bg-[#22C55E]/70

            shadow-[0_0_12px_rgba(34,197,94,.6)]

            animate-float
          "
          style={{
            ...particle,
            animationDelay: particle.delay,
          }}
        />
      ))}

      {/* ==========================================================
          Decorative Lines
      ========================================================== */}

      <div
        aria-hidden
        className="
          absolute

          left-0

          top-0

          h-px

          w-full

          bg-linear-to-r

          from-transparent

          via-[#22C55E]/15

          to-transparent
        "
      />

      <div
        aria-hidden
        className="
          absolute

          bottom-0

          left-0

          h-px

          w-full

          bg-linear-to-r

          from-transparent

          via-white/10

          to-transparent
        "
      />

      {/* ==========================================================
          Vignette
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-vignette

          absolute

          inset-0
        "
      />

      {/* ==========================================================
          Noise
      ========================================================== */}

      <div
        aria-hidden
        className="
          hero-noise

          absolute

          inset-0
        "
      />
    </>
  );
}