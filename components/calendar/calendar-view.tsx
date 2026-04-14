import { SlotInfo, Calendar, Views } from "react-big-calendar";
import { CalendarEvent } from "./types";
import { localizer, messages } from "@/lib/calendar-utils";

type Props = {
  events       : CalendarEvent[];
  onSelectSlot : (slot: SlotInfo) => void;
  onSelectEvent: (event: CalendarEvent) => void;
};

export const CalendarView = ({ events, onSelectSlot, onSelectEvent }: Props) => (
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
        culture="es"
        style={{ height: "100%" }}
      />
    </div>
  </div>
);
