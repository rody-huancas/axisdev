"use client";

import { useTranslation } from "@/lib/i18n";

interface DashboardSummaryProps {
  storageUsed      : number;
  storageLimit     : number;
  storagePercentage: number;
}

export function DashboardSummary({ storageUsed, storageLimit, storagePercentage }: DashboardSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold text-(--axis-muted)">{t.dashboard.storageUsed}</p>
      <p className="text-2xl font-semibold text-(--axis-text)">
        {storageUsed} GB
        <span className="text-sm font-normal text-(--axis-muted)"> / {storageLimit} GB</span>
      </p>
      <div className="mt-1 h-2 rounded-full bg-(--axis-surface-strong)">
        <div
          className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-sky-500"
          style={{ width: `${storagePercentage}%` }}
        />
      </div>
    </div>
  );
}
