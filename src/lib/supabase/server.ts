import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Test import:
// import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // In Server Components, setting cookies can throw.
          // It's safe to ignore if you're only reading auth.
        }
      },
    },
  });
}

// Back-compat (older imports)
export const createClient = createSupabaseServerClient;

