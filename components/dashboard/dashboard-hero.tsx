"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface DashboardHeroProps {
  userName: string;
}

export function DashboardHero({ userName }: DashboardHeroProps) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#6C63FF] via-[#5A7BFF] to-[#4DA2FF] p-6 text-white shadow-[0_18px_36px_rgba(108,99,255,0.28)] sm:p-8">
      <div className="absolute -right-10 top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute right-16 top-16 h-20 w-20 rounded-3xl border border-white/20" />
      <div className="absolute bottom-0 left-0 h-28 w-28 -translate-x-8 translate-y-8 rounded-full bg-white/10" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">AxisDev</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t.dashboard.welcome}
          </h2>
          <p className="text-sm text-white/80">
            {userName}, {t.dashboard.heroDescription}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/drive"
            className="rounded-2xl bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 shadow-lg transition hover:-translate-y-1"
          >
            {t.dashboard.goToDrive}
          </Link>
        </div>
      </div>
    </div>
  );
}