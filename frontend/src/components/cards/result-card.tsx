"use client";
import { DSCard, DSBadge } from "./DScomponents";
import { ExternalLink, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
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

export type ResultCardProps = {
  title?: string;
  category?: string;
  description?: string;
  tags?: string[];
  badge?: string;
  url?: string;
  results?: string[];
}

export function ResultCard({title, category, description, tags, badge, url, results} : ResultCardProps) {
  return(
    <motion.div variants={cardVariants} className="h-full">
      <DSCard hoverable className="flex flex-col h-full bg-transparent bg-linear-to-r from-[#22C55E]/5 to-[#06B6D4]/5">
        <div className="flex items-center justify-between mb-4">
          { badge && (
            <DSBadge variant={(badge as "default") || "default"}>

              {category}
            </DSBadge>
          )}
          { url && (
            <a className="text-[#9CA3AF] hover:text-[#22C55E] transition-colors" href={url} target='_blank' rel='noopener noreferrer' aria-label={`Open ${title || 'project site'} in a new tab`} >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        { title && (
          <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB] mb-3">
            {title}
          </h3>
        )}

        { description && (
          <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Results */}
        { results && (
          <div className="bg-transparent border border-[#22C55E]/30 rounded-lg p-4 mb-4 grow">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[12px] font-semibold text-[#22C55E] uppercase tracking-wider">
                Results
              </span>
            </div>
            <ul className="space-y-2">
              {results.map((result, i) => (
                <li key={i} className="text-[13px] text-[#9CA3AF] flex items-start gap-2">
                  <span className="text-[#22C55E] shrink-0">✓</span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        { tags && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-1 border border-[#22C55E]/30 text-[#9CA3AF] text-[11px] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </DSCard>
    </motion.div>
  );
}

export function ResultCardGrid({items} : {items: ResultCardProps[]}) {
  return(
    <motion.div 
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
    >
      {items.map((item, index) => (
        <ResultCard key={index} {...item}/>
      ))}
    </motion.div>
  );
}