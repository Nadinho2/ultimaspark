import Link from "next/link";
import { getMarketingCourses } from "@/lib/courses";
import Testimonials from "@/components/Testimonials";

export default async function Home() {
  const courses = await getMarketingCourses();

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Ignite Your Future with UltimaSpark Academy
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl">
          Master cutting-edge skills through intensive cohorts and hands-on,
          project-based learning — built for the next generation of creators.
        </p>
        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            Eye-friendly sessions
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-spark">
            Soft spark highlights
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-growth">
            Clear progress signals
          </span>
        </div>
      </div>

      {courses.length > 0 && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
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
      )}

      <div className="mt-16">
        <Testimonials />
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-7 py-2.5 text-sm font-medium text-text-primary shadow-sm transition hover:border-spark hover:text-spark"
        >
          Join the Waitlist
        </button>
      </div>
    </section>
  );
}

