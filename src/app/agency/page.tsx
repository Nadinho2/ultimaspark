/*
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUDIT: ultimaspark.com/agency — Cold Paid Traffic Conversion Audit
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DATE:         2026-06-28
 * TRAFFIC:      85%+ mobile, TikTok/Instagram sponsored posts + influencer ads
 * AUDIENCE:     Nigerian SME sellers — hair vendors, fashion brands, food
 *               vendors, event planners, retail shop owners
 * CONVERSION:   Book free discovery call @ https://calendly.com/ultimaspark/discovery
 * FALLBACK:     WhatsApp @ https://wa.me/2349126914795
 * WINDOW:       3–7 seconds before bounce
 * EMOTION:      Fear of missing sales, frustration with manual work
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * INFRASTRUCTURE ISSUES (outside this file)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. ROOT LAYOUT (src/app/layout.tsx)
 *    Wraps every route with <Header /> (full site nav), <Footer /> (links to
 *    Privacy, Terms, etc.), and <FloatingWhatsApp />. For paid traffic, this
 *    is lethal: the Header gives cold visitors a dozen escape routes.
 *    Layouts are nested — the agency/layout.tsx returns bare {children}, but
 *    the root layout always wraps it first. Fix: either (a) use a route group
 *    with its own root-like layout, or (b) detect the pathname in the root
 *    layout and conditionally strip chrome for /agency.
 *
 * 2. FLOATING WHATSAPP (src/components/FloatingWhatsApp.tsx)
 *    A persistent floating button competing with the primary Calendly CTA.
 *    For paid traffic: if it points to WhatsApp, it splits the conversion
 *    goal. If it stays, it must point to Calendly — or be removed entirely
 *    for this route.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PER-SECTION AUDIT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 1: Sticky Nav (page-level, lines ~125–145)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Brand logo (links to /) + "See Plans →" anchor button
 * Clarity:          8 — instantly recognizable as a nav bar
 * Relevance:        4 — a brand logo means nothing to cold traffic; the only
 *                      relevant piece is "See Plans" but it scrolls to a
 *                      bloated 4-column pricing section 5 sections later
 * Conversion:       5 — the "See Plans" button is a CTA but its label implies
 *                      "spend money," not "solve my problem"
 * Verdict:          REMOVE
 * Why:              Cold traffic doesn't need navigation — every pixel in the
 *                    top 100px must sell. The logo link to / is a direct
 *                    escape route. The "See Plans" button anchors to a
 *                    section that is itself weak (see Section 7).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 2: Hero (lines ~148–185)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Hook the visitor — headline, subheadline, trust bullets,
 *                    two CTA buttons
 * Clarity:          8 — "Websites & AI automation that sell for you, 24/7"
 *                      is clear and benefit-driven.
 * Relevance:        7 — speaks to the pain of manual selling; "wake up to
 *                      orders, not questions" is great. But "AI Automation
 *                      for Sellers" as the label is generic.
 * Conversion:       6 — CTA says "Get Started on WhatsApp →" — it does NOT
 *                      match the conversion goal (book a Calendly call).
 *                      "See How It Works ↓" is a secondary action that
 *                      delays the CTA.
 * Verdict:          REWRITE
 * Why:              Strong bones but three failures: (a) CTA goes to
 *                    WhatsApp, not Calendly. (b) The decorative blur blob
 *                    is pure aesthetics — remove for load speed. (c) "AI"
 *                    as the first word in the label will feel foreign to a
 *                    Lagos hair vendor. Lead with the outcome: "Never miss
 *                    another customer message."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 3: Problem — "Sound familiar?" (lines ~188–217)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Agitate the pain — three cards describing the exact
 *                    daily frustrations of an SME seller
 * Clarity:          9 — every card instantly recognizable to target audience
 * Relevance:        9 — "12 unanswered WhatsApps," "200 Instagram comments,"
 *                      "saying the same thing all day" are dead-on
 * Conversion:       7 — the CTA at the bottom is well placed, but the copy
 *                      "Get Started on WhatsApp" doesn't connect the pain
 *                      to the solution
 * Verdict:          KEEP (with copy edits)
 * Why:              This is the strongest section on the page. Cold visitors
 *                    who read nothing else will read this. The three-column
 *                    grid works on desktop but will stack on mobile (which
 *                    is fine for 85% mobile traffic — single column is
 *                    actually better here).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 4: How It Works (lines ~220–260)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Build trust — show the process is simple, fast, and
 *                    handled for them
 * Clarity:          8 — four numbered steps with plain titles and short
 *                      descriptions
 * Relevance:        7 — "tell us about your business," "we build,"
 *                      "we connect," "you watch orders" maps to their world
 * Conversion:       6 — step 4 mentions "dashboard" and "support" which
 *                      are features, not benefits. CTA present but lacks
 *                      urgency.
 * Verdict:          REWRITE
 * Why:              Process is fine, but the tone is generic. Cold traffic
 *                    needs to hear specific timing ("5 days, not 5 weeks")
 *                    and specific outcomes ("your WhatsApp replies to
 *                    customers while you sleep"). Replace bullet-style
 *                    descriptions with benefit-first phrasing. The numbered
 *                    badges (01–04) are decoration — simplify.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 5: Services — "What You Get" (lines ~263–332)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Feature showcase — two sub-groups (Website Design,
 *                    AI Automation) with two cards each
 * Clarity:          6 — the grouping helps, but "Lead Dashboard" is a
 *                      feature, not a benefit; "Product Catalog Website"
 *                      is clear but should lead with "Your products online,
 *                      one tap to order"
 * Relevance:        7 — all four items are what the audience needs, but
 *                      the sub-group headings add cognitive load
 * Conversion:       5 — CTA present but buried after four cards. The card
 *                      hover effects (group, hover:shadow) are decorative
 *                      and add nothing to conversion.
 * Verdict:          REWRITE (condense to 3 cards, remove subgroups)
 * Why:              Cold traffic doesn't read feature lists — they scan
 *                    for "can this fix my specific problem?" Three punchy
 *                    cards with one headline each (not two groups) will
 *                    convert better. "Lead Dashboard" should be rewritten
 *                    as "See every sale, every lead, every naira — in one
 *                    place."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 6: Portfolio Teaser (lines ~335–345)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Social proof — "20+ projects across e-commerce, AI,
 *                    SaaS, Web3" with link to /agency/portfolio
 * Clarity:          7 — the sentence is clear but the listed categories
 *                      ("SaaS," "Web3") are irrelevant to SME sellers
 * Relevance:        2 — a Nigerian hair vendor does not care about Web3
 *                      projects. "20+ projects" has zero meaning without
 *                      names, faces, or results they recognize.
 * Conversion:       1 — the link to /agency/portfolio is a dead-end escape
 *                      route away from the booking CTA. Even if they click
 *                      it, the portfolio page has no CTA back to this page.
 * Verdict:          REMOVE
 * Why:              Portfolio teasers work for warm traffic from organic
 *                    search. For cold paid traffic, "20+ projects" is a
 *                    hollow claim with no specificity. Replace with actual
 *                    testimonials — named Nigerian business owners with
 *                    photos and specific results (see Section 12 below).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 7: Pricing (lines ~348–482)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Present four tiered packages with setup fees, retainers,
 *                    feature lists, and CTA buttons per plan
 * Clarity:          4 — four columns of dense text with included/not-included
 *                      lists, two different badge types ("Most Popular,"
 *                      "Flagship"), and varying price formats (range vs
 *                      "From"). The "Website Only" plan (₦80K–₦500K) has a
 *                      range so wide it creates confusion rather than choice.
 * Relevance:        6 — prices are relevant but ₦600K on first visit with
 *                      zero trust built is aggressive. The "n8n automation
 *                      workflow" line in Starter is jargon a seller will
 *                      never understand.
 * Conversion:       4 — the "Not sure which plan fits?" WhatsApp link at
 *                      the bottom splits the CTA. Each plan has its own
 *                      "Get Started →" button creating 5 total CTAs in one
 *                      section (4 plan buttons + 1 WhatsApp link). This is
 *                      analysis paralysis.
 * Verdict:          REWRITE (reduce to 2 plans, replace feature lists with
 *                    outcome statements)
 * Why:              Four plans is choice overload. Cold traffic needs a
 *                    simple binary: "Do it for me — basic" vs "Do it for me —
 *                    complete." Remove setup fee ranges (use single anchor
 *                    price), remove "not included" columns (creates doubt),
 *                    remove plan-specific CTAs (one CTA for the section:
 *                    "Book a call to choose your plan").
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 8: Custom Build Section (lines ~485, imported from
 *            _components/CustomBuildSection.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Tabbed pricing table — 13 website types on one tab,
 *                    13 automation types on the other, each with setup fee,
 *                    monthly retainer, and a "Get Started" button
 * Clarity:          2 — the tab UI is clear but the sheer volume (26 rows
 *                      of dense pricing data) overwhelms instantly. A cold
 *                      visitor on mobile sees a wall of numbers.
 * Relevance:        3 — some items are relevant (WhatsApp AI Chatbot,
 *                      Product Catalog) but others are completely irrelevant
 *                      (Job Board, Membership/LMS, Lead Gen Scraper,
 *                      Invoice Automation) to a small retail seller.
 * Conversion:       1 — every row has a "Get Started" button creating 26
 *                      competing CTAs. Each "Get Started" button uses a
 *                      different link — some go to Calendly, some to
 *                      WhatsApp — splitting the conversion goal further.
 * Verdict:          REMOVE
 * Why:              This is a warm-lead sales tool — useful for a sales
 *                    rep on a discovery call, deadly for cold traffic. It
 *                    also breaks visual consistency by switching from dark
 *                    (#0D1B5E) to light (#f9fafb) background. Remove from
 *                    this page and repurpose for an internal /sales page
 *                    or a follow-up email PDF.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 9: FAQ (lines ~488–525)
 * ─────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Handle objections — five accordion items covering
 *                    tech skills, phone numbers, timeline, cancellation,
 *                    and post-payment process
 * Clarity:          8 — questions are phrased in the visitor's voice; the
 *                      accordion UX is mobile-friendly
 * Relevance:        8 — every question addresses a real cold-traffic
 *                      objection ("Do I need tech skills?" is #1)
 * Conversion:       6 — the CTA at the bottom ("Get Started on WhatsApp")
 *                      doesn't ride the momentum of "I just read that it's
 *                      easy and fast — let me book now"
 * Verdict:          KEEP (move earlier, after How It Works)
 * Why:              FAQ is one of the highest-converting sections for cold
 *                    traffic because it answers objections right when they
 *                    arise. Currently placed after two pricing sections (7
 *                    and 8) — it should come before any pricing to reduce
 *                    anxiety before asking for money.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 10: Final CTA (lines ~528–553)
 * ──────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Last-chance conversion — bold headline, two CTA buttons,
 *                    reassurance line
 * Clarity:          9 — "Every day without automation is a day of missed
 *                      sales" is the single best line on the entire page
 * Relevance:        9 — speaks directly to FOMO; "20 minutes" and "no
 *                      commitment" handle last objections
 * Conversion:       7 — strong but both buttons go to WhatsApp, and
 *                      "Get Started on WhatsApp" is a commitment, not an
 *                      invitation. "Book your free 20-min call" would
 *                      convert better.
 * Verdict:          KEEP (edit CTA destination and copy)
 * Why:              Excellent urgency and clarity. Just needs the correct
 *                    destination (Calendly) and a lower-friction label
 *                    ("Book Free Call" instead of "Get Started on WhatsApp").
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 11: Footer (page-level, lines ~556–572)
 * ──────────────────────────────────────────────────────────────────────────────
 * Current purpose:  Brand repeat + legal links (Privacy, Terms)
 * Clarity:          7 — layout is clean; brand logo + tagline + legal
 * Relevance:        2 — a cold visitor does not need legal links or a
 *                      brand logo on a landing page
 * Conversion:       1 — Privacy and Terms are escape routes; the logo
 *                      adds visual noise at the dead end of the page
 * Verdict:          REWRITE (strip to copyright line only)
 * Why:              Paid traffic landing pages should end with a dead end.
 *                    Replace the entire footer with: "© 2026 UltimaSpark."
 *                    That's it. No links, no logo, no tagline.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * SCORE SUMMARY TABLE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Section                  Clarity  Relevance  Conversion  Total/30  Verdict
 * ───────────────────────  ───────  ─────────  ──────────  ────────  ────────
 * 1. Sticky Nav                8          4           5        17     REMOVE
 * 2. Hero                      8          7           6        21     REWRITE
 * 3. Problem ("Sound fam?")    9          9           7        25     KEEP
 * 4. How It Works              8          7           6        21     REWRITE
 * 5. Services ("What You Get") 6          7           5        18     REWRITE
 * 6. Portfolio Teaser          7          2           1        10     REMOVE
 * 7. Pricing                   4          6           4        14     REWRITE
 * 8. Custom Build Section      2          3           1         6     REMOVE
 * 9. FAQ                       8          8           6        22     KEEP
 * 10. Final CTA                9          9           7        25     KEEP
 * 11. Footer                   7          2           1        10     REWRITE
 * ───────────────────────────────────────────────────────────────────────
 * AVERAGE: 18.1/30
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * BOTTOM-LINE ASSESSMENT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. SINGLE BIGGEST CONVERSION KILLER:
 *    All CTAs point to WhatsApp instead of the Calendly discovery call.
 *    "Get Started on WhatsApp" implies a casual chat — it does not set the
 *    expectation of a structured discovery call. Cold traffic needs a clear,
 *    singular action. Right now the page asks visitors to start a WhatsApp
 *    conversation with a stranger — that's high friction. "Book a free 20-min
 *    call" is lower friction because it's a defined appointment with a clear
 *    end time. Fix this BEFORE touching layout or copy.
 *
 * 2. SINGLE STRONGEST ELEMENT WORTH KEEPING:
 *    The Problem section ("Sound familiar?"). Three specific, emotionally
 *    accurate pain points that any Nigerian SME seller will nod along to:
 *    missed WhatsApps, Instagram comment overwhelm, repetitive answers.
 *    This section does what cold traffic needs: it says "we see you, we
 *    understand your day" before asking for anything. Keep the structure,
 *    sharpen the copy, make it the second thing they see after the hero.
 *
 * 3. CRITICAL MISSING SECTION:
 *    SOCIAL PROOF — real testimonials from named Nigerian business owners
 *    with photos, specific results, and recognizable context. Cold paid
 *    traffic from influencer ads has NOT been warmed by the influencer's
 *    personal endorsement the way organic referrals are. The page must build
 *    trust internally. A "20+ projects" claim means nothing. What works:
 *    > "I was missing 15 orders a week because I couldn't reply to everyone.
 *      UltimaSpark set me up in 4 days and now every WhatsApp gets answered
 *      instantly. I've made ₦340K extra in the last month alone."
 *      — Amara O., Hair Vendor, Lagos
 *    This section should appear after How It Works and BEFORE any pricing.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROPOSED REBUILD STRUCTURE (7 sections, down from 11)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *    1. HERO            — Outcome-first hook + single Calendly CTA
 *    2. PROBLEM          — 3 pain cards (keep structure, sharpen copy)
 *    3. HOW IT WORKS     — 3-step flow with benefit-first phrasing
 *    4. SERVICES         — 3 punchy cards (no subgroups, no hover fx)
 *    5. TESTIMONIALS     — 3 named Nigerian sellers + photos + results
 *    6. PRICING          — 2 plans (Basic / Complete), simple binary choice
 *    7. FAQ              — Same 5 questions, moved before pricing for trust
 *    8. FINAL CTA        — Urgency headline + Calendly button
 *    9. FOOTER           — © 2026 UltimaSpark. (nothing else)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * STATUS: AUDIT COMPLETE — AWAITING USER REVIEW BEFORE CODE CHANGES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

"use client";

import { useState } from "react";
import { CustomBuildSection } from "./_components/CustomBuildSection";

// WhatsApp pre-filled message constants — contextual per location
const HERO_CTA_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27d%20like%20to%20automate%20my%20business";
const HERO_SECONDARY_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Ultimaspark";
const SOLUTION_CTA_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20not%20sure%20which%20service%20I%20need.%20Can%20you%20help%3F";
const WEBSITE_ONLY_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website";
const STARTER_PLAN_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20the%20Starter%20package";
const GROWTH_PLAN_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20the%20Growth%20package";
const FULLSTACK_PLAN_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20interested%20in%20the%20Full%20Stack%20package";
const PLAN_HELP_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%20need%20help%20choosing%20a%20plan";
const FINAL_CTA_PRIMARY_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%27m%20ready%20to%20get%20started%20with%20Ultimaspark";
const FINAL_CTA_SECONDARY_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%20want%20to%20know%20more%20before%20I%20decide";
const FLOATING_WHATSAPP_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%20saw%20your%20ad%20and%20I%27m%20interested%20in%20Ultimaspark";
const FAQ_WHATSAPP_LINK =
  "https://wa.me/2349126914795?text=Hi%2C%20I%20have%20a%20question%20about%20Ultimaspark";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-spark">
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

export default function AgencyPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* STICKY TOP BAR — 48px, mobile-first */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between bg-gray-900/95 px-4 backdrop-blur">
        {/* Logo only, no link */}
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-spark text-xs font-bold text-primary">
            ⚡
          </span>
          <span className="text-sm font-bold text-white">UltimaSpark</span>
        </div>

        {/* Single CTA button → WhatsApp */}
        <a
          href={HERO_SECONDARY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-spark px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-spark/80"
      >
        Message Us
      </a>
      </header>

      {/* HERO */}
      <section className="px-4 pb-16 pt-20 md:pb-20 md:pt-28">
        {/* Line 1 — trust label */}
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-spark">
          Trusted by Nigerian Businesses
        </p>

        {/* Headline */}
        <h1 className="mx-auto mt-4 max-w-2xl text-center text-[36px] font-extrabold leading-[1.1] tracking-tight text-white md:text-[56px] md:leading-[1.05]">
          Your Customers Are Messaging You. Are You Replying?
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-gray-300 md:text-base">
          We build websites and AI systems that reply to every WhatsApp
          message, follow up every Instagram comment, and capture every
          lead — 24 hours a day, without you lifting a finger.
        </p>

        {/* Social proof bar */}
        <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <span className="text-spark">⚡</span> 20+ Projects Shipped
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="text-spark">⭐</span> 5+ Businesses Automated
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="text-spark">🇳🇬</span> Nigeria-Based Team
          </span>
        </div>

        {/* Primary CTA */}
        <div className="mx-auto mt-7 flex max-w-sm flex-col items-center gap-3">
          <a
            href={HERO_CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-spark px-8 py-4 text-center text-base font-semibold text-primary shadow-lg shadow-spark/20 transition hover:bg-spark/80 active:scale-[0.98]"
          >
            Book Your Free Strategy Call →
          </a>
          <p className="text-xs text-gray-500">
            Free. 20 minutes. No commitment.
          </p>

          {/* Secondary CTA — WhatsApp fallback */}
          <a
            href={HERO_SECONDARY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 transition hover:text-spark"
          >
            Prefer WhatsApp? Chat with us →
          </a>
        </div>
      </section>

      {/* PAIN AMPLIFICATION — "Sound familiar?" */}
      <section className="bg-white px-4 py-16 md:py-24">
        {/* Section heading */}
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          Sound familiar?
        </p>

        {/* 3 pain cards */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
          {[
            {
              icon: "💬",
              headline: "Customers message at midnight",
              body: "And by morning they've already bought from someone else.",
            },
            {
              icon: "📸",
              headline: "100 comments. Zero follow-ups.",
              body: "Every 'how much?' under your post is a sale you never closed.",
            },
            {
              icon: "📋",
              headline: "Leads scattered everywhere",
              body: "WhatsApp. DMs. Comments. You can't track any of it.",
            },
          ].map((card) => (
            <div
              key={card.headline}
              className="rounded-xl border border-gray-100 bg-gray-50/80 p-6"
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="mt-3 text-base font-bold text-primary">
                {card.headline}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing bold line — no CTA */}
        <p className="mx-auto mt-10 max-w-lg text-center text-lg font-semibold text-primary md:text-xl">
          This is not a discipline problem. It's a systems problem. We fix
          systems.
        </p>

        {/* Testimonial */}
        <div className="mx-auto mt-12 max-w-[600px] rounded-2xl bg-gray-50/80 px-6 py-8 text-center">
          <span className="text-[64px] font-serif leading-none text-spark select-none">
            &ldquo;
          </span>
          <p className="-mt-4 text-[16px] italic leading-relaxed text-primary md:text-[18px]">
            Before Ultimaspark, I was losing customers every night because I
            couldn&apos;t reply fast enough. Now my WhatsApp replies itself and
            I wake up to confirmed orders.
          </p>
          <p className="mt-4 text-sm not-italic text-gray-400">
            &mdash; BelleHairs Owerri, Lagos
          </p>
        </div>
      </section>

      {/* SOLUTION — "Here's What We Build For You" */}
      <section className="px-4 py-16 md:py-24">
        {/* Section heading */}
        <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
          Here's What We Build For You
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-400">
          Everything works together. Nothing requires your technical knowledge.
        </p>

        {/* 4 service rows — no cards, clean rows */}
        <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/10">
          {[
            {
              num: "01",
              title: "WhatsApp AI Chatbot",
              desc: "Replies to every customer message instantly, 24/7. Even at 3am on a Sunday.",
            },
            {
              num: "02",
              title: "Instagram & Facebook Auto-DM",
              desc: "Every comment on your posts gets followed up automatically with your catalog and WhatsApp link.",
            },
            {
              num: "03",
              title: "Product Catalog Website",
              desc: "A clean mobile-first website where every product has a WhatsApp order button built in.",
            },
            {
              num: "04",
              title: "Lead Management Dashboard",
              desc: "Every enquiry from WhatsApp, Instagram, and Facebook in one place. No more scattered leads.",
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <span className="shrink-0 pt-0.5 text-2xl font-extrabold text-spark">
                {item.num}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-400">Not sure which one you need?</p>
          <a
            href={SOLUTION_CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-spark px-7 py-3 text-sm font-semibold text-primary shadow-lg shadow-spark/20 transition hover:bg-spark/80"
          >
            Let&apos;s figure it out together →
          </a>
        </div>
      </section>

      {/* SOCIAL PROOF — "Real Businesses. Real Results." */}
      <section className="bg-white px-4 py-16 md:py-24">
        {/* Section heading */}
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          Real Businesses. Real Results.
        </p>

        {/* BelleHairs Case Study */}
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Label bar */}
          <div className="border-b border-gray-100 bg-spark/10 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-spark">
              Client Work
            </span>
          </div>

          {/* Business name */}
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="text-lg font-bold text-primary">BelleHairs Owerri</p>
          </div>

          {/* Before / After columns */}
          <div className="grid divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Before */}
            <div className="px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Before
              </p>
              <ul className="space-y-2.5">
                {[
                  "80+ unanswered WhatsApp messages daily",
                  "No catalog website",
                  "Leads lost every night",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                After
              </p>
              <ul className="space-y-2.5">
                {[
                  "AI replies every message within seconds",
                  "Catalog live with WhatsApp checkout",
                  "Every lead tracked in one dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 shrink-0 text-spark">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Result line — the money shot */}
          <div className="border-t border-gray-100 px-6 py-5 text-center">
            <p className="text-xl font-bold text-spark md:text-2xl">
              24/7 automated — zero messages missed
            </p>
          </div>
        </div>

        {/* Project thumbnails — 3 more clients */}
        <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
          {[
            {
              name: "MikeNazy Merchandize",
              desc: "Fashion E-commerce Store",
              outcome: "WhatsApp checkout live — orders without a payment gateway",
              url: "https://mikenazymerchandize.lovable.app",
            },
            {
              name: "NaijaSubHub",
              desc: "VTU Platform",
              outcome: "24/7 automated data and airtime sales with instant delivery",
              url: "https://naijasubhub.lovable.app",
            },
            {
              name: "Octra",
              desc: "Blockchain Ecosystem Site",
              outcome: "Launch landing page for a privacy-first Layer-1 blockchain",
              url: "https://octra-three.vercel.app",
            },
          ].map((project) => (
            <div
              key={project.name}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-5"
            >
              <p className="text-sm font-semibold text-primary">{project.name}</p>
              <p className="mt-1 text-xs text-gray-500">{project.desc}</p>
              <p className="mt-1 text-[13px] italic text-gray-400">{project.outcome}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs font-medium text-spark transition hover:underline"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>

        {/* Portfolio link */}
        <div className="mt-8 text-center">
          <a
            href="/agency/portfolio"
            className="text-sm font-medium text-gray-500 transition hover:text-spark"
          >
            See all 20+ projects we&apos;ve shipped →
          </a>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-16 md:py-24">
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          Transparent Pricing
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold text-white sm:text-3xl">
          Pick Your Package
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-400">
          No hidden fees. No long-term contracts. Cancel anytime with 30 days notice.
        </p>

        <div className="mx-auto mt-12 grid max-w-6xl items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Website Only",
              tag: "Best for: businesses that just need a professional site",
              setup: "From ₦80,000",
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
              ctaLink: WEBSITE_ONLY_LINK,
            },
            {
              name: "Starter",
              tag: "Best for: sellers who want 24/7 replies",
              setup: "From ₦200,000",
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
              ctaLink: STARTER_PLAN_LINK,
            },
            {
              name: "Growth",
              tag: "Best for: combining a website with automation",
              setup: "From ₦300,000",
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
              ctaLink: GROWTH_PLAN_LINK,
            },
            {
              name: "Full Stack",
              tag: "Complete website + automation",
              setup: "From ₦600,000",
              retainer: "₦80,000 – ₦120,000/month",
              included: [
                "Everything in Growth",
                "Full e-commerce store with WhatsApp checkout",
                "Lead Management Dashboard",
                "10-day setup",
              ],
              notIncluded: [],
              popular: false,
              premium: true,
              ctaLink: FULLSTACK_PLAN_LINK,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 transition ${
                plan.popular
                  ? "scale-[1.03] border-spark bg-gray-800/60 shadow-[0_0_40px_rgba(0,201,177,0.12)]"
                  : plan.premium
                    ? "border-spark/60 bg-gray-800/40 shadow-[0_0_30px_rgba(0,201,177,0.15)]"
                    : "border-white/10 bg-gray-800/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 rounded-full bg-spark px-3 py-1 text-xs font-bold text-primary shadow-lg">
                  Most Popular
                </span>
              )}
              {plan.premium && (
                <span className="absolute -top-3 right-4 rounded-full border border-spark/60 bg-gray-900 px-3 py-1 text-xs font-bold text-spark shadow-lg">
                  Flagship
                </span>
              )}
              <p className="text-xs font-semibold text-spark">{plan.tag}</p>
              <h3 className={`mt-2 font-bold text-white ${plan.premium ? "text-2xl" : "text-xl"}`}>{plan.name}</h3>
              <p className={`mt-2 font-extrabold text-white ${plan.premium ? "text-3xl" : "text-2xl"}`}>{plan.setup}</p>
              <p className="text-xs text-gray-400">setup fee</p>
              <p className="mt-1 text-sm text-gray-400">{plan.retainer}</p>

              <ul className="mt-5 space-y-2">
                {plan.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 text-spark">✓</span>
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
                    ? "bg-spark text-primary hover:bg-spark/80"
                    : "border border-white/20 text-white hover:border-spark hover:text-spark"
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
            href={PLAN_HELP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-spark transition hover:underline"
          >
            Chat with us on WhatsApp →
          </a>
        </p>
      </section>

      {/* CUSTOM BUILD PRICING — tabbed pricing table */}
      <CustomBuildSection />

      {/* All builds include line */}
      <p className="bg-bg px-4 pb-8 text-center text-xs text-gray-400">
        All builds include: mobile-first design · WhatsApp integration · 30
        days post-launch support · free hosting on our infrastructure
      </p>

      {/* FAQ */}
      <section className="px-4 py-16 md:py-24">
        <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          Questions We Get Asked Every Time
        </p>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-white/10">
          {[
            {
              q: "I'm not a tech person. Can I still use this?",
              a: "Yes — that's exactly who we build for. You never touch any of the technology. You just use the result. We handle everything from setup to maintenance.",
            },
            {
              q: "Will this work for my type of business?",
              a: "If your customers contact you on WhatsApp, Instagram, or Facebook — yes. We've built for hair brands, fashion sellers, food vendors, event planners, VTU platforms, and more.",
            },
            {
              q: "What happens to my existing WhatsApp number?",
              a: "We set up a dedicated business number — your personal WhatsApp is never touched or affected.",
            },
            {
              q: "How long before it's live?",
              a: "Website builds: 5–7 days. Automation builds: 3–5 days. Full Stack: 10 days. You approve everything before we go live.",
            },
            {
              q: "What if I want to cancel?",
              a: "30 days notice, no penalties, no long contracts. We earn your business every month.",
            },
            {
              q: "Is this just for Lagos or big businesses?",
              a: "We're Nigeria-based and we work with businesses everywhere — Owerri, Enugu, Port Harcourt, Abuja, Lagos, and beyond. Business size doesn't matter.",
            },
            {
              q: "Can I just get a website without the automation?",
              a: "Yes. Our Website Only builds start at ₦80,000. You can always add automation later as your business grows.",
            },
          ].map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gray-900 px-4 py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-lg text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
          Every Day You Wait Is Another Day of Missed Sales.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-300">
          The businesses winning right now aren&apos;t working harder. They
          built a system. Let us build yours.
        </p>

        <p className="mt-5 text-xs text-gray-500">
          We take on a limited number of new clients per month to maintain
          quality.
        </p>

        <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3">
          <a
            href={FINAL_CTA_PRIMARY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-spark px-8 py-4 text-center text-base font-semibold text-primary shadow-lg shadow-spark/20 transition hover:bg-spark/80 active:scale-[0.98]"
          >
            Book Your Free Strategy Call Now →
          </a>

          <a
            href={FINAL_CTA_SECONDARY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-white/30 py-3.5 text-center text-sm font-medium text-white transition hover:border-spark hover:text-spark"
          >
            Chat on WhatsApp First
          </a>
        </div>

        <div className="mx-auto mt-6 flex max-w-xs flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>✓ Free 20-minute call</span>
          <span>✓ No commitment required</span>
          <span>✓ Nigeria-based team</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 px-4 py-8 text-center">
        <p className="text-xs text-gray-500">
          &copy; 2025 UltimaSpark &middot; AI Automation for Sellers &middot;
          Built in Nigeria 🇳🇬
        </p>
      </footer>

      {/* FLOATING WHATSAPP — fixed bottom-right */}
      <a
        href={FLOATING_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/25 transition-transform hover:scale-110 active:scale-95"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
        aria-label="Chat with us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="h-7 w-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
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
