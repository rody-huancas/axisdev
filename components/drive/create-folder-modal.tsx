type Props = {
  isOpen            : boolean;
  folderName        : string;
  onFolderNameChange: (name: string) => void;
  onSubmit          : () => void;
  onClose           : () => void;
  isLoading         : boolean;
  t                 : Record<string, any>;
};

export const CreateFolderModal = ({ isOpen, folderName, onFolderNameChange, onSubmit, onClose, isLoading, t }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => !isLoading && onClose()}
      />
      <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
            <h3 className="text-xl font-semibold text-(--axis-text)">{t.pages.drive.createFolder}</h3>
            <p className="text-sm text-(--axis-muted)">{t.pages.drive.folderNameDesc}</p>
          </div>
          <div className="mt-6 space-y-4">
            <input
              value={folderName}
              onChange={(e) => onFolderNameChange(e.target.value)}
              placeholder={t.pages.drive.folderNamePlaceholder}
              className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
              disabled={isLoading}
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {isLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {isLoading ? t.pages.drive.creating : t.pages.drive.create}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
