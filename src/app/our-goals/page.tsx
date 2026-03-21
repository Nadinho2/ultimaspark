import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Goals | UltimaSpark Academy",
  description:
    "Where UltimaSpark Academy is headed — a transparent roadmap of milestones in curriculum, platform, and community.",
};

const phases = [
  {
    period: "Foundation & clarity",
    range: "Shipped • ongoing",
    summary:
      "Establish a calm, readable learning environment with authentication, dashboards, progress tracking, and admin tools so every learner knows where they stand.",
    milestones: [
      "Secure accounts and role-based admin workflows",
      "Course structure with weeks, topics, and drip-friendly unlocks",
      "Certificates, quizzes, and email notifications learners can trust",
    ],
  },
  {
    period: "Depth & flexibility",
    range: "In progress",
    summary:
      "Expand how content is delivered — subscription vs cohort paths, live session recordings per cohort, and richer media per topic so teaching matches real class formats.",
    milestones: [
      "Multi-cohort live video management tied to curriculum topics",
      "Marketing and legal pages that reflect how we actually operate",
      "Continuous polish on accessibility, performance, and mobile layouts",
    ],
  },
  {
    period: "Scale & community",
    range: "Next horizon",
    summary:
      "Grow a sustainable community around shipping: more peer visibility, better feedback loops, and content that stays current as tools evolve.",
    milestones: [
      "Stronger community touchpoints (events, showcases, alumni stories)",
      "Deeper integrations where they measurably help learners",
      "Regular curriculum reviews as AI and automation stacks change",
    ],
  },
];

export default function OurGoalsPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-spark">
          Roadmap
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
          Our Goals
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          A living picture of what we are building — not a promise of fixed
          dates, but a clear sequence of priorities: solid foundations first,
          then depth, then community at scale. We update this as we ship.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-4xl">
        <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-spark/60 via-primary/40 to-growth/50 md:left-8 md:block" />

        <div className="space-y-16 md:space-y-20">
          <article className="relative md:pl-20">
            <div className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-spark bg-surface md:flex md:items-center md:justify-center md:left-[26px]">
              <span className="h-2 w-2 rounded-full bg-spark" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="relative aspect-[21/9] w-full max-h-[280px]">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
                  alt="Planning and strategy for learning goals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                  {phases[0]!.period}
                </h2>
                <p className="mt-1 text-sm font-medium text-spark">
                  {phases[0]!.range}
                </p>
                <p className="mt-4 text-text-secondary">{phases[0]!.summary}</p>
                <ul className="mt-4 space-y-2 border-l-2 border-growth/40 pl-4 text-sm text-text-secondary">
                  {phases[0]!.milestones.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="relative md:pl-20">
            <div className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-primary bg-surface md:flex md:items-center md:justify-center md:left-[26px]">
              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="relative aspect-[21/9] w-full max-h-[280px]">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                  alt="Team collaboration toward shared learning goals"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                  {phases[1]!.period}
                </h2>
                <p className="mt-1 text-sm font-medium text-spark">
                  {phases[1]!.range}
                </p>
                <p className="mt-4 text-text-secondary">{phases[1]!.summary}</p>
                <ul className="mt-4 space-y-2 border-l-2 border-growth/40 pl-4 text-sm text-text-secondary">
                  {phases[1]!.milestones.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="relative md:pl-20">
            <div className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-growth bg-surface md:flex md:items-center md:justify-center md:left-[26px]">
              <span className="h-2 w-2 rounded-full bg-growth" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="relative aspect-[21/9] w-full max-h-[280px]">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80"
                  alt="Community and growth for learners"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                  {phases[2]!.period}
                </h2>
                <p className="mt-1 text-sm font-medium text-spark">
                  {phases[2]!.range}
                </p>
                <p className="mt-4 text-text-secondary">{phases[2]!.summary}</p>
                <ul className="mt-4 space-y-2 border-l-2 border-growth/40 pl-4 text-sm text-text-secondary">
                  {phases[2]!.milestones.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-border bg-bg/40 p-8 text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Principles behind the roadmap
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          We prefer <span className="font-medium text-text-primary">fewer, finished features</span>{" "}
          over a long list of half-baked ones. We prioritize{" "}
          <span className="font-medium text-text-primary">learner trust</span>{" "}
          (clear enrollment, honest progress, working emails) before growth
          hacks. When trade-offs appear, we bias toward{" "}
          <span className="font-medium text-text-primary">clarity and maintainability</span>{" "}
          so the platform stays fast and understandable as we add more.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/about"
            className="inline-flex rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition hover:border-spark hover:text-spark"
          >
            About Us
          </Link>
          <Link
            href="/courses"
            className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Explore courses
          </Link>
        </div>
      </div>
    </section>
  );
}
