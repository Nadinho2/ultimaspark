"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { userHasAdminRole } from "@/lib/admin-role";
import { listAllClerkUsers } from "@/lib/clerk-list-all-users";
import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeOnApproval from "@/emails/WelcomeOnApproval";
import { getCourses } from "@/lib/courses";
import * as React from "react";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export type PendingRow = {
  userId: string;
  name: string | null;
  email: string | null;
  courseSlug: string;
  requestedAt: string;
  message?: string;
  enrollmentType?: "subscription" | "cohort";
  preferredCohort?: string;
};

export async function listPendingEnrollments(): Promise<PendingRow[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) return [];

  const users = await listAllClerkUsers(client);

  const rows: PendingRow[] = [];
  for (const u of users) {
    const pending =
      (u.publicMetadata.pendingEnrollments as
        | {
            courseSlug: string;
            requestedAt: string;
            message?: string;
            enrollmentType?: "subscription" | "cohort";
            preferredCohort?: string;
          }[]
        | undefined) ?? [];
    if (!pending.length) continue;

    const primaryEmail =
      u.emailAddresses?.[0]?.emailAddress ??
      u.primaryEmailAddress?.emailAddress ??
      null;

    for (const p of pending) {
      rows.push({
        userId: u.id,
        name: u.firstName ?? u.username ?? null,
        email: primaryEmail,
        courseSlug: p.courseSlug,
        requestedAt: p.requestedAt,
        message: p.message,
        enrollmentType: p.enrollmentType ?? "subscription",
        preferredCohort: p.preferredCohort,
      });
    }
  }

  rows.sort((a, b) =>
    a.requestedAt < b.requestedAt ? 1 : a.requestedAt > b.requestedAt ? -1 : 0,
  );

  return rows;
}

type ModerationResult =
  | { success: true }
  | { success: false; error: string };

export async function approveEnrollment(
  targetUserId: string,
  courseSlug: string,
  enrollmentType: "subscription" | "cohort" = "subscription",
  cohortId?: string,
): Promise<ModerationResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) return { success: false, error: "Not authorized" };

  const user = await client.users.getUser(targetUserId);

  const enrolled =
    (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
  const pending =
    (user.publicMetadata.pendingEnrollments as
      | {
          courseSlug: string;
          requestedAt: string;
          message?: string;
          enrollmentType?: "subscription" | "cohort";
          preferredCohort?: string;
        }[]
      | undefined) ?? [];
  const enrollmentTypes =
    (user.publicMetadata.enrollmentTypes as
      | Record<string, "subscription" | "cohort">
      | undefined) ?? {};
  const cohortAssignments =
    (user.publicMetadata.cohortAssignments as Record<string, string> | undefined) ?? {};
  const pendingForCourse = pending.find((p) => p.courseSlug === courseSlug);
  const resolvedCohortId =
    enrollmentType === "cohort"
      ? (cohortId && cohortId.trim()) ||
        pendingForCourse?.preferredCohort ||
        `${courseSlug}-general`
      : undefined;

  const updatedEnrolled = enrolled.includes(courseSlug)
    ? enrolled
    : [...enrolled, courseSlug];
  const updatedPending = pending.filter((p) => p.courseSlug !== courseSlug);

  await client.users.updateUserMetadata(targetUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      enrolledCourses: updatedEnrolled,
      pendingEnrollments: updatedPending,
      enrollmentTypes: {
        ...enrollmentTypes,
        [courseSlug]: enrollmentType,
      },
      cohortAssignments:
        enrollmentType === "cohort" && resolvedCohortId
          ? {
              ...cohortAssignments,
              [courseSlug]: resolvedCohortId,
            }
          : cohortAssignments,
    },
  });

  // Best-effort email notification (do not block approval if email fails).
  try {
    if (resend) {
      const courseTitle =
        (await getCourses()).find((c) => c.slug === courseSlug)?.title ?? courseSlug;
      const toEmail =
        user.emailAddresses?.[0]?.emailAddress ??
        user.primaryEmailAddress?.emailAddress ??
        null;
      const displayName = user.firstName ?? user.username ?? "Student";

      if (toEmail) {
        const html = await render(
          React.createElement(WelcomeOnApproval, {
            name: displayName,
            course: courseTitle,
          }),
        );
        await resend.emails.send({
          from: "UltimaSpark Academy <noreply@ultimaspark.com>",
          to: toEmail,
          subject: `Welcome to ${courseTitle} – Access Granted!`,
          html,
        });
      }
    }
  } catch (err) {
    console.error("approveEnrollment email error:", err);
  }

  return { success: true };
}

export async function rejectEnrollment(
  targetUserId: string,
  courseSlug: string,
): Promise<ModerationResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) return { success: false, error: "Not authorized" };

  const user = await client.users.getUser(targetUserId);

  const pending =
    (user.publicMetadata.pendingEnrollments as
      | {
          courseSlug: string;
          requestedAt: string;
          message?: string;
          enrollmentType?: "subscription" | "cohort";
          preferredCohort?: string;
        }[]
      | undefined) ?? [];

  const updatedPending = pending.filter((p) => p.courseSlug !== courseSlug);

  await client.users.updateUserMetadata(targetUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      pendingEnrollments: updatedPending,
    },
  });

  return { success: true };
}

