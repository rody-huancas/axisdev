"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { TaskStatusChart } from "./task-status-chart";
import { RiTimeLine, RiCheckLine } from "react-icons/ri";

interface TaskSectionProps {
  total    : number;
  pending  : number;
  completed: number;
}

export function TaskSection({ total, pending, completed }: TaskSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.dashboard.tasksTitle}</p>
          <p className="mt-2 text-lg font-semibold text-(--axis-text)">{t.dashboard.tasksStatus}</p>
        </div>
        <Link
          href="/tasks"
          className="rounded-full bg-(--axis-surface-strong) px-3 py-1 text-[10px] font-semibold text-(--axis-muted)"
        >
          {total} {t.dashboard.tasksTotal}
        </Link>
      </div>
      <div className="mt-6">
        <TaskStatusChart pending={pending} completed={completed} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-(--axis-surface-strong) p-2">
          <RiTimeLine className="mx-auto h-4 w-4 text-(--axis-amber)" />
          <p className="text-lg font-semibold text-(--axis-text)">{pending}</p>
          <p className="text-[10px] text-(--axis-muted)">{t.dashboard.tasksPending}</p>
        </div>
        <div className="rounded-xl bg-(--axis-surface-strong) p-2">
          <RiCheckLine className="mx-auto h-4 w-4 text-(--axis-emerald)" />
          <p className="text-lg font-semibold text-(--axis-text)">{completed}</p>
          <p className="text-[10px] text-(--axis-muted)">{t.dashboard.tasksCompleted}</p>
        </div>
      </div>
    </div>
  );
}
