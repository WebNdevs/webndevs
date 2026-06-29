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
      {items.map((item, index) => (
        <DSCard key={index} hoverable className="cursor-pointer transition-all" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {item.question && (
                <h3 style={{ fontSize: "18px" }} className="font-semibold text-[#F9FAFB] mb-2">
                  {item.question}
                </h3>
              )}

              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                {item.answer && (
                  <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                    {item.answer}
                  </p>
                )}
              </div>
            </div>

            <button type="button" className="shrink-0 text-[#22C55E]">
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}/>
            </button>
          </div>
        </DSCard>
      ))}
    </div>
  );
}