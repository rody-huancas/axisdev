import type { ArchivoReciente, DriveFile } from "@/lib/types/google-service";

export type StorageBreakdownItem = {
  label     : string;
  percentage: number;
  tone      : string;
};

const classifyStorage = (mimeType: string) => {
  if (mimeType.includes("image") || mimeType.includes("video") || mimeType.includes("audio")) {
    return "Media";
  }
  if (
    mimeType.includes("pdf")          ||
    mimeType.includes("document")     ||
    mimeType.includes("spreadsheet")  ||
    mimeType.includes("presentation") ||
    mimeType.includes("text")
  ) {
    return "Documentos";
  }
  return "Otros";
};

export const computeStorageBreakdown = (driveFiles: DriveFile[]): StorageBreakdownItem[] => {
  const sizeByGroup = driveFiles.reduce<Record<string, number>>((acc, file) => {
    const group = classifyStorage(file.mimeType);
    acc[group] = (acc[group] ?? 0) + file.sizeBytes;
    return acc;
  }, {});

  const countByGroup = driveFiles.reduce<Record<string, number>>((acc, file) => {
    const group = classifyStorage(file.mimeType);
    acc[group] = (acc[group] ?? 0) + 1;
    return acc;
  }, {});

  const sizeTotal  = Object.values(sizeByGroup).reduce((sum, value) => sum + value, 0);
  const countTotal = Object.values(countByGroup).reduce((sum, value) => sum + value, 0);

  return ["Documentos", "Media", "Otros"].map((label, index) => {
    const sizeValue  = sizeByGroup[label] ?? 0;
    const countValue = countByGroup[label] ?? 0;
    const percentage = sizeTotal ? Math.round((sizeValue / sizeTotal) * 100) : countTotal ? Math.round((countValue / countTotal) * 100) : 0;
    const tones      = [
      "from-indigo-500 to-sky-500",
      "from-fuchsia-500 to-violet-500",
      "from-emerald-500 to-cyan-500",
    ];
    return {
      label,
      percentage,
      tone: tones[index] ?? tones[0],
    };
  });
};

export const computeWeeklyBars = (calendarEvents: { inicioIso: string }[]) => {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const day = date.toISOString().split("T")[0];
    return calendarEvents.filter((event) => event.inicioIso.startsWith(day)).length;
  });
};

export const computeTaskStats = (tasks: { estado: "completada" | "pendiente" }[]) => {
  return {
    pending  : tasks.filter((task) => task.estado !== "completada").length,
    completed: tasks.filter((task) => task.estado === "completada").length,
  };
};
