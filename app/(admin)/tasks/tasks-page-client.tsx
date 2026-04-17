"use client";

import { useTranslation } from "@/lib/i18n";
import { TasksClient } from "@/components/tasks/tasks-client";
import type { TareaPendiente } from "@/services/google-service";

type TasksPageContentProps = {
  tasks: TareaPendiente[];
};

const TasksPageContent = ({ tasks }: TasksPageContentProps) => {
  const { t } = useTranslation();

  const pendientes  = tasks.filter((t) => t.estado === "pendiente").length;
  const completadas = tasks.filter((t) => t.estado === "completada").length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.pages.tasks.title}</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">{t.pages.tasks.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">
            {t.pages.tasks.description}
          </p>
        </div>
        <div className="flex gap-3">
          <span className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400">
            {pendientes} {t.pages.tasks.pending}
          </span>
          <span className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
            {completadas} {t.pages.tasks.completed}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <TasksClient initialTasks={tasks} />
      </div>
    </section>
  );
};

export default TasksPageContent;
