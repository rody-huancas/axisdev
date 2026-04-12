import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabaseClient = createClient(env.supabase.url, env.supabase.anonKey);
