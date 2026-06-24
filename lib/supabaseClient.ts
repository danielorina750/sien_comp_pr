import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

function isValidSupabaseUrl(value?: string): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export const supabaseConfigError = !supabaseUrl
  ? "Missing NEXT_PUBLIC_SUPABASE_URL"
  : !isValidSupabaseUrl(supabaseUrl)
    ? "NEXT_PUBLIC_SUPABASE_URL must be your Supabase Project URL, for example https://xxxxx.supabase.co. Do not use the Vercel website URL here."
    : !supabaseAnonKey
      ? "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
      : "";

export const isSupabaseConfigured = Boolean(!supabaseConfigError && supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
