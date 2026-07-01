"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DSCard } from "./DScomponents";

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
            className="cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E]" 
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
                  <h3 style={{ fontSize: "18px" }} className="font-semibold text-[#F9FAFB] mb-2">
                    {item.question}
                  </h3>
                )}

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  {item.answer && (
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                      {item.answer}
                    </p>
                  )}
                </div>
              </div>

              <span className="shrink-0 text-[#22C55E]" aria-hidden="true">
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
              </span>
            </div>
          </DSCard>
        );
      })}
    </div>
  );
}