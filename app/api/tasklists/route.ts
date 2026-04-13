import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export type TaskList = {
  id: string;
  title: string;
};

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(env.api.tasklists);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const data = (await response.json()) as { items?: Array<{ id: string; title: string }> };

  const items: TaskList[] = (data.items ?? []).map((list) => ({
    id: list.id,
    title: list.title,
  }));

  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { title?: string };
  if (!body.title?.trim()) {
    return new Response("Title required", { status: 400 });
  }

  const url = new URL(env.api.tasklists);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: body.title.trim() }),
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const created = await response.json();

  return Response.json({
    item: {
      id: created.id ?? "",
      title: created.title ?? body.title,
    },
  });
}