"use client";

import { useTranslation } from "@/lib/i18n";

interface PageHeaderProps {
  page  : "drive" | "calendar" | "tasks" | "gmail";
  count?: number;
}

export function PageHeader({ page, count }: PageHeaderProps) {
  const { t } = useTranslation();
  const pageData = t.pages[page];

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{pageData.title}</p>
        <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">{pageData.files || pageData.events || pageData.messages}</h1>
        <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">{pageData.description}</p>
      </div>
      {count !== undefined && (
        <span className="shrink-0 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">
          {count} {page === "gmail" ? t.pages.gmail.messagesCount : page === "calendar" ? t.pages.calendar.eventsCount : ""}
        </span>
      )}
    </div>
  );
}
