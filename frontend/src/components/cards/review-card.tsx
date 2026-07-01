import { DSCard } from "./DScomponents"
import { Star, Quote } from "lucide-react";
import Image from "next/image";


export type ReviewCardProps = {
  name?: string;
  company?: string;
  content?: string;
  rating?: number;
  photo_url?: string;
  role?: string;
}

export function ReviewCard({name, company, content, rating, photo_url, role} : ReviewCardProps) {
  return(
    <DSCard hoverable className="flex flex-col">
      {/* Stars */}
      {rating && (
        <div className="flex gap-1 mb-4" aria-label={`Rating: ${rating} out of 5 stars`}>
          {Array.from({ length: rating ?? 0 }, (_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>
      )}

      {/* Quote/Image */}
      { photo_url ? (
        <Image src={photo_url} alt={name ? `Client Review by ${name}` : "Client review testimonial"} className="w-15 h-15 rounded mb-4 object-contain object-center" />
      ) : (
        <Quote className="w-10 h-10 text-[#22C55E]/20 mb-4" />
      )}

      {/* Content */}
      {content && (
        <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-6 grow">
          {content}
        </p>
      )}

      {/* Author */}
      <div className="pt-4 border-t border-[#374151]">
        {name && (
          <p className="font-semibold text-[#F9FAFB] text-[15px] mb-1">
            {name}
          </p>
        )}
        {role && (
          <p className="text-[13px] text-[#9CA3AF] mb-2">
            {role}
          </p>
        )}
        {company && (
          <p className="text-[12px] text-[#22C55E]">
            {company}
          </p>
        )}
      </div>
    </DSCard>
  )
}

export function ReviewCardGrid({items} : {items: ReviewCardProps[]}) {
  return(
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {items.map((item, index) => (
        <ReviewCard key={index} {...item} />
      ))}
    </div>
  )
}