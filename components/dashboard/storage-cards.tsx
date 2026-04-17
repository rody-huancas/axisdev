"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface StorageCardProps {
  label      : string;
  description: string;
  percentage : number;
  gradient   : string;
}

export function StorageCard({ label, description, percentage, gradient }: StorageCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      href="/drive"
      className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-(--axis-text)">{label}</p>
          <p className="text-xs text-(--axis-muted)">{description}</p>
        </div>
        <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
          {percentage}%
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-(--axis-surface-strong)">
        <div
          className={`h-2 rounded-full bg-linear-to-r ${gradient}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Link>
  );
}

export function StorageCards() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StorageCard 
        label={t.dashboard.documents}
        description={t.dashboard.files}
        percentage={0}
        gradient="from-indigo-500 to-sky-500"
      />
      <StorageCard 
        label={t.dashboard.media}
        description={t.dashboard.mediaDescription}
        percentage={0}
        gradient="from-fuchsia-500 to-violet-500"
      />
      <StorageCard 
        label={t.dashboard.others}
        description={t.dashboard.othersDescription}
        percentage={0}
        gradient="from-emerald-500 to-cyan-500"
      />
    </div>
  );
}
