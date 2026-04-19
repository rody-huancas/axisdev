import { useMemo } from "react";
import { buildTimeOptions, timeToMinutes } from "@/lib/calendar-utils";

export type CreateEventDayPart = "morning" | "afternoon";

export function useCreateEventTimeOptions(dayPart: CreateEventDayPart, startTime: string) {
  const startOptions = useMemo(() => {
    const all = buildTimeOptions(6 * 60, 22 * 60 + 30, 30);

    if (dayPart === "morning") {
      return all.filter((value) => {
        const minutes = timeToMinutes(value);
        return minutes >= 6 * 60 && minutes < 12 * 60;
      });
    }

    return all.filter((value) => {
      const minutes = timeToMinutes(value);
      return minutes >= 12 * 60 && minutes <= 22 * 60;
    });
  }, [dayPart]);

  const endOptions = useMemo(() => {
    const startMinutes = timeToMinutes(startTime);
    const all = buildTimeOptions(6 * 60, 23 * 60 + 30, 30);

    return all.filter((value) => {
      const minutes = timeToMinutes(value);
      return !Number.isNaN(startMinutes) && minutes > startMinutes;
    });
  }, [startTime]);

  return { startOptions, endOptions };
}
