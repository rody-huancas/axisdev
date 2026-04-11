"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RiCloseLine, RiExternalLinkLine, RiFullscreenLine } from "react-icons/ri";

import type { DriveFile } from "@/services/google-service";

type FilePreviewModalProps = {
  file   : DriveFile | null;
  onClose: () => void;
};

const isImage      = (mimeType: string) => mimeType.startsWith("image/");
const isFolder     = (mimeType: string) => mimeType === "application/vnd.google-apps.folder";
const isPdf        = (mimeType: string) => mimeType === "application/pdf";
const isOfficeFile = (mimeType: string) =>
  mimeType.includes("msword") ||
  mimeType.includes("wordprocessingml") ||
  mimeType.includes("presentation") ||
  mimeType.includes("powerpoint");

export const FilePreviewModal = ({ file, onClose }: FilePreviewModalProps) => {
  if (!file) return null;

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const previewUrl = file.id ? `https://drive.google.com/file/d/${file.id}/preview` : null;
  const canPreview = Boolean(previewUrl || file.thumbnailLink);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className={
          isFullscreen
            ? "relative h-full w-full overflow-hidden border border-(--axis-border) bg-(--axis-surface)"
            : "relative w-full max-w-4xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_16px_40px_rgba(15,23,42,0.2)]"
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--axis-border) px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-(--axis-text)">{file.nombre}</p>
            <p className="text-xs text-(--axis-muted)">{file.mimeType}</p>
          </div>
          <div className="flex items-center gap-2">
            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-3 py-2 text-xs font-semibold text-(--axis-text) transition hover:bg-(--axis-surface)"
              >
                <RiExternalLinkLine className="h-4 w-4" />
                Abrir
              </a>
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) p-2 text-(--axis-text) transition hover:bg-(--axis-surface)"
              aria-label="Pantalla completa"
            >
              <RiFullscreenLine className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-(--axis-border) bg-(--axis-surface-strong) p-2 text-(--axis-text) transition hover:bg-(--axis-surface)"
              aria-label="Cerrar"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          className={ isFullscreen ? "flex h-[calc(100%-72px)] items-center justify-center bg-(--axis-bg)" : "flex h-[70vh] items-center justify-center bg-(--axis-bg)" }
        >
          {isFolder(file.mimeType) ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-(--axis-text)">Las carpetas se abren en Google Drive.</p>
              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold text-(--axis-text) transition hover:bg-(--axis-surface)"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                  Abrir en Drive
                </a>
              )}
            </div>
          ) : isImage(file.mimeType) && file.thumbnailLink ? (
            <Image
              src={file.thumbnailLink}
              alt={file.nombre}
              width={960}
              height={720}
              className="max-h-[70vh] w-auto object-contain"
            />
          ) : isOfficeFile(file.mimeType) ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-(--axis-text)">
                Este archivo requiere abrirse en Google Drive para previsualizarse.
              </p>
              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold text-(--axis-text) transition hover:bg-(--axis-surface)"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                  Abrir en Drive
                </a>
              )}
            </div>
          ) : isPdf(file.mimeType) && previewUrl ? (
            <iframe
              src={previewUrl}
              title={file.nombre}
              className="h-full w-full"
            />
          ) : canPreview && previewUrl ? (
            <iframe
              src={previewUrl}
              title={file.nombre}
              className="h-full w-full"
            />
          ) : (
            <p className="text-sm text-(--axis-muted)">No hay previsualizacion disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};
