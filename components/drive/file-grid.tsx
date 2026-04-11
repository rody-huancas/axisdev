"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RiFileExcel2Line, RiFileImageLine, RiFilePpt2Line, RiFileTextLine, RiFolder3Line, RiLayoutGridLine, RiListUnordered } from "react-icons/ri";
import { cn } from "@/lib/utils";
import type { DriveFile } from "@/services/google-service";
import { FilePreviewModal } from "@/components/drive/file-preview-modal";

type FileGridProps = {
  files             : DriveFile[];
  currentFolderId  ?: string | null;
  currentFolderName?: string | null;
};

const formatSize = (value: number) => {
  if (!value) return "-";
  
  const units     = ["B", "KB", "MB", "GB"];
  let   size      = value;
  let   unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const iconForMime = (mimeType: string) => {
  if (mimeType === "application/vnd.google-apps.folder") return RiFolder3Line;
  if (mimeType.startsWith("image/"))      return RiFileImageLine;
  if (mimeType.includes("spreadsheet"))   return RiFileExcel2Line;
  if (mimeType.includes("presentation"))  return RiFilePpt2Line;

  return RiFileTextLine;
};

const getExtension = (name: string) => {
  const parts = name.split(".");
  if (parts.length <= 1) return "";
  return parts.pop()?.toLowerCase() ?? "";
};

const toneForFile = (mimeType: string, name: string) => {
  const ext = getExtension(name);
  if (mimeType === "application/vnd.google-apps.folder") return "text-[#2697FF]";
  if (mimeType.startsWith("image/")) return "text-emerald-300";
  if (mimeType.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(ext)) {
    return "text-emerald-400";
  }
  if (mimeType.includes("presentation") || ["ppt", "pptx", "key"].includes(ext)) {
    return "text-amber-300";
  }
  if (mimeType.includes("pdf") || ext === "pdf")  return "text-rose-300";
  if (["doc", "docx", "rtf"].includes(ext))       return "text-sky-300";
  if (["sql", "db", "sqlite"].includes(ext))      return "text-cyan-300";
  if (["pod", "md", "txt", "log"].includes(ext))  return "text-slate-200";
  if (["zip", "rar", "7z"].includes(ext))         return "text-orange-300";
  if (["mp3", "wav", "flac"].includes(ext))       return "text-fuchsia-300";
  if (["mp4", "mov", "mkv"].includes(ext))        return "text-purple-300";
  
  return "text-slate-300";
};

const badgeToneForFile = (mimeType: string, name: string) => {
  const ext = getExtension(name);
  if (mimeType === "application/vnd.google-apps.folder") return "border-[#2697FF]/30 text-[#9ed0ff]";
  if (mimeType.startsWith("image/")) return "border-emerald-400/30 text-emerald-200";
  if (mimeType.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(ext)) {
    return "border-emerald-400/30 text-emerald-200";
  }
  if (mimeType.includes("presentation") || ["ppt", "pptx", "key"].includes(ext)) {
    return "border-amber-400/30 text-amber-200";
  }
  if (mimeType.includes("pdf") || ext === "pdf") return "border-rose-400/30 text-rose-200";
  if (["doc", "docx", "rtf"].includes(ext)) return "border-sky-400/30 text-sky-200";
  if (["sql", "db", "sqlite"].includes(ext)) return "border-cyan-400/30 text-cyan-200";
  if (["zip", "rar", "7z"].includes(ext)) return "border-orange-400/30 text-orange-200";
  return "border-(--axis-border) text-(--axis-muted)";
};

const bgToneForFile = (mimeType: string, name: string) => {
  const ext = getExtension(name);
  if (mimeType === "application/vnd.google-apps.folder") return "bg-[rgba(38,151,255,0.16)]";
  if (mimeType.startsWith("image/")) return "bg-emerald-500/15";
  if (mimeType.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(ext)) {
    return "bg-emerald-500/15";
  }
  if (mimeType.includes("presentation") || ["ppt", "pptx", "key"].includes(ext)) {
    return "bg-amber-500/15";
  }
  if (mimeType.includes("pdf") || ext === "pdf") return "bg-rose-500/15";
  if (["doc", "docx", "rtf"].includes(ext)) return "bg-sky-500/15";
  if (["sql", "db", "sqlite"].includes(ext)) return "bg-cyan-500/15";
  if (["zip", "rar", "7z"].includes(ext)) return "bg-orange-500/15";
  return "bg-slate-400/10";
};

export const FileGrid = ({ files, currentFolderId, currentFolderName }: FileGridProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<DriveFile | null>(null);
  const [tab, setTab] = useState<"all" | "folders" | "files">("all");

  useEffect(() => {
    const original = document.body.style.overflow;
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [selected]);

  const filtered = useMemo(() => {
    if (!query) return files;
    const lower = query.toLowerCase();
    return files.filter((file) => file.nombre.toLowerCase().includes(lower));
  }, [files, query]);

  const folders = filtered.filter(
    (file) => file.mimeType === "application/vnd.google-apps.folder",
  );
  const documents = filtered.filter(
    (file) => file.mimeType !== "application/vnd.google-apps.folder",
  );

  const inFolder = Boolean(currentFolderId && currentFolderId !== "root");
  const handleOpenFolder = (file: DriveFile) => {
    router.push(`/drive?folder=${encodeURIComponent(file.id)}&name=${encodeURIComponent(file.nombre)}`);
    router.refresh();
  };
  const handleBackToRoot = () => {
    router.push("/drive");
    router.refresh();
  };

  const visibleItems = tab === "folders" ? folders : tab === "files" ? documents : filtered;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar archivos..."
            className="w-56 bg-transparent text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl text-(--axis-muted) transition",
              view === "grid" && "bg-(--axis-surface) text-(--axis-text)",
            )}
            aria-label="Vista de cuadrícula"
          >
            <RiLayoutGridLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl text-(--axis-muted) transition",
              view === "list" && "bg-(--axis-surface) text-(--axis-text)",
            )}
            aria-label="Vista de lista"
          >
            <RiListUnordered className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-b border-(--axis-border) pb-3">
        {["all", "folders", "files"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value as "all" | "folders" | "files")}
            className={cn(
              "pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition",
              tab === value &&
                "border-b-2 border-(--axis-accent-2) text-(--axis-text)",
            )}
          >
            {value === "all" ? "Todo" : value === "folders" ? `Carpetas (${folders.length})` : `Archivos (${documents.length})`}
          </button>
        ))}
      </div>

      {inFolder && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-(--axis-border) bg-(--axis-surface) px-6 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">
              Carpeta actual
            </p>
            <p className="mt-2 text-lg font-semibold text-(--axis-text)">
              {currentFolderName ?? "Carpeta"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBackToRoot}
            className="rounded-2xl border border-(--axis-accent-2) bg-(--axis-surface-strong) px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface)"
          >
            Regresar
          </button>
        </div>
      )}

      <div className="space-y-4">
        {visibleItems.length ? (
          <div className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {visibleItems.map((file) => {
              const Icon = iconForMime(file.mimeType);
              const tone = toneForFile(file.mimeType, file.nombre);
              const badgeTone = badgeToneForFile(file.mimeType, file.nombre);
              const extension = getExtension(file.nombre);
              const isFolderItem = file.mimeType === "application/vnd.google-apps.folder";
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => (isFolderItem ? handleOpenFolder(file) : setSelected(file))}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 text-left shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:border-[rgba(148,163,184,0.45)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.24)]",
                    view === "list" && "justify-between",
                  )}
                >
                  <div className="relative z-10 flex min-w-0 items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-(--axis-border)",
                        bgToneForFile(file.mimeType, file.nombre),
                      )}
                    >
                      <Icon className={cn("h-5 w-5", tone)} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-(--axis-text)">
                        {file.nombre}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]",
                            badgeTone,
                          )}
                        >
                          {isFolderItem ? "carpeta" : extension ? extension : "archivo"}
                        </span>
                        <p className="text-xs text-(--axis-muted)">{file.actualizado || "-"}</p>
                      </div>
                    </div>
                  </div>
                  {view === "list" && !isFolderItem && (
                    <span className="relative z-10 text-xs text-(--axis-muted)">
                      {formatSize(file.sizeBytes)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-(--axis-muted)">No hay resultados para esta vista.</p>
        )}
      </div>

      <FilePreviewModal file={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
