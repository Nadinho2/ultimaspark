"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { markComplete } from "@/app/actions/progress";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

type TopicCompleteButtonProps = {
  courseSlug: string;
  itemId: string;
  type?: "topic" | "week";
  className?: string;
};

export function TopicCompleteButton({
  courseSlug,
  itemId,
  type = "topic",
  className,
}: TopicCompleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { user } = useUser();

  const progress =
    (user?.publicMetadata?.progress as
      | Record<string, { completedWeeks?: number[]; completedTopics?: string[] }>
      | undefined) ?? {};
  const courseProgress = progress[courseSlug];
  const completedTopics = courseProgress?.completedTopics ?? [];
  const isCompleted = type === "topic" && completedTopics.includes(itemId);

  const handleClick = () => {
    setLocalMessage(null);
    setLocalError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("courseSlug", courseSlug);
      formData.append("itemId", itemId);
      formData.append("type", type);

      const result = await markComplete(formData);

      if (result.success) {
        setLocalMessage(result.message ?? "Marked complete!");
        router.refresh();
      } else {
        setLocalError(result.error);
      }
    });
  };

  const label = isCompleted
    ? "Completed ✓"
    : isPending
      ? "Marking..."
      : "Mark as Complete";

  return (
    <div className="mt-4 space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || isCompleted}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-growth px-4 py-2 text-xs font-semibold text-bg shadow-sm transition hover:bg-growth/90 disabled:opacity-70",
          className,
        )}
      >
        {label}
      </button>
          {isCompleted && (
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-flex cursor-help items-center gap-1 text-[10px] text-growth">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-surface text-text-primary">
                <span>Marked as complete</span>
              </TooltipContent>
            </Tooltip>
          )}
      {localMessage && (
        <p className="text-[10px] text-growth">{localMessage}</p>
      )}
      {localError && (
        <p className="text-[10px] text-secondary">{localError}</p>
      )}
    </div>
  );
}

