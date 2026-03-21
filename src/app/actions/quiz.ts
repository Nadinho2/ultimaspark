"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { sendCongratsEmail } from "@/app/actions/sendNotification";
import { getCourses } from "@/lib/courses";
import {
  getCorrectAnswerForTopic,
  topicQuizStorageKey,
} from "@/lib/topic-quiz";

type QuizResult =
  | { success: true; passed: boolean; score: number }
  | { success: false; error: string };

const QUIZ_ANSWERS: Record<
  "ai-automation" | "vibe-coding",
  Record<number, string>
> = {
  "ai-automation": {
    1: "c",
  },
  "vibe-coding": {
    1: "b",
  },
};

export async function submitQuiz(formData: FormData): Promise<QuizResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = formData.get("courseSlug") as
    | "ai-automation"
    | "vibe-coding"
    | null;
  const weekStr = formData.get("week") as string | null;
  const answer = formData.get("answer") as string | null;

  if (!courseSlug || !weekStr || !answer) {
    return { success: false, error: "Missing data" };
  }

  const week = Number.parseInt(weekStr, 10);
  if (!Number.isFinite(week) || week <= 0) {
    return { success: false, error: "Invalid week" };
  }

  const correct = QUIZ_ANSWERS[courseSlug]?.[week];
  if (!correct) {
    return { success: false, error: "Quiz not defined" };
  }

  const passed = answer === correct;
  const score = passed ? 100 : 0;

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
      quizzes: {},
    };

    const quizzes = courseProgress.quizzes ?? {};
    const key = `week-${week}`;
    quizzes[key] = { passed, score };
    courseProgress.quizzes = quizzes;

    // If passed, also mark the week as completed (if not already)
    if (passed) {
      const weeks = courseProgress.completedWeeks ?? [];
      if (!weeks.includes(week)) {
        courseProgress.completedWeeks = [...weeks, week];

        const primaryEmail =
          user.emailAddresses?.[0]?.emailAddress ??
          user.primaryEmailAddress?.emailAddress;
        const displayName = user.firstName ?? user.username ?? null;

        const courses = await getCourses();
        const courseConfig = courses.find((c) => c.slug === courseSlug);
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
          week,
          percent,
        );
      }
    }

    progress[courseSlug] = courseProgress;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress,
      },
    });

    return { success: true, passed, score };
  } catch (err) {
    console.error("Quiz submit error:", err);
    return { success: false, error: "Failed to submit quiz" };
  }
}

type TopicQuizResult =
  | { success: true; passed: boolean; score: number }
  | { success: false; error: string };

/** MCQ at end of each topic — key in metadata: `topic:${topicId}` */
export async function submitTopicQuiz(
  formData: FormData,
): Promise<TopicQuizResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
  const topicId = (formData.get("topicId") as string | null)?.trim();
  const answer = ((formData.get("answer") as string | null) ?? "")
    .trim()
    .toLowerCase();

  if (!courseSlug || !topicId || !answer) {
    return { success: false, error: "Missing data" };
  }

  const correct = (
    await getCorrectAnswerForTopic(topicId, courseSlug)
  ).toLowerCase();
  const passed = answer === correct;
  const score = passed ? 100 : 0;

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
      quizzes: {},
    };

    const quizzes = courseProgress.quizzes ?? {};
    const key = topicQuizStorageKey(topicId);
    quizzes[key] = { passed, score };
    courseProgress.quizzes = quizzes;
    progress[courseSlug] = courseProgress;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress,
      },
    });

    return { success: true, passed, score };
  } catch (err) {
    console.error("submitTopicQuiz error:", err);
    return { success: false, error: "Failed to submit topic quiz" };
  }
}

