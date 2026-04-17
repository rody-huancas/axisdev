"use client";

import { useTranslation } from "@/lib/i18n";

interface GreetingSectionProps {
  userName        : string;
  eventsCount     : number;
  todayEventsCount: number;
}

export function GreetingSection({ userName, eventsCount, todayEventsCount }: GreetingSectionProps) {
  const { t } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return t.common.goodMorning;
    if (hour >= 12 && hour < 18) return t.common.goodAfternoon;
    return t.common.goodEvening;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.dashboard.summary}</p>
        <p className="mt-2 text-lg font-semibold text-(--axis-text)">{getGreeting()}, {userName}</p>
        <p className="text-xs text-(--axis-muted)">{eventsCount} {t.dashboard.eventsThisWeek}</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600 hover:bg-emerald-100">
        {todayEventsCount} {t.dashboard.todayEvents}
      </span>
    </div>
  );
}
