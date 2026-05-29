"use client";

import Link from "next/link";
import { useState } from "react";

const SELAR_LINKS = {
  starter: "https://selar.co/YOUR_STARTER_PRODUCT_URL",
  growth: "https://selar.co/YOUR_GROWTH_PRODUCT_URL",
  fullstack: "https://selar.co/YOUR_FULLSTACK_PRODUCT_URL",
};

const WHATSAPP_NUMBER = "234XXXXXXXXXX";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20know%20which%20Ultimaspark%20plan%20is%20right%20for%20me`;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function StickyNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A1628]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-bold text-[#1D9E75]">
          Ultimaspark
        </Link>
        <button
          type="button"
          onClick={() => scrollToId("pricing")}
          className="rounded-full bg-[#1D9E75] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#178a65]"
        >
          See Pricing →
        </button>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 text-center md:pb-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1D9E75]/15 blur-[120px]" />
      </div>
      <p className="mx-auto max-w-3xl text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        AI Automation for Nigerian SMEs
      </p>
      <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Stop losing sales to unanswered messages
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
        We build AI automation systems that reply to every WhatsApp message and
        Instagram comment — 24/7 — so you never miss a sale again.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
        Used by Nigerian SME sellers. Setup in 5 days. Cancel anytime.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => scrollToId("pricing")}
          className="rounded-full bg-[#1D9E75] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1D9E75]/20 transition hover:bg-[#178a65]"
        >
          See pricing →
        </button>
        <button
          type="button"
          onClick={() => scrollToId("services")}
          className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-gray-200 transition hover:border-[#1D9E75] hover:text-[#1D9E75]"
        >
          See how it works ↓
        </button>
      </div>
    </section>
  );
}

const PAIN_POINTS = [
  {
    icon: "📱",
    title: "Unanswered messages overnight",
    desc: "You wake up to 12 unanswered WhatsApp messages — and 3 of them were ready to buy.",
  },
  {
    icon: "💬",
    title: "Can't reply to every comment",
    desc: "Your Instagram post blows up but you can't reply to 200 comments manually.",
  },
  {
    icon: "📦",
    title: "Repeating yourself all day",
    desc: "Customers ask 'do you have this?' 10 times a day and you repeat yourself every time.",
  },
];

function PainPointsSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        Sound familiar?
      </p>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
        {PAIN_POINTS.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-l-4 border-l-[#1D9E75] border-white/10 bg-[#0F1A2E] p-6"
          >
            <span className="text-3xl">{p.icon}</span>
            <h3 className="mt-3 text-base font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: "💬",
    title: "WhatsApp AI Chatbot",
    desc: "24/7 auto-reply on your own WhatsApp Business number. Answers product questions, sends price lists, qualifies buyers — even at 3am.",
  },
  {
    icon: "📲",
    title: "Comment Auto-DM",
    desc: "When someone comments 'price?' or 'how to order' on your Facebook or Instagram post, they automatically get a DM with your catalog and WhatsApp number within seconds.",
  },
  {
    icon: "🛍️",
    title: "Product Catalog Website",
    desc: "A clean, fast website where every product has a photo, price, and one-tap WhatsApp order button. Live in 24 hours.",
  },
  {
    icon: "📊",
    title: "Lead Management Dashboard",
    desc: "Every lead from WhatsApp, Instagram, and Facebook in one screen. See who's buying, who's ghosting, and your total revenue.",
  },
];

function ServicesSection() {
  return (
    <section id="services" className="px-4 py-16 md:py-24">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        What we build for you
      </p>
      <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
        Everything you need to automate sales
      </h2>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className="group relative rounded-xl border border-white/10 bg-[#0F1A2E] p-6 transition hover:border-[#1D9E75]/50 hover:shadow-[0_0_30px_rgba(29,158,117,0.08)]"
          >
            <span className="absolute right-4 top-4 text-xs font-bold text-white/10">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-3xl">{s.icon}</span>
            <h3 className="mt-3 text-base font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        Real results. Real business.
      </p>
      <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F1A2E] p-5">
          <div className="rounded-lg bg-[#0A1628] p-4">
            <div className="mb-3 text-sm font-bold text-[#1D9E75]">
              BelleHairs Owerri
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Frontal Wig", "Closure Wig", "Bob Wig", "Deep Wave"].map(
                (product) => (
                  <div
                    key={product}
                    className="rounded-lg border border-white/10 bg-[#0F1A2E] p-3"
                  >
                    <div className="mb-2 h-16 rounded bg-white/5" />
                    <p className="text-xs font-medium text-white">{product}</p>
                    <p className="text-[11px] text-gray-400">₦45,000</p>
                    <div className="mt-2 rounded bg-[#1D9E75] px-2 py-1 text-center text-[10px] font-semibold text-white">
                      Order on WhatsApp
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-3 py-1 text-xs font-semibold text-[#1D9E75]">
            ✓ Live client — Owerri, Nigeria
          </span>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            BelleHairs Owerri
          </h3>
          <p className="text-sm text-gray-400">@bellehairsng</p>
          <p className="text-sm text-gray-300">
            <span className="font-medium text-white">What we built:</span>{" "}
            Catalog website with WhatsApp checkout
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            Professional catalog live in 24 hours. Orders coming in directly
            from WhatsApp.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              Catalog Site
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              WhatsApp Checkout
            </span>
          </div>
          <a
            href="https://bellehairs.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-[#1D9E75] transition hover:underline"
          >
            View live site →
          </a>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Starter",
    badge: "Best for new sellers",
    price: "From ₦100,000",
    retainer: "+ ₦45,000–₦60,000/month",
    included: [
      "WhatsApp AI Chatbot (24/7)",
      "Dedicated WhatsApp Business number",
      "n8n automation workflow",
      "Claude AI responses",
      "5-day setup",
      "30 days support",
    ],
    excluded: ["Comment Auto-DM", "Catalog Website", "Lead Dashboard"],
    cta: "Get Starter →",
    href: SELAR_LINKS.starter,
    popular: false,
  },
  {
    name: "Growth",
    badge: "For sellers running ads",
    price: "From ₦200,000",
    retainer: "+ ₦55,000–₦80,000/month",
    included: [
      "Everything in Starter",
      "Facebook Comment Auto-DM",
      "Instagram Comment Auto-DM",
      "Buying-intent detection",
      "Auto catalog link + WhatsApp DM",
      "7-day setup",
    ],
    excluded: ["Catalog Website", "Lead Dashboard"],
    cta: "Get Growth →",
    href: SELAR_LINKS.growth,
    popular: true,
  },
  {
    name: "Full Stack",
    badge: "Complete automation",
    price: "From ₦400,000",
    retainer: "+ ₦80,000–₦120,000/month",
    included: [
      "Everything in Growth",
      "Product Catalog Website",
      "WhatsApp checkout on every product",
      "Lead Management Dashboard",
      "All leads in one screen",
      "Priority support",
      "10-day setup",
    ],
    excluded: [],
    cta: "Get Full Stack →",
    href: SELAR_LINKS.fullstack,
    popular: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 md:py-24">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        Simple, transparent pricing
      </p>
      <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
        Choose your automation package
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-400">
        Setup fee paid once. Monthly retainer invoiced after you go live. Cancel
        with 30 days notice.
      </p>

      <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border p-6 transition ${
              plan.popular
                ? "scale-[1.03] border-[#1D9E75] bg-[#0F1A2E] shadow-[0_0_40px_rgba(29,158,117,0.12)]"
                : "border-white/10 bg-[#0F1A2E]"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 rounded-full bg-[#1D9E75] px-3 py-1 text-xs font-bold text-white shadow-lg">
                Most Popular
              </span>
            )}
            <p className="text-xs font-semibold text-[#1D9E75]">{plan.badge}</p>
            <h3 className="mt-2 text-xl font-bold text-white">{plan.name}</h3>
            <p className="mt-2 text-2xl font-extrabold text-white">
              {plan.price}
            </p>
            <p className="text-xs text-gray-400">setup fee</p>
            <p className="mt-1 text-sm text-gray-400">{plan.retainer}</p>

            <ul className="mt-5 space-y-2">
              {plan.included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="mt-0.5 text-[#1D9E75]">✓</span>
                  {item}
                </li>
              ))}
              {plan.excluded.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-500"
                >
                  <span className="mt-0.5 text-gray-600">✗</span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                plan.popular
                  ? "bg-[#1D9E75] text-white hover:bg-[#178a65]"
                  : "border border-white/20 text-white hover:border-[#1D9E75] hover:text-[#1D9E75]"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-sm text-gray-400">
        Not sure which plan is right for you?{" "}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#1D9E75] transition hover:underline"
        >
          Chat with us on WhatsApp →
        </a>
      </p>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Do I need a tech background to use this?",
    a: "No. We handle the entire setup. You just use your WhatsApp and Instagram the same way you always do — we handle everything running in the background.",
  },
  {
    q: "What WhatsApp number will the chatbot run on?",
    a: "We register a new dedicated WhatsApp Business number for your business. Your personal number stays separate.",
  },
  {
    q: "How long does setup take?",
    a: "Starter: 5 days. Growth: 7 days. Full Stack: 10 days. The clock starts after your setup fee is confirmed.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Cancel your monthly retainer with 30 days notice. There are no long-term contracts.",
  },
  {
    q: "What happens after I pay the setup fee on Selar?",
    a: "You'll get a WhatsApp message from our team within 2 hours with your onboarding details and a checklist to get started.",
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-16 md:py-24">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1D9E75]">
        Questions
      </p>
      <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
        Frequently asked
      </h2>
      <div className="mx-auto mt-10 max-w-2xl divide-y divide-white/10">
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-sm font-medium text-white">{item.q}</span>
              <span className="shrink-0 text-lg text-gray-500">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <p className="pb-4 text-sm leading-relaxed text-gray-400">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="bg-[#1D9E75] px-4 py-16 text-center md:py-20">
      <h2 className="text-2xl font-bold text-white sm:text-3xl">
        Your competitors are already automating.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">
        Set up your AI sales system this week.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => scrollToId("pricing")}
          className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0A1628] transition hover:bg-gray-100"
        >
          See plans →
        </button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Chat on WhatsApp →
        </a>
      </div>
    </section>
  );
}

export default function AgencyServicesPage() {
  return (
    <div className="-mx-4 -my-10 md:-mx-6">
      <StickyNav />
      <div className="bg-[#0A1628]">
        <HeroSection />
        <PainPointsSection />
        <ServicesSection />
        <ProofSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </div>
    </div>
  );
}
