"use client";

import { RiInboxLine } from "react-icons/ri";

type GmailEmptyStateProps = {
  hasQuery: boolean;
  t       : Record<string, any>;
};

export const GmailEmptyState = ({ hasQuery, t }: GmailEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--axis-border) bg-[color-mix(in_srgb,var(--axis-bg)_40%,transparent)] px-6 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--axis-surface-strong) ring-1 ring-(--axis-border)">
      <RiInboxLine className="h-7 w-7 text-(--axis-muted)" />
    </div>
    <p className="mt-4 text-sm font-semibold text-(--axis-text)">
      {t.pages.gmail.noEmails}
    </p>
    <p className="mt-1 max-w-sm text-sm text-(--axis-muted)">
      {hasQuery ? "Prueba otro termino de busqueda." : "Tu bandeja de entrada esta vacia."}
    </p>
  </div>
);
