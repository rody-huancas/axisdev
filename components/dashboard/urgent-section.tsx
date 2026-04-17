"use client";

import { useTranslation } from "@/lib/i18n";
import { RiTaskLine } from "react-icons/ri";

interface UrgentSectionProps {
  tasks: { id: string; titulo: string; vence?: string }[];
}

export function UrgentSection({ tasks }: UrgentSectionProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) return null;

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">{t.dashboard.urgent}</p>
          <p className="mt-2 text-lg font-semibold text-(--axis-text)">{t.dashboard.upcomingDue}</p>
          <p className="text-xs text-(--axis-muted)">{t.dashboard.dueInDays}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-600">
          {tasks.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white px-3 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                <RiTaskLine className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-(--axis-text) truncate">{task.titulo}</p>
                <p className="text-[10px] text-amber-600">{t.dashboard.due} {task.vence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
