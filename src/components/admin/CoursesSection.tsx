"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminListCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseVideo,
  updateCourseCurriculum,
  addLiveSessionVideo,
  createCourseCohort,
  updateCohortLiveVideo,
  deleteCohortLiveVideo,
  setTopicVideoId,
  setTopicQuiz,
  updateTopicInstructorNotes,
} from "@/app/actions/admin";
import type { TopicQuizConfig } from "@/lib/courses";
import { resolveTopicQuizContent } from "@/lib/topic-quiz-shared";
import { Select } from "@/components/ui/select";

type AdminCourseRow = Awaited<ReturnType<typeof adminListCourses>>[number];

function flattenTopicsForNotes(course: AdminCourseRow) {
  const weeks = ((course as { weeksDetail?: { title?: string; topics?: { id: string; title: string }[] }[] }).weeksDetail ?? []) as {
    title?: string;
    topics?: { id: string; title: string }[];
  }[];
  const rows: { id: string; title: string; weekLabel: string }[] = [];
  weeks.forEach((w, wi) => {
    (w.topics ?? []).forEach((t) => {
      rows.push({
        id: t.id,
        title: t.title,
        weekLabel: `Week ${wi + 1}${w.title ? `: ${w.title}` : ""}`,
      });
    });
  });
  return rows;
}

export function CoursesSection() {
  const [courses, setCourses] = useState<AdminCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  /** Which single admin action is in flight (avoids global `saving` dimming every button at once). */
  const [mutationKey, setMutationKey] = useState<string | null>(null);

  const runMutation = useCallback(
    async (key: string, fn: () => Promise<void>) => {
      setMutationKey(key);
      setActionError(null);
      try {
        await fn();
      } catch (e) {
        setActionError(
          e instanceof Error
            ? e.message
            : "Request failed. Check the browser console and try again.",
        );
      } finally {
        setMutationKey(null);
      }
    },
    [],
  );
  /** Row index being edited (stable when slug field changes in the form) */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  /** Course slug when Edit was opened — sent as originalSlug to the server */
  const [editingOriginalSlug, setEditingOriginalSlug] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [videoFormSlug, setVideoFormSlug] = useState<string | null>(null);
  const [curriculumSlug, setCurriculumSlug] = useState<string | null>(null);
  const [liveVideoSlug, setLiveVideoSlug] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({
    week: 1,
    topicId: "",
    youtubeId: "",
  });
  const [newLiveVideo, setNewLiveVideo] = useState({
    cohortId: "",
    week: 1,
    topicId: "",
    youtubeId: "",
  });
  const [newCohortId, setNewCohortId] = useState("");
  const [instructorNotesSlug, setInstructorNotesSlug] = useState<string | null>(
    null,
  );
  const [instructorDrafts, setInstructorDrafts] = useState<
    Record<string, Record<string, string>>
  >({});
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    description: "",
    weeks: 6,
  });
  const [editLiveVideos, setEditLiveVideos] = useState<Record<string, string>>({});
  /** Which course card is expanded (stable id: original slug while editing, else current slug). */
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const router = useRouter();

  const resetSubPanels = useCallback(() => {
    setEditingIndex(null);
    setEditingOriginalSlug(null);
    setVideoFormSlug(null);
    setCurriculumSlug(null);
    setLiveVideoSlug(null);
    setInstructorNotesSlug(null);
  }, []);

  const toggleCourseExpanded = useCallback(
    (rowId: string) => {
      setExpandedCourseId((prev) => {
        const next = prev === rowId ? null : rowId;
        if (prev !== null && next !== null && prev !== next) {
          queueMicrotask(resetSubPanels);
        }
        return next;
      });
    },
    [resetSubPanels],
  );

  /** Reset add-video form when opening "Manage Videos" or switching course */
  useEffect(() => {
    if (videoFormSlug) {
      setNewVideo({
        week: 1,
        topicId: "",
        youtubeId: "",
      });
    }
  }, [videoFormSlug]);

  /** Reset live-video fields when opening the panel or switching course (fresh cohort/topic picks) */
  useEffect(() => {
    if (!liveVideoSlug) return;
    setNewLiveVideo({
      cohortId: "",
      week: 1,
      topicId: "",
      youtubeId: "",
    });
  }, [liveVideoSlug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setActionError(null);
      try {
        const data = await adminListCourses();
        if (!cancelled) {
          setCourses(data);
        }
      } catch (e) {
        if (!cancelled) {
          setCourses([]);
          setActionError(
            e instanceof Error
              ? e.message
              : "Could not load courses (check admin permission).",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = () => {
    void runMutation("create-course", async () => {
      const fd = new FormData();
      fd.append("title", newCourse.title);
      if (newCourse.slug) fd.append("slug", newCourse.slug);
      fd.append("description", newCourse.description);
      fd.append("weeks", String(newCourse.weeks));
      const result = await createCourse(fd);
      if (!result.success) {
        setActionError(result.error ?? "Could not create course.");
        return;
      }
      const refreshed = await adminListCourses();
      setCourses(refreshed);
      setNewCourse({
        title: "",
        slug: "",
        description: "",
        weeks: 6,
      });
      router.refresh();
    });
  };

  const handleUpdate = () => {
    if (editingIndex === null || editingOriginalSlug === null) return;
    const row = courses[editingIndex];
    if (!row) return;
    void runMutation(`save-${editingOriginalSlug}`, async () => {
      const fd = new FormData();
      fd.append("originalSlug", editingOriginalSlug);
      fd.append("title", row.title);
      fd.append("slug", row.slug);
      fd.append("description", row.description);
      fd.append("weeks", String(row.weeks));
      const result = await updateCourse(fd);
      if (!result.success) {
        setActionError(result.error ?? "Could not save course.");
        return;
      }
      const refreshed = await adminListCourses();
      setCourses(refreshed);
      setExpandedCourseId((prev) =>
        editingOriginalSlug && prev === editingOriginalSlug ? row.slug : prev,
      );
      setEditingIndex(null);
      setEditingOriginalSlug(null);
      router.refresh();
    });
  };

  const handleDelete = (slug: string, rowIdForExpand: string) => {
    if (!slug) return;
    const confirmDelete = window.confirm(
      "Delete this course and remove it from all users? This cannot be undone.",
    );
    if (!confirmDelete) return;

    void runMutation(`delete-${slug}`, async () => {
      const result = await deleteCourse(slug);
      if (!result.success) {
        setActionError(result.error ?? "Could not delete course.");
        return;
      }
      setCourses((prev) => prev.filter((c) => c.slug !== slug));
      setExpandedCourseId((prev) =>
        prev === rowIdForExpand || prev === slug ? null : prev,
      );
      if (editingOriginalSlug === slug) {
        setEditingIndex(null);
        setEditingOriginalSlug(null);
      }
      router.refresh();
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-text-secondary">
        Loading courses…
      </p>
    );
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      {actionError && (
        <div
          className="rounded-lg border border-spark/40 bg-spark/10 px-3 py-2 text-sm text-spark"
          role="alert"
        >
          {actionError}
        </div>
      )}
      {mutationKey && (
        <p className="text-xs font-medium text-primary" aria-live="polite">
          Saving…
        </p>
      )}
      <p className="rounded-lg border border-border/80 bg-bg/40 px-3 py-2 text-[11px] leading-relaxed text-text-secondary">
        <span className="font-medium text-text-primary">Deploy note: </span>
        Without{" "}
        <code className="rounded bg-surface px-1 font-mono text-[10px]">SUPABASE_SERVICE_ROLE_KEY</code>,
        courses are read from{" "}
        <code className="rounded bg-surface px-1 font-mono text-[10px]">data/courses.json</code>{" "}
        (read-only on Vercel). With Supabase configured, saves go to the database. See{" "}
        <code className="rounded bg-surface px-1 font-mono text-[10px]">docs/supabase-courses.md</code>.
      </p>
      <div className="space-y-2 rounded-lg border border-primary/20 bg-surface/60 p-3">
        <p className="text-sm font-medium text-text-primary">
          Create new course
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, title: e.target.value }))
            }
            className="bg-surface text-sm text-text-primary"
          />
          <Input
            placeholder="Slug (optional)"
            value={newCourse.slug}
            onChange={(e) =>
              setNewCourse((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="bg-surface text-sm text-text-primary"
          />
        </div>
        <Input
          placeholder="Short description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="bg-surface text-sm text-text-primary"
        />
        <div className="flex items-center justify-between gap-2">
          <Input
            type="number"
            min={1}
            max={52}
            value={newCourse.weeks}
            onChange={(e) =>
              setNewCourse((prev) => ({
                ...prev,
                weeks: Number(e.target.value) || 1,
              }))
            }
            className="max-w-[120px] bg-surface text-sm text-text-primary"
          />
          <Button
            type="button"
            size="sm"
            className="bg-spark text-bg hover:bg-spark/90"
            disabled={
              mutationKey === "create-course" || !newCourse.title.trim()
            }
            onClick={handleCreate}
          >
            Create Course
          </Button>
        </div>
        {!newCourse.title.trim() && (
          <p className="text-[11px] text-text-secondary">
            Enter a <strong className="text-text-primary">title</strong> to enable Create Course.
          </p>
        )}
      </div>

      <div className="space-y-2">
        {courses.length === 0 ? (
          <p className="text-sm text-text-secondary">No courses configured.</p>
        ) : (
          courses.map((c, index) => {
            /** Slug at edit start — keeps nested list keys stable if course slug is edited */
            const stableKey =
              editingIndex === index && editingOriginalSlug
                ? editingOriginalSlug
                : c.slug;
            const rowId =
              editingIndex === index && editingOriginalSlug
                ? editingOriginalSlug
                : c.slug;
            const isExpanded = expandedCourseId === rowId;

            return (
            <div
              key={
                editingIndex === index && editingOriginalSlug
                  ? `editing-${editingOriginalSlug}`
                  : c.slug
              }
              className="flex min-w-0 flex-col gap-2 rounded-lg border border-primary/15 bg-surface/60 p-3"
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md border border-primary/20 bg-surface/80 px-3 py-2.5 text-left transition hover:bg-primary/5"
                onClick={() => toggleCourseExpanded(rowId)}
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded
                    ? `${c.title} — collapse`
                    : `${c.title} — expand to edit`
                }
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-text-secondary break-words">
                    slug: <span className="font-mono break-all">{c.slug}</span>{" "}
                    • weeks: {c.weeks} • enrolled: {c.enrolledCount}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-text-secondary"
                    aria-hidden
                  />
                )}
              </button>
              {isExpanded && (
                <div className="space-y-2 border-t border-primary/10 pt-3">
              <div className="min-w-0 flex-1 space-y-1">
                {editingIndex === index && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <Input
                      value={c.title}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCourses((prev) =>
                          prev.map((row) =>
                            row.slug === c.slug
                              ? { ...row, title: next }
                              : row,
                          ),
                        );
                      }}
                      className="bg-surface text-sm text-text-primary"
                    />
                    <Input
                      value={c.slug}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCourses((prev) =>
                          prev.map((row) =>
                            row.slug === c.slug
                              ? { ...row, slug: next }
                              : row,
                          ),
                        );
                      }}
                      className="bg-surface text-sm text-text-primary"
                    />
                  </div>
                )}
                {/* Videos management (topic-level) */}
                <div className="mt-2 space-y-1 rounded-md border border-primary/20 bg-surface/60 p-2">
                  <p className="text-[11px] font-medium text-text-primary">
                    Topic Videos
                  </p>
                  <div className="space-y-1 text-[11px]">
                    {(((c as any).weeksDetail as any[]) ?? []).length > 0 ? (
                      (((c as any).weeksDetail as any[]) ?? []).map((week, wi) => (
                        <div key={`${stableKey}-video-week-${wi + 1}`} className="rounded border border-primary/15 p-2">
                          <p className="font-semibold text-text-primary">Week {wi + 1}: {week.title}</p>
                          <ul className="mt-1 list-none space-y-2 text-text-secondary">
                            {(week.topics ?? []).map((topic: any) => (
                              <li
                                key={`${stableKey}-topic-admin-${topic.id}`}
                                className="list-none space-y-3 rounded border border-primary/10 p-2"
                              >
                                <TopicVideoAdminRow
                                  courseSlug={c.slug}
                                  topicId={topic.id}
                                  topicTitle={topic.title}
                                  initialVideoId={topic.videoId}
                                  onError={setActionError}
                                  onSaved={async () => {
                                    const refreshed = await adminListCourses();
                                    setCourses(refreshed);
                                    router.refresh();
                                  }}
                                />
                                <TopicQuizAdminRow
                                  courseSlug={c.slug}
                                  topic={topic as {
                                    id: string;
                                    title: string;
                                    topicQuiz?: TopicQuizConfig;
                                  }}
                                  mutationKey={mutationKey}
                                  runMutation={runMutation}
                                  mutationSaveKey={`topicQuiz-save-${c.slug}-${topic.id}`}
                                  mutationClearKey={`topicQuiz-clear-${c.slug}-${topic.id}`}
                                  onError={setActionError}
                                  onSaved={async () => {
                                    const refreshed = await adminListCourses();
                                    setCourses(refreshed);
                                    router.refresh();
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-secondary">No week/topics configured yet.</p>
                    )}
                  </div>
                  {videoFormSlug === c.slug && (
                    <div className="mt-2 grid gap-1 sm:grid-cols-3">
                      <select
                        value={newVideo.week}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            week: Number(e.target.value) || 1,
                            topicId: "",
                          }))
                        }
                        className="h-9 rounded-md border border-primary/25 bg-surface px-2 text-[11px] text-text-primary outline-none focus:border-spark"
                      >
                        {Array.from({ length: c.weeks }).map((_, idx) => (
                          <option key={`${stableKey}-week-option-${idx + 1}`} value={idx + 1}>
                            Week {idx + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={newVideo.topicId}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            topicId: e.target.value,
                          }))
                        }
                        className="h-9 rounded-md border border-primary/25 bg-surface px-2 text-[11px] text-text-primary outline-none focus:border-spark"
                      >
                        <option value="">Select topic</option>
                        {(
                          (((c as any).weeksDetail as any[])?.[newVideo.week - 1]?.topics as any[]) ??
                          []
                        ).map((topic: any) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.title}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={newVideo.youtubeId}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            youtubeId: e.target.value,
                          }))
                        }
                        className="bg-surface text-[11px] text-text-primary"
                        placeholder="YouTube URL or ID"
                      />
                      <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          className="border-secondary/60 text-secondary hover:bg-secondary/10"
                          onClick={() => {
                            setVideoFormSlug(null);
                            setNewVideo({
                              week: 1,
                              topicId: "",
                              youtubeId: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          className="bg-spark text-bg hover:bg-spark/90"
                          disabled={
                            mutationKey === `addVideo-${c.slug}` ||
                            !newVideo.youtubeId ||
                            !newVideo.topicId
                          }
                          onClick={() =>
                            void runMutation(`addVideo-${c.slug}`, async () => {
                              const fd = new FormData();
                              fd.append("slug", c.slug);
                              fd.append("week", String(newVideo.week));
                              fd.append("topicId", newVideo.topicId);
                              fd.append("youtubeId", newVideo.youtubeId);
                              const result = await addCourseVideo(fd);
                              if (result.success) {
                                const refreshed =
                                  await adminListCourses();
                                setCourses(refreshed);
                                setVideoFormSlug(null);
                                setNewVideo({
                                  week: 1,
                                  topicId: "",
                                  youtubeId: "",
                                });
                                router.refresh();
                              } else {
                                setActionError(
                                  result.error ?? "Could not add video.",
                                );
                              }
                            })
                          }
                        >
                          Add Video to Topic
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Curriculum / weeks & topics management */}
                <div className="mt-2 space-y-1 rounded-md border border-primary/20 bg-surface/60 p-2">
                  <p className="text-[11px] font-medium text-text-primary">
                    Curriculum (weeks &amp; topics)
                  </p>
                  {curriculumSlug === c.slug && (
                    <div className="mt-2 space-y-3">
                      {(() => {
                        const weeksDetail =
                          ((c as any).weeksDetail as
                            | { title: string; summary?: string; topics?: { id: string; title: string; bullets?: string[] }[] }[]
                            | undefined) ?? [];
                        const weeksArray: {
                          title: string;
                          summary?: string;
                          topics?: { id: string; title: string; bullets?: string[] }[];
                        }[] = [];
                        for (let i = 0; i < c.weeks; i += 1) {
                          weeksArray[i] =
                            weeksDetail[i] ?? {
                              title: `Week ${i + 1}`,
                              summary: "",
                              topics: [],
                            };
                        }

                        return weeksArray.map((week, index) => {
                          const topicsText =
                            (week.topics ?? []).map((t) => t.title).join("\n");
                          return (
                            <div
                              key={`${stableKey}-week-${index + 1}`}
                              className="rounded-md border border-primary/25 bg-surface/80 p-2"
                            >
                              <p className="text-[11px] font-semibold text-primary">
                                Week {index + 1}
                              </p>
                              <Input
                                defaultValue={week.title}
                                placeholder={`Week ${index + 1} title`}
                                className="mt-1 bg-surface text-[11px] text-text-primary"
                                onChange={(e) => {
                                  const nextTitle = e.target.value;
                                  setCourses((prev) =>
                                    prev.map((row) => {
                                      if (row.slug !== c.slug) return row;
                                      const existingWeeks =
                                        ((row as any).weeksDetail as any[]) ?? [];
                                      const copy = [...existingWeeks];
                                      const existingWeek =
                                        copy[index] ?? {
                                          title: `Week ${index + 1}`,
                                          summary: "",
                                          topics: [],
                                        };
                                      copy[index] = {
                                        ...existingWeek,
                                        title: nextTitle,
                                      };
                                      return { ...row, weeksDetail: copy };
                                    }),
                                  );
                                }}
                              />
                              <Input
                                defaultValue={week.summary ?? ""}
                                placeholder="Short summary (optional)"
                                className="mt-1 bg-surface text-[11px] text-text-primary"
                                onChange={(e) => {
                                  const nextSummary = e.target.value;
                                  setCourses((prev) =>
                                    prev.map((row) => {
                                      if (row.slug !== c.slug) return row;
                                      const existingWeeks =
                                        ((row as any).weeksDetail as any[]) ?? [];
                                      const copy = [...existingWeeks];
                                      const existingWeek =
                                        copy[index] ?? {
                                          title: `Week ${index + 1}`,
                                          summary: "",
                                          topics: [],
                                        };
                                      copy[index] = {
                                        ...existingWeek,
                                        summary: nextSummary,
                                      };
                                      return { ...row, weeksDetail: copy };
                                    }),
                                  );
                                }}
                              />
                              <textarea
                                defaultValue={topicsText}
                                placeholder={
                                  "Topics (one per line)\nExample:\nIntroduction\nCore Concepts\nProject"
                                }
                                className="mt-1 h-24 w-full resize-y rounded-md border border-primary/25 bg-surface px-2 py-1 text-[11px] text-text-primary outline-none focus:border-spark"
                                onChange={(e) => {
                                  const lines = e.target.value
                                    .split("\n")
                                    .map((l) => l.trim())
                                    .filter(Boolean);
                                  setCourses((prev) =>
                                    prev.map((row) => {
                                      if (row.slug !== c.slug) return row;
                                      const existingWeeks =
                                        ((row as any).weeksDetail as any[]) ?? [];
                                      const copy = [...existingWeeks];
                                      const existingWeek =
                                        copy[index] ?? {
                                          title: `Week ${index + 1}`,
                                          summary: "",
                                          topics: [],
                                        };
                                      const existingTopics = (existingWeek.topics ?? []) as any[];
                                      const topics = lines.map((title, idx) => ({
                                        id:
                                          existingTopics[idx]?.id ??
                                          `${row.slug}-week-${index + 1}-topic-${idx + 1}`,
                                        title,
                                        videoId: existingTopics[idx]?.videoId ?? "",
                                        subtopics: existingTopics[idx]?.subtopics ?? [],
                                      }));
                                      copy[index] = {
                                        ...existingWeek,
                                        topics,
                                      };
                                      return { ...row, weeksDetail: copy };
                                    }),
                                  );
                                }}
                              />
                            </div>
                          );
                        });
                      })()}
                      <div className="flex justify-end pt-1">
                        <Button
                          type="button"
                          size="xs"
                          className="bg-spark text-bg hover:bg-spark/90"
                          disabled={mutationKey === `curriculum-${c.slug}`}
                          onClick={() =>
                            void runMutation(`curriculum-${c.slug}`, async () => {
                              const weeksDetail =
                                ((c as any).weeksDetail as any[]) ?? [];
                              const fd = new FormData();
                              fd.append("slug", c.slug);
                              fd.append(
                                "weeksDetail",
                                JSON.stringify(weeksDetail),
                              );
                              const result = await updateCourseCurriculum(fd);
                              if (result.success) {
                                const refreshed = await adminListCourses();
                                setCourses(refreshed);
                                setCurriculumSlug(null);
                              } else {
                                setActionError(
                                  result.error ?? "Could not save curriculum.",
                                );
                              }
                            })
                          }
                        >
                          Save Curriculum
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {instructorNotesSlug === c.slug && (
                  <div className="mt-2 space-y-2 rounded-md border border-growth/30 bg-surface/60 p-2">
                    <p className="text-[11px] font-medium text-text-primary">
                      Instructor notes (visible to all learners)
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      Shown on the learner dashboard above &quot;Your notes&quot; for each topic.
                    </p>
                    {flattenTopicsForNotes(c).length === 0 ? (
                      <p className="text-[11px] text-text-secondary">
                        Add topics in <span className="font-medium">Curriculum</span> first, then save
                        curriculum.
                      </p>
                    ) : (
                      <>
                        {flattenTopicsForNotes(c).map((row) => (
                          <div
                            key={row.id}
                            className="space-y-1 rounded border border-border/60 p-2"
                          >
                            <p className="text-[10px] text-text-secondary">{row.weekLabel}</p>
                            <p className="text-[11px] font-medium text-text-primary">{row.title}</p>
                            <textarea
                              value={instructorDrafts[c.slug]?.[row.id] ?? ""}
                              onChange={(e) =>
                                setInstructorDrafts((prev) => ({
                                  ...prev,
                                  [c.slug]: {
                                    ...(prev[c.slug] ?? {}),
                                    [row.id]: e.target.value,
                                  },
                                }))
                              }
                              rows={3}
                              className="w-full resize-y rounded-md border border-primary/25 bg-surface px-2 py-1 text-[11px] text-text-primary outline-none focus:border-spark"
                              placeholder='Optional — e.g. "Focus on the checklist at 12:30"'
                            />
                          </div>
                        ))}
                        <div className="flex justify-end pt-1">
                          <Button
                            type="button"
                            size="xs"
                            className="bg-growth text-bg hover:bg-growth/90"
                            disabled={mutationKey === `instructor-${c.slug}`}
                            onClick={() =>
                              void runMutation(`instructor-${c.slug}`, async () => {
                                setActionError(null);
                                const fd = new FormData();
                                fd.append("slug", c.slug);
                                fd.append(
                                  "notes",
                                  JSON.stringify(instructorDrafts[c.slug] ?? {}),
                                );
                                const result = await updateTopicInstructorNotes(fd);
                                if (result.success) {
                                  const refreshed = await adminListCourses();
                                  setCourses(refreshed);
                                  router.refresh();
                                } else {
                                  setActionError(
                                    result.error ?? "Could not save instructor notes.",
                                  );
                                }
                              })
                            }
                          >
                            Save instructor notes
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-secondary/60 text-secondary hover:bg-secondary/10"
                  onClick={() => {
                    if (editingIndex === index) {
                      setEditingIndex(null);
                      setEditingOriginalSlug(null);
                    } else {
                      setEditingIndex(index);
                      setEditingOriginalSlug(c.slug);
                    }
                  }}
                >
                  {editingIndex === index ? "Cancel" : "Edit"}
                </Button>
                {editingIndex === index ? (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-spark text-bg hover:bg-spark/90"
                    disabled={
                      editingOriginalSlug
                        ? mutationKey === `save-${editingOriginalSlug}`
                        : false
                    }
                    onClick={handleUpdate}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={mutationKey === `delete-${c.slug}`}
                    onClick={() => handleDelete(c.slug, rowId)}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-primary/60 text-primary hover:bg-primary/10"
                  onClick={() =>
                    setVideoFormSlug((prev) =>
                      prev === c.slug ? null : c.slug,
                    )
                  }
                >
                  {videoFormSlug === c.slug ? "Close Videos" : "Manage Videos"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-growth/60 text-growth hover:bg-growth/10"
                  onClick={() =>
                    setCurriculumSlug((prev) =>
                      prev === c.slug ? null : c.slug,
                    )
                  }
                >
                  {curriculumSlug === c.slug ? "Close Curriculum" : "Curriculum"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-primary/60 text-primary hover:bg-primary/10"
                  onClick={() => {
                    if (instructorNotesSlug === c.slug) {
                      setInstructorNotesSlug(null);
                    } else {
                      const existing =
                        (
                          c as {
                            topicInstructorNotes?: Record<string, string>;
                          }
                        ).topicInstructorNotes ?? {};
                      const draft: Record<string, string> = {};
                      for (const row of flattenTopicsForNotes(c)) {
                        draft[row.id] = existing[row.id] ?? "";
                      }
                      setInstructorDrafts((prev) => ({
                        ...prev,
                        [c.slug]: draft,
                      }));
                      setInstructorNotesSlug(c.slug);
                    }
                  }}
                >
                  {instructorNotesSlug === c.slug
                    ? "Close instructor notes"
                    : "Instructor notes"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-spark/60 text-spark hover:bg-spark/10"
                  onClick={() =>
                    setLiveVideoSlug((prev) =>
                      prev === c.slug ? null : c.slug,
                    )
                  }
                >
                  {liveVideoSlug === c.slug ? "Close Live Videos" : "Add Live Session Video"}
                </Button>
              </div>
              {liveVideoSlug === c.slug && (
                <div className="mt-3 min-w-0 rounded-md border border-spark/30 bg-surface/70 p-3">
                  <p className="text-[11px] font-medium text-text-primary">
                    Add live session recording for cohort learners
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <Select
                      value={newLiveVideo.cohortId}
                      onChange={(e) =>
                        setNewLiveVideo((prev) => ({
                          ...prev,
                          cohortId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select cohort</option>
                      {((c as any).cohorts ?? []).map((cohortId: string) => (
                        <option key={`${stableKey}-cohort-${cohortId}`} value={cohortId}>
                          {cohortId}
                        </option>
                      ))}
                    </Select>
                    <Select
                      value={newLiveVideo.week}
                      onChange={(e) =>
                        setNewLiveVideo((prev) => ({
                          ...prev,
                          week: Number(e.target.value) || 1,
                          topicId: "",
                        }))
                      }
                    >
                      {Array.from({ length: c.weeks }).map((_, idx) => (
                        <option key={`${stableKey}-live-week-${idx + 1}`} value={idx + 1}>
                          Week {idx + 1}
                        </option>
                      ))}
                    </Select>
                    <Select
                      value={newLiveVideo.topicId}
                      onChange={(e) =>
                        setNewLiveVideo((prev) => ({
                          ...prev,
                          topicId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select topic</option>
                      {(
                        (((c as any).weeksDetail as any[])?.[newLiveVideo.week - 1]?.topics as any[]) ??
                        []
                      ).map((topic: any) => (
                        <option key={`${stableKey}-live-topic-${topic.id}`} value={topic.id}>
                          {topic.title}
                        </option>
                      ))}
                    </Select>
                    <Input
                      value={newLiveVideo.youtubeId}
                      onChange={(e) =>
                        setNewLiveVideo((prev) => ({
                          ...prev,
                          youtubeId: e.target.value,
                        }))
                      }
                      className="bg-surface text-[11px] text-text-primary"
                      placeholder="YouTube URL or ID"
                    />
                  </div>
                  {newLiveVideo.cohortId && (
                    <div className="mt-3 space-y-2 rounded-md border border-border/70 bg-surface/60 p-3">
                      <p className="text-[11px] font-semibold text-text-primary">
                        Manage uploaded videos ({newLiveVideo.cohortId})
                      </p>
                      {(() => {
                        const cohortVideos =
                          ((((c as any).cohortLiveVideos ?? {})[
                            newLiveVideo.cohortId
                          ] as Record<string, any> | undefined) ?? {});
                        const weekEntries = Object.entries(cohortVideos);
                        if (weekEntries.length === 0) {
                          return (
                        <p className="text-[11px] text-text-secondary">
                          No videos uploaded for this cohort yet.
                        </p>
                          );
                        }
                        return weekEntries.map(([weekKey, topicBucket]) => {
                          const normalizedTopicBucket = Array.isArray(topicBucket)
                            ? { __general__: topicBucket }
                            : (topicBucket ?? {});
                          return (
                            <div key={`${stableKey}-${newLiveVideo.cohortId}-${weekKey}`} className="space-y-2 rounded border border-border/70 p-2">
                              <p className="text-[11px] font-medium text-text-primary">{weekKey}</p>
                              {Object.entries(normalizedTopicBucket).map(([topicId, videos]) => (
                                <div key={`${weekKey}-${topicId}`} className="rounded border border-border/60 p-2">
                                  <p className="text-[11px] text-text-secondary">
                                    Topic: <span className="font-mono text-text-primary">{topicId}</span>
                                  </p>
                                  <div className="mt-1 space-y-1">
                                    {(videos as string[]).map((videoId, idx) => {
                                      const editKey = `${c.slug}|${newLiveVideo.cohortId}|${weekKey}|${topicId}|${videoId}|${idx}`;
                                      const editValue = editLiveVideos[editKey] ?? videoId;
                                      return (
                                        <div key={editKey} className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
                                          <Input
                                            value={editValue}
                                            onChange={(e) =>
                                              setEditLiveVideos((prev) => ({
                                                ...prev,
                                                [editKey]: e.target.value,
                                              }))
                                            }
                                            className="h-8 bg-surface text-[11px] text-text-primary"
                                          />
                                          <Button
                                            type="button"
                                            size="xs"
                                            variant="outline"
                                            disabled={
                                              mutationKey ===
                                                `liveCohortSave-${editKey}` ||
                                              !editValue.trim()
                                            }
                                            onClick={() =>
                                              void runMutation(
                                                `liveCohortSave-${editKey}`,
                                                async () => {
                                                const fd = new FormData();
                                                fd.append("courseSlug", c.slug);
                                                fd.append("cohortId", newLiveVideo.cohortId);
                                                fd.append("weekKey", weekKey);
                                                fd.append("topicId", topicId);
                                                fd.append("oldYoutubeId", videoId);
                                                fd.append("newYoutubeId", editValue.trim());
                                                const result = await updateCohortLiveVideo(fd);
                                                if (result.success) {
                                                  const refreshed = await adminListCourses();
                                                  setCourses(refreshed);
                                                  router.refresh();
                                                } else {
                                                  setActionError(
                                                    result.error ??
                                                      "Could not update cohort video.",
                                                  );
                                                }
                                              },
                                              )
                                            }
                                          >
                                            Save
                                          </Button>
                                          <Button
                                            type="button"
                                            size="xs"
                                            variant="destructive"
                                            disabled={
                                              mutationKey ===
                                                `liveCohortDelete-${editKey}`
                                            }
                                            onClick={() =>
                                              void runMutation(
                                                `liveCohortDelete-${editKey}`,
                                                async () => {
                                                const fd = new FormData();
                                                fd.append("courseSlug", c.slug);
                                                fd.append("cohortId", newLiveVideo.cohortId);
                                                fd.append("weekKey", weekKey);
                                                fd.append("topicId", topicId);
                                                fd.append("youtubeId", videoId);
                                                const result = await deleteCohortLiveVideo(fd);
                                                if (result.success) {
                                                  const refreshed = await adminListCourses();
                                                  setCourses(refreshed);
                                                  router.refresh();
                                                } else {
                                                  setActionError(
                                                    result.error ??
                                                      "Could not delete cohort video.",
                                                  );
                                                }
                                              },
                                              )
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                  <div className="mt-2 grid gap-2 md:grid-cols-[1fr_auto]">
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                      <Input
                        value={newCohortId}
                        onChange={(e) => setNewCohortId(e.target.value)}
                        placeholder="Create cohort id (e.g. ai-automation-apr-2026)"
                        className="min-w-0 bg-surface text-[11px] text-text-primary"
                      />
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        className="border-spark/50 text-spark hover:bg-spark/10"
                        disabled={
                          mutationKey === `cohortCreate-${c.slug}` ||
                          !newCohortId.trim()
                        }
                        onClick={() =>
                          void runMutation(`cohortCreate-${c.slug}`, async () => {
                            const fd = new FormData();
                            fd.append("courseSlug", c.slug);
                            fd.append("cohortId", newCohortId.trim());
                            const result = await createCourseCohort(fd);
                            if (result.success) {
                              const refreshed = await adminListCourses();
                              setCourses(refreshed);
                              setNewLiveVideo((prev) => ({
                                ...prev,
                                cohortId: newCohortId.trim(),
                              }));
                              setNewCohortId("");
                              router.refresh();
                            } else {
                              setActionError(
                                result.error ?? "Could not create cohort.",
                              );
                            }
                          })
                        }
                      >
                        Create Cohort
                      </Button>
                    </div>
                    <div className="flex justify-end">
                    <Button
                      type="button"
                      size="xs"
                      className="bg-spark text-bg hover:bg-spark/90"
                      disabled={
                        mutationKey === `liveSession-${c.slug}` ||
                        !newLiveVideo.youtubeId ||
                        !newLiveVideo.cohortId ||
                        !newLiveVideo.topicId
                      }
                      onClick={() =>
                        void runMutation(`liveSession-${c.slug}`, async () => {
                          const fd = new FormData();
                          fd.append("courseSlug", c.slug);
                          fd.append("cohortId", newLiveVideo.cohortId);
                          fd.append("weekKey", `week-${newLiveVideo.week}`);
                          fd.append("topicId", newLiveVideo.topicId);
                          fd.append("youtubeId", newLiveVideo.youtubeId);
                          const result = await addLiveSessionVideo(fd);
                          if (result.success) {
                            setNewLiveVideo({
                              cohortId: "",
                              week: 1,
                              topicId: "",
                              youtubeId: "",
                            });
                            setLiveVideoSlug(null);
                            void adminListCourses().then(setCourses);
                            router.refresh();
                          } else {
                            setActionError(
                              result.error ?? "Could not save live video.",
                            );
                          }
                        })
                      }
                    >
                      Save Live Video
                    </Button>
                    </div>
                  </div>
                </div>
              )}
                </div>
              )}
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function TopicVideoAdminRow({
  courseSlug,
  topicId,
  topicTitle,
  initialVideoId,
  onError,
  onSaved,
}: {
  courseSlug: string;
  topicId: string;
  topicTitle: string;
  initialVideoId?: string;
  onError: (msg: string | null) => void;
  onSaved: () => Promise<void>;
}) {
  const [val, setVal] = useState(initialVideoId ?? "");
  const [rowSaving, setRowSaving] = useState(false);

  useEffect(() => {
    setVal(initialVideoId ?? "");
  }, [initialVideoId]);

  const run = (clear: boolean) => {
    onError(null);
    void (async () => {
      setRowSaving(true);
      try {
        const fd = new FormData();
        fd.append("slug", courseSlug);
        fd.append("topicId", topicId);
        fd.append("youtubeId", clear ? "" : val.trim());
        const r = await setTopicVideoId(fd);
        if (!r.success) {
          onError(r.error ?? "Could not update topic video");
          return;
        }
        await onSaved();
      } catch (e) {
        onError(e instanceof Error ? e.message : "Request failed");
      } finally {
        setRowSaving(false);
      }
    })();
  };

  return (
    <div className="flex flex-col gap-2 border-b border-primary/10 pb-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-spark">
        Topic video
      </span>
      <span className="text-sm text-text-primary">{topicTitle}</span>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="font-mono text-[10px] text-text-primary"
        placeholder="YouTube URL or 11-char ID"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="xs"
          className="bg-spark text-bg hover:bg-spark/90"
          disabled={rowSaving}
          onClick={() => run(false)}
        >
          Save video
        </Button>
        <Button
          type="button"
          size="xs"
          variant="outline"
          className="border-secondary/60 text-secondary hover:bg-secondary/10"
          disabled={rowSaving || !initialVideoId}
          onClick={() => run(true)}
        >
          Clear video
        </Button>
      </div>
      <p className="text-[10px] text-text-secondary">
        Stored ID:{" "}
        <span className="font-mono text-text-primary">
          {initialVideoId || "—"}
        </span>
      </p>
    </div>
  );
}

function TopicQuizAdminRow({
  courseSlug,
  topic,
  mutationKey,
  runMutation,
  mutationSaveKey,
  mutationClearKey,
  onError,
  onSaved,
}: {
  courseSlug: string;
  topic: { id: string; title: string; topicQuiz?: TopicQuizConfig };
  mutationKey: string | null;
  runMutation: (key: string, fn: () => Promise<void>) => void;
  mutationSaveKey: string;
  mutationClearKey: string;
  onError: (msg: string | null) => void;
  onSaved: () => Promise<void>;
}) {
  const fallback = resolveTopicQuizContent(topic);
  const q = topic.topicQuiz;

  const [question, setQuestion] = useState(
    () => q?.question?.trim() || fallback.question,
  );
  const [labelA, setLabelA] = useState(
    () => q?.options?.find((o) => o.value === "a")?.label ?? fallback.options[0]?.label ?? "",
  );
  const [labelB, setLabelB] = useState(
    () => q?.options?.find((o) => o.value === "b")?.label ?? fallback.options[1]?.label ?? "",
  );
  const [labelC, setLabelC] = useState(
    () => q?.options?.find((o) => o.value === "c")?.label ?? fallback.options[2]?.label ?? "",
  );
  const [labelD, setLabelD] = useState(
    () => q?.options?.find((o) => o.value === "d")?.label ?? fallback.options[3]?.label ?? "",
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    () => (q?.correctAnswer && /^[a-d]$/i.test(q.correctAnswer) ? q.correctAnswer.toLowerCase() : "a"),
  );

  useEffect(() => {
    const fb = resolveTopicQuizContent(topic);
    const next = topic.topicQuiz;
    setQuestion(next?.question?.trim() || fb.question);
    setLabelA(next?.options?.find((o) => o.value === "a")?.label ?? fb.options[0]?.label ?? "");
    setLabelB(next?.options?.find((o) => o.value === "b")?.label ?? fb.options[1]?.label ?? "");
    setLabelC(next?.options?.find((o) => o.value === "c")?.label ?? fb.options[2]?.label ?? "");
    setLabelD(next?.options?.find((o) => o.value === "d")?.label ?? fb.options[3]?.label ?? "");
    setCorrectAnswer(
      next?.correctAnswer && /^[a-d]$/i.test(next.correctAnswer)
        ? next.correctAnswer.toLowerCase()
        : "a",
    );
  }, [topic.id, topic.topicQuiz, topic.title]);

  return (
    <div className="flex flex-col gap-2 rounded border border-growth/25 bg-growth/5 p-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-growth">
        Topic check-in quiz
      </p>
      <p className="text-[10px] text-text-secondary">
        Custom question and four answers (learners see this on the dashboard). Omit saving to keep the default template + overrides file for the correct answer.
      </p>
      <label className="text-[10px] font-medium text-text-primary">
        Question
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-primary/25 bg-surface px-2 py-1 text-[11px] text-text-primary outline-none focus:border-spark"
        />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            ["a", labelA, setLabelA],
            ["b", labelB, setLabelB],
            ["c", labelC, setLabelC],
            ["d", labelD, setLabelD],
          ] as const
        ).map(([key, val, setVal]) => (
          <label key={key} className="text-[10px] font-medium text-text-primary">
            Answer {key.toUpperCase()}
            <Input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="mt-1 bg-surface text-[11px] text-text-primary"
            />
          </label>
        ))}
      </div>
      <label className="text-[10px] font-medium text-text-primary">
        Correct answer
        <Select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="mt-1 h-9 w-full max-w-[120px] text-[11px]"
        >
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </Select>
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          size="xs"
          className="bg-growth text-bg hover:bg-growth/90"
          disabled={mutationKey === mutationSaveKey}
          onClick={() => {
            onError(null);
            void runMutation(mutationSaveKey, async () => {
              const fd = new FormData();
              fd.append("slug", courseSlug);
              fd.append("topicId", topic.id);
              fd.append("question", question.trim());
              fd.append("correctAnswer", correctAnswer);
              fd.append("labelA", labelA.trim());
              fd.append("labelB", labelB.trim());
              fd.append("labelC", labelC.trim());
              fd.append("labelD", labelD.trim());
              const r = await setTopicQuiz(fd);
              if (!r.success) {
                onError(r.error ?? "Could not save quiz");
                return;
              }
              await onSaved();
            });
          }}
        >
          Save quiz
        </Button>
        <Button
          type="button"
          size="xs"
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
          disabled={!topic.topicQuiz || mutationKey === mutationClearKey}
          onClick={() => {
            if (
              !window.confirm(
                "Remove custom quiz for this topic? Learners will see the default check-in again.",
              )
            ) {
              return;
            }
            onError(null);
            void runMutation(mutationClearKey, async () => {
              const fd = new FormData();
              fd.append("slug", courseSlug);
              fd.append("topicId", topic.id);
              fd.append("clear", "1");
              const r = await setTopicQuiz(fd);
              if (!r.success) {
                onError(r.error ?? "Could not remove quiz");
                return;
              }
              await onSaved();
            });
          }}
        >
          Delete custom quiz
        </Button>
      </div>
    </div>
  );
}

