import { promises as fs } from "fs";
import path from "path";
import type { Course } from "@/lib/courses";
import {
  createSupabaseServiceRoleClient,
  isSupabaseCoursesConfigured,
} from "@/lib/supabase/service";

/** Matches testimonials table naming in this project. */
export const ACADEMY_COURSES_TABLE = "UltimaSparkAcademyCourse";

function coursesFilePath() {
  return path.join(process.cwd(), "data", "courses.json");
}

async function readCoursesFromFile(): Promise<Course[]> {
  const file = coursesFilePath();
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as Course[];
}

async function readCoursesFromSupabase(): Promise<Course[]> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(ACADEMY_COURSES_TABLE)
    .select("data")
    .order("slug");

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  return rows
    .map((row: { data: Course }) => row.data as Course)
    .filter(Boolean);
}

async function writeCoursesToFile(courses: Course[]): Promise<void> {
  const file = coursesFilePath();
  await fs.writeFile(file, JSON.stringify(courses, null, 2), "utf8");
}

async function writeCoursesToSupabase(courses: Course[]): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const now = new Date().toISOString();
  const slugs = new Set(courses.map((c) => c.slug));

  for (const c of courses) {
    const { error } = await supabase.from(ACADEMY_COURSES_TABLE).upsert(
      {
        slug: c.slug,
        data: c,
        updated_at: now,
      },
      { onConflict: "slug" },
    );
    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: existing, error: listErr } = await supabase
    .from(ACADEMY_COURSES_TABLE)
    .select("slug");

  if (listErr) {
    throw new Error(listErr.message);
  }

  for (const row of existing ?? []) {
    const s = (row as { slug: string }).slug;
    if (!slugs.has(s)) {
      const { error: delErr } = await supabase
        .from(ACADEMY_COURSES_TABLE)
        .delete()
        .eq("slug", s);
      if (delErr) {
        throw new Error(delErr.message);
      }
    }
  }
}

/** User-facing message when persistence fails (filesystem or Supabase). */
export function persistErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const m = err.message;
    if (/read-only|EROFS|EPERM|EACCES|ENOTSUP/i.test(m)) {
      return "Cannot save courses on this host (serverless deploys are often read-only). Set SUPABASE_SERVICE_ROLE_KEY or save courses in Supabase — see docs in supabase/migrations.";
    }
    return m;
  }
  return fallback;
}

/**
 * Read courses: Supabase when configured and non-empty; otherwise JSON file.
 * If Supabase is empty and the file has data, use the file (bootstrap / migration).
 */
export async function readCourses(): Promise<Course[]> {
  if (isSupabaseCoursesConfigured()) {
    try {
      const fromDb = await readCoursesFromSupabase();
      if (fromDb.length > 0) {
        return fromDb.sort((a, b) => a.slug.localeCompare(b.slug));
      }
    } catch (e) {
      console.error("readCourses Supabase error:", e);
    }
    try {
      const fromFile = await readCoursesFromFile();
      if (fromFile.length > 0) {
        return fromFile;
      }
    } catch {
      // fall through
    }
    return [];
  }

  try {
    return await readCoursesFromFile();
  } catch {
    return [];
  }
}

/**
 * Write courses: Supabase when configured; otherwise JSON file (local dev).
 */
export async function writeCourses(courses: Course[]): Promise<void> {
  if (isSupabaseCoursesConfigured()) {
    await writeCoursesToSupabase(courses);
    return;
  }
  await writeCoursesToFile(courses);
}
