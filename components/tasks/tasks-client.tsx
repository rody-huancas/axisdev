"use client";

import { useTasks } from "@/hooks/use-tasks";
import { TaskItemList } from "./task-item-list";
import { useTranslation } from "@/lib/i18n";
import { CreateTaskModal } from "./modals/create-task-modal";
import { TaskDetailModal } from "./modals/task-detail-modal";
import type { TareaPendiente } from "@/services/google-service";

type TasksClientProps = {
  initialTasks: TareaPendiente[];
};

export const TasksClient = ({ initialTasks }: TasksClientProps) => {
  const { t } = useTranslation();
  
  const {
    query,
    setQuery,
    status,
    setStatus,
    page,
    setPage,
    isLoading,
    selected,
    isDetailOpen,
    isCreateOpen,
    setIsCreateOpen,
    sorted,
    totalPages,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    openDetail,
    closeDetail,
  } = useTasks(initialTasks);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 lg:max-w-md">
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
            disabled={isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-accent) disabled:opacity-50"
            title={t.pages.tasks.reload}
          >
            <span className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}>↻</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
          >
            <span className="h-5 w-5">+</span>
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
            className={`rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] transition ${
              status === value
                ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                : "text-(--axis-muted) hover:text-(--axis-text)"
            }`}
          >
            {value === "all" ? t.pages.tasks.all : value === "pendiente" ? t.pages.tasks.pendingTab : t.pages.tasks.completedTab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--axis-border) bg-(--axis-surface-strong) px-6 py-16 text-center">
            <span className="h-12 w-12 text-(--axis-muted)">+</span>
            <p className="mt-4 text-base font-semibold text-(--axis-text)">{t.pages.tasks.noTasks}</p>
            <p className="text-sm text-(--axis-muted)">{t.pages.tasks.createTaskStart}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((task) => (
              <TaskItemList
                key={task.id}
                task={task}
                onToggle={(tarea, completed) => toggleTask(tarea, completed)}
                onDelete={(tarea) => deleteTask(tarea)}
                onSelect={(tarea) => openDetail(tarea)}
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
            ← {t.pages.tasks.previous}
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
            {t.pages.tasks.next} →
          </button>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createTask}
        isLoading={isLoading}
      />

      <TaskDetailModal
        task={selected}
        isOpen={isDetailOpen}
        isEditOpen={false}
        onClose={closeDetail}
        onEditOpen={() => {}}
        onEditClose={() => {}}
        onUpdate={updateTask}
        onToggle={async (completed) => { if (selected) await toggleTask(selected, completed); }}
        onDelete={async () => { if (selected) await deleteTask(selected); }}
        isLoading={isLoading}
      />
    </div>
  );
};
