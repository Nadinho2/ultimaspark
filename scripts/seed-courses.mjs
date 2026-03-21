/**
 * One-time (or repeat) seed: push data/courses.json → Supabase UltimaSparkAcademyCourse.
 *
 * Prerequisites:
 *   1. Run the SQL migration in Supabase (supabase/migrations/...UltimaSparkAcademyCourse.sql)
 *   2. Env vars (e.g. in .env.local):
 *        NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...   (Dashboard → Project Settings → API → service_role)
 *
 * Run (Node 20+):
 *   node --env-file=.env.local scripts/seed-courses.mjs
 *
 * Or:
 *   set NEXT_PUBLIC_SUPABASE_URL=... && set SUPABASE_SERVICE_ROLE_KEY=... && node scripts/seed-courses.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const TABLE = "UltimaSparkAcademyCourse";
const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const jsonPath = join(__dirname, "..", "data", "courses.json");
const raw = await readFile(jsonPath, "utf8");
const courses = JSON.parse(raw);

if (!Array.isArray(courses)) {
  console.error("courses.json must be a JSON array");
  process.exit(1);
}

const now = new Date().toISOString();
let ok = 0;
for (const c of courses) {
  if (!c?.slug) {
    console.warn("Skipping row without slug", c);
    continue;
  }
  const { error } = await supabase.from(TABLE).upsert(
    { slug: c.slug, data: c, updated_at: now },
    { onConflict: "slug" },
  );
  if (error) {
    console.error(`Upsert failed for ${c.slug}:`, error.message);
    process.exit(1);
  }
  ok += 1;
}

console.log(`Seeded ${ok} course(s) into ${TABLE}.`);
