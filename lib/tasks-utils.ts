import type { TareaPendiente } from "@/services/google-service";

export const formatDateDisplay = (iso?: string) => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

export const formatDateRelative = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `${days} dias atras`;
  return formatDateDisplay(iso);
};

export const isOverdue = (dueDate?: string) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now;
};

export const getTaskStatusColor = (estado: string, dueDate?: string) => {
  if (estado === "completada") {
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  }
  if (isOverdue(dueDate)) {
    return "text-rose-400 bg-rose-500/10 border-rose-500/30";
  }
  return "text-amber-400 bg-amber-500/10 border-amber-500/30";
};

export const taskIconColor = (estado: string, dueDate?: string) => {
  if (estado === "completada") {
    return "text-emerald-400";
  }
  if (isOverdue(dueDate)) {
    return "text-rose-400";
  }
  return "text-amber-400";
};

export const ITEMS_PER_PAGE = 15;

export const filterTasksByStatus = (tasks: TareaPendiente[], status: "all" | "pendiente" | "completada") => {
  if (status === "all") return tasks;
  return tasks.filter((task) => task.estado === status);
};

export const sortTasks = (
  tasks: TareaPendiente[],
  sort: "date" | "alpha" | "status",
) => {
  const sorted = [...tasks];
  switch (sort) {
    case "date":
      return sorted.sort((a, b) => {
        if (a.estado === "completada" && b.estado !== "completada") return 1;
        if (a.estado !== "completada" && b.estado === "completada") return -1;
        if (!a.vence || !b.vence) return 0;
        return new Date(a.vence).getTime() - new Date(b.vence).getTime();
      });
    case "alpha":
      return sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
    case "status":
      return sorted.sort((a, b) => {
        if (a.estado === "completada" && b.estado !== "completada") return 1;
        if (a.estado !== "completada" && b.estado === "completada") return -1;
        return 0;
      });
    default:
      return sorted;
  }
};

export const paginateTasks = (tasks: Array<unknown>, page: number) => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return tasks.slice(start, start + ITEMS_PER_PAGE);
};

export const calculatePageCount = (total: number) => Math.ceil(total / ITEMS_PER_PAGE);