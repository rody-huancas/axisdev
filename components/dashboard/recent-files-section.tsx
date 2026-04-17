"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { RiFileLine } from "react-icons/ri";

interface RecentFilesSectionProps {
  files: { nombre: string; tipo: string; actualizado: string }[];
}

export function RecentFilesSection({ files }: RecentFilesSectionProps) {
  const { t } = useTranslation();

  const tones = [
    "from-violet-500 via-indigo-500 to-sky-500",
    "from-rose-500 via-fuchsia-500 to-purple-500",
    "from-sky-500 via-cyan-500 to-emerald-400",
    "from-emerald-500 via-teal-500 to-cyan-500",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-(--axis-text)">{t.dashboard.recentFilesTitle}</h3>
        <Link href="/drive" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
          {t.dashboard.viewAllFiles} 
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {(files.length ? files.slice(0, 4) : []).map((file, index) => (
          <Link
            key={file.nombre}
            href="/drive"
            className="group rounded-3xl border bg-(--axis-surface) p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br ${tones[index % 4]} sm:h-20 sm:w-20`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RiFileLine className="h-6 w-6 text-white/80" />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="rounded-full bg-(--axis-surface-strong) px-2 py-1 text-[10px] font-semibold text-(--axis-muted)">
                    {file.tipo}
                  </span>
                </div>
                <p className="text-sm font-semibold text-(--axis-text) truncate">{file.nombre}</p>
                <p className="text-xs text-(--axis-muted)">{t.dashboard.updatedToday} {file.actualizado}</p>
              </div>
            </div>
          </Link>
        ))}
        {!files.length && (
          <p className="text-sm text-(--axis-muted)">{t.dashboard.noRecentFiles}</p>
        )}
      </div>
    </div>
  );
}
