export const ROUTES = {
  ROOT     : "/",
  DASHBOARD: "/dashboard",
  DRIVE    : "/drive",
  CALENDAR : "/calendar",
  TASKS    : "/tasks",
  GMAIL    : "/gmail",
  SETTINGS : "/settings",
} as const;

export const API_ROUTES = {
  TASKS              : "/api/tasks",
  TASK_BY_ID         : (id: string) => `/api/tasks/${id}`,
  TASKLISTS          : "/api/tasklists",
  TASKLIST_BY_ID     : (id: string) => `/api/tasklists/${id}`,
  GMAIL_MESSAGES     : "/api/gmail/messages",
  GMAIL_MESSAGE_BY_ID: (id: string) => `/api/gmail/messages/${id}`,
  GMAIL_MESSAGE_REPLY: (id: string) => `/api/gmail/messages/${id}/reply`,
  CALENDAR_EVENTS    : "/api/calendar/events",
  DRIVE_DOWNLOAD     : "/api/drive/download",
  SETTINGS           : "/api/settings",
} as const;

export const STORAGE_KEYS = {
  THEME       : "rody-theme-storage",
  LANGUAGE    : "language",
  TASKS_FILTER: "tasks-filter",
  DRIVE_VIEW  : "drive-view",
} as const;
