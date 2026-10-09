import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an elevated Supabase admin client for secure server-side mutations (Update, Delete, Create).
 * Bypasses RLS restrictions using the SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin configuration in environment variables.");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
