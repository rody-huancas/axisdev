"use client";

import { useTranslation } from "@/lib/i18n";

interface PageTitleProps {
  page: "drive" | "calendar" | "tasks" | "gmail";
}

export function PageTitle({ page }: PageTitleProps) {
  const { t } = useTranslation();
  const pageData = t.pages[page];

  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{pageData.title}</p>
      <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">
        {page === "drive" && pageData.files}
        {page === "calendar" && pageData.events}
        {page === "tasks" && pageData.title}
        {page === "gmail" && pageData.messages}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">{pageData.description}</p>
    </div>
  );
}
