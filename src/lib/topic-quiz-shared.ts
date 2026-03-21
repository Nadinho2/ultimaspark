/**
 * Client-safe topic quiz helpers (no Node fs). Server grading uses `topic-quiz-server.ts`.
 * Intentionally does not import `@/lib/courses` (that pulls `course-store` / `fs` into the client bundle).
 */
export type TopicQuizMCQ = {
  question: string;
  options: { value: string; label: string }[];
};

/** Shape needed for `resolveTopicQuizContent` (matches `CourseTopic` fields used). */
export type TopicQuizContentInput = {
  title: string;
  topicQuiz?: {
    question: string;
    options: { value: string; label: string }[];
    correctAnswer: string;
  };
};

/** Learner-facing quiz copy: custom per topic or shared default template. */
export function resolveTopicQuizContent(topic: TopicQuizContentInput): TopicQuizMCQ {
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
