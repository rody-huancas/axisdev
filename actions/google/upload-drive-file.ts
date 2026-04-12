"use server";

import { auth } from "@/auth";
import { env } from "@/lib/env";

const uploadEndpoint = env.api.driveUpload;

type UploadDriveFileInput = {
  file: File;
  parentId?: string | null;
};

export const uploadDriveFile = async ({ file, parentId }: UploadDriveFileInput) => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const metadata: { name: string; parents?: string[] } = {
    name: file.name,
  };

  if (parentId && parentId !== "root") {
    metadata.parents = [parentId];
  }

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", file);

  const response = await fetch(`${uploadEndpoint}?uploadType=multipart&supportsAllDrives=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload drive file");
  }

  return response.json();
};
