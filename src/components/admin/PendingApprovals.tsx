"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  approveEnrollment,
  rejectEnrollment,
  listPendingEnrollments,
  type PendingRow,
} from "@/app/actions/pendingModeration";

export function PendingApprovals() {
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionPending, startAction] = useTransition();
  const [chosenTypes, setChosenTypes] = useState<
    Record<string, "subscription" | "cohort">
  >({});
  const [chosenCohorts, setChosenCohorts] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const data = await listPendingEnrollments();
      if (!cancelled) {
        setRows(data);
        const initialTypes: Record<string, "subscription" | "cohort"> = {};
        const initialCohorts: Record<string, string> = {};
        for (const row of data) {
          const key = `${row.userId}-${row.courseSlug}`;
          initialTypes[key] =
            row.enrollmentType ?? "subscription";
          if (row.preferredCohort) initialCohorts[key] = row.preferredCohort;
        }
        setChosenTypes(initialTypes);
        setChosenCohorts(initialCohorts);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = (userId: string, courseSlug: string) => {
    const key = `${userId}-${courseSlug}`;
    const selectedType = chosenTypes[key] ?? "subscription";
    const selectedCohort = chosenCohorts[key]?.trim();
    startAction(async () => {
      const result = await approveEnrollment(
        userId,
        courseSlug,
        selectedType,
        selectedType === "cohort" ? selectedCohort : undefined,
      );
      if (result.success) {
        setRows((prev) =>
          prev.filter(
            (r) => !(r.userId === userId && r.courseSlug === courseSlug),
          ),
        );
        router.refresh();
      }
    });
  };

  const handleReject = (userId: string, courseSlug: string) => {
    startAction(async () => {
      const result = await rejectEnrollment(userId, courseSlug);
      if (result.success) {
        setRows((prev) =>
          prev.filter(
            (r) => !(r.userId === userId && r.courseSlug === courseSlug),
          ),
        );
        router.refresh();
      }
    });
  };

  if (isLoading) {
    return (
      <p className="text-sm text-text-secondary">
        Loading pending enrollments…
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-surface/60 p-4 text-sm text-text-secondary">
        <Lock className="h-4 w-4 text-text-secondary" />
        <span>No pending enrollment requests right now.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-text-secondary">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Course</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Requested</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.userId}-${row.courseSlug}-${row.requestedAt}`}
              className="border-b border-white/5 last:border-0"
            >
              <td className="px-3 py-2 text-text-primary">
                {row.name ?? "Unknown"}
              </td>
              <td className="px-3 py-2">{row.email ?? "—"}</td>
              <td className="px-3 py-2">{row.courseSlug}</td>
              <td className="px-3 py-2 text-xs">
                <Select
                  value={
                    chosenTypes[`${row.userId}-${row.courseSlug}`] ??
                    row.enrollmentType ??
                    "subscription"
                  }
                  onChange={(e) =>
                    setChosenTypes((prev) => ({
                      ...prev,
                      [`${row.userId}-${row.courseSlug}`]:
                        e.target.value === "cohort" ? "cohort" : "subscription",
                    }))
                  }
                >
                  <option value="subscription">subscription</option>
                  <option value="cohort">cohort</option>
                </Select>
                {(chosenTypes[`${row.userId}-${row.courseSlug}`] ?? row.enrollmentType) ===
                  "cohort" && (
                  <Input
                    value={chosenCohorts[`${row.userId}-${row.courseSlug}`] ?? row.preferredCohort ?? ""}
                    onChange={(e) =>
                      setChosenCohorts((prev) => ({
                        ...prev,
                        [`${row.userId}-${row.courseSlug}`]: e.target.value,
                      }))
                    }
                    placeholder="cohort-id"
                    className="mt-1 h-8 text-xs"
                  />
                )}
              </td>
              <td className="px-3 py-2 text-xs">
                {new Date(row.requestedAt).toLocaleString()}
              </td>
              <td className="max-w-xs px-3 py-2 text-xs">
                {row.message ?? "—"}
              </td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-growth/60 text-growth hover:bg-growth/10"
                    disabled={actionPending}
                    onClick={() =>
                      handleApprove(row.userId, row.courseSlug)
                    }
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-secondary/60 text-secondary hover:bg-secondary/10"
                    disabled={actionPending}
                    onClick={() =>
                      handleReject(row.userId, row.courseSlug)
                    }
                  >
                    <X className="mr-1 h-3 w-3" />
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

