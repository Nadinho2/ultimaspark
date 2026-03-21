"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import NewVideoAdded from "@/emails/NewVideoAdded";
import * as React from "react";
import {
  extractYouTubeId,
  type Course,
  type CourseWeek,
  type TopicQuizConfig,
} from "@/lib/courses";
import {
  readCourses,
  writeCourses,
  persistErrorMessage,
} from "@/lib/course-store";
import { ADMIN_ROLE_HELP, userHasAdminRole } from "@/lib/admin-role";
import { listAllClerkUsers } from "@/lib/clerk-list-all-users";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type AdminResult =
  | { success: true; message?: string }
  | { success: false; error: string };

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) {
    throw new Error(`Not authorized. ${ADMIN_ROLE_HELP}`);
  }
  return { client, userId };
}

function findWeekNumberForTopic(course: Course, topicId: string): number {
  const weeks = course.weeksDetail ?? [];
  for (let i = 0; i < weeks.length; i += 1) {
    if ((weeks[i].topics ?? []).some((t) => t.id === topicId)) {
      return i + 1;
    }
  }
  return 1;
}

/** Notify learners (or admin/test in opt-out mode) when a lesson video is published. */
async function notifyEnrolledNewLessonVideo(opts: {
  client: Awaited<ReturnType<typeof clerkClient>>;
  adminUserId: string | null;
  courseSlug: string;
  courseTitle: string;
  week: number;
  youtubeId: string;
  topicId?: string | null;
  videoTitleFallback?: string;
}): Promise<void> {
  if (!resend) return;

  const videoLink = `https://youtube.com/watch?v=${encodeURIComponent(
    opts.youtubeId,
  )}`;
  const videoTitle =
    opts.topicId != null
      ? `New lesson video (${opts.topicId})`
      : (opts.videoTitleFallback ?? `Week ${opts.week}`);

  // Default: email all enrolled learners. Set SEND_VIDEO_EMAILS_TO_ALL=false for admin/test-only.
  const sendToAll = process.env.SEND_VIDEO_EMAILS_TO_ALL !== "false";
  const testEmail = process.env.VIDEO_EMAIL_TEST_TO?.trim() ?? null;

  try {
    if (!sendToAll) {
      const adminUser = opts.adminUserId
        ? await opts.client.users.getUser(opts.adminUserId)
        : null;
      const toEmail =
        testEmail ??
        adminUser?.emailAddresses?.[0]?.emailAddress ??
        adminUser?.primaryEmailAddress?.emailAddress ??
        null;
      const displayName =
        adminUser?.firstName ?? adminUser?.username ?? "Team";
      if (!toEmail) {
        console.warn(
          "[new video email] No recipient: set VIDEO_EMAIL_TEST_TO, ensure admin has an email, or leave SEND_VIDEO_EMAILS_TO_ALL unset (defaults to notifying enrolled learners).",
        );
        return;
      }
      const html = await render(
        React.createElement(NewVideoAdded, {
          name: displayName,
          course: opts.courseTitle,
          week: opts.week,
          videoTitle,
          videoLink,
        }),
      );
      await resend.emails.send({
        from: "UltimaSpark Academy <noreply@ultimaspark.com>",
        to: toEmail,
        subject: `New video in Week ${opts.week} of ${opts.courseTitle}`,
        html,
      });
      return;
    }

    const users = await listAllClerkUsers(opts.client);
    for (const u of users) {
      const enrolled =
        (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
      if (!enrolled.includes(opts.courseSlug)) continue;
      const toEmail =
        u.emailAddresses?.[0]?.emailAddress ??
        u.primaryEmailAddress?.emailAddress ??
        null;
      if (!toEmail) continue;
      const displayName = u.firstName ?? u.username ?? "Student";
      const html = await render(
        React.createElement(NewVideoAdded, {
          name: displayName,
          course: opts.courseTitle,
          week: opts.week,
          videoTitle,
          videoLink,
        }),
      );
      try {
        await resend.emails.send({
          from: "UltimaSpark Academy <noreply@ultimaspark.com>",
          to: toEmail,
          subject: `New video in Week ${opts.week} of ${opts.courseTitle}`,
          html,
        });
      } catch (err) {
        console.error(
          `notifyEnrolledNewLessonVideo failed for user ${u.id}:`,
          err,
        );
      }
    }
  } catch (err) {
    console.error("notifyEnrolledNewLessonVideo error:", err);
  }
}

export async function adminListUsers() {
  const { client } = await requireAdmin();
  const users = await listAllClerkUsers(client);

  type AdminUserRow = {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    enrolledCourses: string[];
    enrollmentTypes: Record<string, "subscription" | "cohort">;
    cohortAssignments: Record<string, string>;
    pendingEnrollments: {
      courseSlug: string;
      requestedAt: string;
      enrollmentType?: "subscription" | "cohort";
    }[];
    progressSummary: Record<string, { completedTopics: number; completedWeeks: number }>;
  };

  const rows: AdminUserRow[] = [];

  for (const u of users) {
    const name =
      [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || null;
    const primaryEmail =
      u.emailAddresses?.[0]?.emailAddress ??
      u.primaryEmailAddress?.emailAddress ??
      null;
    const role =
      (u.publicMetadata.role as string | undefined) ??
      ((u.unsafeMetadata as any)?.role as string | undefined) ??
      null;
    const enrolled =
      (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
    const pending =
      (u.publicMetadata.pendingEnrollments as
        | {
            courseSlug: string;
            requestedAt: string;
            message?: string;
            enrollmentType?: "subscription" | "cohort";
          }[]
        | undefined) ?? [];
    const enrollmentTypes =
      (u.publicMetadata.enrollmentTypes as
        | Record<string, "subscription" | "cohort">
        | undefined) ?? {};
    const cohortAssignments =
      (u.publicMetadata.cohortAssignments as Record<string, string> | undefined) ?? {};
    const progress =
      (u.publicMetadata.progress as
        | Record<
            string,
            { completedWeeks?: number[]; completedTopics?: string[] }
          >
        | undefined) ?? {};

    const summary: Record<
      string,
      { completedTopics: number; completedWeeks: number }
    > = {};
    for (const [slug, p] of Object.entries(progress)) {
      summary[slug] = {
        completedTopics: p.completedTopics?.length ?? 0,
        completedWeeks: p.completedWeeks?.length ?? 0,
      };
    }

    rows.push({
      id: u.id,
      name,
      email: primaryEmail,
      role: role ?? null,
      enrolledCourses: enrolled,
      enrollmentTypes,
      cohortAssignments,
      pendingEnrollments: pending.map((p) => ({
        courseSlug: p.courseSlug,
        requestedAt: p.requestedAt,
        enrollmentType: p.enrollmentType,
      })),
      progressSummary: summary,
    });
  }

  return rows;
}

export async function removeCourseFromUser(
  userId: string,
  courseSlug: string,
): Promise<AdminResult> {
  try {
    const { client } = await requireAdmin();
    const user = await client.users.getUser(userId);
    const enrolled =
      (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
    const updatedEnrolled = enrolled.filter((c) => c !== courseSlug);

    const progress =
      (user.publicMetadata.progress as Record<string, unknown> | undefined) ??
      {};
    const updatedProgress = { ...progress };
    delete (updatedProgress as any)[courseSlug];

    const enrollmentTypes = {
      ...((user.publicMetadata.enrollmentTypes as
        | Record<string, "subscription" | "cohort">
        | undefined) ?? {}),
    };
    delete enrollmentTypes[courseSlug];

    const cohortAssignments = {
      ...((user.publicMetadata.cohortAssignments as
        | Record<string, string>
        | undefined) ?? {}),
    };
    delete cohortAssignments[courseSlug];

    const enrollmentDates = {
      ...((user.publicMetadata.enrollmentDates as
        | Record<string, string>
        | undefined) ?? {}),
    };
    delete enrollmentDates[courseSlug];

    const liveSessionVideos = {
      ...((user.publicMetadata.liveSessionVideos as
        | Record<string, unknown>
        | undefined) ?? {}),
    };
    delete liveSessionVideos[courseSlug];

    const claimedCertificates =
      (user.publicMetadata.claimedCertificates as string[] | undefined) ??
      [];
    const updatedCertificates = claimedCertificates.filter(
      (s) => s !== courseSlug,
    );

    const pendingEnrollments =
      (user.publicMetadata.pendingEnrollments as
        | { courseSlug: string; requestedAt: string }[]
        | undefined) ?? [];
    const updatedPending = pendingEnrollments.filter(
      (p) => p.courseSlug !== courseSlug,
    );

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        enrolledCourses: updatedEnrolled,
        progress: updatedProgress,
        enrollmentTypes,
        cohortAssignments,
        enrollmentDates,
        liveSessionVideos,
        claimedCertificates: updatedCertificates,
        pendingEnrollments: updatedPending,
      },
    });

    return { success: true, message: "Course removed from user" };
  } catch (err) {
    console.error("removeCourseFromUser error", err);
    return { success: false, error: "Failed to remove course" };
  }
}

export async function adminListCourses() {
  await requireAdmin();
  const courses = await readCourses();

  const client = await clerkClient();
  const users = await listAllClerkUsers(client);

  const enrolledCounts: Record<string, number> = {};
  for (const c of courses) {
    enrolledCounts[c.slug] = 0;
  }
  for (const u of users) {
    const enrolled =
      (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
    for (const slug of enrolled) {
      if (slug in enrolledCounts) {
        enrolledCounts[slug] += 1;
      }
    }
  }

  return courses.map((c) => ({
    ...c,
    enrolledCount: enrolledCounts[c.slug] ?? 0,
  }));
}

export async function createCourse(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const title = (formData.get("title") as string | null)?.trim();
    let slug = (formData.get("slug") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() ?? "";
    const weeksStr = (formData.get("weeks") as string | null) ?? "6";
    const weeks = Number.parseInt(weeksStr, 10) || 6;

    if (!title) {
      return { success: false, error: "Title is required" };
    }
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const courses = await readCourses();
    if (courses.some((c) => c.slug === slug)) {
      return { success: false, error: "Course slug already exists" };
    }

    courses.push({ slug, title, description, weeks });
    await writeCourses(courses);
    return { success: true, message: "Course created" };
  } catch (err) {
    console.error("createCourse error", err);
    return { success: false, error: persistErrorMessage(err, "Failed to create course") };
  }
}

export async function updateCourse(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const originalSlug = (formData.get("originalSlug") as string | null)?.trim();
    const title = (formData.get("title") as string | null)?.trim();
    const slug = (formData.get("slug") as string | null)?.trim();
    const description =
      (formData.get("description") as string | null)?.trim() ?? "";
    const weeksStr = (formData.get("weeks") as string | null) ?? "6";
    const weeks = Number.parseInt(weeksStr, 10) || 6;

    if (!originalSlug) {
      return { success: false, error: "Missing course identifier" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === originalSlug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const nextSlug = slug && slug.length > 0 ? slug : originalSlug;
    if (nextSlug !== originalSlug && courses.some((c) => c.slug === nextSlug)) {
      return { success: false, error: "New slug already in use" };
    }

    const existing = courses[idx];
    courses[idx] = {
      ...existing,
      slug: nextSlug,
      title: title && title.length > 0 ? title : existing.title,
      description,
      weeks,
    };

    await writeCourses(courses);

    // Note: not renaming users' metadata slugs here for simplicity.
    return { success: true, message: "Course updated" };
  } catch (err) {
    console.error("updateCourse error", err);
    return { success: false, error: persistErrorMessage(err, "Failed to update course") };
  }
}

export async function deleteCourse(slug: string): Promise<AdminResult> {
  try {
    const { client } = await requireAdmin();
    const courses = await readCourses();
    const next = courses.filter((c) => c.slug !== slug);
    await writeCourses(next);

    // Clean up user metadata
    const users = await listAllClerkUsers(client);
    for (const u of users) {
      const enrolled =
        (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
      const pending =
        (u.publicMetadata.pendingEnrollments as
          | { courseSlug: string; requestedAt: string; message?: string }[]
          | undefined) ?? [];
      const progress =
        (u.publicMetadata.progress as Record<string, unknown> | undefined) ??
        {};

      const updatedEnrolled = enrolled.filter((c) => c !== slug);
      const updatedPending = pending.filter((p) => p.courseSlug !== slug);
      const updatedProgress = { ...progress };
      delete (updatedProgress as any)[slug];

      await client.users.updateUserMetadata(u.id, {
        publicMetadata: {
          ...u.publicMetadata,
          enrolledCourses: updatedEnrolled,
          pendingEnrollments: updatedPending,
          progress: updatedProgress,
        },
      });
    }

    return { success: true, message: "Course deleted" };
  } catch (err) {
    console.error("deleteCourse error", err);
    return { success: false, error: persistErrorMessage(err, "Failed to delete course") };
  }
}

export async function addCourseVideo(formData: FormData): Promise<AdminResult> {
  try {
    const { client, userId: adminUserId } = await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const topicId = (formData.get("topicId") as string | null)?.trim();
    const weekStr = (formData.get("week") as string | null) ?? "1";
    const week = Number.parseInt(weekStr, 10) || 1;
    const title =
      (formData.get("title") as string | null)?.trim() ?? `Week ${week}`;
    const youtubeIdInput =
      (formData.get("youtubeId") as string | null)?.trim() ?? "";
    const youtubeId = extractYouTubeId(youtubeIdInput);

    if (!slug || !youtubeId) {
      return { success: false, error: "Slug and YouTube ID are required" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const course = courses[idx];
    const weeksDetail = course.weeksDetail ?? [];
    let updatedByTopic = false;

    // Preferred mode: assign video to a specific topic.
    if (topicId && weeksDetail.length > 0) {
      const updatedWeeks = weeksDetail.map((w) => ({
        ...w,
        topics: (w.topics ?? []).map((t) =>
          t.id === topicId ? { ...t, videoId: youtubeId } : t,
        ),
      }));
      const foundTopic = updatedWeeks.some((w) =>
        (w.topics ?? []).some((t) => t.id === topicId),
      );
      if (foundTopic) {
        courses[idx] = { ...course, weeksDetail: updatedWeeks };
        updatedByTopic = true;
      }
    }

    // Back-compat mode: keep legacy week videos list for older records.
    if (!updatedByTopic) {
      const videos = course.videos ?? [];
      videos.push({ week, title, youtubeId });
      courses[idx] = { ...course, videos };
    }
    await writeCourses(courses);

    await notifyEnrolledNewLessonVideo({
      client,
      adminUserId,
      courseSlug: slug,
      courseTitle: course.title,
      week,
      youtubeId,
      topicId: topicId || null,
      videoTitleFallback: title,
    });

    return { success: true, message: "Video added" };
  } catch (err) {
    console.error("addCourseVideo error", err);
    return { success: false, error: persistErrorMessage(err, "Failed to add video") };
  }
}

export async function removeCourseVideo(
  slug: string,
  youtubeId: string,
): Promise<AdminResult> {
  try {
    await requireAdmin();
    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const course = courses[idx];
    const videos = (course.videos ?? []).filter(
      (v) => v.youtubeId !== youtubeId,
    );
    courses[idx] = { ...course, videos };
    await writeCourses(courses);

    return { success: true, message: "Video removed" };
  } catch (err) {
    console.error("removeCourseVideo error", err);
    return { success: false, error: "Failed to remove video" };
  }
}

export async function updateCourseCurriculum(
  formData: FormData,
): Promise<AdminResult> {
  try {
    await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const weeksDetailRaw = formData.get("weeksDetail") as string | null;

    if (!slug) {
      return { success: false, error: "Slug is required" };
    }
    if (!weeksDetailRaw) {
      return { success: false, error: "Curriculum payload missing" };
    }

    let weeksDetail: CourseWeek[];
    try {
      weeksDetail = JSON.parse(weeksDetailRaw) as CourseWeek[];
    } catch {
      return { success: false, error: "Invalid curriculum JSON" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const existing = courses[idx];
    courses[idx] = {
      ...existing,
      weeksDetail,
    };

    await writeCourses(courses);
    return { success: true, message: "Curriculum updated" };
  } catch (err) {
    console.error("updateCourseCurriculum error", err);
    return { success: false, error: persistErrorMessage(err, "Failed to update curriculum") };
  }
}

export async function addLiveSessionVideo(formData: FormData): Promise<AdminResult> {
  try {
    const { client } = await requireAdmin();
    const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
    const cohortId = (formData.get("cohortId") as string | null)?.trim();
    const weekKey = (formData.get("weekKey") as string | null)?.trim();
    const topicId = (formData.get("topicId") as string | null)?.trim() || "__general__";
    const youtubeIdInput = (formData.get("youtubeId") as string | null)?.trim();

    if (!courseSlug || !cohortId || !weekKey || !youtubeIdInput) {
      return {
        success: false,
        error: "courseSlug, cohortId, weekKey and youtubeId are required",
      };
    }

    const youtubeId = extractYouTubeId(youtubeIdInput);

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === courseSlug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }
    const course = courses[idx];
    const cohortLiveVideos = course.cohortLiveVideos ?? {};
    const existingCohortVideos = cohortLiveVideos[cohortId] ?? {};
    const currentWeekBucket = existingCohortVideos[weekKey];
    const normalizedWeekBucket: Record<string, string[]> = Array.isArray(currentWeekBucket)
      ? { __general__: currentWeekBucket }
      : (currentWeekBucket ?? {});
    const existingTopicVideos = normalizedWeekBucket[topicId] ?? [];
    if (!existingTopicVideos.includes(youtubeId)) {
      normalizedWeekBucket[topicId] = [...existingTopicVideos, youtubeId];
    }
    courses[idx] = {
      ...course,
      cohortLiveVideos: {
        ...cohortLiveVideos,
        [cohortId]: {
          ...existingCohortVideos,
          [weekKey]: normalizedWeekBucket,
        },
      },
      cohorts: Array.from(new Set([...(course.cohorts ?? []), cohortId])),
    };
    await writeCourses(courses);

    const users = await listAllClerkUsers(client);

    for (const u of users) {
      const enrolledCourses =
        (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
      const enrollmentTypes =
        (u.publicMetadata.enrollmentTypes as
          | Record<string, "subscription" | "cohort">
          | undefined) ?? {};
      const cohortAssignments =
        (u.publicMetadata.cohortAssignments as Record<string, string> | undefined) ?? {};

      if (!enrolledCourses.includes(courseSlug)) continue;
      if (enrollmentTypes[courseSlug] !== "cohort") continue;
      if (cohortAssignments[courseSlug] !== cohortId) continue;

      const liveSessionVideos =
        (u.publicMetadata.liveSessionVideos as
          | Record<string, Record<string, Record<string, string[]>>>
          | undefined) ?? {};

      const courseVideos = liveSessionVideos[courseSlug] ?? {};
      const cohortVideos = courseVideos[cohortId] ?? {};
      const existingUserWeekVideos = cohortVideos[weekKey];
      const normalizedUserWeekVideos: Record<string, string[]> = Array.isArray(existingUserWeekVideos)
        ? { __general__: existingUserWeekVideos }
        : (existingUserWeekVideos ?? {});
      const existingUserTopicVideos = normalizedUserWeekVideos[topicId] ?? [];
      if (!existingUserTopicVideos.includes(youtubeId)) {
        normalizedUserWeekVideos[topicId] = [...existingUserTopicVideos, youtubeId];
      }

      await client.users.updateUserMetadata(u.id, {
        publicMetadata: {
          ...u.publicMetadata,
          liveSessionVideos: {
            ...liveSessionVideos,
            [courseSlug]: {
              ...courseVideos,
              [cohortId]: {
                ...cohortVideos,
                [weekKey]: normalizedUserWeekVideos,
              },
            },
          },
        },
      });
    }

    return { success: true, message: "Live session video saved for this cohort" };
  } catch (err) {
    console.error("addLiveSessionVideo error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to add live session video"),
    };
  }
}

export async function createCourseCohort(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
    const cohortId = (formData.get("cohortId") as string | null)?.trim();
    if (!courseSlug || !cohortId) {
      return { success: false, error: "courseSlug and cohortId are required" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === courseSlug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const course = courses[idx];
    const cohorts = course.cohorts ?? [];
    if (!cohorts.includes(cohortId)) {
      courses[idx] = {
        ...course,
        cohorts: [...cohorts, cohortId],
        cohortLiveVideos: {
          ...(course.cohortLiveVideos ?? {}),
          [cohortId]: (course.cohortLiveVideos ?? {})[cohortId] ?? {},
        },
      };
      await writeCourses(courses);
    }

    return { success: true, message: "Cohort created" };
  } catch (err) {
    console.error("createCourseCohort error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to create cohort"),
    };
  }
}

export async function updateCohortLiveVideo(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
    const cohortId = (formData.get("cohortId") as string | null)?.trim();
    const weekKey = (formData.get("weekKey") as string | null)?.trim();
    const topicId = ((formData.get("topicId") as string | null)?.trim() || "__general__");
    const oldYoutubeId = (formData.get("oldYoutubeId") as string | null)?.trim();
    const newYoutubeId = (formData.get("newYoutubeId") as string | null)?.trim();

    if (!courseSlug || !cohortId || !weekKey || !oldYoutubeId || !newYoutubeId) {
      return {
        success: false,
        error: "courseSlug, cohortId, weekKey, oldYoutubeId and newYoutubeId are required",
      };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === courseSlug);
    if (idx === -1) return { success: false, error: "Course not found" };

    const course = courses[idx];
    const cohortLiveVideos = course.cohortLiveVideos ?? {};
    const cohortVideos = cohortLiveVideos[cohortId] ?? {};
    const weekBucket = cohortVideos[weekKey];
    const normalizedWeekBucket: Record<string, string[]> = Array.isArray(weekBucket)
      ? { __general__: weekBucket }
      : (weekBucket ?? {});
    const topicVideos = normalizedWeekBucket[topicId] ?? [];
    const videoIdx = topicVideos.findIndex((v) => v === oldYoutubeId);
    if (videoIdx === -1) return { success: false, error: "Video not found" };
    topicVideos[videoIdx] = newYoutubeId;
    normalizedWeekBucket[topicId] = topicVideos;

    courses[idx] = {
      ...course,
      cohortLiveVideos: {
        ...cohortLiveVideos,
        [cohortId]: {
          ...cohortVideos,
          [weekKey]: normalizedWeekBucket,
        },
      },
    };
    await writeCourses(courses);
    return { success: true, message: "Cohort video updated" };
  } catch (err) {
    console.error("updateCohortLiveVideo error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to update cohort video"),
    };
  }
}

export async function deleteCohortLiveVideo(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
    const cohortId = (formData.get("cohortId") as string | null)?.trim();
    const weekKey = (formData.get("weekKey") as string | null)?.trim();
    const topicId = ((formData.get("topicId") as string | null)?.trim() || "__general__");
    const youtubeId = (formData.get("youtubeId") as string | null)?.trim();

    if (!courseSlug || !cohortId || !weekKey || !youtubeId) {
      return { success: false, error: "courseSlug, cohortId, weekKey and youtubeId are required" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === courseSlug);
    if (idx === -1) return { success: false, error: "Course not found" };

    const course = courses[idx];
    const cohortLiveVideos = course.cohortLiveVideos ?? {};
    const cohortVideos = cohortLiveVideos[cohortId] ?? {};
    const weekBucket = cohortVideos[weekKey];
    const normalizedWeekBucket: Record<string, string[]> = Array.isArray(weekBucket)
      ? { __general__: weekBucket }
      : (weekBucket ?? {});
    const topicVideos = normalizedWeekBucket[topicId] ?? [];
    normalizedWeekBucket[topicId] = topicVideos.filter((v) => v !== youtubeId);

    courses[idx] = {
      ...course,
      cohortLiveVideos: {
        ...cohortLiveVideos,
        [cohortId]: {
          ...cohortVideos,
          [weekKey]: normalizedWeekBucket,
        },
      },
    };
    await writeCourses(courses);
    return { success: true, message: "Cohort video deleted" };
  } catch (err) {
    console.error("deleteCohortLiveVideo error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to delete cohort video"),
    };
  }
}

export async function setTopicVideoId(formData: FormData): Promise<AdminResult> {
  try {
    const { client, userId: adminUserId } = await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const topicId = (formData.get("topicId") as string | null)?.trim();
    const raw = (formData.get("youtubeId") as string | null)?.trim() ?? "";
    const youtubeId = raw ? extractYouTubeId(raw) : "";

    if (!slug || !topicId) {
      return { success: false, error: "slug and topicId are required" };
    }
    if (raw && !youtubeId) {
      return { success: false, error: "Could not parse a valid YouTube ID from that input" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) return { success: false, error: "Course not found" };

    const course = courses[idx];
    const weeksDetail = course.weeksDetail ?? [];

    let oldVideoId: string | undefined;
    for (const w of weeksDetail) {
      const hit = (w.topics ?? []).find((t) => t.id === topicId);
      if (hit) {
        oldVideoId = hit.videoId;
        break;
      }
    }

    let found = false;
    const updatedWeeks = weeksDetail.map((w) => ({
      ...w,
      topics: (w.topics ?? []).map((t) => {
        if (t.id !== topicId) return t;
        found = true;
        if (!youtubeId) {
          const { videoId: _removed, ...rest } = t;
          return rest;
        }
        return { ...t, videoId: youtubeId };
      }),
    }));

    if (!found) {
      return { success: false, error: "Topic not found in curriculum" };
    }

    courses[idx] = { ...course, weeksDetail: updatedWeeks };
    await writeCourses(courses);

    if (youtubeId && youtubeId !== oldVideoId) {
      const weekNum = findWeekNumberForTopic(course, topicId);
      await notifyEnrolledNewLessonVideo({
        client,
        adminUserId,
        courseSlug: slug,
        courseTitle: course.title,
        week: weekNum,
        youtubeId,
        topicId,
      });
    }

    return { success: true, message: "Topic video updated" };
  } catch (err) {
    console.error("setTopicVideoId error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to update topic video"),
    };
  }
}

const QUIZ_OPTION_KEYS = ["a", "b", "c", "d"] as const;

export async function setTopicQuiz(formData: FormData): Promise<AdminResult> {
  try {
    await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const topicId = (formData.get("topicId") as string | null)?.trim();
    const clear = (formData.get("clear") as string | null) === "1";

    if (!slug || !topicId) {
      return { success: false, error: "slug and topicId are required" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) return { success: false, error: "Course not found" };

    const course = courses[idx];
    const weeksDetail = course.weeksDetail ?? [];

    if (clear) {
      let foundTopic = false;
      const updatedWeeks = weeksDetail.map((w) => ({
        ...w,
        topics: (w.topics ?? []).map((t) => {
          if (t.id !== topicId) return t;
          foundTopic = true;
          const { topicQuiz: _removed, ...rest } = t;
          return rest;
        }),
      }));
      if (!foundTopic) {
        return { success: false, error: "Topic not found in curriculum" };
      }
      courses[idx] = { ...course, weeksDetail: updatedWeeks };
      await writeCourses(courses);
      return { success: true, message: "Topic quiz removed" };
    }

    const question = (formData.get("question") as string | null)?.trim() ?? "";
    const correctAnswer = (
      (formData.get("correctAnswer") as string | null) ?? "a"
    )
      .trim()
      .toLowerCase()
      .slice(0, 1);

    const labels = QUIZ_OPTION_KEYS.map(
      (k) =>
        (formData.get(`label${k.toUpperCase()}`) as string | null)?.trim() ??
        "",
    );

    if (!question) {
      return { success: false, error: "Quiz question is required" };
    }
    if (!/^[a-d]$/.test(correctAnswer)) {
      return { success: false, error: "Correct answer must be a, b, c, or d" };
    }
    if (labels.some((l) => !l)) {
      return { success: false, error: "All four answer labels are required" };
    }

    const topicQuiz: TopicQuizConfig = {
      question,
      correctAnswer,
      options: QUIZ_OPTION_KEYS.map((value, i) => ({
        value,
        label: labels[i]!,
      })),
    };

    let found = false;
    const updatedWeeks = weeksDetail.map((w) => ({
      ...w,
      topics: (w.topics ?? []).map((t) => {
        if (t.id !== topicId) return t;
        found = true;
        return { ...t, topicQuiz };
      }),
    }));

    if (!found) {
      return { success: false, error: "Topic not found in curriculum" };
    }

    courses[idx] = { ...course, weeksDetail: updatedWeeks };
    await writeCourses(courses);
    return { success: true, message: "Topic quiz saved" };
  } catch (err) {
    console.error("setTopicQuiz error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to save topic quiz"),
    };
  }
}

export async function updateTopicInstructorNotes(
  formData: FormData,
): Promise<AdminResult> {
  try {
    await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const raw = formData.get("notes") as string | null;
    if (!slug) {
      return { success: false, error: "slug is required" };
    }

    let parsed: Record<string, string> = {};
    if (raw && raw.trim().length > 0) {
      try {
        parsed = JSON.parse(raw) as Record<string, string>;
      } catch {
        return { success: false, error: "Invalid notes JSON" };
      }
    }

    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const key = k.trim();
      if (!key) continue;
      const text = typeof v === "string" ? v.trim() : "";
      if (text.length > 0) cleaned[key] = text;
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) return { success: false, error: "Course not found" };

    const course = courses[idx];
    courses[idx] = {
      ...course,
      topicInstructorNotes:
        Object.keys(cleaned).length > 0 ? cleaned : undefined,
    };
    await writeCourses(courses);
    return { success: true, message: "Instructor notes saved" };
  } catch (err) {
    console.error("updateTopicInstructorNotes error", err);
    return {
      success: false,
      error: persistErrorMessage(err, "Failed to save instructor notes"),
    };
  }
}


