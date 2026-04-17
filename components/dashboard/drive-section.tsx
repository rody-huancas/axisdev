"use client";

import { useTranslation } from "@/lib/i18n";
import { DriveBreakdownChart } from "./drive-breakdown-chart";

interface DriveSectionProps {
  fileCount: number;
  breakdown: { label: string; value: number }[];
}

export function DriveSection({ fileCount, breakdown }: DriveSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border bg-(--axis-surface) p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.dashboard.driveTitle}</p>
          <p className="mt-2 text-lg font-semibold text-(--axis-text)">{t.dashboard.driveFiles}</p>
          <p className="text-xs text-(--axis-muted)">{fileCount} {t.dashboard.driveFileCount}</p>
        </div>
      </div>
      <div className="mt-6">
        <DriveBreakdownChart items={breakdown} />
      </div>
    </div>
  );
}
