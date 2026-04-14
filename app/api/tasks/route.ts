import { auth } from "@/auth";
import { env } from "@/lib/env";
import type { TareaPendiente } from "@/services/google-service";

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

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params        = new URL(request.url).searchParams;
  const tasklistParam = params.get("tasklist");
  const baseUrl       = env.api.tasks.replace("/lists/@default/tasks", "");

  const allItems: Array<{ id?: string; title?: string; status?: string; due?: string; notes?: string; parent?: string; tasklistId?: string }> = [];

  if (tasklistParam) {
    const url = new URL(`${baseUrl}/lists/${tasklistParam}/tasks?_=` + Date.now());
    url.searchParams.set("maxResults", "100");
    url.searchParams.set("showCompleted", "true");
    url.searchParams.set("showHidden", "false");

    const response = await fetch(url.toString(), {
      headers: { 
        Authorization: `Bearer ${session.accessToken}`,
        "Cache-Control": "no-store",
      },
    });

    if (response.ok) {
      const data = await response.json();
      allItems.push(...(data.items ?? []));
    }
  } else {
    const listsUrl = new URL(`${baseUrl}/lists`);
    const listsResponse = await fetch(listsUrl.toString(), {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (listsResponse.ok) {
      const listsData = await listsResponse.json();
      const lists = listsData.items ?? [];

      for (const list of lists) {
        const listId = list.id;
        const url = new URL(`${baseUrl}/lists/${listId}/tasks?_=` + Date.now());
        url.searchParams.set("maxResults", "100");
        url.searchParams.set("showCompleted", "true");
        url.searchParams.set("showHidden", "false");

        const taskResponse = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        if (taskResponse.ok) {
          const taskData = await taskResponse.json();
          allItems.push(...(taskData.items ?? []));
        }
      }
    }
  }

  const items = allItems.map((task) => ({
    id         : task.id ?? "",
    titulo     : task.title ?? "Tarea sin titulo",
    estado     : task.status === "completed" ? "completada": "pendiente",
    vence      : formatDate(task.due),
    descripcion: task.notes ?? "",
    parent     : task.parent,
    tasklist   : task.tasklistId,
  }));

  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json() as { title?: string; due?: string; notes?: string; parent?: string; tasklist?: string };
  if (!body.title?.trim()) {
    return new Response("Title required", { status: 400 });
  }

  const tasklistId = body.tasklist || "@default";
  const baseUrl = env.api.tasks.replace("/lists/@default/tasks", "");
  const url = new URL(`${baseUrl}/lists/${tasklistId}/tasks`);

  const requestBody: Record<string, string> = {
    title: body.title.trim(),
  };
  if (body.due) {
    const [y, m, d] = body.due.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0));
    requestBody.due = date.toISOString();
  }
  if (body.notes) requestBody.notes = body.notes.trim();
  if (body.parent) requestBody.parent = body.parent;

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  console.log("Request body:", requestBody);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google Tasks API error:", response.status, errorText);
    return new Response(`Google API error: ${response.status} - ${errorText}`, { status: 502 });
  }

  const created = await response.json();
  console.log("Google POST response:", created);

  return Response.json({
    item: {
      id         : created.id    ?? "",
      titulo     : created.title ?? body.title,
      estado     : "pendiente",
      vence      : formatDate(created.due),
      descripcion: created.notes ?? "",
      parent     : created.parent,
      tasklist   : created.tasklistId,
    },
  });
}