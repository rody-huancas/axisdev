import type { Event as RBCEvent } from "react-big-calendar";
import type { ApiEvent } from "@/lib/calendar-utils";

export type CalendarEvent = RBCEvent & {
  resource?: ApiEvent;
};

export type { ApiEvent };