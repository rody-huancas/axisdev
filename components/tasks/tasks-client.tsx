"use client";

import { useMemo, useState } from "react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import type { TareaPendiente } from "@/services/google-service";
import {
  ITEMS_PER_PAGE,
  calculatePageCount,
  filterTasksByStatus,
  sortTasks,
} from "@/lib/tasks-utils";
import { TaskList } from "@/components/tasks/task-list";
import {
  RiArrowUpDownLine,
  RiCheckboxCircleLine,
  RiInboxLine,
  RiMoreLine,
  RiRefreshLine,
  RiSearchLine,
  RiSortAsc,
} from "react-icons/ri";

type TasksClientProps = {
  initialTasks: TareaPendiente[];
};

export const TasksClient = ({ initialTasks }: TasksClientProps) => {
  const [tasks, setTasks] = useState<TareaPendiente[]>(initialTasks);
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<"all" | "pendiente" | "completada">("all");
  const [sort, setSort] = useState<"date" | "alpha" | "status">("date");
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filtered = useMemo(() => {
    let result = tasks;
    if (query) {
      const lower = query.toLowerCase();
      result = result.filter((t) => t.titulo.toLowerCase().includes(lower));
    }
    result = filterTasksByStatus(result, status);
    result = sortTasks(result, sort);
    return result;
  }, [tasks, query, status, sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = calculatePageCount(filtered.length);

  const handleToggle = async (id: string, completed: boolean) => {
    setIsLoading(true);
    const run = async () => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Error");
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: completed ? "completada" : "pendiente" } : t)),
      );
    };
    sileo.promise(run(), {
      loading: { title: "Actualizando..." },
      success: { title: completed ? "Completada" : "Pendiente" },
      error: { title: "Error" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const run = async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Error");
      const data = await response.json() as { items: TareaPendiente[] };
      setTasks(data.items);
      setPage(1);
    };
    sileo.promise(run(), {
      loading: { title: "Cargando tareas..." },
      success: { title: "Tareas actualizadas" },
      error: { title: "Error" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 lg:max-w-md">
          <RiSearchLine
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar tareas..."
            className="w-full rounded-2xl border border-border bg-surface-strong py-3 pl-11 pr-4 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:bg-surface hover:text-accent disabled:opacity-50"
          title="Actualizar"
        >
          <RiRefreshLine className={cn("h-5 w-5", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 rounded-2xl border border-border bg-surface-strong p-1">
        {(["all", "pendiente", "completada"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
              status === value
                ? "bg-surface text-text shadow-sm ring-1 ring-border"
                : "text-muted hover:text-text",
            )}
          >
            {value === "all" ? "Todas" : value === "pendiente" ? "Pendientes" : "Completadas"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <TaskList tasks={paginated} onToggle={handleToggle} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="rounded-2xl border border-border bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text transition hover:bg-surface disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs text-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="rounded-2xl border border-border bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text transition hover:bg-surface disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};