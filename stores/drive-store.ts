import { create } from "zustand";
import type { DriveFile } from "@/services/google-service";

type DriveView = "grid" | "list";
type DriveTab  = "all" | "folders" | "files";

type DriveState = {
  files            : DriveFile[];
  query            : string;
  view             : DriveView;
  tab              : DriveTab;
  currentFolderId  : string | null;
  currentFolderName: string | null;
  selectedIds      : string[];
  isBulkMode       : boolean;
  setFiles         : (files: DriveFile[]) => void;
  setQuery         : (query: string) => void;
  setView          : (view: DriveView) => void;
  setTab           : (tab: DriveTab) => void;
  setCurrentFolder : (id: string | null, name: string | null) => void;
  toggleSelected   : (id: string) => void;
  clearSelection   : () => void;
  setBulkMode      : (enabled: boolean) => void;
};

export const useDriveStore = create<DriveState>((set) => ({
  files            : [],
  query            : "",
  view             : "grid",
  tab              : "all",
  currentFolderId  : null,
  currentFolderName: null,
  selectedIds      : [],
  isBulkMode       : false,

  setFiles: (files) => set({ files }),

  setQuery: (query) => set({ query }),

  setView: (view) => set({ view }),

  setTab: (tab) => set({ tab }),

  setCurrentFolder: (id, name) =>
    set({ currentFolderId: id, currentFolderName: name }),

  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id) ? state.selectedIds.filter((i) => i !== id) : [...state.selectedIds, id],
    })),

  clearSelection: () => set({ selectedIds: [] }),

  setBulkMode: (isBulkMode) =>
    set({
      isBulkMode,
      selectedIds: isBulkMode ? []: [],
    }),
}));
