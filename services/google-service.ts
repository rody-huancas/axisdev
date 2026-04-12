import axios from "axios";

import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";
import { googleApi } from "@/lib/axios-config";
import { env } from "@/lib/env";

export type ServiceResult<T> = | { ok: true; data: T } | { ok: false; error: string };

export type ArchivoReciente = {
  id         : string;
  nombre     : string;
  tipo       : string;
  mimeType   : string;
  sizeBytes  : number;
  actualizado: string;
};

export type EventoCalendario = {
  id          : string;
  titulo      : string;
  inicio      : string;
  fin         : string;
  inicioIso   : string;
  organizador?: string;
};

export type StorageInfo = {
  usadoGb   : number;
  limiteGb  : number;
  porcentaje: number;
};

export type TareaPendiente = {
  id     : string;
  titulo : string;
  estado : "completada" | "pendiente";
  vence ?: string;
};

export type GmailMensaje = {
  id       : string;
  asunto   : string;
  remitente: string;
  snippet  : string;
};

export const fetchGmailUnreadCount = async (): Promise<ServiceResult<number>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const response = await axios.get(
      `${env.api.gmail}/messages`,
      {
        headers: auth.headers,
        params : {
          maxResults: 1,
          labelIds  : "INBOX",
          q         : "is:unread",
        },
      },
    );

    return { ok: true, data: Number(response.data?.resultSizeEstimate ?? 0) };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export type DriveFile = {
  id            : string;
  nombre        : string;
  mimeType      : string;
  actualizado   : string;
  sizeBytes     : number;
  iconLink     ?: string;
  webViewLink  ?: string;
  thumbnailLink?: string;
};

const mapMimeToTipo = (mimeType: string) => {
  if (mimeType.includes("folder")) return "Carpeta";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("spreadsheet")) return "Hoja";
  if (mimeType.includes("presentation")) return "Slides";
  if (mimeType.includes("image")) return "Imagen";
  if (mimeType.includes("video")) return "Video";
  return "Archivo";
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("es-ES", {
    day  : "2-digit",
    month: "short",
    year : "numeric",
  });
};

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) {
      return "La sesion expiro. Inicia sesion nuevamente.";
    }
    if (status === 403) {
      return "No tienes permisos para acceder a esta informacion.";
    }
    return (
      (error.response?.data as { error?: { message?: string } })?.error?.message ||
      "Ocurrio un error al consultar Google."
    );
  }

  return "Ocurrio un error inesperado.";
};

const withAuthHeaders = async () => {
  const headers = await getGoogleAuthHeaders();
  if (!headers) {
    return { ok: false, error: "No hay una sesion valida." } as const;
  }
  return { ok: true, headers } as const;
};

export const fetchRecentFiles = async (): Promise<ServiceResult<ArchivoReciente[]>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const response = await googleApi.get("/drive/v3/files", {
      headers: auth.headers,
      params : {
        pageSize: 12,
        fields  : "files(id,name,mimeType,modifiedTime,size)",
        orderBy : "modifiedTime desc",
      },
    });

    const files = (response.data?.files ?? []).map(
      (file: {
        id           : string;
        name         : string;
        mimeType     : string;
        modifiedTime?: string;
        size        ?: string;
      }) => ({
        id         : file.id,
        nombre     : file.name,
        mimeType   : file.mimeType,
        tipo       : mapMimeToTipo(file.mimeType),
        sizeBytes  : Number(file.size ?? 0),
        actualizado: formatDate(file.modifiedTime),
      }),
    );

    return { ok: true, data: files };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchDriveFiles = async (folderId: string = "root"): Promise<ServiceResult<DriveFile[]>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const resolvedFolderId = folderId && folderId !== "root" ? folderId : "root";
    const isRoot           = resolvedFolderId === "root";
    const query            = `'${resolvedFolderId}' in parents and trashed = false`;

    const paramsBase = {
      q                        : query,
      fields                   : "nextPageToken, files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,thumbnailLink)",
      supportsAllDrives        : true,
      includeItemsFromAllDrives: true,
      corpora                  : isRoot ? "user" : "allDrives",
      spaces                   : "drive",
    };

    const allFiles : DriveFile[] = [];
    let   pageToken: string | undefined;

    do {
      const response = await googleApi.get("/drive/v3/files", {
        headers: auth.headers,
        params : {
          ...paramsBase,
          pageSize: 100,
          pageToken,
          orderBy: "folder, modifiedTime desc",
        },
      });

      const files = (response.data?.files ?? []).map(
        (file: {
          id            : string;
          name          : string;
          mimeType      : string;
          modifiedTime ?: string;
          size         ?: string;
          iconLink     ?: string;
          webViewLink  ?: string;
          thumbnailLink?: string;
        }) => ({
          id           : file.id,
          nombre       : file.name,
          mimeType     : file.mimeType,
          actualizado  : formatDate(file.modifiedTime),
          sizeBytes    : Number(file.size ?? 0),
          iconLink     : file.iconLink,
          webViewLink  : file.webViewLink,
          thumbnailLink: file.thumbnailLink,
        }),
      );

      allFiles.push(...files);
      pageToken = response.data?.nextPageToken ?? undefined;
    } while (pageToken && allFiles.length < 500);

    return { ok: true, data: allFiles };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchCalendarEvents = async (): Promise<ServiceResult<EventoCalendario[]>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const response = await googleApi.get("/calendar/v3/calendars/primary/events", {
      headers: auth.headers,
      params : {
        maxResults  : 10,
        singleEvents: true,
        orderBy     : "startTime",
        timeMin     : new Date().toISOString(),
      },
    });

    const events = (response.data?.items ?? []).map(
      (event: {
        id        : string;
        summary  ?: string;
        start    ?: { dateTime?: string; date?: string };
        end      ?: { dateTime?: string; date?: string };
        organizer?: { displayName?: string; email?: string };
      }) => ({
        id         : event.id,
        titulo     : event.summary ?? "Evento sin titulo",
        inicio     : formatDate(event.start?.dateTime ?? event.start?.date),
        fin        : formatDate(event.end?.dateTime ?? event.end?.date),
        inicioIso  : event.start?.dateTime ?? event.start?.date ?? "",
        organizador: event.organizer?.displayName ?? event.organizer?.email,
      }),
    );

    return { ok: true, data: events };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchStorageInfo = async (): Promise<ServiceResult<StorageInfo>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const response = await googleApi.get("/drive/v3/about", {
      headers: auth.headers,
      params: {
        fields: "storageQuota",
      },
    });

    const quota      = response.data?.storageQuota ?? {};
    const usage      = Number(quota.usage ?? 0);
    const limit      = Number(quota.limit ?? 0);
    const usedGb     = usage / 1024 / 1024 / 1024;
    const limitGb    = limit ? limit / 1024 / 1024 / 1024 : 0;
    const porcentaje = limit ? Math.round((usage / limit) * 100) : 0;

    return {
      ok  : true,
      data: {
        usadoGb : Number(usedGb.toFixed(1)),
        limiteGb: Number(limitGb.toFixed(1)),
        porcentaje,
      },
    };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchTasksPreview = async (): Promise<ServiceResult<TareaPendiente[]>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const response = await axios.get(
      env.api.tasks,
      {
        headers: auth.headers,
        params : {
          maxResults   : 6,
          showCompleted: true,
          showHidden   : false,
        },
      },
    );

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

const getHeaderValue = (
  headers: Array<{ name: string; value: string }>,
  key: string,
) => headers.find((header) => header.name.toLowerCase() === key.toLowerCase())?.value ?? "";

export const fetchGmailPreview = async (): Promise<ServiceResult<GmailMensaje[]>> => {
  try {
    const auth = await withAuthHeaders();
    if (!auth.ok) return auth;

    const listResponse = await axios.get(
      `${env.api.gmail}/messages`,
      {
        headers: auth.headers,
        params: {
          maxResults: 6,
          labelIds: "INBOX",
        },
      },
    );

    const messages = listResponse.data?.messages ?? [];
    const details = await Promise.all(
      messages.map((message: { id: string }) =>
        axios
          .get(
            `${env.api.gmail}/messages/${message.id}`,
            {
              headers: auth.headers,
              params: {
                format: "metadata",
                metadataHeaders: ["Subject", "From"],
              },
            },
          )
          .then((response) => response.data)
          .catch(() => null),
      ),
    );

    const mapped = details
      .filter(Boolean)
      .map(
        (message: {
          id      : string;
          snippet?: string;
          payload?: { headers?: Array<{ name: string; value: string }> };
        }) => {
          const headers = message.payload?.headers ?? [];
          return {
            id       : message.id,
            asunto   : getHeaderValue(headers, "Subject") || "Sin asunto",
            remitente: getHeaderValue(headers, "From") || "Remitente desconocido",
            snippet  : message.snippet ?? "",
          };
        },
      );

    return { ok: true, data: mapped };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};
