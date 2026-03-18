import Link from "next/link";
import { getCourses } from "@/lib/courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
        Courses
      </h1>
      <p className="mt-4 max-w-xl text-sm text-text-secondary sm:text-base">
        Explore all UltimaSpark Academy tracks. Each course is a focused, 6-week
        experience designed to help you ship real work.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {courses.map((course) => {
          const href =
            course.slug === "ai-automation"
              ? "/ai-automation"
              : course.slug === "vibe-coding"
                ? "/vibe-coding"
                : `/courses/${course.slug}`;

          return (
            <article
              key={course.slug}
              className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {course.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] font-mono text-text-secondary">
                    {course.slug}
                  </span>
                  <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[11px] font-medium text-spark">
                    {course.weeks} weeks
                  </span>
                </div>
                <p className="mt-3 text-sm text-text-secondary">
                  {course.description}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={href}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  View course
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


