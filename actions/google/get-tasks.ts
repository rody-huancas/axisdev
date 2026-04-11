"use server";

import { auth } from "@/auth";
import type { GoogleTasksResponse } from "@/types/google";

const tasksEndpoint = "https://tasks.googleapis.com/tasks/v1/lists/@default/tasks";

export const getTasksPreview = async (): Promise<GoogleTasksResponse> => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const url = new URL(tasksEndpoint);
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("showCompleted", "true");
  url.searchParams.set("showHidden", "false");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return (await response.json()) as GoogleTasksResponse;
};
