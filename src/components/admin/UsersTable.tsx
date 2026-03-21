"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminListUsers, removeCourseFromUser } from "@/app/actions/admin";

type AdminUserRow = Awaited<ReturnType<typeof adminListUsers>>[number];

export function UsersTable() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [filtered, setFiltered] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await adminListUsers();
      if (!cancelled) {
        setRows(data);
        setFiltered(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    if (!q) {
      setFiltered(rows);
      return;
    }
    setFiltered(
      rows.filter((r) => {
        const name = (r.name ?? "").toLowerCase();
        const email = (r.email ?? "").toLowerCase();
        return name.includes(q) || email.includes(q);
      }),
    );
  }, [query, rows]);

  const handleRemoveCourse = (userId: string, courseSlug: string) => {
    if (!courseSlug) return;
    startTransition(async () => {
      const result = await removeCourseFromUser(userId, courseSlug);
      if (result.success) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === userId
              ? {
                  ...r,
                  enrolledCourses: r.enrolledCourses.filter(
                    (c) => c !== courseSlug,
                  ),
                }
              : r,
          ),
        );
        router.refresh();
      }
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-text-secondary">
        Loading users…
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs bg-surface text-sm text-text-primary"
        />
        <p className="text-xs text-text-secondary">
          Showing {filtered.length} of {rows.length} users
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-text-secondary">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Enrolled</th>
              <th className="px-3 py-2">Pending</th>
              <th className="px-3 py-2">Progress</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-3 py-2 text-text-primary">
                  {row.name ?? "Unknown"}
                </td>
                <td className="px-3 py-2">{row.email ?? "—"}</td>
                <td className="px-3 py-2 text-xs">
                  {row.role ?? "student"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {row.enrolledCourses.length === 0 ? (
                    "—"
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {row.enrolledCourses.map((c) => {
                        const enrollmentType =
                          row.enrollmentTypes[c] ?? "subscription";
                        const cohortId = row.cohortAssignments[c];
                        return (
                        <span
                          key={c}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                        >
                          {c} • {enrollmentType}
                          {enrollmentType === "cohort" && cohortId
                            ? ` • ${cohortId}`
                            : ""}
                        </span>
                        );
                      })}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">
                  {row.pendingEnrollments.length === 0
                    ? "0"
                    : row.pendingEnrollments
                        .map((p) => p.courseSlug)
                        .join(", ")}
                </td>
                <td className="px-3 py-2 text-xs">
                  {Object.keys(row.progressSummary).length === 0
                    ? "—"
                    : Object.entries(row.progressSummary)
                        .map(
                          ([slug, p]) =>
                            `${slug}: ${p.completedTopics} topics, ${p.completedWeeks} weeks`,
                        )
                        .join(" • ")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-secondary/60 text-secondary hover:bg-secondary/10"
                      onClick={() =>
                        // stub details route
                        router.push(`/admin/users/${row.id}`)
                      }
                    >
                      Details
                    </Button>
                    {row.enrolledCourses.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/60 text-destructive hover:bg-destructive/10"
                        disabled={isPending}
                        onClick={() =>
                          handleRemoveCourse(
                            row.id,
                            row.enrolledCourses[0] ?? "",
                          )
                        }
                      >
                        Remove 1 course
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

