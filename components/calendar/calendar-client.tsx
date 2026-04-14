"use client";

import { useMemo, useState } from "react";
import { sileo } from "sileo";
import type { SlotInfo } from "react-big-calendar";
import { CalendarHeader } from "./calendar-layout";
import { EventDetailModal } from "./event-detail-modal";
import { CreateEventModal } from "./create-event-modal";
import { getDefaultCalendarFetchRange } from "@/lib/calendar-date-range";
import { ApiEvent, toDate, minutesToTime, combineLocalDateTime, formatDateValue } from "@/lib/calendar-utils";
import type { CalendarEvent } from "./types";
import { CalendarView } from "./calendar-view";

type CalendarClientProps = {
  initialItems: ApiEvent[];
};

export const CalendarClient = ({ initialItems }: CalendarClientProps) => {
  const [items            , setItems            ] = useState<ApiEvent[]>(initialItems);
  const [isCreateOpen     , setIsCreateOpen     ] = useState<boolean>(false);
  const [isDetailOpen     , setIsDetailOpen     ] = useState<boolean>(false);
  const [selected         , setSelected         ] = useState<ApiEvent | null>(null);
  const [isLoading        , setIsLoading        ] = useState<boolean>(false);
  const [createTitle      , setCreateTitle      ] = useState<string>("");
  const [createDate       , setCreateDate       ] = useState<string>("");
  const [createStartTime  , setCreateStartTime  ] = useState<string>("09:00");
  const [createEndTime    , setCreateEndTime    ] = useState<string>("10:00");
  const [createDayPart    , setCreateDayPart    ] = useState<"morning" | "afternoon">("morning");
  const [createLocation   , setCreateLocation   ] = useState<string>("");
  const [createDescription, setCreateDescription] = useState<string>("");
  const [createAttendees  , setCreateAttendees  ] = useState<string>("");
  const [createMeet       , setCreateMeet       ] = useState<boolean>(true);

  const events = useMemo<CalendarEvent[]>(() =>
    items.map((item) => ({
      title   : item.title,
      start   : toDate(item.start),
      end     : toDate(item.end),
      resource: item,
    }))
  , [items]);

  const fetchRange = async (start: Date, end: Date) => {
    setIsLoading(true);
    const url = new URL("/api/calendar/events", window.location.origin);

    url.searchParams.set("start", start.toISOString());
    url.searchParams.set("end", end.toISOString());

    const res  = await fetch(url.toString());
    const data = await res.json() as { items: ApiEvent[] };

    setItems(data.items ?? []);
    setIsLoading(false);
  };

  const openCreateModal = (start?: Date, end?: Date) => {
    const now             = start ?? new Date();
    const rawStartMinutes = now.getHours() * 60 + now.getMinutes();
    const rawEndMinutes   = rawStartMinutes + 60;
    const minStart        = 6 * 60;
    const maxEnd          = 23 * 60 + 30;
    const startMinutes    = Math.min(Math.max(rawStartMinutes, minStart), maxEnd);
    const endMinutes      = Math.min(Math.max(rawEndMinutes, startMinutes + 30), maxEnd);

    setCreateDate(formatDateValue(now));
    setCreateStartTime(minutesToTime(startMinutes));
    setCreateEndTime(minutesToTime(endMinutes));
    setCreateDayPart(startMinutes < 12 * 60 ? "morning" : "afternoon");
    setCreateTitle("");
    setCreateLocation("");
    setCreateDescription("");
    setCreateAttendees("");
    setCreateMeet(true);
    setIsCreateOpen(true);
  };

  const handleSelectSlot  = (slot: SlotInfo) => openCreateModal(slot.start as Date, slot.end as Date);
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelected(event.resource ?? null);
    setIsDetailOpen(Boolean(event.resource));
  };

  const handleCreate = async () => {
    const title = createTitle.trim();
    if (!title) {
      sileo.error({ title: "Titulo requerido", description: "Escribe un titulo para el evento." });
      return;
    }

    const startAt = combineLocalDateTime(createDate, createStartTime);
    const endAt   = combineLocalDateTime(createDate, createEndTime);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      sileo.error({ title: "Fecha invalida", description: "Revisa inicio y fin del evento." });
      return;
    }
    if (endAt.getTime() <= startAt.getTime()) {
      sileo.error({ title: "Horario invalido", description: "La hora de fin debe ser posterior al inicio." });
      return;
    }

    const payload = {
      title,
      start      : startAt.toISOString(),
      end        : endAt.toISOString(),
      location   : createLocation.trim()    || undefined,
      description: createDescription.trim() || undefined,
      attendees  : Array.from(new Set(createAttendees.split(/[\n,;\s]+/g).map((v) => v.trim()).filter(Boolean))),
      createMeet,
    };

    setIsLoading(true);
    try {
      const response = await fetch("/api/calendar/events", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("create_failed");
      const data = (await response.json()) as { item: ApiEvent };
      setItems((prev) => [data.item, ...prev]);
      setIsCreateOpen(false);
    } catch (err) {
      sileo.error({ title: "No se pudo crear", description: err instanceof Error ? err.message : undefined });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        isLoading={isLoading}
        eventCount={items.length}
        onReload={() => { const { start, end } = getDefaultCalendarFetchRange(); fetchRange(start, end).catch(() => {}); }}
        onCreate={() => openCreateModal()}
      />

      <CalendarView
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      <CreateEventModal
        isOpen={isCreateOpen}
        isLoading={isLoading}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
        createTitle={createTitle}
        setCreateTitle={setCreateTitle}
        createDate={createDate}
        setCreateDate={setCreateDate}
        createStartTime={createStartTime}
        setCreateStartTime={setCreateStartTime}
        createEndTime={createEndTime}
        setCreateEndTime={setCreateEndTime}
        createDayPart={createDayPart}
        setCreateDayPart={setCreateDayPart}
        createLocation={createLocation}
        setCreateLocation={setCreateLocation}
        createDescription={createDescription}
        setCreateDescription={setCreateDescription}
        createAttendees={createAttendees}
        setCreateAttendees={setCreateAttendees}
        createMeet={createMeet}
        setCreateMeet={setCreateMeet}
      />

      <EventDetailModal
        isOpen={isDetailOpen}
        selected={selected}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default CalendarClient;
