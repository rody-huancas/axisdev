import { ApiEvent } from "@/lib/calendar-utils";
import { useTranslation } from "@/lib/i18n";
import { RiExternalLinkLine } from "react-icons/ri";

type EventDetailModalProps = {
  isOpen  : boolean;
  selected: ApiEvent | null;
  onClose : () => void;
};

export const EventDetailModal = ({ isOpen, selected, onClose }: EventDetailModalProps) => {
  const { t } = useTranslation();
  if (!isOpen || !selected) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.pages.calendar.event}</p>
              <h3 className="mt-2 truncate text-xl font-semibold text-(--axis-text)">{selected.title}</h3>
              <p className="mt-2 text-sm text-(--axis-muted)">
                {new Date(selected.start).toLocaleString("es-ES")} - {new Date(selected.end).toLocaleString("es-ES")}
              </p>
            </div>
            {selected.htmlLink && (
              <a
                href={selected.htmlLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface)"
              >
                <RiExternalLinkLine className="h-4 w-4" />
                {t.pages.calendar.open}
              </a>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {selected.attendees?.length ? (
              <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">{t.pages.calendar.attendeesTitle}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.attendees.map((email) => (
                    <span key={email} className="rounded-full border border-(--axis-border) bg-(--axis-surface) px-3 py-1 text-xs text-(--axis-text)">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {selected.meetLink && (
              <a
                href={selected.meetLink}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm font-semibold text-(--axis-text) transition hover:bg-(--axis-surface)"
              >
                {t.pages.calendar.joinMeet}
                <p className="mt-1 truncate text-xs font-normal text-(--axis-muted)">{selected.meetLink}</p>
              </a>
            )}
            {selected.location && (
              <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">{t.pages.calendar.locationTitle}</p>
                <p className="mt-2 text-sm text-(--axis-text)">{selected.location}</p>
              </div>
            )}
            {selected.description && (
              <div className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">{t.pages.calendar.descriptionTitle}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-(--axis-text)">{selected.description}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
            >
              {t.pages.calendar.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
