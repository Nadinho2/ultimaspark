import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PageShell } from "@/components/PageShell";
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
  icons: {
    icon: "/icon.svg",
  },
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
            <PageShell>{children}</PageShell>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
