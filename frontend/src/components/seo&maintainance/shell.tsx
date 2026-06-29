import { ReactNode } from "react";
import { Footer } from "../footer";
import { Navbar } from "../navbar";


export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="min-h-screen bg-[#0B0F14]">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}


