"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

const MAX_NOTE_CHARS = 8000;

type NoteResult = { success: true } | { success: false; error: string };

type CourseProgressShape = {
  completedWeeks?: number[];
  completedTopics?: string[];
  quizzes?: Record<string, { passed: boolean; score?: number }>;
  topicNotes?: Record<string, string>;
};

export async function saveTopicNote(formData: FormData): Promise<NoteResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const courseSlug = (formData.get("courseSlug") as string | null)?.trim();
  const noteKey = (formData.get("noteKey") as string | null)?.trim();
  const body = (formData.get("body") as string | null) ?? "";

  if (!courseSlug || !noteKey) {
    return { success: false, error: "Missing course or note key" };
  }

  if (body.length > MAX_NOTE_CHARS) {
    return {
      success: false,
      error: `Notes must be ${MAX_NOTE_CHARS} characters or less.`,
    };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const progress =
      ((user.publicMetadata.progress as Record<string, CourseProgressShape> | null) ??
        {}) || {};

    const courseProgress: CourseProgressShape = progress[courseSlug] || {
      completedWeeks: [],
      completedTopics: [],
    };

    const topicNotes = { ...(courseProgress.topicNotes ?? {}) };
    if (body.trim().length === 0) {
      delete topicNotes[noteKey];
    } else {
      topicNotes[noteKey] = body;
    }
    courseProgress.topicNotes = topicNotes;
    progress[courseSlug] = courseProgress;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        progress,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("saveTopicNote error:", err);
    return { success: false, error: "Could not save notes" };
  }
}
