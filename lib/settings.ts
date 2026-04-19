import { supabaseServer } from "@/lib/supabase/server";

export type SettingsWidget = {
  id     : string;
  enabled: boolean;
};

export type SettingsNotification = {
  id     : string;
  enabled: boolean;
};

export type UserSettings = {
  id           ?: string;
  user_email    : string;
  language      : string;
  widgets       : SettingsWidget[];
  notifications : SettingsNotification[];
  created_at   ?: string;
  updated_at   ?: string;
};

export async function getUserSettings(userEmail: string): Promise<UserSettings | null> {
  const { data, error } = await supabaseServer
    .from("user_settings")
    .select("*")
    .eq("user_email", userEmail)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user settings:", error);
    return null;
  }

  return data;
}

export async function createUserSettings(userEmail: string): Promise<UserSettings | null> {
  const defaultSettings: Omit<UserSettings, "id" | "created_at" | "updated_at"> = {
    user_email: userEmail,
    language: "es",
    widgets: [
      { id: "gmail", enabled: true },
      { id: "tasks", enabled: true },
      { id: "calendar", enabled: true },
      { id: "storage", enabled: true },
      { id: "recentFiles", enabled: true },
    ],
    notifications: [
      { id: "push", enabled: true },
      { id: "tasks", enabled: true },
      { id: "calendar", enabled: false },
    ],
  };

  const { data, error } = await supabaseServer
    .from("user_settings")
    .insert(defaultSettings)
    .select()
    .single();

  if (error) {
    console.error("Error creating user settings:", error);
    return null;
  }

  return data;
}

export async function updateUserSettings(
  userEmail: string,
  updates: Partial<Omit<UserSettings, "id" | "user_email" | "created_at" | "updated_at">>
): Promise<boolean> {
  const { error } = await supabaseServer
    .from("user_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_email", userEmail);

  if (error) {
    console.error("Error updating user settings:", error);
    return false;
  }

  return true;
}

export async function getOrCreateUserSettings(userEmail: string): Promise<UserSettings> {
  let settings = await getUserSettings(userEmail);

  if (!settings) {
    settings = await createUserSettings(userEmail);
  }

  return settings!;
}
