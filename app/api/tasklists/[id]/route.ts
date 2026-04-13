import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { title?: string };
  if (!body.title?.trim()) {
    return new Response("Title required", { status: 400 });
  }

  const baseUrl = env.api.tasklists.replace("/users/@me/lists", "");
  const url = new URL(`${baseUrl}/users/@me/lists/${id}`);

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: body.title.trim() }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PATCH tasklist error:", response.status, errorText);
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const updated = await response.json();

  return Response.json({
    item: {
      id: updated.id ?? "",
      title: updated.title ?? body.title,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const baseUrl = env.api.tasklists.replace("/users/@me/lists", "");
  const url = new URL(`${baseUrl}/users/@me/lists/${id}`);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  return Response.json({ ok: true });
}