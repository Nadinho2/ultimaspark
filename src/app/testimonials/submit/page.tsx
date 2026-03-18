import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SubmitTestimonialForm } from "./submit-form";

export const metadata = {
  title: "Submit Testimonial",
};

export default async function SubmitTestimonialPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-2xl">
        <header className="space-y-3">
          <p className="inline-flex w-fit items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-spark">
            Testimonials
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Share Your UltimaSpark Experience
          </h1>
          <p className="text-sm text-text-secondary sm:text-base">
            Your testimonial helps future learners choose the right track. Submissions
            are reviewed before they appear publicly.
          </p>
        </header>

        <div className="mt-8 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <SubmitTestimonialForm />
        </div>
      </div>
    </section>
  );
}

