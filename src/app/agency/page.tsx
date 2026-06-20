"use client";

import Link from "next/link";
import { useState } from "react";

const DISCOVERY_CALL_LINK = "https://calendly.com/ultimaspark/discovery";
const WHATSAPP_LINK = "https://wa.me/2349126914795?text=Hi%2C%20I%27d%20like%20to%20automate%20my%20sales";
const FULLSTACK_WHATSAPP_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20the%20Full%20Stack%20package";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#00C9B1]">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
      {children}
    </h2>
  );
}

function BookCallCta({ variant = "primary" }: { variant?: "primary" | "outline" }) {
  if (variant === "outline") {
    return (
      <a
        href={DISCOVERY_CALL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:border-[#00C9B1] hover:text-[#00C9B1]"
      >
        Book a Free Discovery Call →
      </a>
    );
  }
  return (
    <a
      href={DISCOVERY_CALL_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-full bg-[#00C9B1] px-7 py-3 text-sm font-semibold text-[#0D1B5E] shadow-lg shadow-[#00C9B1]/20 transition hover:bg-[#00b4a0]"
    >
      Book a Free Discovery Call →
    </a>
  );
}

export default function AgencyPage() {
  return (
    <div className="-mx-4 -my-10 md:-mx-6">
      {/* STICKY NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0D1B5E]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C9B1] text-sm font-bold text-[#0D1B5E]">
              ⚡
            </span>
            <span className="text-base font-bold text-white">UltimaSpark</span>
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection("pricing")}
            className="rounded-full bg-[#00C9B1] px-5 py-2 text-sm font-semibold text-[#0D1B5E] transition hover:bg-[#00b4a0]"
          >
            See Plans →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-28 text-center md:pb-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00C9B1]/10 blur-[120px]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C9B1]">
          AI Automation for Sellers
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Websites &amp; AI automation that sell for you, 24/7
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          We build beautiful product websites and AI systems that reply to
          every WhatsApp and Instagram message — so you wake up to orders,
          not questions.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          Setup in days. No tech skills needed. Cancel anytime.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={DISCOVERY_CALL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#00C9B1] px-7 py-3 text-sm font-semibold text-[#0D1B5E] shadow-lg shadow-[#00C9B1]/20 transition hover:bg-[#00b4a0]"
          >
            Book a Free Discovery Call →
          </a>
          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-gray-200 transition hover:border-[#00C9B1] hover:text-[#00C9B1]"
          >
            See How It Works ↓
          </button>
        </div>
      </section>

      {/* PROBLEM SECTION — Sound familiar? */}
      <section className="px-4 py-16 md:py-24">
        <SectionLabel>Sound familiar?</SectionLabel>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
          {[
            {
              emoji: "📱",
              title: "Missed messages = missed money",
              desc: "You wake up to 12 unanswered WhatsApps — and 3 of them were ready to buy.",
            },
            {
              emoji: "💬",
              title: "Comments you can't keep up with",
              desc: "Your Instagram post blows up but you can't reply to 200 comments fast enough.",
            },
            {
              emoji: "📦",
              title: "Saying the same thing all day",
              desc: "Customers ask 'Do you have this?' 10 times a day and you type the same answer over and over.",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-l-4 border-l-[#00C9B1] border-white/10 bg-[#0D1B5E]/50 p-6"
            >
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="mt-3 text-base font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <BookCallCta />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-4 py-16 md:py-24">
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>We set it up. You sell more.</SectionTitle>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2 md:gap-10">
          {[
            {
              step: "01",
              title: "Tell us about your business",
              desc: "A quick chat where we learn what you sell, where your customers are, and what messages you get most.",
            },
            {
              step: "02",
              title: "We build your website & automation",
              desc: "Our team builds your product catalog website, AI chatbot, comment auto-responder, and dashboard — usually within a week.",
            },
            {
              step: "03",
              title: "We connect everything",
              desc: "Your new website, WhatsApp number, Instagram/Facebook auto-DM all go live. We test every flow for you.",
            },
            {
              step: "04",
              title: "You watch the orders come in",
              desc: "Your website and AI work 24/7. You get a dashboard showing every lead and sale. We handle support.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <span className="shrink-0 text-2xl font-extrabold text-[#00C9B1]">
                {s.step}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <BookCallCta />
        </div>
      </section>

      {/* SERVICES — What you get */}
      <section className="px-4 py-16 md:py-24">
        <SectionLabel>What You Get</SectionLabel>
        <SectionTitle>Websites &amp; automation to grow your business</SectionTitle>

        {/* Website Design Group */}
        <div className="mx-auto mt-12 max-w-4xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-white">
            🌐 Website Design
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: "🛍️",
                title: "Product Catalog Website",
                desc: "A clean, one-page site with all your products, prices, and a one-tap WhatsApp order button. Live in 24 hours.",
              },
              {
                icon: "📊",
                title: "Lead Dashboard",
                desc: "Every message, comment, and lead in one screen. See who's buying, who's interested, and what you're earning.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-white/10 bg-[#0D1B5E]/30 p-6 transition hover:border-[#00C9B1]/40 hover:shadow-[0_0_30px_rgba(0,201,177,0.06)]"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 text-base font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Automation Group */}
        <div className="mx-auto mt-10 max-w-4xl">
          <p className="mb-4 text-sm font-semibold tracking-wide text-white">
            🤖 AI Automation
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: "💬",
                title: "WhatsApp AI Chatbot",
                desc: "Auto-replies on your own WhatsApp Business number 24/7. Answers questions, shares price lists, collects orders — even at 3am.",
              },
              {
                icon: "📲",
                title: "Instagram & Facebook Auto-DM",
                desc: "When someone comments 'price' or 'how to order', they get a DM with your catalog and WhatsApp link in seconds.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-white/10 bg-[#0D1B5E]/30 p-6 transition hover:border-[#00C9B1]/40 hover:shadow-[0_0_30px_rgba(0,201,177,0.06)]"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 text-base font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <BookCallCta />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-16 md:py-24">
        <SectionLabel>Simple Pricing</SectionLabel>
        <SectionTitle>Choose your package</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-400">
          One-time setup fee. Monthly retainer invoiced after you go live. Cancel with 30 days notice.
        </p>

        <div className="mx-auto mt-12 grid max-w-6xl items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Website Only",
              tag: "Best for: businesses that just need a professional site",
              setup: "₦80,000 – ₦150,000",
              retainer: "+ ₦15,000/month hosting & maintenance",
              included: [
                "Professional website (up to 5 pages)",
                "Mobile-first, WhatsApp-ready",
                "Product catalog with WhatsApp order button",
                "5-day setup",
              ],
              notIncluded: ["AI Chatbot", "Auto-DM", "Dashboard"],
              popular: false,
              premium: false,
              ctaLink: DISCOVERY_CALL_LINK,
            },
            {
              name: "Starter",
              tag: "Best for: sellers who want 24/7 replies",
              setup: "From ₦70,000",
              retainer: "+ ₦30,000–₦40,000/month",
              included: [
                "WhatsApp AI Chatbot (24/7)",
                "Dedicated WhatsApp number",
                "n8n automation workflow",
                "AI-powered responses",
                "5-day setup",
                "30 days support",
              ],
              notIncluded: ["Auto-DM", "Catalog Website", "Dashboard"],
              popular: false,
              premium: false,
              ctaLink: DISCOVERY_CALL_LINK,
            },
            {
              name: "Growth",
              tag: "Best for: combining a website with automation",
              setup: "From ₦150,000",
              retainer: "+ ₦45,000–₦60,000/month",
              included: [
                "Everything in Starter",
                "Facebook & Instagram Auto-DM",
                "Buying-intent detection",
                "Product Catalog Website",
                "7-day setup",
              ],
              notIncluded: ["Dashboard"],
              popular: true,
              premium: false,
              ctaLink: DISCOVERY_CALL_LINK,
            },
            {
              name: "Full Stack",
              tag: "Complete website + automation",
              setup: "₦600,000",
              retainer: "+ ₦80,000–₦120,000/month",
              included: [
                "Everything in Growth",
                "Full e-commerce store with WhatsApp checkout",
                "Lead Management Dashboard",
                "Priority support",
                "10-day setup",
              ],
              notIncluded: [],
              popular: false,
              premium: true,
              ctaLink: FULLSTACK_WHATSAPP_LINK,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 transition ${
                plan.popular
                  ? "scale-[1.03] border-[#00C9B1] bg-[#0D1B5E]/60 shadow-[0_0_40px_rgba(0,201,177,0.12)]"
                  : plan.premium
                    ? "border-[#00C9B1]/60 bg-[#0D1B5E]/40 shadow-[0_0_30px_rgba(0,201,177,0.15)]"
                    : "border-white/10 bg-[#0D1B5E]/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 rounded-full bg-[#00C9B1] px-3 py-1 text-xs font-bold text-[#0D1B5E] shadow-lg">
                  Most Popular
                </span>
              )}
              {plan.premium && (
                <span className="absolute -top-3 right-4 rounded-full border border-[#00C9B1]/60 bg-[#0D1B5E] px-3 py-1 text-xs font-bold text-[#00C9B1] shadow-lg">
                  Flagship
                </span>
              )}
              <p className="text-xs font-semibold text-[#00C9B1]">{plan.tag}</p>
              <h3 className={`mt-2 font-bold text-white ${plan.premium ? "text-2xl" : "text-xl"}`}>{plan.name}</h3>
              <p className={`mt-2 font-extrabold text-white ${plan.premium ? "text-3xl" : "text-2xl"}`}>{plan.setup}</p>
              <p className="text-xs text-gray-400">setup fee</p>
              <p className="mt-1 text-sm text-gray-400">{plan.retainer}</p>

              <ul className="mt-5 space-y-2">
                {plan.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 text-[#00C9B1]">✓</span>
                    {item}
                  </li>
                ))}
                {plan.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="mt-0.5 text-gray-600">✗</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                  plan.popular || plan.premium
                    ? "bg-[#00C9B1] text-[#0D1B5E] hover:bg-[#00b4a0]"
                    : "border border-white/20 text-white hover:border-[#00C9B1] hover:text-[#00C9B1]"
                }`}
              >
                Get Started →
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-gray-400">
          Not sure which plan fits?{" "}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#00C9B1] transition hover:underline"
          >
            Chat with us on WhatsApp →
          </a>
        </p>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 md:py-24">
        <SectionLabel>Questions</SectionLabel>
        <SectionTitle>Frequently asked</SectionTitle>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-white/10">
          {[
            {
              q: "Do I need any technical skills?",
              a: "No. We handle everything. You keep using WhatsApp and Instagram the way you always have — we run the automation in the background.",
            },
            {
              q: "What number does the chatbot use?",
              a: "We set up a dedicated WhatsApp Business number for your business. Your personal number stays completely separate.",
            },
            {
              q: "How fast can I get started?",
              a: "Starter is live in 5 days. Growth in 7 days. Full Stack in 10 days. The clock starts once your setup fee is confirmed.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel your monthly retainer with 30 days notice. No long-term contracts, no lock-in.",
            },
            {
              q: "What happens after I pay the setup fee?",
              a: "You'll hear from our team within 2 hours with your onboarding checklist. We guide you through every step.",
            },
          ].map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <BookCallCta variant="outline" />
        </div>
      </section>

      {/* FINAL CTA — Navy background */}
      <section id="cta-final" className="bg-[#0D1B5E] px-4 py-20 text-center md:py-28">
        <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Every day without automation is a day of missed sales.
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={DISCOVERY_CALL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-[#00C9B1] px-8 py-3.5 text-center text-sm font-semibold text-[#0D1B5E] shadow-lg shadow-[#00C9B1]/20 transition hover:bg-[#00b4a0] sm:w-auto"
          >
            Book Your Free Discovery Call →
          </a>
          <a
            href="https://wa.me/2349126914795"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-white/30 px-8 py-3.5 text-center text-sm font-medium text-white transition hover:border-[#00C9B1] hover:text-[#00C9B1] sm:w-auto"
          >
            Message Us on WhatsApp
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          No commitment. No tech knowledge needed. Takes 20 minutes.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D1B5E] px-4 py-10 text-center text-sm text-gray-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00C9B1] text-xs font-bold text-[#0D1B5E]">
              ⚡
            </span>
            <span className="text-sm font-semibold text-white">UltimaSpark</span>
          </div>
          <p>AI Automation for Sellers. © {new Date().getFullYear()}</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="transition hover:text-[#00C9B1]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#00C9B1]">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <span className="shrink-0 text-lg text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-400">{answer}</p>
      )}
    </div>
  );
}
