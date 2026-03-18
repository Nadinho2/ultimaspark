import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/supabase/types";
import { TestimonialsModeration } from "@/components/admin/TestimonialsModeration";

const TESTIMONIALS_TABLE = "UltimaSparkAcademyTestimonial";

export const metadata = {
  title: "Testimonials Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string | undefined) ?? null;
  if (String(role ?? "").toLowerCase().trim() !== "admin") {
    redirect("/dashboard");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-primary">Manage Testimonials</h1>
          <p className="text-sm text-text-secondary">Error loading testimonials</p>
        </div>
      </section>
    );
  }

  const testimonials = (data ?? []) as Testimonial[];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="mb-8 text-3xl font-bold text-primary">
            Manage Testimonials
          </h1>
          <p className="text-sm text-text-secondary sm:text-base">
            Review and approve learner testimonials before they appear publicly.
          </p>
          <p className="text-xs text-text-secondary">
            Found {testimonials.length} testimonial{testimonials.length === 1 ? "" : "s"}.
          </p>
        </header>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <TestimonialsModeration testimonials={testimonials} />
        </div>

        {testimonials.length === 0 && (
          <div className="rounded-xl border border-spark/30 bg-spark/10 p-4 text-sm text-text-primary">
            If you submitted testimonials successfully but nothing shows here, check Supabase
            RLS/permissions for <span className="font-semibold">SELECT</span> on
            <span className="font-mono">UltimaSparkAcademyTestimonial</span> for the anon role.
          </div>
        )}
      </div>
    </section>
  );
}

