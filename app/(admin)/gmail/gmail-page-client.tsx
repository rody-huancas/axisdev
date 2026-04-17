"use client";

import { useTranslation } from "@/lib/i18n";
import { GmailClient } from "@/components/gmail/gmail-client";
import type { GmailMensaje } from "@/services/google-service";

type GmailPageContentProps = {
  messages: GmailMensaje[];
};

const GmailPageContent = ({ messages }: GmailPageContentProps) => {
  const { t } = useTranslation();

  const messageLabel = messages.length === 1  ? t.pages.gmail.message || "mensaje"  : t.pages.gmail.messages;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.pages.gmail.title}</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">{t.pages.gmail.messages}</h1>
          <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">
            {t.pages.gmail.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">
          {messages.length} {messageLabel}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <GmailClient initialItems={messages} />
      </div>
    </section>
  );
};

export default GmailPageContent;
