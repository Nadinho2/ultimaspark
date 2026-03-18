"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminListCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseVideo,
  removeCourseVideo,
  updateCourseCurriculum,
} from "@/app/actions/admin";

type AdminCourseRow = Awaited<ReturnType<typeof adminListCourses>>[number];

export function CoursesSection() {
  const [courses, setCourses] = useState<AdminCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [formOpenSlug, setFormOpenSlug] = useState<string | null>(null);
  const [videoFormSlug, setVideoFormSlug] = useState<string | null>(null);
  const [curriculumSlug, setCurriculumSlug] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({
    week: 1,
    title: "",
    youtubeId: "",
  });
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    description: "",
    weeks: 6,
  });
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await adminListCourses();
      if (!cancelled) {
        setCourses(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("title", newCourse.title);
      if (newCourse.slug) fd.append("slug", newCourse.slug);
      fd.append("description", newCourse.description);
      fd.append("weeks", String(newCourse.weeks));
      const result = await createCourse(fd);
      if (result.success) {
        const refreshed = await adminListCourses();
        setCourses(refreshed);
        setNewCourse({
          title: "",
          slug: "",
          description: "",
          weeks: 6,
        });
        router.refresh();
      }
    });
  };

  const handleUpdate = (c: AdminCourseRow) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("originalSlug", c.slug);
      fd.append("title", c.title);
      fd.append("slug", c.slug);
      fd.append("description", c.description);
      fd.append("weeks", String(c.weeks));
      const result = await updateCourse(fd);
      if (result.success) {
        const refreshed = await adminListCourses();
        setCourses(refreshed);
        setFormOpenSlug(null);
        router.refresh();
      }
    });
  };

  const handleDelete = (slug: string) => {
    if (!slug) return;
    const confirmDelete = window.confirm(
      "Delete this course and remove it from all users? This cannot be undone.",
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      const result = await deleteCourse(slug);
      if (result.success) {
        setCourses((prev) => prev.filter((c) => c.slug !== slug));
        router.refresh();
      }
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
    <div className="space-y-4">
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
            size="sm"
            className="bg-spark text-bg hover:bg-spark/90"
            disabled={isPending || !newCourse.title}
            onClick={handleCreate}
          >
            Create Course
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {courses.length === 0 ? (
          <p className="text-sm text-text-secondary">No courses configured.</p>
        ) : (
          courses.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col gap-2 rounded-lg border border-primary/15 bg-surface/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 space-y-1">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    slug: <span className="font-mono">{c.slug}</span> • weeks:{" "}
                    {c.weeks} • enrolled: {c.enrolledCount}
                  </p>
                </div>
                {formOpenSlug === c.slug && (
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
                {/* Videos management */}
                <div className="mt-2 space-y-1 rounded-md border border-primary/20 bg-surface/60 p-2">
                  <p className="text-[11px] font-medium text-text-primary">
                    Videos
                  </p>
                  {(c as any).videos && (c as any).videos.length > 0 ? (
                    <ul className="space-y-1">
                      {(c as any).videos.map(
                        (v: {
                          week: number;
                          title: string;
                          youtubeId: string;
                        }) => (
                          <li
                            key={v.youtubeId}
                            className="flex items-center justify-between text-[11px] text-text-secondary"
                          >
                            <span>
                              Week {v.week}: {v.title}{" "}
                              <span className="font-mono text-[10px]">
                                ({v.youtubeId})
                              </span>
                            </span>
                            <Button
                              size="xs"
                              variant="destructive"
                              disabled={isPending}
                              onClick={() =>
                                startTransition(async () => {
                                  const result = await removeCourseVideo(
                                    c.slug,
                                    v.youtubeId,
                                  );
                                  if (result.success) {
                                    const refreshed =
                                      await adminListCourses();
                                    setCourses(refreshed);
                                    setVideoFormSlug(null);
                                    setNewVideo({
                                      week: 1,
                                      title: "",
                                      youtubeId: "",
                                    });
                                    router.refresh();
                                  }
                                })
                              }
                            >
                              Remove
                            </Button>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-text-secondary">
                      No videos configured.
                    </p>
                  )}
                  {videoFormSlug === c.slug && (
                    <div className="mt-2 grid gap-1 sm:grid-cols-[80px_1fr]">
                      <Input
                        type="number"
                        min={1}
                        max={c.weeks}
                        value={newVideo.week}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            week: Number(e.target.value) || 1,
                          }))
                        }
                        className="bg-surface text-[11px] text-text-primary"
                        placeholder="Week"
                      />
                      <Input
                        value={newVideo.title}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="bg-surface text-[11px] text-text-primary"
                        placeholder="Video title (optional)"
                      />
                      <Input
                        value={newVideo.youtubeId}
                        onChange={(e) =>
                          setNewVideo((prev) => ({
                            ...prev,
                            youtubeId: e.target.value,
                          }))
                        }
                        className="sm:col-span-2 bg-surface text-[11px] text-text-primary"
                        placeholder="YouTube ID (e.g. dQw4w9WgXcQ)"
                      />
                      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-secondary/60 text-secondary hover:bg-secondary/10"
                          onClick={() => {
                            setVideoFormSlug(null);
                            setNewVideo({
                              week: 1,
                              title: "",
                              youtubeId: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="xs"
                          className="bg-spark text-bg hover:bg-spark/90"
                          disabled={isPending || !newVideo.youtubeId}
                          onClick={() =>
                            startTransition(async () => {
                              const fd = new FormData();
                              fd.append("slug", c.slug);
                              fd.append("week", String(newVideo.week));
                              if (newVideo.title)
                                fd.append("title", newVideo.title);
                              fd.append("youtubeId", newVideo.youtubeId);
                              const result = await addCourseVideo(fd);
                              if (result.success) {
                                const refreshed =
                                  await adminListCourses();
                                setCourses(refreshed);
                                setVideoFormSlug(null);
                                setNewVideo({
                                  week: 1,
                                  title: "",
                                  youtubeId: "",
                                });
                                router.refresh();
                              }
                            })
                          }
                        >
                          Add Video
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
                              key={`${c.slug}-week-${index + 1}`}
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
                                      const topics = lines.map((title, idx) => ({
                                        id: `${row.slug}-week-${index + 1}-topic-${idx + 1}`,
                                        title,
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
                          size="xs"
                          className="bg-spark text-bg hover:bg-spark/90"
                          disabled={isPending}
                          onClick={() =>
                            startTransition(async () => {
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
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-secondary/60 text-secondary hover:bg-secondary/10"
                  onClick={() =>
                    setFormOpenSlug((prev) => (prev === c.slug ? null : c.slug))
                  }
                >
                  {formOpenSlug === c.slug ? "Cancel" : "Edit"}
                </Button>
                {formOpenSlug === c.slug ? (
                  <Button
                    size="sm"
                    className="bg-spark text-bg hover:bg-spark/90"
                    disabled={isPending}
                    onClick={() => handleUpdate(c)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleDelete(c.slug)}
                  >
                    Delete
                  </Button>
                )}
                <Button
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

