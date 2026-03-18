import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/supabase/types";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "?";
}

export const dynamic = "force-dynamic";

export default async function Testimonials() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("UltimaSparkAcademyTestimonial")
    .select("name, role, avatar_url, content, rating, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  const testimonials = (data ?? []) as Testimonial[];

  if (error || testimonials.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-4xl font-bold text-primary">
          What Our Students Say
        </h2>
        <div className="mt-12">
          <Card className="border-border bg-surface shadow-sm">
            <CardHeader className="pb-4">
              <p className="text-center text-sm font-semibold text-text-secondary">
                No testimonials yet
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-text-secondary">
                Be the first to share your experience! Submit one here.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/testimonials/submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Submit testimonial
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="mb-12 text-center text-4xl font-bold text-primary">
        What Our Students Say
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((t) => {
          const initials = getInitials(t.name);
          const rating = typeof t.rating === "number" ? t.rating : 0;

          return (
            <Card
              key={t.id}
              className="border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md"
            >
              <CardHeader className="p-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    {t.avatar_url ? (
                      <AvatarImage src={t.avatar_url} alt={t.name} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">
                      {t.name}
                    </p>
                    <p className="truncate text-sm text-text-secondary">
                      {t.role ?? "Student"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-5">
                <p className="mt-4 text-text-primary italic">"{t.content}"</p>

                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < rating
                          ? "text-spark fill-current"
                          : "text-text-secondary fill-transparent"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-text-secondary">
                  Submitted {formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

