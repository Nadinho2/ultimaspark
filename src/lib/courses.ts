import { promises as fs } from "fs";
import path from "path";

export type CourseTopic = {
  id: string;
  title: string;
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
  weeksDetail?: CourseWeek[];
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

