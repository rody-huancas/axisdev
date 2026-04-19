"use client";

import { RiArrowLeftLine } from "react-icons/ri";

type GmailMessageFull = {
  asunto      : string;
  remitente   : string;
  fecha      ?: string;
  snippet    ?: string;
  htmlContent?: string;
};

type GmailDetailModalProps = {
  selected: GmailMessageFull | null;
  isOpen  : boolean;
  onClose : () => void;
  t       : Record<string, any>;
};

export const GmailDetailModal = ({ selected, isOpen, onClose, t }: GmailDetailModalProps) => {
  if (!isOpen || !selected) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 flex h-dvh items-center justify-center p-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="flex items-start justify-between gap-4 border-b border-(--axis-border) px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-(--axis-accent)">{t.pages.gmail.message || "Mensaje"}</p>
              <h3 className="mt-2 truncate text-xl font-semibold text-(--axis-text)">{selected.asunto || t.pages.gmail.noSubject}</h3>
              <p className="mt-1 text-sm text-(--axis-muted)">{selected.remitente || t.pages.gmail.unknownSender}</p>
              {selected.fecha && <p className="mt-1 text-xs text-(--axis-muted)">{selected.fecha}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text)"
            >
              <RiArrowLeftLine className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[50dvh] overflow-y-auto px-6 py-5">
            {selected.htmlContent ? (
              <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.htmlContent }} />
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-(--axis-text)">{selected.snippet || t.pages.gmail.noContent}</div>
            )}
          </div>
          <div className="shrink-0 flex items-center justify-end gap-3 border-t border-(--axis-border) bg-(--axis-surface) px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
            >
              {t.pages.calendar.close || t.common.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
