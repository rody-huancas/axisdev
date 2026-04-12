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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(`${env.api.tasks}/${id}`);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const data = await response.json();

  return Response.json({
    item: {
      id: data.id ?? "",
      titulo: data.title ?? "Tarea sin titulo",
      estado: data.status === "completed" ? "completada" : "pendiente",
      vence: formatDate(data.due),
      descripcion: data.notes ?? "",
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { completed?: boolean; title?: string; due?: string; notes?: string };

  const url = new URL(`${env.api.tasks}/${id}`);

  const updates: Record<string, unknown> = {};
  if (body.completed !== undefined) {
    updates.status = body.completed ? "completed" : "needsAction";
  }
  if (body.title !== undefined) updates.title = body.title;
  if (body.due !== undefined) updates.due = body.due;
  if (body.notes !== undefined) updates.notes = body.notes;

  const response = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  const data = await response.json();

  return Response.json({
    item: {
      id: data.id ?? id,
      titulo: data.title ?? "Tarea sin titulo",
      estado: data.status === "completed" ? "completada" : "pendiente",
      vence: formatDate(data.due),
      descripcion: data.notes ?? "",
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

  const url = new URL(`${env.api.tasks}/${id}`);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!response.ok) {
    return new Response(`Google API error: ${response.status}`, { status: 502 });
  }

  return Response.json({ ok: true });
}