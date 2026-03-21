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

/** Vercel / Lambda: no writable project disk — course JSON cannot be saved without Supabase. */
function isServerlessReadOnlyFilesystem(): boolean {
  return (
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.NETLIFY
  );
}

const SUPABASE_SETUP_HELP =
  "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel (or your host) → Environment Variables, then Redeploy. Copy the service_role key from Supabase → Project Settings → API (not the anon key). Run supabase/migrations SQL if the table is missing. See docs/supabase-courses.md.";

/** User-facing message when persistence fails (filesystem or Supabase). */
export function persistErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const m = err.message;
    if (/read-only|EROFS|EPERM|EACCES|ENOTSUP/i.test(m)) {
      return `Cannot save courses on this host (filesystem is read-only). ${SUPABASE_SETUP_HELP}`;
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
 * Write courses: Supabase when configured; otherwise JSON file (local dev only).
 * On Vercel/serverless, the filesystem is read-only — require Supabase or fail with a clear error.
 */
export async function writeCourses(courses: Course[]): Promise<void> {
  if (isSupabaseCoursesConfigured()) {
    await writeCoursesToSupabase(courses);
    return;
  }
  if (isServerlessReadOnlyFilesystem()) {
    throw new Error(
      `Course saves need a database on this deployment. ${SUPABASE_SETUP_HELP}`,
    );
  }
  await writeCoursesToFile(courses);
}
