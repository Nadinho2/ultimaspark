# Course data in Supabase (production)

Course content (same shape as `data/courses.json`) is stored in Postgres when **`SUPABASE_SERVICE_ROLE_KEY`** is set together with **`NEXT_PUBLIC_SUPABASE_URL`**.

- **Reads** (`getCourses`, marketing pages, dashboard): use the service role on the server (same as admin writes).
- **Writes** (admin actions): persist to the `UltimaSparkAcademyCourse` table.
- **Without** the service role key, the app keeps using **`data/courses.json`** (fine for local dev; **not** writable on Vercel).

## 1. Create the table

In Supabase → **SQL Editor**, run the migration file:

`supabase/migrations/20260317120000_UltimaSparkAcademyCourse.sql`

(or copy its contents and execute).

## 2. Add secrets

In **Vercel** → Project → **Settings** → **Environment Variables** (Production):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Already set if you use Supabase for testimonials |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → **Project Settings** → **API** → **service_role** (secret) |

Never put the service role key in `NEXT_PUBLIC_*` or client-side code.

Locally, add the same to `.env.local` (see `.env.example`).

## 3. Seed from your JSON file

After the table exists and env vars are set:

```bash
npm run seed:courses
```

(Node 20+ loads `.env.local` via `--env-file`. On older Node, export the vars manually, then `node scripts/seed-courses.mjs`.)

This upserts every course from `data/courses.json` into `UltimaSparkAcademyCourse`.

## 4. Deploy

Redeploy so the new env var is available. Admin saves on production will update Supabase instead of the read-only filesystem.

## Troubleshooting

- **“Cannot save courses” / read-only on Vercel**: The app must see **both** `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` at **runtime** on the server. After adding them in Vercel, click **Redeploy** (env vars are baked in at build for some routes, and always need a new deployment to be sure). If you use a Preview deployment, add the same vars under **Preview** or they won’t be set there.
- **Empty catalog**: Run the seed script, or add rows in the Table Editor (`data` column = full course JSON object).
- **Permission errors** (`permission denied for table UltimaSparkAcademyCourse`): Almost always the **wrong key** in Vercel — `SUPABASE_SERVICE_ROLE_KEY` must be the **`service_role`** JWT from Supabase → **Project Settings** → **API** (long secret), **not** `NEXT_PUBLIC_SUPABASE_ANON_KEY` / “anon public”. The app now errors early if the JWT `role` is not `service_role`. If the key is correct, run the follow-up migration `supabase/migrations/20260321190000_UltimaSparkAcademyCourse_grants_and_policies.sql` in the SQL Editor (GRANT + RLS policy for `service_role`).
- **Table name**: The app uses `"UltimaSparkAcademyCourse"` (PascalCase), matching `UltimaSparkAcademyTestimonial`.
