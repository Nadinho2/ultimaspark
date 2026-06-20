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

      {/* ACADEMY SECTION */}
      <section className="py-12 sm:py-16 lg:py-20">

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
    </>
  );
}

