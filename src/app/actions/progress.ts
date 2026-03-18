"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { sendCongratsEmail } from "@/app/actions/sendNotification";
import { getCourses } from "@/lib/courses";

type ProgressResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function markComplete(formData: FormData): Promise<ProgressResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = formData.get("courseSlug") as string | null;
  const itemId = formData.get("itemId") as string | null;
  const type = formData.get("type") as "topic" | "week" | null;

  if (!courseSlug || !itemId || !type) {
    return { success: false, error: "Missing data" };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const progress =
      ((user.publicMetadata.progress as Record<
        string,
        {
          completedWeeks?: number[];
          completedTopics?: string[];
          quizzes?: Record<string, { passed: boolean; score?: number }>;
        }
      > | null) ??
        {}) || {};

    const courseProgress = progress[courseSlug] || {
      completedWeeks: [],
      completedTopics: [],
    };

    if (type === "topic") {
      const topics = courseProgress.completedTopics ?? [];
      if (!topics.includes(itemId)) {
        courseProgress.completedTopics = [...topics, itemId];
      }
    } else if (type === "week") {
      const weekNum = parseInt(itemId.split("-")[1] ?? "", 10);
      if (!Number.isNaN(weekNum)) {
        const courses = await getCourses();
        const courseConfig = courses.find((c) => c.slug === courseSlug);
        const weeks = courseProgress.completedWeeks ?? [];
        const hadWeek = weeks.includes(weekNum);
        if (!hadWeek) {
          courseProgress.completedWeeks = [...weeks, weekNum];

          const primaryEmail =
            user.emailAddresses?.[0]?.emailAddress ?? user.primaryEmailAddress?.emailAddress;
          const displayName = user.firstName ?? user.username ?? null;

          const courseTitle = courseConfig?.title ?? courseSlug;
          const totalTopics =
            courseConfig?.weeksDetail?.reduce(
              (acc, w) => acc + (w.topics?.length ?? 0),
              0,
            ) ?? 0;
          const topicCount = courseProgress.completedTopics?.length ?? 0;
          const percent = totalTopics > 0 ? (topicCount / totalTopics) * 100 : undefined;

          await sendCongratsEmail(
            primaryEmail,
            displayName,
            courseTitle,
            weekNum,
            percent,
          );
        }
      }
    }

    progress[courseSlug] = courseProgress;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress,
      },
    });

    return { success: true, message: "Marked complete!" };
  } catch (err) {
    console.error("Progress error:", err);
    return { success: false, error: "Failed to update" };
  }
}

