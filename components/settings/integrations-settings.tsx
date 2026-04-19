"use client";

import { RiGoogleFill, RiCheckLine } from "react-icons/ri";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiAlertLine, RiRefreshLine } from "react-icons/ri";

const integrationsList = [
  { name: "Gmail", key: "gmail", descriptionKey: "gmailDesc" },
  { name: "Drive", key: "drive", descriptionKey: "driveDesc" },
  { name: "Calendar", key: "calendar", descriptionKey: "calendarDesc" },
];

type IntegrationsSettingsProps = {
  t: Record<string, any>;
};

export const IntegrationsSettings = ({ t }: IntegrationsSettingsProps) => {
  const copy = t.settings.integrationsBanner;
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Record<string, boolean> | null>(null);

  const reauthHref = `/api/auth/signin?callbackUrl=${encodeURIComponent("/settings")}`;

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/integrations/status", { cache: "no-store" });
      if (!response.ok) {
        setServices(null);
        return;
      }
      const data = (await response.json()) as { ok: boolean; services?: Record<string, boolean> };
      setServices(data.services ?? null);
    } catch {
      setServices(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();

    const onFocus = () => {
      void fetchStatus();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchStatus();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchStatus]);

  const missing = useMemo(() => {
    if (!services) return [] as string[];
    return integrationsList
      .filter((i) => !services[i.key])
      .map((i) => t.integrations[i.key as keyof typeof t.integrations] as string);
  }, [services, t]);

  return (
    <div className="rounded-3xl border border-(--axis-border) bg-(--axis-surface-strong) p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
            <RiGoogleFill className="h-5 w-5 text-blue-500" />
          </div>

          <div>
            <h3 className="font-semibold text-(--axis-text)">{t.settings.integrations.title}</h3>
            <p className="text-xs text-(--axis-muted)">{t.settings.integrations.description}</p>
          </div>
        </div>

        <a
          href={reauthHref}
          className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
        >
          <RiRefreshLine className="h-4 w-4" />
          {copy.reconnect}
        </a>
      </div>

      {!loading && missing.length ? (
        <div className="mb-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-(--axis-text)">
            <RiAlertLine className="h-4 w-4 text-amber-300" />
            {copy.missingTitle}
          </p>
          <p className="mt-1 text-xs text-(--axis-muted)">
            {copy.missingDescription}
          </p>
          <p className="mt-2 text-xs font-medium text-(--axis-muted)">
            {copy.missingLabel}: {missing.join(", ")}
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        {integrationsList.map((item) => {
          const isConnected = services ? Boolean(services[item.key]) : false;
          const showUnknown = !loading && !services;
          const statusText = showUnknown
            ? copy.unknown
            : isConnected
              ? t.integrations.connected
              : copy.needsAccess;

          const statusTone = showUnknown
            ? "bg-slate-500/15 text-slate-300"
            : isConnected
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-300";

          const StatusIcon = showUnknown || !isConnected ? RiAlertLine : RiCheckLine;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-(--axis-border) bg-(--axis-surface) p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <RiGoogleFill className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium text-(--axis-text)">
                    {t.integrations[item.key as keyof typeof t.integrations]}
                  </p>
                  <p className="text-xs text-(--axis-muted)">
                    {t.integrations[item.descriptionKey as keyof typeof t.integrations]}
                  </p>
                </div>
              </div>

              <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${statusTone}`}>
                <StatusIcon className="h-3 w-3" />
                {statusText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
