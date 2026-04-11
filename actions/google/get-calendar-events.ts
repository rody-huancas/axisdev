"use server";

import { auth } from "@/auth";
import { calendarEventsQuerySchema } from "@/lib/validations/google";
import type { GoogleCalendarEventsResponse } from "@/types/google";

const calendarEndpoint = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

type CalendarEventsInput = {
  timeMin   ?: string;
  maxResults?: number;
};

export const getUpcomingCalendarEvents = async (input: CalendarEventsInput = {}): Promise<GoogleCalendarEventsResponse> => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const parsed = calendarEventsQuerySchema.parse({
    timeMin   : input.timeMin ?? new Date().toISOString(),
    maxResults: input.maxResults ?? 5,
  });

  const url = new URL(calendarEndpoint);
  url.searchParams.set("maxResults", String(parsed.maxResults));
  url.searchParams.set("timeMin", parsed.timeMin ?? new Date().toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }

  return (await response.json()) as GoogleCalendarEventsResponse;
};
