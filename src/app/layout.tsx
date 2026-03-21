import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UltimaSpark Academy",
    template: "%s • UltimaSpark Academy",
  },
  description:
    "UltimaSpark Academy is a modern learning studio for AI automation, vibe coding, and builder-first cohorts. Ship real projects in focused 6-week programs.",
};

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-bg text-text-primary`}
      >
        {/* `dynamic` avoids static prerender issues with Next.js 15+ where auth UI never hydrates (blank pages). */}
        <ClerkProvider dynamic>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-10 md:px-6">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
