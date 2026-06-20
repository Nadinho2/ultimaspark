import Link from "next/link";
import { getMarketingCourses } from "@/lib/courses";
import Testimonials from "@/components/Testimonials";

const CALENDAR_LINK = "https://calendly.com/ultimaspark/discovery";
const WHATSAPP_LINK = "https://wa.me/2349126914795";

export default async function Home() {
  const courses = await getMarketingCourses();

  return (
    <>
      {/* ACADEMY HERO */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-spark/10 blur-[140px]" />
        </div>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-spark to-growth p-0.5 shadow-lg shadow-spark/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-bg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                  fill="url(#spark-gradient)"
                  stroke="url(#spark-gradient)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="spark-gradient" x1="4" y1="2" x2="21" y2="22">
                    <stop stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
            Ignite Your Future with{" "}
            <span className="bg-gradient-to-r from-spark to-growth bg-clip-text text-transparent">
              UltimaSpark Academy
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl">
            Master cutting-edge skills through intensive cohorts and hands-on,
            project-based learning — built for the next generation of creators.
          </p>
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
              AI automation
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-spark">
              Vibe coding
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-growth">
              6-week cohorts
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Explore Courses →
            </Link>
            <Link
              href="/our-goals"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-sm font-medium text-text-primary transition hover:border-spark hover:text-spark"
            >
              Our Goals
            </Link>
          </div>
        </div>
      </section>

      {/* AGENCY + ACADEMY CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* AGENCY CARD */}
          <div className="group rounded-2xl border border-[#00C9B1]/20 bg-gradient-to-br from-[#0D1B5E]/40 to-bg p-8 transition hover:border-[#00C9B1]/50 hover:shadow-[0_0_40px_rgba(0,201,177,0.06)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00C9B1]/10">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-[#00C9B1]">UltimaSpark Agency</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              We build AI automation systems that reply to every WhatsApp message
              and Instagram comment — 24/7 — so Nigerian SME sellers never miss a
              sale again. Setup in days. Cancel anytime.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                "WhatsApp AI Chatbot — 24/7 auto-replies",
                "Instagram & Facebook Comment Auto-DM",
                "Product Catalog Website with WhatsApp checkout",
                "Lead Management Dashboard",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-0.5 text-[#00C9B1]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/agency"
                className="inline-flex items-center justify-center rounded-full bg-[#00C9B1] px-6 py-2.5 text-sm font-semibold text-[#0D1B5E] transition hover:bg-[#00b4a0]"
              >
                Explore Agency Services →
              </Link>
              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition hover:border-[#00C9B1] hover:text-[#00C9B1]"
              >
                Book a Free Discovery Call
              </a>
            </div>
          </div>

          {/* ACADEMY CARD */}
          <div className="group rounded-2xl border border-white/10 bg-surface p-8 transition hover:border-primary/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.04)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl">🎓</span>
            </div>
            <h2 className="text-2xl font-bold text-primary">UltimaSpark Academy</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Master cutting-edge skills through intensive cohorts and hands-on,
              project-based learning — built for the next generation of creators
              and AI builders.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                "Intensive 6-week cohort programs",
                "Hands-on, project-based learning",
                "AI automation & vibe coding skills",
                "Eye-friendly sessions with clear progress",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-0.5 text-growth">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
              >
                Explore Courses →
              </Link>
              <Link
                href="/our-goals"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition hover:border-spark hover:text-spark"
              >
                View Our Goals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE CARDS */}
      {courses.length > 0 && (
        <section className="pt-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-spark">
              Available Programs
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary">
              Choose your path
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {courses.map((course) => {
              const href = `/courses/${course.slug}`;
              return (
                <div
                  key={course.slug}
                  className="group transform rounded-xl border border-border bg-surface p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
                    {course.title}
                  </h2>
                  <p className="mt-4 text-sm text-text-secondary sm:text-base">
                    {course.description}
                  </p>
                  <Link
                    href={href}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
                  >
                    Explore Course
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <div className="py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-spark">
            Testimonials
          </p>
          <h2 className="mt-2 text-2xl font-bold text-primary">
            What learners say
          </h2>
        </div>
        <Testimonials />
      </div>
    </>
  );
}
