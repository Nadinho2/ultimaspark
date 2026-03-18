"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/supabase/types";
import {
  approveTestimonial,
  deleteTestimonial,
  rejectTestimonial,
} from "@/app/actions/testimonials";

type Props = {
  testimonials: Testimonial[];
};

type Filter = "all" | "pending" | "approved" | "rejected";

function Stars({ value }: { value: number | null }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(5, value)) : 0;
  const full = "★".repeat(v);
  const empty = "☆".repeat(5 - v);
  return (
    <span className="font-mono text-xs text-spark" aria-label={`${v} stars`}>
      {full}
      <span className="text-text-secondary">{empty}</span>
    </span>
  );
}

function normalizeStatus(status: Testimonial["status"] | null | undefined) {
  const s = status ? String(status).toLowerCase().trim() : null;
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  return "pending";
}

function StatusBadge({ status }: { status: Testimonial["status"] | null | undefined }) {
  const normalized = normalizeStatus(status);
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";
  if (normalized === "approved") {
    return (
      <span className={`${base} border-growth/30 bg-growth/10 text-growth`}>
        Approved
      </span>
    );
  }
  if (normalized === "rejected") {
    return (
      <span className={`${base} border-border bg-bg text-text-secondary`}>
        Rejected
      </span>
    );
  }
  return (
    <span className={`${base} border-spark/30 bg-spark/10 text-spark`}>
      Pending
    </span>
  );
}

export function TestimonialsModeration({ testimonials }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return testimonials;
    const normalizedFilter = filter;
    return testimonials.filter((t) => normalizeStatus(t.status) === normalizedFilter);
  }, [filter, testimonials]);

  const handleAction = (
    kind: "approve" | "reject",
    t: Testimonial,
  ) => {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const fd = new FormData();
      if (t.id) fd.append("id", t.id);
      fd.append("clerk_user_id", t.clerk_user_id ?? "");
      fd.append("created_at", t.created_at);
      fd.append("content", t.content);
      const result =
        kind === "approve"
          ? await approveTestimonial(fd)
          : await rejectTestimonial(fd);
      if (result.success) {
        setMessage(kind === "approve" ? "Approved" : "Rejected");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const handleDelete = (t: Testimonial) => {
    if (!t.id) return;
    const ok = window.confirm("Delete this testimonial? This cannot be undone.");
    if (!ok) return;

    setError(null);
    setMessage(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", t.id);

      const result = await deleteTestimonial(fd);
      if (result.success) {
        setMessage("Deleted");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved", "rejected"] as Filter[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={
                filter === k
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary hover:border-spark hover:text-spark"
              }
            >
              {k[0]!.toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary">
          Showing {filtered.length} of {testimonials.length}
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-growth/30 bg-growth/10 p-3 text-sm text-growth">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-spark/30 bg-spark/10 p-3 text-sm text-text-primary">
          <span className="font-semibold text-spark">Error:</span> {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg/50 text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Content</th>
              <th className="px-3 py-3">Rating</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Submitted</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-text-secondary" colSpan={7}>
                  No testimonials found for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="align-top">
                  <td className="px-3 py-3 font-medium text-text-primary">
                    {t.name}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">{t.role ?? "—"}</td>
                  <td className="px-3 py-3 text-text-secondary">
                    <div className="max-w-[520px]">
                      {t.content.length > 140 ? `${t.content.slice(0, 140)}…` : t.content}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Stars value={t.rating} />
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-3 py-3 text-xs text-text-secondary">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    {normalizeStatus(t.status) === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-growth text-white hover:bg-growth/90"
                          disabled={isPending}
                        onClick={() => handleAction("approve", t)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleAction("reject", t)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary">—</span>
                    )}
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(t)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

