"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { es } from "date-fns/locale";
import { sileo } from "sileo";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer, Views, type Event as RBCEvent, type SlotInfo } from "react-big-calendar";
import { cn } from "@/lib/utils";
import { getDefaultCalendarFetchRange } from "@/lib/calendar-date-range";
import { RiArrowDownSLine, RiCloseLine, RiExternalLinkLine } from "react-icons/ri";


type ApiEvent = {
  id          : string;
  title       : string;
  start       : string;
  end         : string;
  meetLink   ?: string | null;
  htmlLink   ?: string | null;
  location   ?: string | null;
  description?: string | null;
  attendees  ?: string[];
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

const pad2 = (value: number) => String(value).padStart(2, "0");

const formatDateValue = (date: Date) => {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
};

const timeToMinutes = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return NaN;
  return hh * 60 + mm;
};

const minutesToTime = (minutes: number) => {
  const clamped = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
};

const combineLocalDateTime = (dateValue: string, timeValue: string) => {
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

const buildTimeOptions = (startMinutes: number, endMinutes: number, stepMinutes: number) => {
  const options: string[] = [];
  for (let t = startMinutes; t <= endMinutes; t += stepMinutes) {
    options.push(minutesToTime(t));
  }
  return options;
};

type TimeDropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

const TimeDropdown = ({ label, value, options, onChange, disabled }: TimeDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current && !ref.current.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="space-y-2" ref={ref}>
      <span className="text-xs font-semibold text-(--axis-muted)">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => (disabled ? null : setOpen((prev) => !prev))}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-left text-sm text-(--axis-text) transition",
            open && "border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] ring-2 ring-[color-mix(in_srgb,var(--axis-accent)_18%,transparent)]",
            disabled && "opacity-60",
          )}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="tabular-nums">{value}</span>
          <RiArrowDownSLine className={cn("h-5 w-5 text-(--axis-muted) transition", open && "rotate-180")} aria-hidden />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
            <div className="max-h-64 overflow-auto p-2">
              <div className="grid grid-cols-2 gap-1" role="listbox" aria-label={label}>
                {options.map((option) => {
                  const active = option === value;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                      className={cn(
                        "rounded-xl px-3 py-2 text-left text-sm tabular-nums transition",
                        active
                          ? "bg-[color-mix(in_srgb,var(--axis-accent)_14%,transparent)] text-(--axis-text) ring-1 ring-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))]"
                          : "text-(--axis-muted) hover:bg-(--axis-surface-strong) hover:text-(--axis-text)",
                      )}
                      role="option"
                      aria-selected={active}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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

  const startOptions = useMemo(() => {
    const all = buildTimeOptions(6 * 60, 22 * 60 + 30, 30);
    if (createDayPart === "morning") {
      return all.filter((value) => {
        const minutes = timeToMinutes(value);
        return minutes >= 6 * 60 && minutes < 12 * 60;
      });
    }
    return all.filter((value) => {
      const minutes = timeToMinutes(value);
      return minutes >= 12 * 60 && minutes <= 22 * 60;
    });
  }, [createDayPart]);

  const endOptions = useMemo(() => {
    const startMinutes = timeToMinutes(createStartTime);
    const all = buildTimeOptions(6 * 60, 23 * 60 + 30, 30);
    return all.filter((value) => {
      const minutes = timeToMinutes(value);
      return !Number.isNaN(startMinutes) && minutes > startMinutes;
    });
  }, [createStartTime]);

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

  const syncEndAfterStart = (nextStartTime: string, nextEndTime: string) => {
    const startMinutes = timeToMinutes(nextStartTime);
    const endMinutes = timeToMinutes(nextEndTime);
    if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) return nextEndTime;
    if (endMinutes > startMinutes) return nextEndTime;
    return minutesToTime(startMinutes + 60);
  };

  const openCreateModal = (startAt?: Date, endAt?: Date) => {
    const start = startAt ?? new Date();
    const end = endAt ?? new Date(start.getTime() + 60 * 60 * 1000);

    const rawStartMinutes = Math.ceil((start.getHours() * 60 + start.getMinutes()) / 30) * 30;
    const rawEndMinutes = Math.ceil((end.getHours() * 60 + end.getMinutes()) / 30) * 30;

    const minStart = 6 * 60;
    const maxStart = 22 * 60 + 30;
    const maxEnd = 23 * 60 + 30;

    const startMinutes = Math.min(Math.max(rawStartMinutes, minStart), maxStart);
    const endMinutes = Math.min(Math.max(rawEndMinutes, startMinutes + 30), maxEnd);
    const startTime = minutesToTime(startMinutes);
    const endTime = minutesToTime(endMinutes);

    setCreateDate(formatDateValue(start));
    setCreateStartTime(startTime);
    setCreateEndTime(endTime);
    setCreateDayPart(startMinutes < 12 * 60 ? "morning" : "afternoon");
    setCreateTitle("");
    setCreateLocation("");
    setCreateDescription("");
    setCreateAttendees("");
    setCreateMeet(true);
    setIsCreateOpen(true);
  };

  const handleSelectSlot = (slot: SlotInfo) => {
    const start = slot.start as Date;
    const end   = slot.end as Date;

    openCreateModal(start, end);
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

    const startAt = combineLocalDateTime(createDate, createStartTime);
    const endAt = combineLocalDateTime(createDate, createEndTime);
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
      attendees  : Array.from(
        new Set(
          createAttendees
            .split(/[\n,;\s]+/g)
            .map((value) => value.trim())
            .filter(Boolean),
        ),
      ),
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
            onClick={() => openCreateModal()}
            className="rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
          >
            Crear evento
          </button>
        </div>
      </div>

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
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-start justify-between gap-4 border-b border-(--axis-border) px-6 py-5">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Nuevo evento</p>
                  <h3 className="mt-2 text-xl font-semibold text-(--axis-text)">Crear en Google Calendar</h3>
                  <p className="mt-2 text-sm text-(--axis-muted)">
                    Elige una sola fecha y un rango horario. Puedes usar Mañana/Tarde como atajo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => (isLoading ? null : setIsCreateOpen(false))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text) disabled:opacity-50"
                  aria-label="Cerrar"
                  disabled={isLoading}
                  title="Cerrar"
                >
                  <RiCloseLine className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div className="max-h-[82dvh] overflow-auto px-6 py-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="Titulo"
                    className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                    disabled={isLoading}
                  />

                  <label className="space-y-2">
                    <span className="text-xs font-semibold text-(--axis-muted)">Fecha</span>
                    <input
                      type="date"
                      value={createDate}
                      onChange={(e) => setCreateDate(e.target.value)}
                      className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) focus:outline-none"
                      disabled={isLoading}
                    />
                  </label>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-(--axis-muted)">Bloque</span>
                    <div className="flex items-center gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCreateDayPart("morning");
                          setCreateStartTime("09:00");
                          setCreateEndTime("10:00");
                        }}
                        className={cn(
                          "flex-1 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                          createDayPart === "morning"
                            ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                            : "text-(--axis-muted) hover:text-(--axis-text)",
                        )}
                        disabled={isLoading}
                      >
                        Mañana
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateDayPart("afternoon");
                          setCreateStartTime("15:00");
                          setCreateEndTime("16:00");
                        }}
                        className={cn(
                          "flex-1 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                          createDayPart === "afternoon"
                            ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                            : "text-(--axis-muted) hover:text-(--axis-text)",
                        )}
                        disabled={isLoading}
                      >
                        Tarde
                      </button>
                    </div>
                  </div>

                  <TimeDropdown
                    label="Inicio"
                    value={createStartTime}
                    options={startOptions}
                    disabled={isLoading}
                    onChange={(next) => {
                      const nextMinutes = timeToMinutes(next);
                      setCreateStartTime(next);
                      if (!Number.isNaN(nextMinutes)) {
                        setCreateDayPart(nextMinutes < 12 * 60 ? "morning" : "afternoon");
                      }
                      setCreateEndTime((prev) => syncEndAfterStart(next, prev));
                    }}
                  />

                  <TimeDropdown
                    label="Fin"
                    value={createEndTime}
                    options={endOptions}
                    disabled={isLoading}
                    onChange={(next) => setCreateEndTime(next)}
                  />

                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {[30, 60, 120].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => {
                          const startMinutes = timeToMinutes(createStartTime);
                          if (Number.isNaN(startMinutes)) return;
                          const maxEnd = 23 * 60 + 30;
                          const nextEnd = Math.min(startMinutes + duration, maxEnd);
                          if (nextEnd <= startMinutes) return;
                          setCreateEndTime(minutesToTime(nextEnd));
                        }}
                        disabled={isLoading}
                        className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text) disabled:opacity-50"
                        title="Ajustar duracion"
                      >
                        {duration === 30 ? "30 min" : duration === 60 ? "1 hora" : "2 horas"}
                      </button>
                    ))}
                  </div>

                  <input
                    value={createLocation}
                    onChange={(e) => setCreateLocation(e.target.value)}
                    placeholder="Ubicacion (opcional)"
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

                  <input
                    value={createAttendees}
                    onChange={(e) => setCreateAttendees(e.target.value)}
                    placeholder="Invitados (emails: coma, espacio o salto de linea)"
                    className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                    disabled={isLoading}
                  />

                  <textarea
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    placeholder="Descripcion (opcional)"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-(--axis-border) bg-(--axis-surface) px-6 py-4">
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
                {selected.attendees?.length ? (
                  <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">Invitados</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.attendees.map((email) => (
                        <span
                          key={email}
                          className="rounded-full border border-(--axis-border) bg-(--axis-surface) px-3 py-1 text-xs text-(--axis-text)"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
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
