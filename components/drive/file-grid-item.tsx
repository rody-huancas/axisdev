import { cn } from "@/lib/utils";
import { RiDownloadLine } from "react-icons/ri";
import type { DriveFile } from "@/services/google-service";
import { getMimeIcon, getFileTone, getBadgeTone, getBgTone, getFileExtension, formatFileSize } from "@/lib/utils/drive-utils";

type FileGridItemProps = {
  file      : DriveFile;
  view      : "grid" | "list";
  isBulkMode: boolean;
  isSelected: boolean;
  onSelect  : () => void;
  onActivate: () => void;
  onDownload: () => void;
  t         : Record<string, any>;
};

export const FileGridItem = ({ file, view, isBulkMode, isSelected, onSelect, onActivate, onDownload, t }: FileGridItemProps) => {
  const Icon         = getMimeIcon(file.mimeType);
  const tone         = getFileTone(file.mimeType, file.nombre);
  const badgeTone    = getBadgeTone(file.mimeType, file.nombre);
  const extension    = getFileExtension(file.nombre);
  const isFolderItem = file.mimeType === "application/vnd.google-apps.folder";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }}
      className={cn(
        "group relative flex min-w-0 items-center gap-4 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))] hover:bg-(--axis-surface-strong) hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]",
        isBulkMode && isSelected && "border-(--axis-accent) bg-[color-mix(in_srgb,var(--axis-accent)_10%,var(--axis-surface))]",
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-(--axis-border)", getBgTone(file.mimeType, file.nombre))}>
          <Icon className={cn("h-5 w-5", tone)} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-(--axis-text)">{file.nombre}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]", badgeTone)}>
              {isFolderItem ? t.pages.drive.folderItem : extension ? extension : t.pages.drive.file}
            </span>
            <p className="text-xs text-(--axis-muted)">{file.actualizado || "-"}</p>
          </div>
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {view === "list" && !isFolderItem && (
          <span className="text-xs text-(--axis-muted)">{formatFileSize(file.sizeBytes)}</span>
        )}
        {!isBulkMode && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDownload();
            }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border border-(--axis-border) bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:border-[color-mix(in_srgb,var(--axis-accent)_35%,var(--axis-border))] hover:text-(--axis-accent)",
              view === "grid" && "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            )}
            title={t.pages.drive.download}
            aria-label={t.pages.drive.download}
          >
            <RiDownloadLine className="h-4 w-4" aria-hidden />
          </button>
        )}
        {isBulkMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            className="h-5 w-5 rounded border-(--axis-border) bg-(--axis-surface) accent-(--axis-accent)"
            aria-label={isSelected ? t.pages.drive.deselect : t.pages.drive.select}
          />
        )}
      </div>
    </div>
  );
};
