"use client";

import { useTranslation } from "@/lib/i18n";
import { useGmail } from "@/hooks/use-gmail";
import type { GmailMensaje } from "@/services/google-service";
import { GmailMessageItem } from "./gmail-message-item";
import { GmailEmptyState } from "./gmail-empty-state";
import { GmailDetailModal } from "./gmail-detail-modal";

type GmailClientProps = {
  initialItems: GmailMensaje[];
};

export const GmailClient = ({ initialItems }: GmailClientProps) => {
  const { t } = useTranslation();
  
  const {
    query,
    setQuery,
    page,
    setPage,
    isLoading,
    selected,
    isDetailOpen,
    paginatedItems,
    totalPages,
    refresh,
    selectMessage,
    closeDetail,
  } = useGmail(initialItems);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 lg:max-w-md">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={t.pages.gmail.searchMessages}
            className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
          />
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-accent) disabled:opacity-50"
          title={t.pages.gmail.refresh}
        >
          <span className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}>↻</span>
        </button>
      </div>

      <div className="space-y-2">
        {paginatedItems.length ? (
          <div className="grid gap-2">
            {paginatedItems.map((item) => (
              <GmailMessageItem
                key={item.id}
                item={item}
                onClick={() => selectMessage(item)}
                t={t}
              />
            ))}
          </div>
        ) : (
          <GmailEmptyState hasQuery={!!query} t={t} />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
          >
            {t.pages.gmail.previous}
          </button>
          <span className="text-xs text-(--axis-muted)">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50 flex items-center gap-1"
          >
            {t.pages.gmail.next}
          </button>
        </div>
      )}

      <GmailDetailModal
        selected={selected}
        isOpen={isDetailOpen}
        onClose={closeDetail}
        t={t}
      />
    </div>
  );
};
