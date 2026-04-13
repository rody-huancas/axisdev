import { googleApi } from "@/lib/axios-config";
import { formatDate } from "@/lib/utils/date-formatter";
import { mapMimeToTipo } from "@/lib/utils/mime-type-mapper";
import { handleAxiosError } from "@/lib/utils/google-api-error";
import { getGoogleAuthHeaders } from "@/actions/google/get-google-auth-headers";
import type { ServiceResult, ArchivoReciente, DriveFile, StorageInfo } from "@/lib/types/google-service";

export const fetchRecentFiles = async (): Promise<ServiceResult<ArchivoReciente[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await googleApi.get("/drive/v3/files", {
      headers,
      params: {
        pageSize: 12,
        fields  : "files(id,name,mimeType,modifiedTime,size)",
        orderBy : "modifiedTime desc",
      },
    });

    const files = (response.data?.files ?? []).map(
      (file: {
        id           : string;
        name         : string;
        mimeType     : string;
        modifiedTime?: string;
        size        ?: string;
      }) => ({
        id         : file.id,
        nombre     : file.name,
        mimeType   : file.mimeType,
        tipo       : mapMimeToTipo(file.mimeType),
        sizeBytes  : Number(file.size ?? 0),
        actualizado: formatDate(file.modifiedTime),
      }),
    );

    return { ok: true, data: files };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchDriveFiles = async (folderId: string = "root"): Promise<ServiceResult<DriveFile[]>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const resolvedFolderId = folderId && folderId !== "root" ? folderId : "root";
    const isRoot           = resolvedFolderId     === "root";
    const query            = `'${resolvedFolderId}' in parents and trashed = false`;

    const paramsBase = {
      q                        : query,
      fields                   : "nextPageToken, files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,thumbnailLink)",
      supportsAllDrives        : true,
      includeItemsFromAllDrives: true,
      corpora                  : isRoot ? "user" : "allDrives",
      spaces                   : "drive",
    };

    const allFiles : DriveFile[] = [];
    let   pageToken: string | undefined;

    do {
      const response = await googleApi.get("/drive/v3/files", {
        headers,
        params: {
          ...paramsBase,
          pageSize: 100,
          pageToken,
          orderBy: "folder, modifiedTime desc",
        },
      });

      const files = (response.data?.files ?? []).map(
        (file: {
          id            : string;
          name          : string;
          mimeType      : string;
          modifiedTime ?: string;
          size         ?: string;
          iconLink     ?: string;
          webViewLink  ?: string;
          thumbnailLink?: string;
        }) => ({
          id           : file.id,
          nombre       : file.name,
          mimeType     : file.mimeType,
          actualizado  : formatDate(file.modifiedTime),
          sizeBytes    : Number(file.size ?? 0),
          iconLink     : file.iconLink,
          webViewLink  : file.webViewLink,
          thumbnailLink: file.thumbnailLink,
        }),
      );

      allFiles.push(...files);
      pageToken = response.data?.nextPageToken ?? undefined;
    } while (pageToken && allFiles.length < 500);

    return { ok: true, data: allFiles };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};

export const fetchStorageInfo = async (): Promise<ServiceResult<StorageInfo>> => {
  try {
    const headers = await getGoogleAuthHeaders();
    if (!headers) {
      return { ok: false, error: "No hay una sesion valida." };
    }

    const response = await googleApi.get("/drive/v3/about", {
      headers,
      params: {
        fields: "storageQuota",
      },
    });

    const quota      = response.data?.storageQuota ?? {};
    const usage      = Number(quota.usage ?? 0);
    const limit      = Number(quota.limit ?? 0);
    const usedGb     = usage / 1024 / 1024 / 1024;
    const limitGb    = limit ? limit / 1024 / 1024 / 1024 : 0;
    const porcentaje = limit ? Math.round((usage / limit) * 100) : 0;

    return {
      ok  : true,
      data: {
        usadoGb : Number(usedGb.toFixed(1)),
        limiteGb: Number(limitGb.toFixed(1)),
        porcentaje,
      },
    };
  } catch (error) {
    return { ok: false, error: handleAxiosError(error) };
  }
};