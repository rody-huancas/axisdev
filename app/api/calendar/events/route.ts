import { auth } from "@/auth";

export const runtime = "nodejs";

type CalendarApiEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  meetLink?: string | null;
  htmlLink?: string | null;
  location?: string | null;
  description?: string | null;
  attendees?: string[];
};

const calendarEndpoint = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const safeText = async (response: Response) => {
  try {
    return await response.text();
  } catch {
    return "";
  }
};

const googleError = async (response: Response) => {
  const text = await safeText(response);
  try {
    const parsed = JSON.parse(text) as { error?: { message?: string } };
    const message = parsed?.error?.message;
    if (message) return `Google API ${response.status}: ${message}`;
  } catch {
    // ignore
  }
  return `Google API ${response.status}: ${text.slice(0, 300)}`;
};

const toIso = (dateTime?: string, date?: string) => {
  if (dateTime) return dateTime;
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toISOString();
};

const toEndIso = (dateTime?: string, date?: string) => {
  if (dateTime) return dateTime;
  if (!date) return "";
  const start = new Date(`${date}T00:00:00`);
  start.setDate(start.getDate() + 1);
  return start.toISOString();
};

const extractMeetLink = (event: { hangoutLink?: string; conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> } }) => {
  if (event.hangoutLink) return event.hangoutLink;
  const entryPoints = event.conferenceData?.entryPoints ?? [];
  const video = entryPoints.find((entry) => entry.entryPointType === "video");
  return video?.uri ?? null;
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const url = new URL(calendarEndpoint);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "2500");
  url.searchParams.set("fields", "items(id,summary,start,end,hangoutLink,conferenceData,htmlLink,location,description,attendees(email,displayName,responseStatus))");
  if (start) url.searchParams.set("timeMin", start);
  if (end) url.searchParams.set("timeMax", end);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const status = response.status === 401 || response.status === 403 ? response.status : 502;
    return new Response(await googleError(response), { status });
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
      hangoutLink?: string;
      conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> };
      htmlLink?: string;
      location?: string;
      description?: string;
      attendees?: Array<{ email?: string; displayName?: string; responseStatus?: string }>;
    }>;
  };

  const items = (data.items ?? []).map((event) => {
    const startIso = toIso(event.start?.dateTime, event.start?.date);
    const endIso = toEndIso(event.end?.dateTime, event.end?.date);
    return {
      id: event.id,
      title: event.summary ?? "(Sin titulo)",
      start: startIso,
      end: endIso,
      meetLink: extractMeetLink(event),
      htmlLink: event.htmlLink ?? null,
      location: event.location ?? null,
      description: event.description ?? null,
      attendees: (event.attendees ?? []).map((attendee) => attendee.email).filter(Boolean) as string[],
    } satisfies CalendarApiEvent;
  });

  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    location?: string;
    start?: string;
    end?: string;
    attendees?: string[];
    createMeet?: boolean;
  };

  const title = (body.title ?? "").trim();
  const start = body.start ?? "";
  const end = body.end ?? "";

  if (!title || !start || !end) {
    return new Response("Missing title/start/end", { status: 400 });
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const insertUrl = new URL(calendarEndpoint);
  insertUrl.searchParams.set("conferenceDataVersion", "1");

  const attendees = (body.attendees ?? [])
    .map((email) => email.trim())
    .filter(Boolean);

  if (attendees.length) {
    insertUrl.searchParams.set("sendUpdates", "all");
  }

  const payload: any = {
    summary: title,
    description: body.description?.trim() || undefined,
    location: body.location?.trim() || undefined,
    start: { dateTime: start },
    end: { dateTime: end },
    attendees: attendees.map((email) => ({ email })),
  };

  if (body.createMeet) {
    payload.conferenceData = {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  const response = await fetch(insertUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const status = response.status === 401 || response.status === 403 ? response.status : 502;
    return new Response(await googleError(response), { status });
  }

  const created = (await response.json()) as any;
  const createdStart = toIso(created?.start?.dateTime, created?.start?.date);
  const createdEnd = toEndIso(created?.end?.dateTime, created?.end?.date);

  const createdAttendees = (created?.attendees ?? []) as Array<{ email?: string }>;
  const attendeeEmails = (createdAttendees.length ? createdAttendees.map((a) => a.email) : attendees).filter(Boolean) as string[];

  const item: CalendarApiEvent = {
    id: created?.id,
    title: created?.summary ?? title,
    start: createdStart,
    end: createdEnd,
    meetLink: created?.hangoutLink ?? null,
    htmlLink: created?.htmlLink ?? null,
    location: created?.location ?? null,
    description: created?.description ?? null,
    attendees: attendeeEmails,
  };

  return Response.json({ item });
}
