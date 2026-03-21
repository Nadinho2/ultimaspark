import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | UltimaSpark Academy",
  description:
    "Learn who we are, how we teach, and why UltimaSpark Academy exists — builder-first education for AI, automation, and modern software skills.",
};

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-spark">
          About Us
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
          Building skills that ship
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          UltimaSpark Academy is a learning studio for people who want more than
          theory — they want outcomes. We combine structured cohorts, clear
          milestones, and real projects so you can move from curiosity to
          capability without drowning in noise.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-10 text-base leading-relaxed text-text-secondary">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Our mission
          </h2>
          <p className="mt-3">
            Technology is moving faster than traditional curricula can follow.
            Our mission is to close that gap with practical education: short
            cycles, honest feedback, and tools you can use on day one at work or
            in your own ventures. We believe the best way to learn is to build
            — agents, workflows, apps, and automations that mirror what
            professionals actually ship.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Why &ldquo;UltimaSpark&rdquo;
          </h2>
          <p className="mt-3">
            <span className="font-medium text-text-primary">Ultima</span> stands
            for the highest standard we hold for our learners: clarity,
            consistency, and follow-through.
            <span className="font-medium text-text-primary"> Spark</span> is the
            moment understanding clicks — when a concept stops feeling abstract
            and becomes something you can use. Together they describe our
            promise: rigorous learning that still feels human, warm, and
            motivating.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            How we teach
          </h2>
          <p className="mt-3">
            Courses are organized in weeks with explicit outcomes. You get
            pre-recorded libraries for self-paced depth, optional cohort tracks
            for live energy, and progress tracking so you always know what is
            next. We emphasize readability: fewer buzzwords, more structure;
            fewer promises, more checkpoints. Whether you are upskilling for a
            role or building a side project, the path should be obvious.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Who we are for
          </h2>
          <p className="mt-3">
            We work best with self-starters who are comfortable experimenting —
            developers expanding into AI, founders automating operations,
            creators who code, and professionals who want leverage without a
            four-year detour. You do not need to be an expert; you do need to
            be willing to try, break, and fix things in the open.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Values we practice
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 marker:text-spark">
            <li>
              <span className="font-medium text-text-primary">Clarity over hype</span>{" "}
              — we explain trade-offs, not just headlines.
            </li>
            <li>
              <span className="font-medium text-text-primary">Respect for your time</span>{" "}
              — tight lessons, clear drip schedules, no filler.
            </li>
            <li>
              <span className="font-medium text-text-primary">Integrity</span> — honest
              difficulty levels, transparent enrollment, and support when you are
              stuck.
            </li>
            <li>
              <span className="font-medium text-text-primary">Community</span> — cohorts
              and testimonials are part of how we keep standards high and spirits
              up.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Looking ahead
          </h2>
          <p className="mt-3">
            We are continuously improving curriculum, tooling, and learner
            experience — from certificates and quizzes to live sessions and
            content drip. Our public roadmap-style goals live on{" "}
            <Link
              href="/our-goals"
              className="font-medium text-primary underline-offset-4 hover:text-spark hover:underline"
            >
              Our Goals
            </Link>
            ; we share direction openly so you can decide if we are the right
            partner for your journey.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-text-primary">
            Project-first
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Weekly deliverables and real artifacts you can show in a portfolio
            or at work.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-text-primary">
            Structured paths
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Topics, subtopics, and progress tracking so you always know where you
            stand.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-text-primary">
            Modern stack
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            AI agents, automation, and creative coding workflows that match
            today&apos;s tools.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-surface/80 p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-text-primary">
          Ready to explore courses?
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          View all courses
        </Link>
      </div>
    </section>
  );
}
