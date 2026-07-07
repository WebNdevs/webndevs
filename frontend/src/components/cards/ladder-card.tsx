"use client";
import { DSCard } from "./DScomponents";
import { ICONS } from "../../data/icons";
import { motion } from "framer-motion";

export type LadderCardProps = {
  icon?: string;
  title?: string;
  number?: string;
  description?: string;
  text?: string;
  align?: 'left' | 'right';
}

export function LadderCard({icon, title, number, description, text, align} : LadderCardProps) {
  const Icon = ICONS[icon as keyof typeof ICONS];
  const isLeft = align === 'left';
  
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
    >
      <DSCard hoverable className="bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5">
        <div className={`flex items-start gap-4 ${isLeft ? "lg:flex-row-reverse" : "" }`}>
          {icon && (
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-[#22C55E]" />
            </div>
          )}
          <div className={`flex-1 text-left ${isLeft ? "lg:text-right" : "" }`}>
            <div className={`flex items-center gap-3 mb-3 justify-start ${isLeft ? "lg:justify-end" : "" }`}>
              {isLeft ? (
                <>
                  <h3 style={{ fontSize: '24px' }} className="hidden lg:block font-bold text-[#F9FAFB]">
                    {title}
                  </h3>
                  <span className="hidden lg:block text-[32px] font-bold text-[#22C55E]/70">
                    {number}
                  </span>
                  
                  <span className="lg:hidden text-[32px] font-bold text-[#22C55E]/70">
                    {number}
                  </span>
                  <h3 style={{ fontSize: '24px' }} className="lg:hidden font-bold text-[#F9FAFB]">
                    {title}
                  </h3>
                </>
              ) : (
                <>
                  <span className="text-[32px] font-bold text-[#22C55E]/70">
                    {number}
                  </span>
                  <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                    {title}
                  </h3>
                </>
              )}
            </div>
            <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
              {description}
            </p>
            <p className="text-[12px] text-[#22C55E] font-medium">
              {text}
            </p>
          </div>
        </div>
      </DSCard>
    </motion.div>
  );

  return(
    <>
      {/* Mobile view */}
      <div className="block lg:hidden w-full pl-8 md:pl-12 relative">
        {card}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
        {isLeft ? (
          <>
            <div>
              {card}
            </div>
            <div />
          </>
        ) : (
          <>
            <div />
            <div>
              {card}
            </div>
          </>
        )}
      </div>
    </>
  )
}


export function LadderSection({items} : {items: LadderCardProps[]}) {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <motion.div 
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ originY: 0 }}
        className="absolute left-4 md:left-6 lg:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-linear-to-b from-[#22C55E] to-[#06B6D4]" 
      />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Center Dot */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="absolute left-4 md:left-6 lg:left-1/2 top-10 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" 
            />

            <LadderCard
              {...item}
              align={index % 2 === 0 ? "left" : "right"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

