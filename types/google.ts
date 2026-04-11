export type GoogleCalendarEvent = {
  id       : string;
  summary ?: string;
  htmlLink?: string;
  start   ?: {
    date    ?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end?: {
    date    ?: string;
    dateTime?: string;
    timeZone?: string;
  };
};

export type GoogleCalendarEventsResponse = {
  items         : GoogleCalendarEvent[];
  nextPageToken?: string;
};

export type GoogleDriveFile = {
  id           : string;
  name        ?: string;
  modifiedTime?: string;
  iconLink    ?: string;
  webViewLink ?: string;
};

export type GoogleDriveFilesResponse = {
  files: GoogleDriveFile[];
};

export type GoogleTask = {
  id     : string;
  title ?: string;
  status?: "needsAction" | "completed";
  due   ?: string;
};

export type GoogleTasksResponse = {
  items?: GoogleTask[];
};

export type GoogleGmailMessage = {
  id       : string;
  threadId?: string;
  snippet ?: string;
};

export type GoogleGmailListResponse = {
  messages?: Array<{ id: string; threadId?: string }>;
};
