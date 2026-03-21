"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

type PendingResult =
  | { success: true; message?: string }
  | { success: false; error: string };

type EnrollmentType = "subscription" | "cohort";

export async function requestEnrollment(formData: FormData): Promise<PendingResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = formData.get("courseSlug") as string | null;
  const message = formData.get("message") as string | null;
  const enrollmentTypeRaw = (formData.get("enrollmentType") as string | null) ?? "subscription";
  const preferredCohortRaw = (formData.get("preferredCohort") as string | null)?.trim();
  const preferredCohort = preferredCohortRaw && preferredCohortRaw.length > 0
    ? preferredCohortRaw
    : undefined;
  const enrollmentType: EnrollmentType =
    enrollmentTypeRaw === "cohort" ? "cohort" : "subscription";

  if (!courseSlug) {
    return { success: false, error: "No course specified" };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const enrolled =
      (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
    if (enrolled.includes(courseSlug)) {
      return { success: true, message: "Already enrolled" };
    }

    const pending =
      (user.publicMetadata.pendingEnrollments as
        | {
            courseSlug: string;
            requestedAt: string;
            message?: string;
            enrollmentType?: EnrollmentType;
            preferredCohort?: string;
          }[]
        | undefined) ?? [];

    if (pending.some((p) => p.courseSlug === courseSlug)) {
      return { success: true, message: "Enrollment already pending approval" };
    }

    const requestedAt = new Date().toISOString();
    const updatedPending = [
      ...pending,
      {
        courseSlug,
        requestedAt,
        message: message || undefined,
        enrollmentType,
        preferredCohort,
      },
    ];

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        pendingEnrollments: updatedPending,
      },
    });

    return {
      success: true,
      message: "Request submitted – pending admin approval.",
    };
  } catch (err) {
    console.error("Pending enrollment error:", err);
    return { success: false, error: "Failed to submit request" };
  }
}

