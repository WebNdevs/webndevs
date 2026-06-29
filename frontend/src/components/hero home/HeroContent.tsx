import HeroButtons from "./HeroButton";
import HeroStats from "./HeroStats";

type HeroContentProps = {
  badge: string;

  headline1: string;
  headline2: string;

  body: string;

  primaryCta: string;
  secondaryCta: string;
};

const FEATURES = [
  "Web Development",
  "Mobile Apps",
  "AI Automation",
  "Cloud",
  "Analytics",
  "SEO",
];

export default function HeroContent({
  badge,
  headline1,
  headline2,
  body,
  primaryCta,
  secondaryCta,
}: HeroContentProps) {
  return (
    <div className="relative z-10 max-w-2xl">

      {/* =======================================================
          Badge
      ======================================================= */}

      <span
        className="
          inline-flex
          items-center
          gap-3

          rounded-full

          border
          border-[#22C55E]/20

          bg-[#22C55E]/10

          px-5
          py-2.5

          text-[11px]
          font-semibold
          uppercase
          tracking-[0.25em]

          text-[#22C55E]

          backdrop-blur

          animate-float-badge
        "
      >
        <span className="relative flex h-3 w-3">

          <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75 animate-ping" />

          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22C55E]" />

        </span>

        {badge}
      </span>

      {/* =======================================================
          Heading
      ======================================================= */}

      <h1
        className="
          mt-8

          text-5xl

          font-black

          leading-[0.9]

          tracking-tight

          text-white

          sm:text-6xl

          lg:text-[5.25rem]

          xl:text-[6rem]
        "
      >
        {headline1}

        <span
          className="
            mt-2

            block

            bg-linear-to-r

            from-[#22C55E]
            via-[#34D399]
            to-[#06B6D4]

            bg-clip-text

            text-transparent

            animate-gradient
          "
        >
          {headline2}
        </span>
      </h1>

      {/* =======================================================
          Description
      ======================================================= */}

      <p
        className="
          mt-8

          max-w-xl

          text-lg

          leading-8

          text-[#9CA3AF]
        "
      >
        {body}
      </p>

      {/* =======================================================
          Features
      ======================================================= */}

      <div className="mt-10 grid grid-cols-2 gap-4">

        {FEATURES.map((feature) => (
          <div
            key={feature}
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex

                h-7
                w-7

                items-center
                justify-center

                rounded-full

                bg-[#22C55E]/10

                text-[#22C55E]
              "
            >
              ✓
            </div>

            <span
              className="
                text-sm

                font-medium

                text-[#D1D5DB]
              "
            >
              {feature}
            </span>
          </div>
        ))}

      </div>

      {/* =======================================================
          Buttons
      ======================================================= */}

      <HeroButtons
        primaryText={primaryCta}
        secondaryText={secondaryCta}
      />

      {/* =======================================================
          Stats
      ======================================================= */}

      <HeroStats />

    </div>
  );
}