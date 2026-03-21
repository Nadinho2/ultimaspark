import { promises as fs } from "fs";
import path from "path";

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

export async function getCorrectAnswerForTopic(topicId: string): Promise<string> {
  const overrides = await loadAnswerOverrides();
  const v = overrides[topicId];
  if (v && /^[a-d]$/i.test(v)) return v.toLowerCase();
  return "a";
}

/** Shared MCQ copy for every topic (answer validated server-side). */
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
