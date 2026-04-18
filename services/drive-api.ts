import axios from "axios";
import type { DriveFile } from "@/services/google-service";

export const driveApi = {
  download: async (ids: string[]): Promise<Blob> => {
    const response = await axios.post("/api/drive/download", { ids }, {
      responseType: "blob",
    });
    return response.data;
  },

  getFilenameFromHeaders: (contentDisposition: string | null): string => {
    const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
    return filenameMatch?.[1] ?? `drive-download-${Date.now()}.zip`;
  },

  triggerDownload: (blob: Blob, filename: string): void => {
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href     = url;
    link.download = filename;
    
    document.body.appendChild(link);

    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  getFileById: async (id: string): Promise<DriveFile> => {
    const response = await axios.get(`/api/drive/files/${id}`);
    return response.data.item;
  },

  getFiles: async (folderId?: string | null): Promise<DriveFile[]> => {
    const params: Record<string, string> = {};
    if (folderId && folderId !== "root") {
      params.folderId = folderId;
    }
    const response = await axios.get("/api/drive/files", { params });
    return response.data.items;
  },
};

export const folderApi = {
  create: async (name: string, parentId?: string | null): Promise<DriveFile> => {
    const response = await axios.post("/api/drive/folders", { name, parentId });
    return response.data.item;
  },
};

export const uploadApi = {
  uploadFile: async (file: File, parentId?: string | null): Promise<DriveFile> => {
    const formData = new FormData();
    formData.append("file", file);

    if (parentId) {
      formData.append("parentId", parentId);
    }

    const response = await axios.post("/api/drive/upload", formData);
    return response.data.item;
  },

  uploadMultiple: async (files: File[], parentId?: string | null): Promise<DriveFile[]> => {
    return Promise.all(files.map((file) => uploadApi.uploadFile(file, parentId)));
  },
};
