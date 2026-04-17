"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

interface MyTasksSectionProps {
  tasks: { id: string; titulo: string; vence?: string | null; estado?: string }[];
}

export function MyTasksSection({ tasks }: MyTasksSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-(--axis-text)">{t.dashboard.myTasks}</h3>
        <Link href="/tasks" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
          {t.dashboard.viewAllTasks}
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {(tasks.length ? tasks.slice(0, 3) : []).map((task) => (
          <Link
            key={task.id}
            href="/tasks"
            className="flex items-center justify-between rounded-2xl border bg-(--axis-surface-strong) px-3 py-3 transition hover:bg-(--axis-surface) cursor-pointer"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-emerald-200 via-cyan-200 to-sky-200" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-(--axis-text) truncate">{task.titulo}</p>
                <p className="text-[10px] text-(--axis-muted)">
                  {task.vence ? `${t.dashboard.due} ${task.vence}` : "Sin fecha"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-(--axis-muted)">
              {task.estado === "completada" ? t.dashboard.tasksCompleted : t.dashboard.tasksPending}
            </span>
          </Link>
        ))}
        {!tasks.length && (
          <p className="text-sm text-(--axis-muted)">{t.dashboard.noTasks}</p>
        )}
      </div>
    </div>
  );
}
