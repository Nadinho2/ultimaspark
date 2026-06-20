import Link from "next/link";
import { getMarketingCourses } from "@/lib/courses";
import Testimonials from "@/components/Testimonials";

const CALENDAR_LINK = "https://calendly.com/ultimaspark/discovery";
const WHATSAPP_LINK = "https://wa.me/2349126914795";

export default async function Home() {
  const courses = await getMarketingCourses();

  return (
    <>
      {/* AGENCY HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#0D1B5E] px-4 pt-20 pb-16 md:min-h-screen md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00C9B1]/8 blur-[140px]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D1B5E] to-transparent" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00C9B1] text-lg">
              💬
            </span>
            <span className="text-sm font-bold tracking-wider text-[#00C9B1]">
              ULIMTASPARK
            </span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            We Build Websites and AI Automation Systems{" "}
            <span className="text-[#00C9B1]">for African Businesses</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            So you sell more, work less, and never miss a customer again.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-[#00C9B1] px-8 py-3.5 text-center text-sm font-semibold text-[#0D1B5E] shadow-lg shadow-[#00C9B1]/20 transition hover:bg-[#00b4a0] sm:w-auto"
            >
              Book a Free Discovery Call →
            </a>
          </div>
          <p className="mt-3 text-sm text-gray-400">20 minutes. No commitment.</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-gray-400 underline-offset-2 transition hover:text-[#00C9B1] hover:underline"
          >
            Or chat with us on WhatsApp
          </a>
        </div>
      </section>

      {/* AGENCY + ACADEMY CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* AGENCY CARD */}
          <div className="group rounded-2xl border border-[#00C9B1]/20 bg-[#0D1B5E]/30 p-8 transition hover:border-[#00C9B1]/50 hover:shadow-[0_0_40px_rgba(0,201,177,0.06)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00C9B1]/10">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-white">UltimaSpark Agency</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
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
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
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

      {/* COURSE CARDS (inside Academy context) */}
      {courses.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-spark">
              Academy Courses
            </p>
            <h3 className="mt-2 text-xl font-bold text-primary">
              Available programs
            </h3>
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

      {/* TESTIMONIALS — shared across both */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Testimonials />
      </div>
    </>
  );
}
