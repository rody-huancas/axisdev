"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { RiMailLine, RiTaskLine, RiCalendarLine, RiDriveLine } from "react-icons/ri";

interface StatCardProps {
  href     : string;
  icon     : React.ReactNode;
  iconBg   : string;
  iconColor: string;
  value    : string | number;
  label    : string;
}

function StatCard({ href, icon, iconBg, iconColor, value, label }: StatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden transition hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold text-(--axis-text)">{value}</p>
          <p className="text-xs text-(--axis-muted)">{label}</p>
        </div>
      </div>
    </Link>
  );
}

function StorageStatCard() {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
          <RiDriveLine className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-(--axis-text)">0</p>
          <p className="text-xs text-(--axis-muted)">{t.dashboard.gb}</p>
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ gmailCount, tasksCount, eventsCount, storageUsed }: { gmailCount: number; tasksCount: number; eventsCount: number; storageUsed: number }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {gmailCount > 0 && (
        <StatCard
          href="/gmail"
          icon={<RiMailLine className="h-5 w-5" />}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          value={gmailCount}
          label={t.dashboard.unread}
        />
      )}
      {tasksCount > 0 && (
        <StatCard
          href="/tasks"
          icon={<RiTaskLine className="h-5 w-5" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          value={tasksCount}
          label={t.dashboard.pending}
        />
      )}
      {eventsCount > 0 && (
        <StatCard
          href="/calendar"
          icon={<RiCalendarLine className="h-5 w-5" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          value={eventsCount}
          label={t.dashboard.today}
        />
      )}
      <StorageStatCard />
    </div>
  );
}
