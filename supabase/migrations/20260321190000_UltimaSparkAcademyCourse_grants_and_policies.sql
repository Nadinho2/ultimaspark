-- Fixes: "permission denied for table UltimaSparkAcademyCourse"
-- Run this in Supabase SQL Editor if admin saves (cohorts, videos, curriculum) fail.
--
-- Common causes:
-- 1) SUPABASE_SERVICE_ROLE_KEY in Vercel is the anon/public key — must be the service_role JWT from API settings.
-- 2) Table privileges / RLS need explicit grants for the API roles Supabase uses.

-- Ensure core roles can use the table (PostgREST checks privileges even when RLS is enabled)
GRANT USAGE ON SCHEMA public TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."UltimaSparkAcademyCourse" TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."UltimaSparkAcademyCourse" TO service_role;

-- RLS: allow the service_role JWT (used by SUPABASE_SERVICE_ROLE_KEY) full access.
-- (service_role often bypasses RLS, but policies + grants fix edge cases and mis-keyed anon tokens.)
DROP POLICY IF EXISTS "UltimaSparkAcademyCourse_service_role_all" ON public."UltimaSparkAcademyCourse";

CREATE POLICY "UltimaSparkAcademyCourse_service_role_all"
  ON public."UltimaSparkAcademyCourse"
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: public read for anon/authenticated if you later use the anon key for SELECT only
-- GRANT SELECT ON TABLE public."UltimaSparkAcademyCourse" TO anon, authenticated;
-- CREATE POLICY "UltimaSparkAcademyCourse_public_read" ON public."UltimaSparkAcademyCourse" FOR SELECT TO anon, authenticated USING (true);
