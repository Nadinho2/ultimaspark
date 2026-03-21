-- Academy course catalog: one row per course slug, full payload in JSONB.
-- App reads/writes via SUPABASE_SERVICE_ROLE_KEY (server only). Anon key is not used for this table.

create table if not exists public."UltimaSparkAcademyCourse" (
  slug text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public."UltimaSparkAcademyCourse" is 'UltimaSpark Academy courses (mirrors data/courses.json shape)';

create index if not exists ultimaspark_academy_course_updated_at_idx
  on public."UltimaSparkAcademyCourse" (updated_at desc);

alter table public."UltimaSparkAcademyCourse" enable row level security;

-- Intentionally no GRANT to anon/authenticated: only the service role (used in Next.js server actions) can access.
-- If you need client-side reads later, add a SELECT policy and use the anon key.
