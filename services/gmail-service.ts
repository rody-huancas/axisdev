import axios from "axios";
import { env } from "@/lib/env";
import { handleAxiosError } from "@/lib/utils/google-api-error";
import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";
import type { ServiceResult, GmailMensaje } from "@/lib/types/google-service";

const getHeaderValue = (
  headers: Array<{ name: string; value: string }>,
  key: string,
) => headers.find((header) => header.name.toLowerCase() === key.toLowerCase())?.value ?? "";

export const fetchGmailUnreadCount = async (): Promise<ServiceResult<number>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await axios.get(
      `${env.api.gmail}/messages`,
      {
        headers,
        params: {
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

export const fetchGmailPreview = async (): Promise<ServiceResult<GmailMensaje[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const listResponse = await axios.get(
      `${env.api.gmail}/messages`,
      {
        headers,
        params: {
          maxResults: 6,
          labelIds: "INBOX",
        },
      },
    );

    const messages = listResponse.data?.messages ?? [];
    const details  = await Promise.all(
      messages.map((message: { id: string }) =>
        axios
          .get(
            `${env.api.gmail}/messages/${message.id}`,
            {
              headers,
              params: {
                format         : "metadata",
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

export const fetchGmailMessages = async (maxResults = 50): Promise<ServiceResult<GmailMensaje[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const listResponse = await axios.get(
      `${env.api.gmail}/messages`,
      {
        headers,
        params: {
          maxResults,
          labelIds: "INBOX",
        },
      },
    );

    const messages = listResponse.data?.messages ?? [];
    const details  = await Promise.all(
      messages.map((message: { id: string }) =>
        axios
          .get(
            `${env.api.gmail}/messages/${message.id}`,
            {
              headers,
              params: {
                format         : "metadata",
                metadataHeaders: ["Subject", "From", "Date", "To"],
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
          id: string;
          snippet?: string;
          payload?: { headers?: Array<{ name: string; value: string }> };
        }) => {
          const headers = message.payload?.headers ?? [];
          return {
            id       : message.id,
            asunto   : getHeaderValue(headers, "Subject") || "Sin asunto",
            remitente: getHeaderValue(headers, "From")    || "Remitente desconocido",
            snippet  : message.snippet ?? "",
          };
        },
      );

    return { ok: true, data: mapped };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};