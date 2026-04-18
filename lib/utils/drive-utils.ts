import type { IconType } from "react-icons";
import { RiFolder3Line, RiFileImageLine, RiFileExcel2Line, RiFilePpt2Line, RiFileTextLine } from "react-icons/ri";

export const formatFileSize = (value: number): string => {
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

export const getFileExtension = (name: string): string => {
  const parts = name.split(".");
  if (parts.length <= 1) return "";
  return parts.pop()?.toLowerCase() ?? "";
};

export const getMimeIcon = (mimeType: string): IconType => {
  if (mimeType === "application/vnd.google-apps.folder") return RiFolder3Line;
  if (mimeType.startsWith("image/")) return RiFileImageLine;
  if (mimeType.includes("spreadsheet")) return RiFileExcel2Line;
  if (mimeType.includes("presentation")) return RiFilePpt2Line;
  return RiFileTextLine;
};

export const getFileTone = (mimeType: string, name: string): string => {
  const ext = getFileExtension(name);
  
  if (mimeType === "application/vnd.google-apps.folder") return "text-amber-300";
  if (mimeType.startsWith("image/")) return "text-emerald-300";
  if (mimeType.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(ext)) {
    return "text-emerald-400";
  }
  if (mimeType.includes("presentation") || ["ppt", "pptx", "key"].includes(ext)) {
    return "text-amber-300";
  }
  if (mimeType.includes("pdf") || ext === "pdf") return "text-rose-300";
  if (["doc", "docx", "rtf"].includes(ext)) return "text-sky-300";
  if (["sql", "db", "sqlite"].includes(ext)) return "text-cyan-300";
  if (["pod", "md", "txt", "log"].includes(ext)) return "text-slate-200";
  if (["zip", "rar", "7z"].includes(ext)) return "text-orange-300";
  if (["mp3", "wav", "flac"].includes(ext)) return "text-fuchsia-300";
  if (["mp4", "mov", "mkv"].includes(ext)) return "text-purple-300";
  
  return "text-slate-300";
};

export const getBadgeTone = (mimeType: string, name: string): string => {
  const ext = getFileExtension(name);
  
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

export const getBgTone = (mimeType: string, name: string): string => {
  const ext = getFileExtension(name);
  
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
