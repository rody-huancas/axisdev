"use client";

import { useMemo, useState } from "react";
import { sileo } from "sileo";
import type { TareaPendiente } from "@/services/google-service";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { TaskItem } from "./components/task-item";
import { CreateTaskModal } from "./modals/create-task-modal";
import { TaskDetailModal } from "./modals/task-detail-modal";
import { calculatePageCount, filterTasksByStatus, sortTasks } from "@/lib/tasks-utils";
import { RiSearchLine, RiRefreshLine, RiAddLine, RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

export type TaskList = {
  id   : string;
  title: string;
};

type TasksClientProps = {
  initialTasks: TareaPendiente[];
};

export const TasksClient = ({ initialTasks }: TasksClientProps) => {
  const { t } = useTranslation();
  const [tasks       , setTasks       ] = useState<TareaPendiente[]>(initialTasks);
  const [query       , setQuery       ] = useState<string>("");
  const [status      , setStatus      ] = useState<"all" | "pendiente" | "completada">("all");
  const [page        , setPage        ] = useState<number>(1);
  const [isLoading   , setIsLoading   ] = useState<boolean>(false);
  const [selected    , setSelected    ] = useState<TareaPendiente | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen  , setIsEditOpen  ] = useState<boolean>(false);

  const filtered = useMemo(() => {
    let result = tasks;
    if (query) {
      const lower = query.toLowerCase();
      result = result.filter((t) => t.titulo.toLowerCase().includes(lower));
    }
    result = filterTasksByStatus(result, status);
    return result;
  }, [tasks, query, status]);

  const sorted = useMemo(() => sortTasks(filtered, "date"), [filtered]);

  const mainTasks = sorted;

  const totalPages = calculatePageCount(mainTasks.length);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error();
      const data = await res.json() as { items: TareaPendiente[] };
      setTasks(data.items);
      setPage(1);
    } catch {
      sileo.error({ title: t.pages.tasks.loadError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: { title: string; due?: string; notes?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          title: data.title,
          due  : data.due,
          notes: data.notes,
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json() as { item: TareaPendiente };
      setTasks((prev) => [result.item, ...prev]);
      sileo.success({ title: t.pages.tasks.taskCreated });
    } catch {
      sileo.error({ title: t.pages.tasks.createError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: { title: string; due?: string; notes?: string }) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${selected.id}`, {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          title   : data.title,
          due     : data.due,
          notes   : data.notes,
          tasklist: selected.tasklist,
          parent  : selected.parent,
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json() as { item: TareaPendiente };
      setTasks((prev) => prev.map((t) => (t.id === selected.id ? result.item : t)));
      setSelected(result.item);
      setIsDetailOpen(false);
      sileo.success({ title: t.pages.tasks.taskUpdated });
    } catch {
      sileo.error({ title: t.pages.tasks.updateError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (task: TareaPendiente, completed: boolean) => {
    const taskId = task.id;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, estado: completed ? "completada" : "pendiente" } : t)),
    );
    
    sileo.promise(
      fetch(`/api/tasks/${taskId}`, {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ completed, tasklist: task.tasklist }),
      }).then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      {
        loading: { title: completed ? t.pages.tasks.completing : t.pages.tasks.reopening },
        success: { title: completed ? t.pages.tasks.taskCompleted : t.pages.tasks.taskOpen },
        error  : { title: t.pages.tasks.updateError },
      },
    );
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${selected.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasklist: selected.tasklist, parent: selected.parent }),
      });
      if (!res.ok) throw new Error();
      setTasks((prev) => prev.filter((t) => t.id !== selected.id));
      setIsDetailOpen(false);
      setSelected(null);
      sileo.success({ title: t.pages.tasks.taskDeleted });
    } catch {
      sileo.error({ title: t.pages.tasks.deleteError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFromCard = async (task: TareaPendiente) => {
    sileo.promise(
      (async () => {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasklist: task.tasklist, parent: task.parent }),
        });
        if (!res.ok) throw new Error();
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      })(),
      {
        loading: { title: t.pages.tasks.deleting },
        success: { title: t.pages.tasks.taskDeleted },
        error: { title: t.pages.tasks.deleteError },
      },
    );
  };

  const openCreate = () => {
    setIsCreateOpen(true);
  };

  const openDetail = (task: TareaPendiente) => {
    console.log("Opening task detail:", task);
    setSelected(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 lg:max-w-md">
          <RiSearchLine className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--axis-muted)" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t.pages.tasks.searchTasks}
            className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-(--axis-accent) focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-accent) disabled:opacity-50"
            title={t.pages.tasks.reload}
          >
            <RiRefreshLine className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
          >
            <RiAddLine className="h-5 w-5" />
            {t.pages.tasks.new}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
        {(["all", "pendiente", "completada"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] transition",
              status === value
                ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                : "text-(--axis-muted) hover:text-(--axis-text)",
            )}
          >
            {value === "all" ? t.pages.tasks.all : value === "pendiente" ? t.pages.tasks.pendingTab : t.pages.tasks.completedTab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {mainTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--axis-border) bg-(--axis-surface-strong) px-6 py-16 text-center">
            <RiAddLine className="h-12 w-12 text-(--axis-muted)" />
            <p className="mt-4 text-base font-semibold text-(--axis-text)">{t.pages.tasks.noTasks}</p>
            <p className="text-sm text-(--axis-muted)">{t.pages.tasks.createTaskStart}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mainTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDeleteFromCard}
                onSelect={openDetail}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            {t.pages.tasks.previous}
          </button>
          <span className="text-sm text-(--axis-muted)">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
          >
            {t.pages.tasks.next}
            <RiArrowRightLine className="h-4 w-4" />
          </button>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      <TaskDetailModal
        task={selected}
        isOpen={isDetailOpen}
        isEditOpen={isEditOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setIsEditOpen(false);
          setSelected(null);
        }}
        onEditOpen={() => setIsEditOpen(true)}
        onEditClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdate}
        onToggle={(completed) => handleToggle(selected!, completed)}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};
