"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DSCard } from "./DScomponents";
import { motion, AnimatePresence } from "framer-motion";

export type FAQItemProps = {
  question?: string;
  answer?: string;
};

export type FAQCardProps = {
  items?: FAQItemProps[];
};

export function FAQCard({items = []} : FAQCardProps) {
  const [openIndex, setOpenIndex] =
  useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <DSCard 
            key={index} 
            hoverable 
            className="cursor-pointer bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E]" 
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onClick={() => setOpenIndex(isOpen ? null : index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpenIndex(isOpen ? null : index);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {item.question && (
                  <h3 style={{ fontSize: "18px" }} className="font-semibold text-[#F9FAFB] mb-1">
                    {item.question}
                  </h3>
                )}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {item.answer && (
                        <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                          {item.answer}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="shrink-0 text-[#22C55E] pt-0.5" aria-hidden="true">
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
              </span>
            </div>
          </DSCard>
        );
      })}
    </div>
  );
}