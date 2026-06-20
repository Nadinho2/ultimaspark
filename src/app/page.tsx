import Link from "next/link";
import { getMarketingCourses } from "@/lib/courses";
import Testimonials from "@/components/Testimonials";

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
