const getEnv = (key: string, fallback = "") => process.env[key] ?? fallback;

export const env = {
  auth: {
    secret: getEnv("AUTH_SECRET") || getEnv("NEXTAUTH_SECRET"),
  },
  google: {
    clientId    : getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
  },
  supabase: {
    url       : getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey   : getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    serviceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"),
  },
  api: {
    google     : getEnv("NEXT_PUBLIC_GOOGLE_API"),
    calendar   : getEnv("NEXT_PUBLIC_GOOGLE_API_CALENDAR"),
    drive      : getEnv("NEXT_PUBLIC_GOOGLE_API_DRIVE"),
    driveUpload: getEnv("NEXT_PUBLIC_GOOGLE_API_DRIVE_UPLOAD"),
    tasklists  : getEnv("NEXT_PUBLIC_GOOGLE_API_TASKS_LIST"),
    tasks      : getEnv("NEXT_PUBLIC_GOOGLE_API_TASKS"),
    gmail      : getEnv("NEXT_PUBLIC_GOOGLE_API_GMAIL"),
  },
};