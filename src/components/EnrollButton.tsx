"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import type { CourseEnrollmentSnapshot } from "@/lib/course-enrollment";
import { requestEnrollment } from "@/app/actions/pendingEnrollment";

type EnrollButtonProps = {
  courseSlug: string;
  enrollment: CourseEnrollmentSnapshot;
  className?: string;
};

export function EnrollButton({
  courseSlug,
  enrollment,
  className,
}: EnrollButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentType, setEnrollmentType] = useState<"subscription" | "cohort">(
    "subscription",
  );
  const [preferredCohort, setPreferredCohort] = useState("");

  const { isSignedIn, isEnrolled, isPendingApproval } = enrollment;

  const handleClick = () => {
    if (!isSignedIn) {
      const returnPath = pathname || "/";
      router.push(
        `/sign-in?redirect_url=${encodeURIComponent(returnPath)}`,
      );
      return;
    }

    if (isEnrolled || isPendingApproval) return;

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", courseSlug);
      formData.append("enrollmentType", enrollmentType);
      if (preferredCohort.trim()) {
        formData.append("preferredCohort", preferredCohort.trim());
      }

      const result = await requestEnrollment(formData);

      if (result.success) {
        setMessage(
          result.message ??
            "Request submitted – pending admin approval. Check email for updates.",
        );
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const label = isPending ? "Submitting..." : "Request Enrollment";

  return (
    <div className="space-y-2">
      {isEnrolled && (
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center rounded-full border border-growth/50 bg-growth/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-growth"
            aria-label="You are enrolled in this course"
          >
            Enrolled
          </span>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View course videos
          </Link>
        </div>
      )}
      {!isEnrolled && !isPendingApproval && (
        <div className="max-w-xs space-y-1">
          <label className="block text-xs font-medium text-text-secondary">
            Enrollment type
          </label>
          <select
            value={enrollmentType}
            onChange={(e) =>
              setEnrollmentType(
                e.target.value === "cohort" ? "cohort" : "subscription",
              )
            }
            className="h-9 w-full rounded-md border border-border bg-surface px-2 text-xs text-text-primary outline-none focus:border-spark"
          >
            <option value="subscription">
              Subscription (full pre-recorded library)
            </option>
            <option value="cohort">
              Cohort (live session recordings only)
            </option>
          </select>
          {enrollmentType === "cohort" && (
            <input
              value={preferredCohort}
              onChange={(e) => setPreferredCohort(e.target.value)}
              placeholder="Preferred cohort (optional, e.g. ai-automation-apr-2026)"
              className="mt-2 h-9 w-full rounded-md border border-border bg-surface px-2 text-xs text-text-primary outline-none focus:border-spark"
            />
          )}
        </div>
      )}
      {!isEnrolled && !isPendingApproval && (
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          className={cn(
            "inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70",
            className,
          )}
        >
          {label}
        </button>
      )}
      {isPendingApproval && (
        <span
          className="inline-flex items-center rounded-full border border-spark/50 bg-spark/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-spark"
          aria-label="Enrollment pending approval"
        >
          {label}
        </span>
      )}
      {message && !isEnrolled && (
        <p className="text-xs text-growth">{message}</p>
      )}
      {error && (
        <p className="text-xs text-spark">{error}</p>
      )}
    </div>
  );
}
