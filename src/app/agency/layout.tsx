import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UltimaSpark Agency — AI Automation for Sellers",
  description:
    "We build AI automation systems that reply to every WhatsApp message and Instagram comment 24/7 — so Nigerian SME sellers never miss a sale again.",
};

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
