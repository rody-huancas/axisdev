import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { RiRefreshLine, RiAddLine } from "react-icons/ri";


type CalendarHeaderProps = {
  isLoading : boolean;
  eventCount: number;
  onReload  : () => void;
  onCreate  : () => void;
};

export const CalendarHeader = ({ isLoading, eventCount, onReload, onCreate }: CalendarHeaderProps) => {
  const { t } = useTranslation();
  return (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.pages.calendar.title}</p>
      <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">{t.pages.calendar.events}</h1>
      <p className="mt-2 text-sm text-(--axis-muted)">
        {eventCount} {t.pages.calendar.eventsCount}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onReload}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
      >
        <RiRefreshLine className={cn("h-4 w-4", isLoading && "animate-spin")} />
        {t.pages.calendar.reload}
      </button>
      <button
        type="button"
        onClick={onCreate}
        className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
      >
        <RiAddLine className="h-4 w-4" />
        {t.pages.calendar.createEvent}
      </button>
    </div>
  </div>
  );
};
