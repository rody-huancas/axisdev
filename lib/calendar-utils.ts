import { es } from "date-fns/locale";
import { format, parse, startOfWeek, getDay, dateFnsLocalizer } from "react-big-calendar";

export const locales = { es };

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export const messages = {
  allDay: "Todo el dia",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total: number) => `+${total} mas`,
};

export const toDate = (iso: string) => new Date(iso);

export const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatDateValue = (date: Date) => {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
};

export const timeToMinutes = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return NaN;
  return hh * 60 + mm;
};

export const minutesToTime = (minutes: number) => {
  const clamped = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
};

export const combineLocalDateTime = (dateValue: string, timeValue: string) => {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue.trim());
  const minutes = timeToMinutes(timeValue);
  if (!dateMatch || Number.isNaN(minutes)) return new Date(NaN);
  const y = Number(dateMatch[1]);
  const m = Number(dateMatch[2]);
  const d = Number(dateMatch[3]);
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
};

export const buildTimeOptions = (startMinutes: number, endMinutes: number, stepMinutes: number) => {
  const options: string[] = [];
  for (let t = startMinutes; t <= endMinutes; t += stepMinutes) {
    options.push(minutesToTime(t));
  }
  return options;
};

export type ApiEvent = {
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