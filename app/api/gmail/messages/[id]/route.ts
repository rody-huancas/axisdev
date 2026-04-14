import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(`${env.api.gmail}/messages/${id}`);
  url.searchParams.set("format", "full");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const data = await safeJson(response);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const headers = data.payload?.headers ?? [];
  const subject = getHeaderValue(headers, "Subject") || "Sin asunto";
  const from    = getHeaderValue(headers, "From")    || "Remitente desconocido";
  const date    = getHeaderValue(headers, "Date")    || "";
  const to      = getHeaderValue(headers, "To")      || "";

  let htmlContent: string | undefined;
  if (data.payload?.parts) {
    const htmlPart = data.payload.parts.find(
      (part: any) => part.mimeType === "text/html",
    );
    if (htmlPart?.body?.data) {
      htmlContent = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
    }
  }

  const snippet = data.snippet || "";

  return Response.json({
    item: {
      id,
      asunto   : subject,
      remitente: from,
      snippet,
      fecha       : date,
      destinatario: to,
      htmlContent,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { text?: string };
  if (!body.text) {
    return new Response("Missing text", { status: 400 });
  }

  const getUrl = new URL(`${env.api.gmail}/messages/${id}/messages`);
  const getResponse = await fetch(getUrl.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!getResponse.ok) {
    return new Response("Error getting thread", { status: 502 });
  }

  const threadData = await safeJson(getResponse);
  const threadId = threadData?.threadId || id;

  const createUrl = new URL(`${env.api.gmail}/messages/send`);

  const createResponse = await fetch(createUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      threadId,
      raw: Buffer.from(
        `To: ${threadData?.payload?.headers?.[0]?.value || ""}\nSubject: Re: ${threadData?.payload?.headers?.find((h: any) => h.name === "Subject")?.value || ""}\n\n${body.text}`,
      ).toString("base64"),
    }),
  });

  if (!createResponse.ok) {
    return new Response("Error sending reply", { status: 502 });
  }

  return Response.json({ ok: true });
}
