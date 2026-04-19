"use client";

import { RiMailLine } from "react-icons/ri";
import type { GmailMensaje } from "@/services/google-service";
import { cleanSnippet, formatGmailDate } from "@/lib/utils/gmail-utils";

type GmailMessageItemProps = {
  item   : GmailMensaje;
  onClick: () => void;
  t      : Record<string, any>;
};

export const GmailMessageItem = ({ item, onClick, t }: GmailMessageItemProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    }}
    className="group flex items-start gap-4 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))] hover:bg-(--axis-surface-strong) hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--axis-border) bg-(--axis-accent)/10">
      <RiMailLine className="h-5 w-5 text-(--axis-accent)" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-(--axis-text)">
        {item.remitente || t.pages.gmail.unknownSender}
      </p>
      <p className="mt-0.5 truncate text-xs font-medium text-(--axis-muted)">
        {item.asunto || t.pages.gmail.noSubject}
      </p>
      <p className="mt-1 line-clamp-2 text-xs text-(--axis-muted)">
        {cleanSnippet(item.snippet)}
      </p>
    </div>
    <span className="shrink-0 text-xs tabular-nums text-(--axis-muted)">
      {formatGmailDate(new Date().toISOString(), t)}
    </span>
  </div>
);
