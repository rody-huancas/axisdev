import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CalendarClient } from "@/components/calendar/calendar-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getDefaultCalendarFetchRange } from "@/lib/calendar-date-range";

type ApiEvent = {
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

const calendarEndpoint = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

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

const CalendarPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const { start, end } = getDefaultCalendarFetchRange();

  const url = new URL(calendarEndpoint);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "2500");
  url.searchParams.set("timeMin", start.toISOString());
  url.searchParams.set("timeMax", end.toISOString());
  url.searchParams.set("fields", "items(id,summary,start,end,hangoutLink,conferenceData,htmlLink,location,description,attendees(email,displayName,responseStatus))");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const data = response.ok
    ? ((await response.json()) as {
        items?: Array<{
          id             : string;
          summary       ?: string;
          start         ?: { dateTime?: string; date?: string };
          end           ?: { dateTime?: string; date?: string };
          hangoutLink   ?: string;
          conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> };
          htmlLink      ?: string;
          location      ?: string;
          description   ?: string;
          attendees     ?: Array<{ email?: string; displayName?: string; responseStatus?: string }>;
        }>;
      })
    :  { items: [] };

  const initialItems: ApiEvent[] = (data.items ?? []).map((event) => ({
    id         : event.id,
    title      : event.summary ?? "(Sin titulo)",
    start      : toIso(event.start?.dateTime, event.start?.date),
    end        : toEndIso(event.end?.dateTime, event.end?.date),
    meetLink   : extractMeetLink(event),
    htmlLink   : event.htmlLink ?? null,
    location   : event.location ?? null,
    description: event.description ?? null,
    attendees  : (event.attendees ?? []).map((attendee) => attendee.email).filter(Boolean) as string[],
  }));

  return (
    <section className="space-y-6">
      <DashboardHeader
        userName={session.user?.name?.split(" ")[0] ?? "Usuario"}
        userEmail={session.user?.email ?? null}
        userImage={session.user?.image ?? null}
      />

      <CalendarClient initialItems={initialItems} />
    </section>
  );
};

export default CalendarPage;
