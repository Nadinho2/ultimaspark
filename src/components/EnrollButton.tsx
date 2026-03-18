"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { requestEnrollment } from "@/app/actions/pendingEnrollment";

type EnrollButtonProps = {
  courseSlug: string;
  className?: string;
};

export function EnrollButton({ courseSlug, className }: EnrollButtonProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enrolled =
    (user?.publicMetadata?.enrolledCourses as string[] | undefined) ?? [];
  const isEnrolled = enrolled.includes(courseSlug);

  const pending =
    (user?.publicMetadata?.pendingEnrollments as
      | { courseSlug: string; requestedAt: string; message?: string }[]
      | undefined) ?? [];
  const isPendingApproval = pending.some((p) => p.courseSlug === courseSlug);

  const handleClick = () => {
    if (isEnrolled || isPendingApproval) return;

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", courseSlug);

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

  const label = isEnrolled
    ? "Enrolled"
    : isPendingApproval
      ? "Pending Approval"
    : isPending
        ? "Submitting..."
        : "Request Enrollment";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || isEnrolled || isPendingApproval}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70",
          className,
        )}
      >
        {label}
      </button>
      {message && !isEnrolled && (
        <p className="text-xs text-growth">{message}</p>
      )}
      {error && (
        <p className="text-xs text-spark">{error}</p>
      )}
    </div>
  );
}

