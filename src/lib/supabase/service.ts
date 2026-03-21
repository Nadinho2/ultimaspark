import { createClient } from "@supabase/supabase-js";

/** Decode JWT payload (no signature verify) to read `role` claim — catches anon key pasted as service role. */
function jwtPayloadRole(jwt: string): string | undefined {
  try {
    const parts = jwt.trim().split(".");
    if (parts.length < 2) return undefined;
    const b64 = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    return payload.role;
  } catch {
    return undefined;
  }
}

/**
 * Server-only client with the service role key (bypasses RLS).
 * Use for admin course persistence — never import in client components.
 */
export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for Supabase course storage.",
    );
  }

  const trimmed = key.trim();
  const role = jwtPayloadRole(trimmed);
  if (role && role !== "service_role") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY must be the service_role secret (JWT role is "${role}", expected "service_role"). In Supabase: Project Settings → API → copy the service_role key — not the anon/public key. That mismatch causes "permission denied for table UltimaSparkAcademyCourse".`,
    );
  }

  return createClient(url, trimmed, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseCoursesConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}
