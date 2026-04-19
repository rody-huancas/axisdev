"use client";

import Link from "next/link";
import { RiLock2Line, RiSettings3Line, RiRefreshLine } from "react-icons/ri";
import { useTranslation } from "@/lib/i18n";

type Props = {
  missingServices: string[];
};

export function ServiceAccessBanner({ missingServices }: Props) {
  const { t } = useTranslation();

  const fallback = t.common.lang === "en"
    ? {
        title       : "Service access required",
        description : "We could not read some Google services. Reconnect your account or review integrations.",
        missingLabel: "Missing access to",
        openSettings: "Settings",
        reconnect   : "Reconnect",
      }
    : {
        title       : "Acceso a servicios pendiente",
        description : "No pudimos leer algunos servicios de Google. Reautoriza tu cuenta o revisa integraciones.",
        missingLabel: "Falta acceso a",
        openSettings: "Configuracion",
        reconnect   : "Reautorizar",
      };

  const copy = t.dashboard?.access ?? fallback;

  const reauthHref = `/api/auth/signin?callbackUrl=${encodeURIComponent("/dashboard")}`;

  if (!missingServices.length) return null;

  return (
    <div className="rounded-3xl border border-amber-500/25 bg-amber-500/10 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <RiLock2Line className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--axis-text)">{copy.title}</p>
            <p className="mt-1 text-xs text-(--axis-muted)">
              {copy.description}
            </p>
            <p className="mt-2 text-xs font-medium text-(--axis-muted)">
              {copy.missingLabel}: {missingServices.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-text) transition hover:bg-(--axis-surface-strong)"
          >
            <RiSettings3Line className="h-4 w-4" />
            {copy.openSettings}
          </Link>

          <a
            href={reauthHref}
            className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
          >
            <RiRefreshLine className="h-4 w-4" />
            {copy.reconnect}
          </a>
        </div>
      </div>
    </div>
  );
}
