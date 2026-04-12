"use server";

import { auth } from "@/auth";
import { env } from "@/lib/env";

const driveEndpoint = env.api.drive;

type CreateFolderInput = {
  name: string;
  parentId?: string | null;
};

export const createDriveFolder = async ({ name, parentId }: CreateFolderInput) => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const body: {
    name: string;
    mimeType: string;
    parents?: string[];
  } = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentId && parentId !== "root") {
    body.parents = [parentId];
  }

  const response = await fetch(`${driveEndpoint}?supportsAllDrives=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to create drive folder");
  }

  return response.json();
};
