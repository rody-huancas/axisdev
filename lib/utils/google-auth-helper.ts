import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";

export const withAuthHeaders = async () => {
  const headers = await getGoogleAuthHeaders();
  if (!headers) {
    return { ok: false, error: "No hay una sesion valida." } as const;
  }
  return { ok: true, headers } as const;
};