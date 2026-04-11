import { z } from "zod";

export const calendarEventsQuerySchema = z.object({
  timeMin   : z.string().datetime().optional(),
  maxResults: z.coerce.number().int().min(1).max(10).default(5),
});

export type CalendarEventsQuery = z.infer<typeof calendarEventsQuerySchema>;
