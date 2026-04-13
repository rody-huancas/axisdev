export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("es-ES", {
    day  : "2-digit",
    month: "short",
    year : "numeric",
  });
};