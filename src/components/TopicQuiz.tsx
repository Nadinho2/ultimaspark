"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitTopicQuiz } from "@/app/actions/quiz";
import type { TopicQuizMCQ } from "@/lib/topic-quiz-shared";

type Props = {
  courseSlug: string;
  topicId: string;
  content: TopicQuizMCQ;
  passed: boolean;
};

export function TopicQuiz({ courseSlug, topicId, content, passed: initialPassed }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [passed, setPassed] = useState(initialPassed);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (passed) {
    return (
      <div className="mt-3 rounded-lg border border-growth/40 bg-growth/10 px-3 py-2 text-xs font-medium text-growth">
        Topic quiz passed
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-spark">
        Topic check-in
      </p>
      <p className="mt-2 text-sm text-text-primary">{content.question}</p>
      <div className="mt-2 space-y-2">
        {content.options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent px-2 py-1.5 text-xs text-text-secondary hover:border-border hover:bg-surface"
          >
            <input
              type="radio"
              name={`quiz-${topicId}`}
              value={opt.value}
              checked={answer === opt.value}
              onChange={() => setAnswer(opt.value)}
              className="mt-0.5 border-border text-primary"
            />
            <span>
              <span className="font-medium text-text-primary">{opt.value.toUpperCase()}.</span>{" "}
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-xs text-spark" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={isPending || !answer}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const fd = new FormData();
            fd.append("courseSlug", courseSlug);
            fd.append("topicId", topicId);
            fd.append("answer", answer);
            const result = await submitTopicQuiz(fd);
            if (result.success) {
              if (result.passed) {
                setPassed(true);
                router.refresh();
              } else {
                setError("Not quite — review the topic and try again.");
              }
            } else {
              setError(result.error ?? "Could not submit quiz.");
            }
          });
        }}
        className="mt-3 inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit answer"}
      </button>
    </div>
  );
}
