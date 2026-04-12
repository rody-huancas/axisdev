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
  RiAddLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiMoreLine,
  RiRefreshLine,
  RiSearchLine,
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
  const [selected, setSelected] = useState<TareaPendiente | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDue, setNewDue] = useState<string>("");
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDue, setEditDue] = useState<string>("");

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

  const openCreate = () => {
    setNewTitle("");
    setNewDue("");
    setIsCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsLoading(true);
    const run = async () => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), due: newDue || undefined }),
      });
      if (!response.ok) throw new Error("Error");
      const data = await response.json() as { item: TareaPendiente };
      setTasks((prev) => [data.item, ...prev]);
      setIsCreateOpen(false);
    };
    sileo.promise(run(), {
      loading: { title: "Creando..." },
      success: { title: "Tarea creada" },
      error: { title: "Error" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const run = async () => {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setIsDetailOpen(false);
      setSelected(null);
    };
    sileo.promise(run(), {
      loading: { title: "Eliminando..." },
      success: { title: "Eliminada" },
      error: { title: "Error" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selected || !editTitle.trim()) return;
    setIsLoading(true);
    const run = async () => {
      const response = await fetch(`/api/tasks/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), due: editDue || undefined }),
      });
      if (!response.ok) throw new Error("Error");
      const data = await response.json() as { item: TareaPendiente };
      setTasks((prev) => prev.map((t) => (t.id === selected.id ? data.item : t)));
      setSelected(data.item);
      setIsEditOpen(false);
    };
    sileo.promise(run(), {
      loading: { title: "Guardando..." },
      success: { title: "Actualizada" },
      error: { title: "Error" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  const openDetail = async (task: TareaPendiente) => {
    setSelected(task);
    setEditTitle(task.titulo);
    setEditDue(task.vence || "");
    setIsDetailOpen(true);
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
      loading: { title: "Cargando..." },
      success: { title: "Actualizado" },
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
          <RiSearchLine className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar tareas..."
            className="w-full rounded-2xl border border-border bg-surface-strong py-3 pl-11 pr-4 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:bg-surface hover:text-accent disabled:opacity-50"
            title=" Actualizar"
          >
            <RiRefreshLine className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
          >
            <RiAddLine className="h-4 w-4" />
            Nueva
          </button>
        </div>
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
        <TaskList tasks={paginated} onToggle={handleToggle} onSelect={openDetail} />
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

      {isCreateOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60" onClick={() => !isLoading && setIsCreateOpen(false)} />
          <div className="relative z-10 flex h-dvh items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-text">Nueva tarea</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:bg-surface hover:text-text"
                >
                  <RiCloseLine className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Titulo de la tarea"
                  className="w-full rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
                />
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-text focus:border-accent focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:bg-surface-strong"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isLoading || !newTitle.trim()}
                    className="rounded-2xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-50"
                  >
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
          <div className="relative z-10 flex h-dvh items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-text">Detalle</h3>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-surface-strong text-muted transition hover:bg-surface hover:text-text"
                >
                  <RiCloseLine className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                {isEditOpen ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-text focus:border-accent focus:outline-none"
                    />
                    <input
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-text focus:border-accent focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted transition hover:bg-surface-strong"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleEdit}
                        disabled={isLoading || !editTitle.trim()}
                        className="rounded-2xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-accent">Titulo</p>
                      <p className={cn("mt-1 text-lg font-semibold text-text", selected.estado === "completada" && "line-through text-muted")}>
                        {selected.titulo}
                      </p>
                    </div>
                    {selected.vence && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-accent">Vence</p>
                        <p className="mt-1 text-sm text-text">{selected.vence}</p>
                      </div>
                    )}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(selected.id)}
                        className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-400 transition hover:bg-rose-500/20"
                      >
                        <RiDeleteBin6Line className="mr-2 inline h-4 w-4" />
                        Eliminar
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditOpen(true)}
                          className="flex items-center gap-2 rounded-2xl border border-border bg-surface-strong px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text transition hover:bg-surface"
                        >
                          <RiEditLine className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(selected.id, selected.estado === "pendiente")}
                          className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
                        >
                          {selected.estado === "pendiente" ? "Completar" : "Reabrir"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};