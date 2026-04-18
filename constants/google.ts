export const MIME_TYPES = {
  FOLDER      : "application/vnd.google-apps.folder",
  PDF         : "application/pdf",
  SPREADSHEET : /spreadsheet/,
  PRESENTATION: /presentation/,
  IMAGE       : /image\//,
} as const;

export const FILE_EXTENSIONS = {
  SPREADSHEET : ["xls", "xlsx", "csv"],
  PRESENTATION: ["ppt", "pptx", "key"],
  DOCUMENT    : ["doc", "docx", "rtf"],
  DATABASE    : ["sql", "db", "sqlite"],
  ARCHIVE     : ["zip", "rar", "7z"],
  AUDIO       : ["mp3", "wav", "flac"],
  VIDEO       : ["mp4", "mov", "mkv"],
  TEXT        : ["pod", "md", "txt", "log"],
} as const;

export type FileExtension = keyof typeof FILE_EXTENSIONS;

export const GOOGLE_SERVICES = {
  GMAIL   : "gmail",
  DRIVE   : "drive",
  CALENDAR: "calendar",
  TASKS   : "tasks",
} as const;
