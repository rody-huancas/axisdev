export type ApiEvent = {
  id          : string;
  title       : string;
  start       : string;
  end         : string;
  meetLink   ?: string | null;
  htmlLink   ?: string | null;
  location   ?: string | null;
  description?: string | null;
  attendees  ?: string[];
};

export const toIso = (dateTime?: string, date?: string) => {
  if (dateTime) return dateTime;
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toISOString();
};

export const toEndIso = (dateTime?: string, date?: string) => {
  if (dateTime) return dateTime;
  if (!date) return "";
  const start = new Date(`${date}T00:00:00`);
  start.setDate(start.getDate() + 1);
  return start.toISOString();
};

export const extractMeetLink = (event: {
  hangoutLink?: string;
  conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> };
}) => {
  if (event.hangoutLink) return event.hangoutLink;
  const entryPoints = event.conferenceData?.entryPoints ?? [];
  const video       = entryPoints.find((entry) => entry.entryPointType === "video");

  return video?.uri ?? null;
};
