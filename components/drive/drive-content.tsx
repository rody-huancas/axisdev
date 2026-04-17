"use client";

import { useTranslation } from "@/lib/i18n";
import { FileGrid } from "@/components/drive/file-grid";
import type { DriveFile } from "@/lib/types/google-service";

interface DriveContentProps {
  files     : DriveFile[];
  folderId  : string;
  folderName: string | null;
}

export function DriveContent({ files, folderId, folderName }: DriveContentProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">{t.pages.drive.title}</p>
          <h1 className="mt-2 text-2xl font-semibold text-(--axis-text)">{t.pages.drive.files}</h1>
          <p className="mt-2 max-w-xl text-sm text-(--axis-muted)">{t.pages.drive.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--axis-muted)">
          {files.length} {files.length === 1 ? t.pages.drive.element : t.pages.drive.elements}
        </span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] sm:p-6">
        <FileGrid files={files} currentFolderId={folderId} currentFolderName={folderName} />
      </div>
    </section>
  );
}
