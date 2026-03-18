"use server";

import { promises as fs } from "fs";
import path from "path";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import NewVideoAdded from "@/emails/NewVideoAdded";
import * as React from "react";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type AdminResult =
  | { success: true; message?: string }
  | { success: false; error: string };

type CourseTopic = {
  id: string;
  title: string;
  bullets?: string[];
};

type CourseWeek = {
  title: string;
  summary?: string;
  topics: CourseTopic[];
};

type Course = {
  slug: string;
  title: string;
  description: string;
  weeks: number;
  weeksDetail?: CourseWeek[];
  videos?: { week: number; title: string; youtubeId: string }[];
};

function ensureAdminRole(role: unknown): role is "admin" {
  if (!role) return false;
  const s = String(role).toLowerCase().trim();
  return s === "admin";
}

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const role =
    me.publicMetadata.role ?? (me.unsafeMetadata as any)?.role ?? null;
  if (!ensureAdminRole(role)) {
    throw new Error("Not authorized");
  }
  return { client };
}

function coursesFilePath() {
  return path.join(process.cwd(), "data", "courses.json");
}

async function readCourses(): Promise<Course[]> {
  const file = coursesFilePath();
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Course[];
}

async function writeCourses(courses: Course[]) {
  const file = coursesFilePath();
  await fs.writeFile(file, JSON.stringify(courses, null, 2), "utf8");
}

export async function adminListUsers() {
  const { client } = await requireAdmin();
  const list = await client.users.getUserList({});
  const users = list.data ?? [];

  type AdminUserRow = {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    enrolledCourses: string[];
    pendingEnrollments: { courseSlug: string; requestedAt: string }[];
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
        | { courseSlug: string; requestedAt: string; message?: string }[]
        | undefined) ?? [];
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
      pendingEnrollments: pending.map((p) => ({
        courseSlug: p.courseSlug,
        requestedAt: p.requestedAt,
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

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        enrolledCourses: updatedEnrolled,
        progress: updatedProgress,
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
  const list = await client.users.getUserList({});
  const users = list.data ?? [];

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
    return { success: false, error: "Failed to create course" };
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
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(slug: string): Promise<AdminResult> {
  try {
    const { client } = await requireAdmin();
    const courses = await readCourses();
    const next = courses.filter((c) => c.slug !== slug);
    await writeCourses(next);

    // Clean up user metadata
    const list = await client.users.getUserList({});
    const users = list.data ?? [];
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
    return { success: false, error: "Failed to delete course" };
  }
}

export async function addCourseVideo(formData: FormData): Promise<AdminResult> {
  try {
    const { userId: adminUserId } = await auth();
    const { client } = await requireAdmin();
    const slug = (formData.get("slug") as string | null)?.trim();
    const weekStr = (formData.get("week") as string | null) ?? "1";
    const week = Number.parseInt(weekStr, 10) || 1;
    const title =
      (formData.get("title") as string | null)?.trim() ?? `Week ${week}`;
    const youtubeId =
      (formData.get("youtubeId") as string | null)?.trim() ?? "";

    if (!slug || !youtubeId) {
      return { success: false, error: "Slug and YouTube ID are required" };
    }

    const courses = await readCourses();
    const idx = courses.findIndex((c) => c.slug === slug);
    if (idx === -1) {
      return { success: false, error: "Course not found" };
    }

    const course = courses[idx];
    const videos = course.videos ?? [];
    videos.push({ week, title, youtubeId });

    courses[idx] = { ...course, videos };
    await writeCourses(courses);

    // Best-effort email notification to enrolled learners.
    try {
      if (resend) {
        const videoLink = `https://youtube.com/watch?v=${encodeURIComponent(
          youtubeId,
        )}`;

        const sendToAll = process.env.SEND_VIDEO_EMAILS_TO_ALL === "true";
        const testEmail = process.env.VIDEO_EMAIL_TEST_TO?.trim() ?? null;

        // MVP mode: send to test email if set; otherwise only to the admin who triggered the change.
        if (!sendToAll) {
          const adminUser = adminUserId
            ? await client.users.getUser(adminUserId)
            : null;

          const toEmail =
            testEmail ??
            adminUser?.emailAddresses?.[0]?.emailAddress ??
            adminUser?.primaryEmailAddress?.emailAddress ??
            null;
          const displayName =
            adminUser?.firstName ?? adminUser?.username ?? "Student";

          if (toEmail) {
            const html = await render(
              React.createElement(NewVideoAdded, {
                name: displayName,
                course: course.title,
                week,
                videoTitle: title,
                videoLink: videoLink,
              }),
            );
            await resend.emails.send({
              from: "UltimaSpark Academy <noreply@ultimaspark.com>",
              to: toEmail,
              subject: `New video in Week ${week} of ${course.title}`,
              html,
            });
          }
        } else {
          // Full mode: send to all enrolled learners for this course.
          const list = await client.users.getUserList({});
          const users = list.data ?? [];

          for (const u of users) {
            const enrolled =
              (u.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
            if (!enrolled.includes(slug)) continue;

            const toEmail =
              u.emailAddresses?.[0]?.emailAddress ??
              u.primaryEmailAddress?.emailAddress ??
              null;
            if (!toEmail) continue;

            const displayName = u.firstName ?? u.username ?? "Student";
            const html = await render(
              React.createElement(NewVideoAdded, {
                name: displayName,
                course: course.title,
                week,
                videoTitle: title,
                videoLink: videoLink,
              }),
            );

            try {
              await resend.emails.send({
                from: "UltimaSpark Academy <noreply@ultimaspark.com>",
                to: toEmail,
                subject: `New video in Week ${week} of ${course.title}`,
                html,
              });
            } catch (err) {
              console.error(
                `addCourseVideo email send failed for user ${u.id}:`,
                err,
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("addCourseVideo email notification error:", err);
    }

    return { success: true, message: "Video added" };
  } catch (err) {
    console.error("addCourseVideo error", err);
    return { success: false, error: "Failed to add video" };
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
    return { success: false, error: "Failed to update curriculum" };
  }
}


