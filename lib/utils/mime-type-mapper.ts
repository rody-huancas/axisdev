export const mapMimeToTipo = (mimeType: string) => {
  if (mimeType.includes("folder"))       return "Carpeta";
  if (mimeType.includes("pdf"))          return "PDF";
  if (mimeType.includes("spreadsheet"))  return "Hoja";
  if (mimeType.includes("presentation")) return "Slides";
  if (mimeType.includes("image"))        return "Imagen";
  if (mimeType.includes("video"))        return "Video";
  return "Archivo";
};