"use server";

import { auth } from "@/auth";

export const getGoogleAuthHeaders = async () => {
  const session     = await auth();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
