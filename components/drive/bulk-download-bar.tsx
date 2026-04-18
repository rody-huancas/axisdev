import { RiDownloadLine } from "react-icons/ri";

type BulkDownloadBarProps = {
  selectedCount: number;
  onDownload   : () => void;
  onCancel     : () => void;
  isLoading    : boolean;
  t            : Record<string, any>;
};

export const BulkDownloadBar = ({ selectedCount, onDownload, onCancel, isLoading, t }: BulkDownloadBarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
      {t.pages.drive.multiSelect}
      {selectedCount > 0 ? (
        <span className="ml-2 text-(--axis-text)">({selectedCount})</span>
      ) : null}
    </p>
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onDownload}
        disabled={isLoading || selectedCount === 0}
        className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
      >
        <RiDownloadLine className="h-4 w-4" aria-hidden />
        {t.pages.drive.download}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
      >
        {t.common.cancel}
      </button>
    </div>
  </div>
);
