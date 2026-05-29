import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Automation Agency — WhatsApp, Instagram & Catalog",
  description:
    "We build AI automation systems that reply to every WhatsApp message and Instagram comment 24/7. Setup in 5 days. Cancel anytime.",
};

export default function AgencyServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
