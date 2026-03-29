import type { User } from "@clerk/nextjs/server";

/** Clerk metadata should store string[]; normalize bad shapes from manual edits. */
export function normalizeEnrolledCourseSlugs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (x): x is string => typeof x === "string" && x.trim().length > 0,
  );
}

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

  const enrolled = normalizeEnrolledCourseSlugs(
    user.publicMetadata.enrolledCourses,
  );
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
