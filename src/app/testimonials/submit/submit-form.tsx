"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TESTIMONIALS_TABLE = "UltimaSparkAcademyTestimonial";

export function SubmitTestimonialForm() {
  const router = useRouter();
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!user) {
    // Server page already redirects; this is just a safety net.
    return null;
  }

  const contentTrimmed = content.trim();
  const isContentValid = contentTrimmed.length >= 20;
  const isRatingValid = Number.isFinite(rating) && rating >= 1 && rating <= 5;
  const canSubmit = isContentValid && isRatingValid && !isPending;

  const displayName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const name = displayName || user.username || "Student";

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setSuccess(null);

        startTransition(async () => {
          try {
            const supabase = createSupabaseBrowserClient();
            const { error: insertError } = await supabase
              .from(TESTIMONIALS_TABLE)
              .insert([
                {
                  clerk_user_id: user.id,
                  name,
                  role: role.trim() || "Student",
                  content: contentTrimmed,
                  rating: Number(rating),
                  status: "pending",
                  avatar_url: user.imageUrl ?? null,
                },
              ]);

            if (insertError) {
              setError(insertError.message);
              return;
            }

            setSuccess("Submitted! Await admin approval.");
            setContent("");
            setRole("");
            setRating(5);

            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 800);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Failed to submit testimonial",
            );
          }
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary">
          Your testimonial
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What changed for you? What did you build? What would you tell a friend?"
          className="min-h-32"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{isContentValid ? "Looks good" : "Minimum 20 characters"}</span>
          <span className={isContentValid ? "text-growth" : ""}>
            {contentTrimmed.length}/20
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">
            Rating (1–5)
          </label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          {!isRatingValid && (
            <p className="text-xs text-spark">Rating must be between 1 and 5.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">
            Your role (optional)
          </label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder='e.g. "AI Automation Student"'
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
          We may lightly edit for clarity. No spam—just real outcomes.
        </p>

        <Button type="submit" disabled={!canSubmit} className="h-10 px-6">
          {isPending ? "Submitting..." : "Submit testimonial"}
        </Button>
      </div>

      {success && (
        <div className="rounded-lg border border-growth/30 bg-growth/10 p-3 text-sm text-growth">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-spark/30 bg-spark/10 p-3 text-sm text-text-primary">
          <span className="font-semibold text-spark">Error:</span> {error}
        </div>
      )}
    </form>
  );
}

