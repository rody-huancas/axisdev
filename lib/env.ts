const getEnv = (key: string, fallback = "") => process.env[key] ?? fallback;

export const env = {
  auth: {
    secret: getEnv("AUTH_SECRET") || getEnv("NEXTAUTH_SECRET"),
  },
  google: {
    clientId: getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
  },
  supabase: {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    serviceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"),
  },
  api: {
    google: "https://www.googleapis.com",
    calendar: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    drive: "https://www.googleapis.com/drive/v3/files",
    driveUpload: "https://www.googleapis.com/upload/drive/v3/files",
    tasks: "https://tasks.googleapis.com/tasks/v1/lists/@default/tasks",
    gmail: "https://gmail.googleapis.com/gmail/v1/users/me",
  },
};