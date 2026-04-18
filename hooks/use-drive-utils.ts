export const formatFileSize = (value: number): string => {
  if (!value) return "-";
  
  const units     = ["B", "KB", "MB", "GB"];
  let   size      = value;
  let   unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const getFileExtension = (name: string): string => {
  const parts = name.split(".");
  if (parts.length <= 1) return "";
  return parts.pop()?.toLowerCase() ?? "";
};
