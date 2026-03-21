import { promises as fs } from "fs";
import path from "path";
import { getCourses } from "@/lib/courses";

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
 * Server-only (uses fs + getCourses).
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
