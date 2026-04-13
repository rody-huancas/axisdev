import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";
import { googleApi } from "@/lib/axios-config";
import { handleAxiosError } from "@/lib/utils/google-api-error";
import { formatDate } from "@/lib/utils/date-formatter";
import type { ServiceResult, EventoCalendario } from "@/lib/types/google-service";

export const fetchCalendarEvents = async (): Promise<ServiceResult<EventoCalendario[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await googleApi.get("/calendar/v3/calendars/primary/events", {
      headers,
      params: {
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
        timeMin: new Date().toISOString(),
      },
    });

    const events = (response.data?.items ?? []).map(
      (event: {
        id        : string;
        summary  ?: string;
        start    ?: { dateTime   ?: string; date ?: string };
        end      ?: { dateTime   ?: string; date ?: string };
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
