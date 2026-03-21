import type { User } from "@clerk/nextjs/server";

export type CourseEnrollmentSnapshot = {
  isSignedIn: boolean;
  isEnrolled: boolean;
  isPendingApproval: boolean;
};

export function getCourseEnrollmentSnapshot(
  user: User | null,
  courseSlug: string,
): CourseEnrollmentSnapshot {
  if (!user) {
    return {
      isSignedIn: false,
      isEnrolled: false,
      isPendingApproval: false,
    };
  }

  const enrolled =
    (user.publicMetadata.enrolledCourses as string[] | undefined) ?? [];
  const pending =
    (user.publicMetadata.pendingEnrollments as
      | { courseSlug: string }[]
      | undefined) ?? [];

  return {
    isSignedIn: true,
    isEnrolled: enrolled.includes(courseSlug),
    isPendingApproval: pending.some((p) => p.courseSlug === courseSlug),
  };
}
