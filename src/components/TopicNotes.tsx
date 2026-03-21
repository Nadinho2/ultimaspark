"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTopicNote } from "@/app/actions/topicNotes";

const MAX = 8000;

type Props = {
  courseSlug: string;
  noteKey: string;
  initialNote: string;
};

export function TopicNotes({ courseSlug, noteKey, initialNote }: Props) {
  const router = useRouter();
  const [text, setText] = useState(initialNote);
  const [isPending, startTransition] = useTransition();
  const [flash, setFlash] = useState<"saved" | null>(null);

  useEffect(() => {
    setText(initialNote);
  }, [initialNote]);

  const persist = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("courseSlug", courseSlug);
      fd.append("noteKey", noteKey);
      fd.append("body", text);
      const r = await saveTopicNote(fd);
      if (r.success) {
        setFlash("saved");
        router.refresh();
        window.setTimeout(() => setFlash(null), 2000);
      }
    });
  };

  return (
    <div className="mt-3 rounded-lg border border-border bg-bg/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-spark">
        Your notes
      </p>
      <p className="mt-1 text-[11px] text-text-secondary">
        Private to you — saved to your account.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Key takeaways, timestamps, links, reminders…"
        rows={4}
        maxLength={MAX}
        className="mt-2 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 outline-none focus:border-spark"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-text-secondary">
          {text.length}/{MAX}
        </span>
        <div className="flex items-center gap-2">
          {flash === "saved" && (
            <span className="text-[11px] font-medium text-growth">Saved</span>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={persist}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
