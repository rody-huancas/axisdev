import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { useTranslation } from "@/lib/i18n";
import type { DriveFile } from "@/services/google-service";
import { driveApi, folderApi, uploadApi } from "@/services/drive-api";

export type DriveView = "grid" | "list";
export type DriveTab  = "all" | "folders" | "files";

interface Props {
  files             : DriveFile[],
  currentFolderId  ?: string | null,
  currentFolderName?: string | null,
}

export const useDrive = (props: Props) => {
  const { files, currentFolderId, currentFolderName } = props;

  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [query          , setQuery          ] = useState<string>("");
  const [view           , setView           ] = useState<DriveView>("grid");
  const [tab            , setTab            ] = useState<DriveTab>("all");
  const [selected       , setSelected       ] = useState<DriveFile | null>(null);
  const [selectedIds    , setSelectedIds    ] = useState<string[]>([]);
  const [isBulkMode     , setIsBulkMode     ] = useState<boolean>(false);
  const [isLoading      , setIsLoading      ] = useState<boolean>(false);
  const [modalType      , setModalType      ] = useState<"folder" | "upload" | null>(null);
  const [uploadFilesList, setUploadFilesList] = useState<File[]>([]);
  const [folderName     , setFolderName     ] = useState<string>("");
  const [isDragging     , setIsDragging     ] = useState<boolean>(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [selected]);

  const filtered = useMemo(() => {
    if (!query) return files;
    const lower = query.toLowerCase();
    return files.filter((file) => file.nombre.toLowerCase().includes(lower));
  }, [files, query]);

  const folders = useMemo(
    () => filtered.filter((file) => file.mimeType === "application/vnd.google-apps.folder"),
    [filtered],
  );

  const documents = useMemo(
    () => filtered.filter((file) => file.mimeType !== "application/vnd.google-apps.folder"),
    [filtered],
  );

  const visibleItems = useMemo(
    () => (tab === "folders" ? folders : tab === "files" ? documents : filtered),
    [tab, folders, documents, filtered],
  );

  const inFolder = Boolean(currentFolderId && currentFolderId !== "root");

  const openFolderModal = useCallback(() => setModalType("folder"), []);
  const openUploadModal = useCallback(() => setModalType("upload"), []);
  const closeModal = useCallback(() => {
    setModalType(null);
    setFolderName("");
    setUploadFilesList([]);
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await driveApi.getFiles(currentFolderId);
    } catch {
      sileo.error({ title: t.pages.drive.loadError });
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, t]);

  const handleCreateFolder = useCallback(async () => {
    const trimmed = folderName.trim();
    if (!trimmed) {
      sileo.error({ title: t.pages.drive.nameRequired, description: t.pages.drive.writeFolderName });
      return;
    }

    setIsLoading(true);
    try {
      await folderApi.create(trimmed, currentFolderId);
      sileo.success({ title: t.pages.drive.folderCreated });
      closeModal();
      router.refresh();
    } catch {
      sileo.error({ title: t.pages.drive.folderFailed });
    } finally {
      setIsLoading(false);
    }
  }, [folderName, currentFolderId, router, t, closeModal]);

  const handleUploadFiles = useCallback(async () => {
    if (!uploadFilesList.length) {
      sileo.warning({ title: t.pages.drive.selectFiles, description: t.pages.drive.addFiles });
      return;
    }

    setIsLoading(true);
    try {
      await uploadApi.uploadMultiple(uploadFilesList, currentFolderId);
      sileo.success({ title: t.pages.drive.filesUploaded });
      closeModal();
      router.refresh();
    } catch {
      sileo.error({ title: t.pages.drive.uploadFailed });
    } finally {
      setIsLoading(false);
    }
  }, [uploadFilesList, currentFolderId, router, t, closeModal]);

  const downloadItems = useCallback(async (ids: string[]) => {
    if (!ids.length) {
      sileo.warning({ title: t.pages.drive.selectFiles, description: t.pages.drive.chooseFiles });
      return;
    }

    try {
      const blob = await driveApi.download(ids);
      const filename = driveApi.getFilenameFromHeaders(null);
      driveApi.triggerDownload(blob, filename);
      sileo.success({ title: t.pages.drive.downloadReady });
    } catch (err) {
      sileo.error({
        title: t.pages.drive.downloadFailed,
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }, [t]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const exitBulkMode = useCallback(() => {
    setIsBulkMode(false);
    clearSelection();
  }, [clearSelection]);

  const activateItem = useCallback((file: DriveFile) => {
    if (isBulkMode) {
      toggleSelection(file.id);
      return;
    }
    if (file.mimeType === "application/vnd.google-apps.folder") {
      router.push(`/drive?folder=${encodeURIComponent(file.id)}&name=${encodeURIComponent(file.nombre)}`);
      router.refresh();
      return;
    }
    setSelected(file);
  }, [isBulkMode, toggleSelection, router]);

  const handleSelectUploadFiles = useCallback((filesList: FileList | null) => {
    if (!filesList?.length) return;
    const selectedFiles = Array.from(filesList);
    setUploadFilesList((prev) => {
      const seen = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const next = [...prev];
      selectedFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          next.push(file);
        }
      });
      return next;
    });
  }, []);

  const handleRemoveUpload = useCallback((fileToRemove: File) => {
    const keyToRemove = `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`;
    setUploadFilesList((prev) =>
      prev.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== keyToRemove),
    );
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleSelectUploadFiles(event.dataTransfer.files);
  }, [handleSelectUploadFiles]);

  const handleUploadInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectUploadFiles(event.target.files);
    event.target.value = "";
  }, [handleSelectUploadFiles]);

  return {
    query,
    setQuery,
    view,
    setView,
    tab,
    setTab,
    selected,
    setSelected,
    selectedIds,
    isBulkMode,
    setIsBulkMode,
    isLoading,
    isModalOpen: modalType !== null,
    modalType,
    uploadFiles: uploadFilesList,
    setUploadFiles: setUploadFilesList,
    folderName,
    setFolderName,
    isDragging,
    setIsDragging,
    filtered,
    folders,
    documents,
    visibleItems,
    inFolder,
    currentFolderName,
    fileInputRef,
    openFolderModal,
    openUploadModal,
    closeModal,
    refresh,
    handleCreateFolder,
    handleUploadFiles,
    downloadItems,
    activateItem,
    toggleSelection,
    clearSelection,
    exitBulkMode,
    handleSelectUploadFiles,
    handleRemoveUpload,
    handleDrop,
    handleUploadInputChange,
  };
};
