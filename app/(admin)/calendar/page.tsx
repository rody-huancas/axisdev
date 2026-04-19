import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { auth } from "@/auth";
import { CalendarClient } from "@/components/calendar/calendar-client";
import { getDefaultCalendarFetchRange } from "@/lib/calendar-date-range";
import { toIso, toEndIso, extractMeetLink, type ApiEvent } from "@/lib/utils/calendar-transform";

const calendarEndpoint = env.api.calendar;

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
          id            ?: string;
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

  const rawItems = data.items ?? [];
  const initialItems: ApiEvent[] = rawItems
    .filter((event) => event.id)
    .map((event) => ({
      id         : event.id as string,
      title      : event.summary ?? "",
      start      : toIso(event.start?.dateTime, event.start?.date),
      end        : toEndIso(event.end?.dateTime, event.end?.date),
      meetLink   : extractMeetLink(event),
      htmlLink   : event.htmlLink    ?? null,
      location   : event.location    ?? null,
      description: event.description ?? null,
      attendees  : (event.attendees  ?? []).map((attendee) => attendee.email).filter(Boolean) as string[],
    }));

  return (
    <section className="space-y-6">
      <CalendarClient initialItems={initialItems} />
    </section>
  );
};

export default CalendarPage;
