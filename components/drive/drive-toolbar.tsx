"use client";

import { cn } from "@/lib/utils";
import { RiSearchLine } from "react-icons/ri";

type DriveToolbarProps = {
  query           : string;
  onQueryChange   : (query: string) => void;
  view            : "grid" | "list";
  onViewChange    : (view: "grid" | "list") => void;
  isBulkMode      : boolean;
  onBulkModeToggle: () => void;
  onCreateFolder  : () => void;
  onUpload        : () => void;
  t               : Record<string, any>;
};

export const DriveToolbar = ({ query, onQueryChange, isBulkMode, onBulkModeToggle, onCreateFolder, onUpload, t }: DriveToolbarProps) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div className="relative flex-1 lg:max-w-md">
      <RiSearchLine
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--axis-muted)"
        aria-hidden
      />
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t.pages.drive.searchByName}
        className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onBulkModeToggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition",
          isBulkMode
            ? "border-(--axis-accent) bg-[color-mix(in_srgb,var(--axis-accent)_12%,transparent)] text-(--axis-text)"
            : "border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-text) hover:bg-(--axis-surface)",
        )}
      >
        {t.pages.drive.various}
      </button>
      <button
        type="button"
        onClick={onCreateFolder}
        className="inline-flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface)"
      >
        {t.pages.drive.folder}
      </button>
      <button
        type="button"
        onClick={onUpload}
        className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(108,99,255,0.35)] transition hover:opacity-90"
      >
        {t.pages.drive.upload}
      </button>
    </div>
  </div>
);
