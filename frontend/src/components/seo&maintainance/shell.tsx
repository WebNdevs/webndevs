import { ReactNode } from "react";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import dynamic from "next/dynamic";

const InteractiveBackground = dynamic(
  () => import("../animations/interactive-background").then((mod) => mod.InteractiveBackground)
);


export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="min-h-screen bg-[#0B0F14] relative">
      <InteractiveBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 bg-[#22C55E] text-[#0B0F14] px-4 py-2 rounded-lg font-bold transition-all"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
}


