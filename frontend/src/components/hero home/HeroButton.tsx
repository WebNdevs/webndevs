import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { DSButton } from "@/components/cards/DScomponents";

type HeroButtonsProps = {
  primaryText: string;
  primaryHref?: string;

  secondaryText: string;
  secondaryHref?: string;
};

export default function HeroButtons({
  primaryText,
  primaryHref = "/contact",

  secondaryText,
  secondaryHref = "/services",
}: HeroButtonsProps) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-4 lg:justify-start">

      <DSButton
        asChild
        size="lg"
        className="group min-w-55"
      >
        <Link href={primaryHref}>
          {primaryText}

          <ArrowRight
            className="
              ml-2
              h-5
              w-5

              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          />
        </Link>
      </DSButton>

      <DSButton
        asChild
        variant="secondary"
        size="lg"
        className="group min-w-55"
      >
        <Link href={secondaryHref}>

          <Play
            className="
              mr-2
              h-5
              w-5

              fill-current

              transition-transform
              duration-300

              group-hover:scale-110
            "
          />

          {secondaryText}

        </Link>
      </DSButton>

    </div>
  );
}