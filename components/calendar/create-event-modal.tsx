"use client";

import { useMemo } from "react";
import { RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { TimeDropdown } from "./time-dropdown";
import { timeToMinutes, minutesToTime, buildTimeOptions } from "@/lib/calendar-utils";

type CreateModalProps = {
  isOpen              : boolean;
  isLoading           : boolean;
  onClose             : () => void;
  onCreate            : () => Promise<void>;
  createTitle         : string;
  setCreateTitle      : (v: string) => void;
  createDate          : string;
  setCreateDate       : (v: string) => void;
  createStartTime     : string;
  setCreateStartTime  : (v: string) => void;
  createEndTime       : string;
  setCreateEndTime    : (v: string) => void;
  createDayPart       : "morning" | "afternoon";
  setCreateDayPart    : (v: "morning" | "afternoon") => void;
  createLocation      : string;
  setCreateLocation   : (v: string) => void;
  createDescription   : string;
  setCreateDescription: (v: string) => void;
  createAttendees     : string;
  setCreateAttendees  : (v: string) => void;
  createMeet          : boolean;
  setCreateMeet       : (v: boolean) => void;
};

const syncEndAfterStart = (start: string, prevEnd: string) => {
  const startMin = timeToMinutes(start);
  const endMin   = timeToMinutes(prevEnd);

  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return prevEnd;
  if (endMin <= startMin) {
    return minutesToTime(Math.min(startMin + 30, 23 * 60 + 30));
  }
  return prevEnd;
};

export const CreateEventModal = (props: CreateModalProps) => {
  const {
    isOpen,
    isLoading,
    onClose,
    onCreate,
    createTitle,
    setCreateTitle,
    createDate,
    setCreateDate,
    createStartTime,
    setCreateStartTime,
    createEndTime,
    setCreateEndTime,
    createDayPart,
    setCreateDayPart,
    createLocation,
    setCreateLocation,
    createDescription,
    setCreateDescription,
    createAttendees,
    setCreateAttendees,
    createMeet,
    setCreateMeet,
  } = props;


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
    const all          = buildTimeOptions(6 * 60, 23 * 60 + 30, 30);

    return all.filter((value) => {
      const minutes = timeToMinutes(value);
      return !Number.isNaN(startMinutes) && minutes > startMinutes;
    });
  }, [createStartTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={() => (isLoading ? null : onClose())} />
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
              onClick={() => (isLoading ? null : onClose())}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text) disabled:opacity-50"
              disabled={isLoading}
            >
              <RiCloseLine className="h-5 w-5" />
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
                  setCreateStartTime(next);
                  const nextMinutes = timeToMinutes(next);
                  if (!Number.isNaN(nextMinutes)) {
                    setCreateDayPart(nextMinutes < 12 * 60 ? "morning" : "afternoon");
                  }
                  setCreateEndTime(syncEndAfterStart(next, createEndTime));
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
                  >
                    {duration === 30 ? "30 min" : duration === 60 ? "1 hora" : "2 horas"}
                  </button>
                ))}
              </div>

              <input
                value={createLocation}
                onChange={(e) => setCreateLocation(e.target.value)}
                placeholder="Ubicacion (opcional)"
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                disabled={isLoading}
              />

              <textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Descripcion (opcional)"
                rows={3}
                className="w-full resize-none rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                disabled={isLoading}
              />

              <input
                value={createAttendees}
                onChange={(e) => setCreateAttendees(e.target.value)}
                placeholder="Asistentes (email, separado por comas)"
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none sm:col-span-2"
                disabled={isLoading}
              />

              <label className="flex items-center gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={createMeet}
                  onChange={(e) => setCreateMeet(e.target.checked)}
                  className="h-5 w-5 rounded border-(--axis-border) text-(--axis-accent) focus:ring-(--axis-accent)"
                  disabled={isLoading}
                />
                <span className="text-sm text-(--axis-text)">Crear videollamada (Google Meet)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-(--axis-border) px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-5 py-2.5 text-sm font-semibold text-(--axis-text) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onCreate}
              disabled={isLoading}
              className="rounded-2xl bg-(--axis-accent) px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Creando..." : "Crear evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { ApiEvent } from "@/lib/calendar-utils";
