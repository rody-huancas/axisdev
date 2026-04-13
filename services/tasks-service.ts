import axios from "axios";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/utils/date-formatter";
import { handleAxiosError } from "@/lib/utils/google-api-error";
import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";
import type { ServiceResult, TareaPendiente } from "@/lib/types/google-service";

export const fetchTasksPreview = async (): Promise<ServiceResult<TareaPendiente[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await axios.get(env.api.tasks, {
      headers,
      params: {
        maxResults   : 6,
        showCompleted: true,
        showHidden   : false,
      },
    });

    const tasks = (response.data?.items ?? []).map(
      (task: { id: string; title?: string; status?: string; due?: string }) => ({
        id    : task.id,
        titulo: task.title ?? "Tarea sin titulo",
        estado: task.status === "completed" ? "completada": "pendiente",
        vence : formatDate(task.due),
      }),
    );

    return { ok: true, data: tasks };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchTaskList = async (): Promise<ServiceResult<TareaPendiente[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await axios.get(env.api.tasks, {
      headers,
      params: {
        maxResults   : 100,
        showCompleted: true,
        showHidden   : false,
      },
    });

    const tasks = (response.data?.items ?? []).map(
      (task: { id: string; title?: string; status?: string; due?: string; notes?: string; tasklistId?: string }) => ({
        id         : task.id,
        titulo     : task.title ?? "Tarea sin titulo",
        estado     : task.status === "completed" ? "completada": "pendiente",
        vence      : formatDate(task.due),
        descripcion: task.notes ?? "",
        tasklist   : task.tasklistId,
      }),
    );

    return { ok: true, data: tasks };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};