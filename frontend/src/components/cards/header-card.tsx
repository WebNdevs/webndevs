
export type HeaderSectionProps = {
  tag?: string;
  subheading1?: string;
  subheading2?: string;
  subtext?: string;
};


export function HeaderSection({tag, subheading1, subheading2, subtext} : HeaderSectionProps) {
  return(
    <div className="text-center mb-16">
      { tag && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
          <span className="text-[14px] font-medium text-[#22C55E]">
            {tag}
          </span>
        </div>
      )}

      { subheading1 && (
        <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
          {subheading1} <span className='bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>
            {subheading2}  
          </span>
        </h2>
      )}
      
      { subtext && (
        <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
          {subtext}
        </p>
      )}
    </div>
  );
}