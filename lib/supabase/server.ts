import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabaseServer = createClient(env.supabase.url, env.supabase.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
