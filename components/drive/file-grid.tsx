"use client";

import type { DriveFile } from "@/services/google-service";
import { useDrive } from "@/hooks/use-drive";
import { DriveTabs } from "./drive-tabs";
import { UploadModal } from "./upload-modal";
import { DriveToolbar } from "./drive-toolbar";
import { FileGridItem } from "@/components/drive/file-grid-item";
import { useTranslation } from "@/lib/i18n";
import { DriveBreadcrumb } from "./drive-breadcrumb";
import { BulkDownloadBar } from "./bulk-download-bar";
import { DriveEmptyState } from "./drive-empty-state";
import { FilePreviewModal } from "@/components/drive/file-preview-modal";
import { CreateFolderModal } from "./create-folder-modal";

type FileGridProps = {
  files             : DriveFile[];
  currentFolderId  ?: string | null;
  currentFolderName?: string | null;
};

export const FileGrid = ({ files, currentFolderId, currentFolderName }: FileGridProps) => {
  const { t } = useTranslation();
  
  const {
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
    visibleItems,
    folders,
    documents,
    inFolder,
    modalType,
    openFolderModal,
    openUploadModal,
    closeModal,
    folderName,
    setFolderName,
    uploadFiles,
    setUploadFiles,
    isDragging,
    setIsDragging,
    handleCreateFolder,
    handleUploadFiles,
    downloadItems,
    toggleSelection,
    exitBulkMode,
    activateItem,
    handleRemoveUpload,
    handleDrop,
    handleUploadInputChange,
    fileInputRef,
  } = useDrive({ files, currentFolderId, currentFolderName });

  const isFolderModalOpen = modalType === "folder";
  const isUploadModalOpen = modalType === "upload";

  return (
    <div className="space-y-5">
      <DriveBreadcrumb
        inFolder={inFolder}
        currentFolderName={currentFolderName}
        onBack={() => {}}
        t={t}
      />

      <DriveToolbar
        query={query}
        onQueryChange={setQuery}
        view={view}
        onViewChange={setView}
        isBulkMode={isBulkMode}
        onBulkModeToggle={() => isBulkMode ? exitBulkMode() : setIsBulkMode(true)}
        onCreateFolder={openFolderModal}
        onUpload={openUploadModal}
        t={t}
      />

      {isBulkMode && (
        <BulkDownloadBar
          selectedCount={selectedIds.length}
          onDownload={() => downloadItems(selectedIds)}
          onCancel={exitBulkMode}
          isLoading={isLoading}
          t={t}
        />
      )}

      <CreateFolderModal
        isOpen={isFolderModalOpen}
        folderName={folderName}
        onFolderNameChange={setFolderName}
        onSubmit={handleCreateFolder}
        onClose={closeModal}
        isLoading={isLoading}
        t={t}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        uploadFiles={uploadFiles}
        isDragging={isDragging}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onInputChange={handleUploadInputChange}
        onRemoveFile={handleRemoveUpload}
        onClearFiles={() => setUploadFiles([])}
        onClose={closeModal}
        onSubmit={handleUploadFiles}
        t={t}
      />

      <DriveTabs
        tab={tab}
        onTabChange={setTab}
        foldersCount={folders.length}
        filesCount={documents.length}
        t={t}
      />

      {visibleItems.length ? (
        <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
          {visibleItems.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              view={view}
              isBulkMode={isBulkMode}
              isSelected={selectedIds.includes(file.id)}
              onSelect={() => toggleSelection(file.id)}
              onActivate={() => activateItem(file)}
              onDownload={() => downloadItems([file.id])}
              t={t}
            />
          ))}
        </div>
      ) : (
        <DriveEmptyState hasQuery={!!query} t={t} />
      )}

      <FilePreviewModal file={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
