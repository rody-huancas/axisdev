import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

type GmailMessage = {
  id           : string;
  asunto       : string;
  remitente    : string;
  snippet      : string;
  fecha       ?: string;
  destinatario?: string;
  htmlContent ?: string;
};

const getHeaderValue = (
  headers: Array<{ name: string; value: string }>,
  key: string,
) => headers.find((header) => header.name.toLowerCase() === key.toLowerCase())?.value ?? "";

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const maxResults = Number(searchParams.get("maxResults") || 50);

  const url = new URL(`${env.api.gmail}/messages`);
  url.searchParams.set("maxResults", String(Math.min(maxResults, 100)));
  url.searchParams.set("labelIds", "INBOX");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const listData = await safeJson(response);
  if (!listData?.messages) {
    return Response.json({ items: [] });
  }

  const details = await Promise.all(
    listData.messages.map((msg: { id: string }) =>
      fetch(`${env.api.gmail}/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then(safeJson)
        .catch(() => null),
    ),
  );

  const items: GmailMessage[] = details
    .filter(Boolean)
    .map((msg: any) => {
      const headers = msg.payload?.headers ?? [];
      return {
        id: msg.id,
        asunto: getHeaderValue(headers, "Subject") || "Sin asunto",
        remitente: getHeaderValue(headers, "From") || "Remitente desconocido",
        snippet: msg.snippet ?? "",
      };
    });

  return Response.json({ items });
}