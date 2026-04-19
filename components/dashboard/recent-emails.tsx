"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { RiMailLine, RiExternalLinkLine } from "react-icons/ri";

interface RecentEmailsProps {
  messages: { id: string; asunto: string; remitente: string }[];
}

function encodeGmailId(id: string) {
  return id.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function RecentEmailsSection({ messages }: RecentEmailsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-(--axis-text)">{t.dashboard.recentEmails}</h3>
        <Link href="/gmail" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">
          {t.dashboard.viewAllEmails} <RiExternalLinkLine className="inline h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {(messages.length ? messages.slice(0, 5) : []).map((message) => (
          <a
            key={message.id}
            href={`https://mail.google.com/mail/u/0/#inbox/${encodeGmailId(message.id)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 transition hover:border-indigo-300 hover:bg-(--axis-surface-strong) cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <RiMailLine className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-semibold text-(--axis-text)">{message.asunto || t.pages.gmail.noSubject}</p>
              <p className="truncate text-xs text-(--axis-muted)">{message.remitente || t.pages.gmail.unknownSender}</p>
            </div>
            <RiExternalLinkLine className="h-4 w-4 shrink-0 text-indigo-400" />
          </a>
        ))}
        {!messages.length && (
          <p className="text-sm text-(--axis-muted)">{t.dashboard.noRecentEmails}</p>
        )}
      </div>
    </div>
  );
}
