"use client";
import Link from "next/link";
import { DSBadge, DSCard } from "./DScomponents"
import { ICONS, FallbackIcon } from "../../data/icons";
import { motion } from "framer-motion";

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export type IconCardProps = {
  icon?: string;
  title?: string;
  description?: string;
  tags?: string[];
  url?: string;
}

export function IconCard({icon, title, description, url, tags}: IconCardProps) {
  const Icon =
  ICONS[icon as keyof typeof ICONS] ??
  FallbackIcon;
  const card = (
    <motion.div variants={cardVariants} className="h-full">
      <DSCard hoverable className="h-full bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5">
        <div className="flex items-start gap-4">
          { icon && (
            <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-[#22C55E]" />
            </div>
          )}
          <div>
            { title && (
              <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                {title}
              </h3>
            )}
            { description && (
              <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        { tags && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag, i) => (
                <DSBadge variant="success" key={i}>
                  {tag}
                </DSBadge>
              ))}
            </div>
          </div>
        )}
      </DSCard>
    </motion.div>
  );
  return url ? (
    <Link href={url} className="h-full block">
      {card}
    </Link>
  ) : (
    card
  );
}

export function IconCardGrid({items} : {items: IconCardProps[]}) {
  return(
    <motion.div 
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
    >
      {items.map((item, index) => (
        <IconCard key={index} {...item}/>
      ))}
    </motion.div>
  );
}