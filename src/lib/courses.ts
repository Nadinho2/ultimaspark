import { promises as fs } from "fs";
import path from "path";

export type CourseTopic = {
  id: string;
  title: string;
  videoId?: string;
  subtopics?: string[];
  bullets?: string[];
};

export type CourseWeek = {
  title: string;
  summary?: string;
  topics: CourseTopic[];
};

export type CourseVideo = {
  week: number;
  title: string;
  youtubeId: string;
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  weeks: number;
  cohorts?: string[];
  cohortLiveVideos?: Record<
    string,
    Record<string, string[] | Record<string, string[]>>
  >;
  weeksDetail?: CourseWeek[];
  // Legacy videos array kept for backward compatibility.
  videos?: CourseVideo[];
};

function coursesFilePath() {
  return path.join(process.cwd(), "data", "courses.json");
}

export async function getCourses(): Promise<Course[]> {
  try {
    const file = coursesFilePath();
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Course[];
  } catch {
    return [];
  }
}

/** Legacy slugs still in `courses.json` / redirect routes; hidden from marketing pages. */
export const HIDDEN_FROM_MARKETING_SLUGS = new Set([
  "ai-automation",
  "vibe-coding",
]);

/** Courses shown on Home and /courses (excludes legacy hardcoded tracks). */
export async function getMarketingCourses(): Promise<Course[]> {
  const courses = await getCourses();
  return courses.filter((c) => !HIDDEN_FROM_MARKETING_SLUGS.has(c.slug));
}

export async function getCoursesBySlug(): Promise<Record<string, Course>> {
  const courses = await getCourses();
  return courses.reduce(
    (acc, course) => {
      acc[course.slug] = course;
      return acc;
    },
    {} as Record<string, Course>,
  );
}

export function extractYouTubeId(input: string): string {
  const value = input.trim();
  if (!value) return "";
  // Already a plain id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v.slice(0, 11);
      const parts = url.pathname.split("/");
      const embedIndex = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1].slice(0, 11);
      }
    }
  } catch {
    // not a URL; fall through
  }

  return value;
}

