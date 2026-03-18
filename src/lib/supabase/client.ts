"use client";

import { createBrowserClient } from "@supabase/ssr";

// Test import:
// import { createSupabaseBrowserClient } from "@/lib/supabase/client";
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createBrowserClient(url, anonKey);
}

// Back-compat (older imports)
export const createClient = createSupabaseBrowserClient;

