import { promises as fs } from "fs";
import path from "path";
import { getCourses } from "@/lib/courses";
import type { CourseTopic } from "@/lib/courses";

export type TopicQuizMCQ = {
  question: string;
  options: { value: string; label: string }[];
};

/** Optional overrides: topic id → correct option value (a–d). Default is "a". */
async function loadAnswerOverrides(): Promise<Record<string, string>> {
  try {
    const file = path.join(process.cwd(), "data", "topic-quiz-overrides.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

/**
 * Correct answer for a topic: course-stored quiz → JSON overrides → "a".
 */
export async function getCorrectAnswerForTopic(
  topicId: string,
  courseSlug: string,
): Promise<string> {
  const courses = await getCourses();
  const course = courses.find((c) => c.slug === courseSlug);
  for (const w of course?.weeksDetail ?? []) {
    const t = w.topics?.find((x) => x.id === topicId);
    const ca = t?.topicQuiz?.correctAnswer;
    if (ca && /^[a-d]$/i.test(String(ca))) {
      return String(ca).toLowerCase();
    }
  }

  const overrides = await loadAnswerOverrides();
  const v = overrides[topicId];
  if (v && /^[a-d]$/i.test(v)) return v.toLowerCase();
  return "a";
}

/** Learner-facing quiz copy: custom per topic or shared default template. */
export function resolveTopicQuizContent(topic: Pick<CourseTopic, "title" | "topicQuiz">): TopicQuizMCQ {
  const q = topic.topicQuiz;
  if (
    q &&
    typeof q.question === "string" &&
    q.question.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length >= 2
  ) {
    return {
      question: q.question.trim(),
      options: q.options.map((o) => ({
        value: String(o.value).toLowerCase().slice(0, 1),
        label: String(o.label ?? "").trim() || "(empty)",
      })),
    };
  }
  return buildTopicQuizContent(topic.title);
}

/** Shared MCQ copy for every topic without custom `topicQuiz` (answer validated server-side). */
export function buildTopicQuizContent(topicTitle: string): TopicQuizMCQ {
  return {
    question: `After working through “${topicTitle}”, which choice best reflects a strong next step?`,
    options: [
      {
        value: "a",
        label:
          "Apply one concrete idea in a small hands-on exercise or mini-project this week.",
      },
      {
        value: "b",
        label: "Postpone all practice until the entire course is finished.",
      },
      {
        value: "c",
        label: "Rely only on re-reading notes without building anything.",
      },
      {
        value: "d",
        label: "Skip revisiting the topic even if parts were unclear.",
      },
    ],
  };
}

export function topicQuizStorageKey(topicId: string): string {
  return `topic:${topicId}`;
}
