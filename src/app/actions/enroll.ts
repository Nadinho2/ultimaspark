"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

type EnrollResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function enrollInCourse(formData: FormData): Promise<EnrollResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = formData.get("courseSlug") as string | null;
  if (!courseSlug) {
    return { success: false, error: "No course specified" };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const currentEnrolled =
      (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
    const enrollmentDates =
      (user.publicMetadata.enrollmentDates as Record<string, string> | undefined) ??
      {};

    if (currentEnrolled.includes(courseSlug)) {
      return { success: true, message: "Already enrolled" };
    }

    const updatedEnrolled = [...currentEnrolled, courseSlug];
    const nowIso = new Date().toISOString();

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        enrolledCourses: updatedEnrolled,
        enrollmentDates: {
          ...enrollmentDates,
          [courseSlug]: enrollmentDates[courseSlug] ?? nowIso,
        },
      },
    });

    return { success: true, message: "Enrolled successfully!" };
  } catch (err) {
    console.error("Enroll error:", err);
    return { success: false, error: "Failed to enroll" };
  }
}

