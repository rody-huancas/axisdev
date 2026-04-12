"use client";

import { useMemo, useState } from "react";
import { es } from "date-fns/locale";
import { sileo } from "sileo";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer, Views, type Event as RBCEvent, type SlotInfo } from "react-big-calendar";
import { getDefaultCalendarFetchRange } from "@/lib/calendar-date-range";
import { formatDateTimeLocalValue, parseDateTimeLocalValue } from "@/lib/datetime-local";
import { RiExternalLinkLine } from "react-icons/ri";


type ApiEvent = {
  id          : string;
  title       : string;
  start       : string;
  end         : string;
  meetLink   ?: string | null;
  htmlLink   ?: string | null;
  location   ?: string | null;
  description?: string | null;
};

type CalendarClientProps = {
  initialItems: ApiEvent[];
};

type CalendarEvent = RBCEvent & {
  resource?: ApiEvent;
};

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
  allDay         : "Todo el dia",
  previous       : "Anterior",
  next           : "Siguiente",
  today          : "Hoy",
  month          : "Mes",
  week           : "Semana",
  day            : "Dia",
  agenda         : "Agenda",
  date           : "Fecha",
  time           : "Hora",
  event          : "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore       : (total: number) => `+${total} mas`,
};

const toDate = (iso: string) => new Date(iso);

export const CalendarClient = ({ initialItems }: CalendarClientProps) => {
  const [items            , setItems            ] = useState<ApiEvent[]>(initialItems);
  const [isCreateOpen     , setIsCreateOpen     ] = useState<boolean>(false);
  const [isDetailOpen     , setIsDetailOpen     ] = useState<boolean>(false);
  const [selected         , setSelected         ] = useState<ApiEvent | null>(null);
  const [isLoading        , setIsLoading        ] = useState<boolean>(false);
  const [createTitle      , setCreateTitle      ] = useState<string>("");
  const [createStart      , setCreateStart      ] = useState<string>(formatDateTimeLocalValue(new Date()));
  const [createEnd        , setCreateEnd        ] = useState<string>(formatDateTimeLocalValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [createLocation   , setCreateLocation   ] = useState<string>("");
  const [createDescription, setCreateDescription] = useState<string>("");
  const [createAttendees  , setCreateAttendees  ] = useState<string>("");
  const [createMeet       , setCreateMeet       ] = useState<boolean>(true);

  const events = useMemo<CalendarEvent[]>(
    () =>
      items.map((item) => ({
        title   : item.title,
        start   : toDate(item.start),
        end     : toDate(item.end),
        resource: item,
      })),
    [items],
  );

  const fetchRange = async (start: Date, end: Date) => {
    setIsLoading(true);
    const url = new URL("/api/calendar/events", window.location.origin);
    url.searchParams.set("start", start.toISOString());
    url.searchParams.set("end", end.toISOString());

    const run = async () => {
      const response = await fetch(url.toString());
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        if (response.status === 403 && text.includes("insufficient authentication scopes")) {
          throw new Error(
            "Falta permiso de Google Calendar. Cierra sesion y vuelve a entrar para aceptar los nuevos permisos.",
          );
        }
        throw new Error(text || `Error ${response.status}`);
      }
      const data = (await response.json()) as { items: ApiEvent[] };
      setItems(data.items);
    };

    const promise = run();
    sileo.promise(promise, {
      loading: { title: "Cargando calendario..." },
      success: { title: "Calendario actualizado" },
      error: (err) => ({
        title: "No se pudo cargar",
        description: err instanceof Error ? err.message : undefined,
      }),
    });
    try {
      await promise;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlot = (slot: SlotInfo) => {
    const start = slot.start as Date;
    const end   = slot.end as Date;

    setCreateStart(formatDateTimeLocalValue(start));
    setCreateEnd(formatDateTimeLocalValue(end));
    setCreateTitle("");
    setCreateLocation("");
    setCreateDescription("");
    setCreateAttendees("");
    setCreateMeet(true);
    setIsCreateOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    const resource = event.resource ?? null;
    setSelected(resource);
    setIsDetailOpen(Boolean(resource));
  };

  const handleCreate = async () => {
    const title = createTitle.trim();
    if (!title) {
      sileo.error({ title: "Titulo requerido", description: "Escribe un titulo para el evento." });
      return;
    }

    const startAt = parseDateTimeLocalValue(createStart);
    const endAt = parseDateTimeLocalValue(createEnd);
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
      location   : createLocation.trim() || undefined,
      description: createDescription.trim() || undefined,
      attendees  : createAttendees.split(",").map((value) => value.trim()).filter(Boolean),
      createMeet,
    };

    setIsLoading(true);
    const promise = fetch("/api/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        if (response.status === 403 && text.includes("insufficient authentication scopes")) {
          throw new Error(
            "Falta permiso para crear eventos. Cierra sesion y vuelve a entrar para aceptar los permisos de calendario.",
          );
        }
        throw new Error(text || "create_failed");
      }
      const data = (await response.json()) as { item: ApiEvent };
      setItems((prev) => [data.item, ...prev]);
      setIsCreateOpen(false);
    });

    sileo.promise(promise, {
      loading: { title: "Creando evento..." },
      success: { title: "Evento creado" },
      error: (err) => ({
        title: "No se pudo crear",
        description: err instanceof Error ? err.message : undefined,
      }),
    });

    try {
      await promise;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Calendario</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">Eventos</h1>
          <p className="mt-2 text-sm text-(--axis-muted)">
            Navega con la barra del calendario. Pulsa Recargar para traer de nuevo los eventos desde Google.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const { start, end } = getDefaultCalendarFetchRange();
              void fetchRange(start, end);
            }}
            disabled={isLoading}
            className="rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
          >
            Recargar
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
          >
            Crear evento
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
        <div className="axis-rbc h-[70dvh] min-h-[520px]">
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
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            culture="es"
            style={{ height: "100%" }}
          />
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60" onClick={() => (isLoading ? null : setIsCreateOpen(false))} />
          <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Nuevo evento</p>
                <h3 className="mt-2 text-xl font-semibold text-(--axis-text)">Crear en Google Calendar</h3>
                <p className="mt-2 text-sm text-(--axis-muted)">
                  Si acabas de actualizar permisos, cierra sesion y entra de nuevo para que Google los aplique.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <input
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Titulo"
                  className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
                  disabled={isLoading}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold text-(--axis-muted)">Inicio</span>
                    <input
                      type="datetime-local"
                      value={createStart}
                      onChange={(e) => setCreateStart(e.target.value)}
                      className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) focus:outline-none"
                      disabled={isLoading}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-semibold text-(--axis-muted)">Fin</span>
                    <input
                      type="datetime-local"
                      value={createEnd}
                      onChange={(e) => setCreateEnd(e.target.value)}
                      className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) focus:outline-none"
                      disabled={isLoading}
                    />
                  </label>
                </div>

                <input
                  value={createLocation}
                  onChange={(e) => setCreateLocation(e.target.value)}
                  placeholder="Ubicacion (opcional)"
                  className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
                  disabled={isLoading}
                />

                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Descripcion (opcional)"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
                  disabled={isLoading}
                />

                <input
                  value={createAttendees}
                  onChange={(e) => setCreateAttendees(e.target.value)}
                  placeholder="Invitados (emails separados por coma)"
                  className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
                  disabled={isLoading}
                />

                <label className="flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text)">
                  <input
                    type="checkbox"
                    checked={createMeet}
                    onChange={(e) => setCreateMeet(e.target.checked)}
                    className="h-4 w-4 accent-(--axis-accent)"
                    disabled={isLoading}
                  />
                  Agregar reunion de Google Meet
                </label>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    disabled={isLoading}
                    className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isLoading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDetailOpen && selected && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsDetailOpen(false)} />
          <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Evento</p>
                  <h3 className="mt-2 truncate text-xl font-semibold text-(--axis-text)">{selected.title}</h3>
                  <p className="mt-2 text-sm text-(--axis-muted)">
                    {new Date(selected.start).toLocaleString("es-ES")} - {new Date(selected.end).toLocaleString("es-ES")}
                  </p>
                </div>
                {selected.htmlLink && (
                  <a
                    href={selected.htmlLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface)"
                  >
                    <RiExternalLinkLine className="h-4 w-4" />
                    Abrir
                  </a>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {selected.meetLink && (
                  <a
                    href={selected.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm font-semibold text-(--axis-text) transition hover:bg-(--axis-surface)"
                  >
                    Unirse a Meet
                    <p className="mt-1 truncate text-xs font-normal text-(--axis-muted)">{selected.meetLink}</p>
                  </a>
                )}
                {selected.location && (
                  <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">Ubicacion</p>
                    <p className="mt-2 text-sm text-(--axis-text)">{selected.location}</p>
                  </div>
                )}
                {selected.description && (
                  <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">Descripcion</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-(--axis-text)">{selected.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
