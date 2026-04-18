export const formatGmailDate = (iso: string, t: Record<string, any>): string => {
  const date = new Date(iso);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return t.pages.gmail.hoy;
  if (days === 1) return t.pages.gmail.ayer;
  if (days < 7) return `${days} ${t.pages.gmail.diasAtras}`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

export const cleanSnippet = (snippet: string): string => {
  if (!snippet) return "";
  return snippet
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .slice(0, 200);
};
