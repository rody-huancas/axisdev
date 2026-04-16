"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import type { DriveFile } from "@/services/google-service";
import { uploadDriveFile } from "@/actions/google/upload-drive-file";
import { FilePreviewModal } from "@/components/drive/file-preview-modal";
import { createDriveFolder } from "@/actions/google/create-drive-folder";
import { RiArrowRightSLine, RiDownloadLine, RiFileExcel2Line, RiFileImageLine, RiFilePpt2Line, RiFileTextLine, RiFolder3Line, RiFolderAddLine, RiInboxLine, RiLayoutGridLine, RiListUnordered, RiSearchLine, RiUploadCloud2Line } from "react-icons/ri";

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
  if (mimeType === "application/vnd.google-apps.folder") return "text-amber-300";
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
  if (mimeType === "application/vnd.google-apps.folder") {
    return "border-amber-400/30 text-amber-200";
  }
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
  if (mimeType === "application/vnd.google-apps.folder") {
    return "bg-amber-500/12";
  }
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [query             , setQuery             ] = useState<string>("");
  const [view              , setView              ] = useState<"grid" | "list">("grid");
  const [selected          , setSelected          ] = useState<DriveFile | null>(null);
  const [tab               , setTab               ] = useState<"all" | "folders" | "files">("all");
  const [isFolderModalOpen , setIsFolderModalOpen ] = useState<boolean>(false);
  const [isUploadModalOpen , setIsUploadModalOpen ] = useState<boolean>(false);
  const [folderName        , setFolderName        ] = useState<string>("");
  const [uploadFiles       , setUploadFiles       ] = useState<File[]>([]);
  const [isCreating        , setIsCreating        ] = useState<boolean>(false);
  const [isUploading       , setIsUploading       ] = useState<boolean>(false);
  const [isDragging        , setIsDragging        ] = useState<boolean>(false);
  const [selectedIds       , setSelectedIds       ] = useState<string[]>([]);
  const [isDownloading     , setIsDownloading     ] = useState<boolean>(false);
  const [isBulkDownloadMode, setIsBulkDownloadMode] = useState<boolean>(false);

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

  const handleCreateFolder = () => {
    setIsFolderModalOpen(true);
  };

  const handlePickUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleSelectUploadFiles = (filesList: FileList | null) => {
    if (!filesList?.length) {
      return;
    }

    const selectedFiles = Array.from(filesList);
    setUploadFiles((prev) => {
      const seen = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const next = [...prev];

      selectedFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          next.push(file);
        }
      });

      return next;
    });
  };

  const handleUploadInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectUploadFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleSelectUploadFiles(event.dataTransfer.files);
  };

  const handleRemoveUpload = (fileToRemove: File) => {
    const keyToRemove = `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`;
    setUploadFiles((prev) =>
      prev.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== keyToRemove),
    );
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const exitBulkMode = () => {
    setIsBulkDownloadMode(false);
    clearSelection();
  };

  const handleDownloadItems = async (ids: string[]) => {
    if (!ids.length) {
      sileo.warning({ title: "Selecciona archivos", description: "Elige archivos o carpetas para descargar." });
      return;
    }

    setIsDownloading(true);
    const promise = fetch("/api/drive/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).then(async (response) => {
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "download_failed");
      }
      const blob               = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch      = contentDisposition?.match(/filename="?([^";]+)"?/i);
      const filename           = filenameMatch?.[1] ?? `drive-download-${Date.now()}.zip`;

      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });

    sileo.promise(promise, {
      loading: { title: "Preparando descarga..." },
      success: { title: "Descarga lista" },
      error: (err) => ({
        title: "No se pudo descargar",
        description: err instanceof Error ? err.message : undefined,
      }),
    });

    try {
      await promise;
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCreateFolderSubmit = async () => {
    const trimmed = folderName.trim();

    if (!trimmed) {
      sileo.error({ title: "Nombre requerido", description: "Escribe un nombre para la carpeta." });
      return;
    }

    setIsCreating(true);
    const promise = createDriveFolder({ name: trimmed, parentId: currentFolderId });

    sileo.promise(promise, {
      loading: { title: "Creando carpeta..." },
      success: { title: "Carpeta creada" },
      error: { title: "No se pudo crear la carpeta" },
    });

    try {
      await promise;
      setFolderName("");
      setIsFolderModalOpen(false);
      router.refresh();
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFiles.length) {
      sileo.warning({ title: "Selecciona archivos", description: "Agrega uno o mas archivos para subir." });
      return;
    }

    setIsUploading(true);
    const promise = Promise.all(
      uploadFiles.map((file) => uploadDriveFile({ file, parentId: currentFolderId })),
    );

    sileo.promise(promise, {
      loading: { title: "Subiendo archivos..." },
      success: { title: "Archivos subidos" },
      error: { title: "No se pudo subir el archivo" },
    });

    try {
      await promise;
      setUploadFiles([]);
      setIsUploadModalOpen(false);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  };

  const visibleItems = tab === "folders" ? folders : tab === "files" ? documents : filtered;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-(--axis-border) pb-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={inFolder ? handleBackToRoot : undefined}
            className={cn(
              "inline-flex items-center rounded-2xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition",
              inFolder
                ? "border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-text) hover:bg-(--axis-surface)"
                : "cursor-default border-(--axis-border) bg-(--axis-surface) text-(--axis-muted)",
            )}
            aria-current={!inFolder ? "page" : undefined}
            title={inFolder ? "Volver a Mi Drive" : "Mi Drive"}
          >
            Mi Drive
          </button>
          {inFolder && (
            <>
              <RiArrowRightSLine className="h-4 w-4 text-(--axis-muted)" aria-hidden />
              <span className="max-w-[60ch] truncate font-medium text-(--axis-text)" aria-current="page">
                {currentFolderName ?? "Carpeta"}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <RiSearchLine
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--axis-muted)"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isBulkDownloadMode) {
                  exitBulkMode();
                  return;
                }
                setIsBulkDownloadMode(true);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition",
                isBulkDownloadMode
                  ? "border-(--axis-accent) bg-[color-mix(in_srgb,var(--axis-accent)_12%,transparent)] text-(--axis-text)"
                  : "border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-text) hover:bg-(--axis-surface)",
              )}
            >
              <RiDownloadLine className="h-4 w-4 opacity-80" aria-hidden />
              {isBulkDownloadMode ? "Salir" : "Varios"}
            </button>
            <button
              type="button"
              onClick={handleCreateFolder}
              className="inline-flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface)"
            >
              <RiFolderAddLine className="h-4 w-4 text-(--axis-accent-2)" aria-hidden />
              Carpeta
            </button>
            <button
              type="button"
              onClick={handlePickUpload}
              className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(108,99,255,0.35)] transition hover:opacity-90"
            >
              <RiUploadCloud2Line className="h-4 w-4" aria-hidden />
              Subir
            </button>
            <div className="flex items-center gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition",
                  view === "grid"
                    ? "bg-(--axis-surface) text-(--axis-accent) shadow-sm"
                    : "text-(--axis-muted) hover:text-(--axis-text)",
                )}
                aria-label="Vista de cuadricula"
              >
                <RiLayoutGridLine className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition",
                  view === "list"
                    ? "bg-(--axis-surface) text-(--axis-accent) shadow-sm"
                    : "text-(--axis-muted) hover:text-(--axis-text)",
                )}
                aria-label="Vista de lista"
              >
                <RiListUnordered className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isBulkDownloadMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
            Seleccion multiple
            {selectedIds.length > 0 ? (
              <span className="ml-2 text-(--axis-text)">({selectedIds.length})</span>
            ) : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadItems(selectedIds)}
              disabled={isDownloading || selectedIds.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <RiDownloadLine className="h-4 w-4" aria-hidden />
              Descargar
            </button>
            <button
              type="button"
              onClick={exitBulkMode}
              className="rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => {
              if (isCreating) return;
              setIsFolderModalOpen(false);
              setFolderName("");
            }}
          />
          <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
              <h3 className="text-xl font-semibold text-(--axis-text)">Crear carpeta</h3>
              <p className="text-sm text-(--axis-muted)">Define el nombre de la carpeta nueva.</p>
            </div>
            <div className="mt-6 space-y-4">
              <input
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="Nombre de la carpeta"
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
                disabled={isCreating}
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFolderModalOpen(false);
                    setFolderName("");
                  }}
                  disabled={isCreating}
                  className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateFolderSubmit}
                  disabled={isCreating}
                  className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {isCreating && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {isCreating ? "Creando" : "Crear"}
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => {
              if (isUploading) return;
              setIsUploadModalOpen(false);
              setUploadFiles([]);
            }}
          />
          <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-(--axis-border) bg-(--axis-surface) p-6 shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Drive</p>
              <h3 className="text-xl font-semibold text-(--axis-text)">Subir archivos</h3>
              <p className="text-sm text-(--axis-muted)">Arrastra y suelta o selecciona varios archivos.</p>
            </div>
            <div className="mt-6 space-y-4">
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition",
                  isDragging
                    ? "border-(--axis-accent) bg-(--axis-surface-strong)"
                    : "border-(--axis-border) bg-(--axis-surface)",
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <p className="text-sm font-semibold text-(--axis-text)">Suelta tus archivos aquí</p>
                <p className="text-xs text-(--axis-muted)">o</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
                >
                  Seleccionar archivos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUploadInputChange}
                />
              </div>

              {uploadFiles.length > 0 && (
                <div className="max-h-52 space-y-2 overflow-auto rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-3">
                  {uploadFiles.map((file) => (
                    <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between gap-4 text-xs text-(--axis-text)">
                      <span className="truncate font-medium">{file.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-(--axis-muted)">{formatSize(file.size)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveUpload(file)}
                          disabled={isUploading}
                          className="rounded-xl py-1 px-2 text-white bg-red-500 transition hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setUploadFiles([])}
                  disabled={isUploading || uploadFiles.length === 0}
                  className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
                >
                  Limpiar
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setUploadFiles([]);
                    }}
                    disabled={isUploading}
                    className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong) disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isUploading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {isUploading ? "Subiendo" : "Subir"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
        {(["all", "folders", "files"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
              tab === value
                ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                : "text-(--axis-muted) hover:text-(--axis-text)",
            )}
          >
            {value === "all"
              ? "Todo"
              : value === "folders"
                ? `Carpetas (${folders.length})`
                : `Archivos (${documents.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visibleItems.length ? (
          <div className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {visibleItems.map((file) => {
              const Icon = iconForMime(file.mimeType);
              const tone = toneForFile(file.mimeType, file.nombre);
              const badgeTone = badgeToneForFile(file.mimeType, file.nombre);
              const extension = getExtension(file.nombre);
              const isFolderItem = file.mimeType === "application/vnd.google-apps.folder";
              const isSelected = selectedIds.includes(file.id);
              const handleActivate = () => {
                if (isBulkDownloadMode) {
                  toggleSelection(file.id);
                  return;
                }

                if (isFolderItem) {
                  handleOpenFolder(file);
                  return;
                }

                setSelected(file);
              };
              return (
                <div
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  onClick={handleActivate}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleActivate();
                    }
                  }}
                  className={cn(
                    "group relative flex min-w-0 items-center gap-4 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))] hover:bg-(--axis-surface-strong) hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]",
                    isBulkDownloadMode && isSelected && "border-(--axis-accent) bg-[color-mix(in_srgb,var(--axis-accent)_10%,var(--axis-surface))]",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-4">
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
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    {view === "list" && !isFolderItem && (
                      <span className="text-xs text-(--axis-muted)">{formatSize(file.sizeBytes)}</span>
                    )}

                    {!isBulkDownloadMode && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDownloadItems([file.id]);
                        }}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border border-(--axis-border) bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:border-[color-mix(in_srgb,var(--axis-accent)_35%,var(--axis-border))] hover:text-(--axis-accent)",
                          view === "grid" && "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                        )}
                        title="Descargar"
                        aria-label="Descargar"
                      >
                        <RiDownloadLine className="h-4 w-4" aria-hidden />
                      </button>
                    )}

                    {isBulkDownloadMode && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(file.id)}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                        className="h-5 w-5 rounded border-(--axis-border) bg-(--axis-surface) accent-(--axis-accent)"
                        aria-label={isSelected ? "Deseleccionar" : "Seleccionar"}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--axis-border) bg-[color-mix(in_srgb,var(--axis-bg)_40%,transparent)] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--axis-surface-strong) ring-1 ring-(--axis-border)">
              <RiInboxLine className="h-7 w-7 text-(--axis-muted)" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-semibold text-(--axis-text)">No hay elementos</p>
            <p className="mt-1 max-w-sm text-sm text-(--axis-muted)">
              {query
                ? "Prueba otro término de búsqueda o cambia el filtro."
                : "Sube archivos o crea una carpeta para empezar."}
            </p>
          </div>
        )}
      </div>

      <FilePreviewModal file={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
