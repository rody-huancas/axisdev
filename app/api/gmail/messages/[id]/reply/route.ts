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

  const url = new URL(`${env.api.gmail}/messages/${id}`);
  url.searchParams.set("format", "full");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response("Error getting message", { status: 502 });
  }

  const data = await safeJson(response);
  if (!data) {
    return new Response("Message not found", { status: 404 });
  }

  const headers = data.payload?.headers ?? [];
  const to = getHeaderValue(headers, "From");
  const subject = getHeaderValue(headers, "Subject");

  const threadId = data.threadId || id;

  const rawEmail = Buffer.from(
    `To: ${to}\nSubject: ${subject.startsWith("Re:") ? subject : `Re: ${subject}`}\nThread-ID: ${threadId}\n\n${body.text}`,
  ).toString("base64url");

  const sendUrl = new URL(`${env.api.gmail}/messages/send`);

  const sendResponse = await fetch(sendUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: rawEmail }),
  });

  if (!sendResponse.ok) {
    return new Response("Error sending reply", { status: 502 });
  }

  return Response.json({ ok: true });
}