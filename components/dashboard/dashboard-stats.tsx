"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { RiMailLine, RiTaskLine, RiCalendarLine, RiDriveLine } from "react-icons/ri";

interface DashboardContentProps {
  gmailCount : number;
  tasksCount : number;
  eventsCount: number;
  storageUsed: number;
}

export function DashboardStats({ gmailCount, tasksCount, eventsCount, storageUsed }: DashboardContentProps) {
  const { t } = useTranslation();

  const stats = [
    gmailCount > 0 && {
      href: "/gmail",
      icon: <RiMailLine className="h-5 w-5" />,
      bg: "bg-red-50",
      color: "text-red-500",
      value: gmailCount,
      label: t.dashboard.unread,
    },
    tasksCount > 0 && {
      href: "/tasks",
      icon: <RiTaskLine className="h-5 w-5" />,
      bg: "bg-amber-50",
      color: "text-amber-500",
      value: tasksCount,
      label: t.dashboard.pending,
    },
    eventsCount > 0 && {
      href: "/calendar",
      icon: <RiCalendarLine className="h-5 w-5" />,
      bg: "bg-blue-50",
      color: "text-blue-500",
      value: eventsCount,
      label: t.dashboard.today,
    },
    {
      href: "/drive",
      icon: <RiDriveLine className="h-5 w-5" />,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
      value: storageUsed,
      label: t.dashboard.gb,
    },
  ].filter(Boolean);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        stat && (
          <Link
            key={index}
            href={stat.href}
            className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden transition hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold text-(--axis-text)">{stat.value}</p>
                <p className="text-xs text-(--axis-muted)">{stat.label}</p>
              </div>
            </div>
          </Link>
        )
      ))}
    </div>
  );
}
