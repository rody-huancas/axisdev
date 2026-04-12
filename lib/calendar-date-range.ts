import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";

export const getDefaultCalendarFetchRange = (): { start: Date; end: Date } => {
  const now   = new Date();
  const start = startOfMonth(subMonths(now, 3));
  const end   = endOfMonth(addMonths(now, 9));
  return { start, end };
};
