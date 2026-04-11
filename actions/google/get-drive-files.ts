"use server";

import { auth } from "@/auth";
import type { GoogleDriveFilesResponse } from "@/types/google";

const driveEndpoint = "https://www.googleapis.com/drive/v3/files";

export const getRecentDriveFiles = async (): Promise<GoogleDriveFilesResponse> => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const url = new URL(driveEndpoint);
  url.searchParams.set("pageSize", "5");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set(
    "fields",
    "files(id,name,modifiedTime,iconLink,webViewLink)"
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch drive files");
  }

  return (await response.json()) as GoogleDriveFilesResponse;
};
