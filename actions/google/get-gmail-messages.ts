"use server";

import { auth } from "@/auth";
import type { GoogleGmailListResponse, GoogleGmailMessage } from "@/types/google";

const gmailListEndpoint = "https://gmail.googleapis.com/gmail/v1/users/me/messages";

const gmailMessageEndpoint = (messageId: string) => `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;

const fetchMessage = async (accessToken: string, messageId: string) => {
  const url = new URL(gmailMessageEndpoint(messageId));
  url.searchParams.set("format", "metadata");
  url.searchParams.append("metadataHeaders", "Subject");
  url.searchParams.append("metadataHeaders", "From");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as GoogleGmailMessage & {
    payload?: { headers?: Array<{ name: string; value: string }> };
  };
};

export const getGmailPreview = async (): Promise<GoogleGmailMessage[]> => {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("Missing Google access token");
  }

  const listUrl = new URL(gmailListEndpoint);
  listUrl.searchParams.set("maxResults", "5");
  listUrl.searchParams.set("labelIds", "INBOX");

  const listResponse = await fetch(listUrl.toString(), {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!listResponse.ok) {
    throw new Error("Failed to fetch gmail list");
  }

  const listData = (await listResponse.json()) as GoogleGmailListResponse;
  const messages = listData.messages ?? [];

  const detailData = await Promise.all(
    messages.map((message) => fetchMessage(session.accessToken as string, message.id))
  );

  return detailData.filter(Boolean) as GoogleGmailMessage[];
};
