import { supabaseServer } from "@/lib/supabase/server";

export async function getOrCreateUser(email: string, name?: string, avatarUrl?: string) {
  const { data: existingUser } = await supabaseServer
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    return existingUser;
  }

  const { data: newUser, error } = await supabaseServer
    .from("users")
    .insert({ email, name, avatar_url: avatarUrl })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return newUser;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function updateUser(email: string, updates: { name?: string; avatar_url?: string }) {
  const { error } = await supabaseServer
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("Error updating user:", error);
    return false;
  }

  return true;
}
