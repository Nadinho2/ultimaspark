"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAgency = pathname.startsWith("/agency");

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {!isAgency && <Header />}
        <main
          className={
            isAgency
              ? "flex-1 bg-primary"
              : "mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-10 md:px-6"
          }
        >
          {children}
        </main>
        {!isAgency && <Footer />}
      </div>
      {!isAgency && <FloatingWhatsApp />}
    </>
  );
}
