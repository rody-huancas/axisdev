import { useState, useCallback, useMemo } from "react";
import { sileo } from "sileo";
import { useTranslation } from "@/lib/i18n";
import { gmailApi, type GmailMessageFull } from "@/services/gmail-api";
import type { GmailMensaje } from "@/services/google-service";

const ITEMS_PER_PAGE = 20;

export const useGmail = (initialMessages: GmailMensaje[]) => {
  const { t } = useTranslation();
  
  const [messages    , setMessages    ] = useState<GmailMensaje[]>(initialMessages);
  const [query       , setQuery       ] = useState<string>("");
  const [page        , setPage        ] = useState<number>(1);
  const [isLoading   , setIsLoading   ] = useState<boolean>(false);
  const [selected    , setSelected    ] = useState<GmailMessageFull | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const filtered = useMemo(() => {
    if (!query) return messages;
    const lower = query.toLowerCase();
    return messages.filter(
      (item) => item.asunto.toLowerCase().includes(lower) || item.remitente.toLowerCase().includes(lower) || item.snippet.toLowerCase().includes(lower),
    );
  }, [messages, query]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await gmailApi.getMessages();
      setMessages(items);
      setPage(1);
    } catch {
      sileo.error({ title: t.pages.gmail.error });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const selectMessage = useCallback(async (item: GmailMensaje) => {
    setIsLoading(true);
    try {
      const full = await gmailApi.getMessageById(item.id);
      setSelected(full);
      setIsDetailOpen(true);
    } catch {
      setSelected(item);
      setIsDetailOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendReply = useCallback(async (text: string) => {
    if (!text.trim() || !selected) return;
    setIsLoading(true);
    try {
      await gmailApi.sendReply(selected.id, text);
      sileo.success({ title: t.pages.gmail.sent });
    } catch {
      sileo.error({ title: t.pages.gmail.sendError });
    } finally {
      setIsLoading(false);
    }
  }, [selected, t]);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelected(null);
  }, []);

  return {
    messages,
    query,
    setQuery,
    page,
    setPage,
    isLoading,
    selected,
    isDetailOpen,
    filtered,
    paginatedItems,
    totalPages,
    refresh,
    selectMessage,
    sendReply,
    closeDetail,
    setSelected,
  };
};

export const formatGmailDate = (iso: string, t: any): string => {
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
  return snippet.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").slice(0, 200);
};
