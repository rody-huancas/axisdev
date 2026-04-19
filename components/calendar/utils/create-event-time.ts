import { minutesToTime, timeToMinutes } from "@/lib/calendar-utils";
import type { CreateEventDayPart } from "../hooks/use-create-event-time-options";

export function syncEndAfterStart(start: string, prevEnd: string) {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(prevEnd);

  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return prevEnd;
  if (endMin <= startMin) {
    return minutesToTime(Math.min(startMin + 30, 23 * 60 + 30));
  }
  return prevEnd;
}

export function getDayPartForTime(value: string): CreateEventDayPart | null {
  const minutes = timeToMinutes(value);
  if (Number.isNaN(minutes)) return null;
  return minutes < 12 * 60 ? "morning" : "afternoon";
}

export function getEndTimeByDuration(startTime: string, durationMinutes: number) {
  const startMinutes = timeToMinutes(startTime);
  if (Number.isNaN(startMinutes)) return null;

  const maxEnd = 23 * 60 + 30;
  const nextEnd = Math.min(startMinutes + durationMinutes, maxEnd);
  if (nextEnd <= startMinutes) return null;
  return minutesToTime(nextEnd);
}
