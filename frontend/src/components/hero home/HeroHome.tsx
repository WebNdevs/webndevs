import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroOrbit from "./HeroOrbit";
import type { OrbitNode } from "./HeroNode";

export type HomeHeroProps = {
  badge?: string;

  headline1?: string;
  headline2?: string;

  body?: string;

  primaryCta?: string;
  secondaryCta?: string;

  orbitIcons: OrbitNode[];

  logo?: string;

  centerNode?: React.ReactNode;
};

export default function HomeHero({
  badge = "YOUR COMPLETE DIGITAL PARTNER",

  headline1 = "Everything Your",

  headline2 = "Business Needs.",

  body = "From websites and mobile apps to AI automation, cloud infrastructure, analytics and digital growth—we build complete digital ecosystems that help businesses scale faster.",

  primaryCta = "Start Your Project",

  secondaryCta = "Explore Services",

  orbitIcons,

  logo,

  centerNode,
}: HomeHeroProps) {
  return (
    <section
      className="
        relative

        isolate

        overflow-hidden

        bg-[#0B0F14]
      "
    >
      {/* ============================================
          Background
      ============================================ */}

      <HeroBackground />

      {/* ============================================
          Main Layout
      ============================================ */}

      <div
        className="
          relative

          z-10

          mx-auto

          grid

          min-h-[92vh]

          max-w-350

          grid-cols-1

          items-center

          gap-20

          px-6

          py-24

          sm:px-8

          lg:grid-cols-[1.02fr_.98fr]

          lg:gap-12

          lg:px-12

          lg:py-0

          xl:px-16
        "
      >
        {/* ============================================
            Left
        ============================================ */}

        <HeroContent
          badge={badge}
          headline1={headline1}
          headline2={headline2}
          body={body}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />

        {/* ============================================
            Right
        ============================================ */}

        <HeroOrbit
          logo={logo}
          centerNode={centerNode}
          nodes={orbitIcons}
        />
      </div>

      {/* ============================================
          Bottom Divider
      ============================================ */}

      <div
        className="
          absolute

          bottom-0

          left-0

          h-px

          w-full

          bg-linear-to-r

          from-transparent

          via-[#22C55E]/20

          to-transparent
        "
      />
    </section>
  );
}