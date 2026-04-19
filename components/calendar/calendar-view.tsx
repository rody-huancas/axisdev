"use client";

import { SlotInfo, Calendar, Views } from "react-big-calendar";
import { localizer } from "@/lib/calendar-utils";
import { CalendarEvent } from "./types";
import { useTranslation } from "@/lib/i18n";

type Props = {
  events       : CalendarEvent[];
  onSelectSlot : (slot: SlotInfo) => void;
  onSelectEvent: (event: CalendarEvent) => void;
};

export const CalendarView = ({ events, onSelectSlot, onSelectEvent }: Props) => {
  const { t } = useTranslation();
  
  const messages = {
    allDay         : t.pages.calendar.allDay,
    previous       : t.pages.calendar.previous,
    next           : t.pages.calendar.next,
    today          : t.pages.calendar.today,
    month          : t.pages.calendar.month,
    week           : t.pages.calendar.week,
    day            : t.pages.calendar.day,
    agenda         : t.pages.calendar.agenda,
    date           : t.pages.calendar.date,
    time           : t.pages.calendar.time,
    event          : t.pages.calendar.event,
    noEventsInRange: t.pages.calendar.noEvents,
    showMore       : (total: number) => `+${total} ${t.pages.calendar.more}`,
  };

  const culture = t.common.lang === "en" ? "en" : "es";

  return (
    <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
      <div className="axis-rbc h-[70dvh] min-h-130">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
          messages={messages}
          selectable
          popup
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          culture={culture}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
};
