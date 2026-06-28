"use client";

import { useState } from "react";

const TABS = ["Website Design", "Automation & AI"] as const;
type Tab = (typeof TABS)[number];

const CALENDLY_LINK = "https://calendly.com/ultimaspark/discovery";
const WHATSAPP_ENQUIRY_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20an%20automation%20build";
const WHATSAPP_CHAT_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20custom%20build";

const WEBSITE_DESIGN_TABLE = [
  { project: "Landing Page", price: "₦80,000" },
  { project: "Brochure / Service Site", price: "₦150,000" },
  { project: "NGO / Nonprofit Site", price: "₦150,000" },
  { project: "Product Catalog + WhatsApp Checkout", price: "₦180,000" },
  { project: "Restaurant / Food Ordering Site", price: "₦200,000" },
  { project: "Event / Ticketing Site", price: "₦200,000" },
  { project: "Booking / Appointment Site", price: "₦220,000" },
  { project: "Real Estate Listing Site", price: "₦280,000" },
  { project: "Job Board / Application Portal", price: "₦300,000" },
  { project: "Internal Business Dashboard", price: "₦320,000" },
  { project: "Directory / Listing Site", price: "₦320,000" },
  { project: "Membership / LMS Site", price: "₦380,000" },
  { project: "E-commerce Store (Paystack)", price: "₦450,000" },
];

const AUTOMATION_TABLE = [
  { name: "Review / Feedback Collection", setup: "₦120,000", monthly: "₦10,000" },
  { name: "Document Generation", setup: "₦120,000", monthly: "₦10,000" },
  { name: "Follow-Up Message Sequences", setup: "₦150,000", monthly: "₦15,000" },
  { name: "Social Media Auto-Posting", setup: "₦150,000", monthly: "₦15,000" },
  { name: "Lead Capture → Dashboard", setup: "₦200,000", monthly: "₦15,000" },
  { name: "Invoice & Payment Automation", setup: "₦200,000", monthly: "₦15,000" },
  { name: "Facebook/Instagram Comment Auto-DM", setup: "₦200,000", monthly: "₦20,000" },
  { name: "Abandoned Cart Recovery", setup: "₦200,000", monthly: "₦20,000" },
  { name: "Appointment Booking + Reminders", setup: "₦220,000", monthly: "₦20,000" },
  { name: "AI Content Generation Pipeline", setup: "₦220,000", monthly: "₦20,000" },
  { name: "Lead Generation Scraper", setup: "₦220,000", monthly: "₦20,000" },
  { name: "WhatsApp AI Chatbot", setup: "₦250,000", monthly: "₦35,000" },
  { name: "Order Processing Pipeline", setup: "₦280,000", monthly: "₦25,000" },
];

function GetStartedButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-500 transition hover:border-[#00C9B1] hover:text-[#00C9B1]"
    >
      Get Started
    </a>
  );
}

export function CustomBuildSection() {
  const [activeTab, setActiveTab] = useState<Tab>("Website Design");

  return (
    <section className="bg-[#f9fafb] px-4 pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Section header */}
      <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
        Custom Builds
      </p>
      <h2 className="mt-3 text-center text-2xl font-bold text-[#111827] sm:text-3xl">
        Need Something Specific?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-500">
        Pick exactly what your business needs. Every build includes mobile-first
        design, WhatsApp integration, and 30 days of post-launch support.
      </p>

      {/* Tab switcher */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-[#00C9B1] bg-[#00C9B1] text-[#0D1B5E]"
                : "border-gray-200 bg-white text-gray-500 hover:border-[#00C9B1]/40 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Price table */}
      <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {activeTab === "Website Design" ? (
          <>
            {/* ── Website Design heading ── */}
            <p className="border-b border-gray-100 px-6 py-3 text-sm font-semibold text-[#111827]">
              One-time setup fee. Hosting on us.
            </p>

            {/* ── Website Design header ── */}
            <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3">
              <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Project Type
              </span>
              <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Price
              </span>
              <span className="w-28 shrink-0" />
            </div>

            {/* ── Website Design rows ── */}
            <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {WEBSITE_DESIGN_TABLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50 ${
                    i % 2 !== 0 ? "bg-gray-50/40" : "bg-white"
                  }`}
                >
                  <span className="flex-1 text-sm font-semibold text-[#111827]">{row.project}</span>
                  <span className="w-24 shrink-0 text-sm font-bold text-[#00C9B1]">{row.price}</span>
                  <span className="w-28 shrink-0">
                    <GetStartedButton href={CALENDLY_LINK} />
                  </span>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-center">
              <p className="text-sm text-gray-500">
                Prices are estimates.{" "}
                <a
                  href={WHATSAPP_CHAT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#00C9B1] transition hover:underline"
                >
                  Chat with us for a precise quote &rarr;
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ── Automation heading ── */}
            <p className="border-b border-gray-100 px-6 py-3 text-sm font-semibold text-[#111827]">
              Setup fee is one-time. Monthly retainer covers hosting, monitoring, and AI infrastructure.
            </p>

            {/* ── Automation header ── */}
            <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3">
              <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Automation Type
              </span>
              <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Setup Fee
              </span>
              <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Monthly
              </span>
              <span className="w-28 shrink-0" />
            </div>

            {/* ── Automation rows ── */}
            <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {AUTOMATION_TABLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50 ${
                    i % 2 !== 0 ? "bg-gray-50/40" : "bg-white"
                  }`}
                >
                  <span className="flex-1 text-sm font-semibold text-[#111827]">{row.name}</span>
                  <span className="w-20 shrink-0 text-sm font-bold text-[#111827]">{row.setup}</span>
                  <span className="w-20 shrink-0 text-sm font-bold text-[#00C9B1]">{row.monthly}</span>
                  <span className="w-28 shrink-0">
                    <GetStartedButton href={WHATSAPP_ENQUIRY_LINK} />
                  </span>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-center">
              <p className="text-sm text-gray-500">
                Prices are estimates.{" "}
                <a
                  href={WHATSAPP_ENQUIRY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#00C9B1] transition hover:underline"
                >
                  Chat with us for a precise quote &rarr;
                </a>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Closing footnote */}
      <p className="mx-auto mt-6 max-w-3xl text-xs leading-relaxed text-gray-400">
        All prices are in Nigerian Naira (₦). For international clients, pricing
        is quoted in USD on request. Need a combination of website and
        automation? See our packages above or:{" "}
        <a
          href="https://wa.me/2349126914795?text=Hi%2C%20I%20need%20a%20custom%20quote"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#00C9B1] transition hover:underline"
        >
          Chat with us to build a custom quote &rarr;
        </a>
      </p>
    </section>
  );
}
