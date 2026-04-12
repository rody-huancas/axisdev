import { auth } from "@/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(env.api.tasks);
  url.searchParams.set("maxResults", "100");
  url.searchParams.set("showCompleted", "true");
  url.searchParams.set("showHidden", "false");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const data = (await response.json()) as { items?: Array<{ id?: string; title?: string; status?: string; due?: string; notes?: string }> };

  const items = (data.items ?? []).map((task) => ({
    id     : task.id ?? "",
    titulo : task.title ?? "Tarea sin titulo",
    estado : task.status === "completed" ? "completada" : "pendiente",
    vence  : formatDate(task.due),
    descripcion: task.notes ?? "",
  }));

  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { title?: string; due?: string; notes?: string };
  if (!body.title?.trim()) {
    return new Response("Title required", { status: 400 });
  }

  const url = new URL(env.api.tasks);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: body.title.trim(),
      due: body.due || undefined,
      notes: body.notes?.trim() || undefined,
    }),
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const created = await response.json();

  return Response.json({
    item: {
      id: created.id ?? "",
      titulo: created.title ?? body.title,
      estado: "pendiente",
      vence: body.due ? formatDate(body.due) : "",
      descripcion: body.notes ?? "",
    },
  });
}