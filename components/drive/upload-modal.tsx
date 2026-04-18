"use client";

import { cn } from "@/lib/utils";
import type { RefObject } from "react";

type Porps = {
  isOpen       : boolean;
  uploadFiles  : File[];
  isDragging   : boolean;
  isLoading    : boolean;
  fileInputRef : RefObject<HTMLInputElement | null>;
  onDragEnter  : () => void;
  onDragLeave  : () => void;
  onDrop       : (event: React.DragEvent<HTMLDivElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile : (file: File) => void;
  onClearFiles : () => void;
  onClose      : () => void;
  onSubmit     : () => void;
  t            : Record<string, any>;
};

export const UploadModal = (props: Porps) => {
  const { isOpen, uploadFiles, isDragging, isLoading, fileInputRef, onDragEnter, onDragLeave, onDrop, onInputChange, onRemoveFile, onClearFiles, onClose, onSubmit, t } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={() => !isLoading && onClose()} />
      <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
            <h3 className="text-xl font-semibold text-(--axis-text)">{t.pages.drive.uploadFiles}</h3>
            <p className="text-sm text-(--axis-muted)">{t.pages.drive.uploadFilesDesc}</p>
          </div>
          <div className="mt-6 space-y-4">
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition",
                isDragging ? "border-(--axis-accent) bg-(--axis-surface-strong)" : "border-(--axis-border) bg-(--axis-surface)",
              )}
              onDragOver={(e) => { e.preventDefault(); onDragEnter(); }}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <p className="text-sm font-semibold text-(--axis-text)">{t.pages.drive.dropHere}</p>
              <p className="text-xs text-(--axis-muted)">{t.pages.drive.or}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
              >
                {t.pages.drive.selectFilesBtn}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={onInputChange}
              />
            </div>

            {uploadFiles.length > 0 && (
              <div className="max-h-52 space-y-2 overflow-auto rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-3">
                {uploadFiles.map((file) => (
                  <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between gap-4 text-xs text-(--axis-text)">
                    <span className="truncate font-medium">{file.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-(--axis-muted)">{file.size}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file)}
                        disabled={isLoading}
                        className="rounded-xl py-1 px-2 text-white bg-red-500 transition hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                      >
                        {t.pages.drive.remove}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClearFiles}
                disabled={isLoading || uploadFiles.length === 0}
                className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
              >
                {t.pages.drive.clear}
              </button>
              <div className="flex items-center gap-3">
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
                  {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                  {isLoading ? t.pages.drive.uploading : t.pages.drive.upload}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
