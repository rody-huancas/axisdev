import { useState, useCallback, useMemo } from "react";
import { sileo } from "sileo";
import { useTranslation } from "@/lib/i18n";
import { gmailApi, type GmailMessageFull } from "@/services/gmail-api";
import { cleanSnippet as cleanSnippetBase, formatGmailDate as formatGmailDateBase } from "@/lib/utils/gmail-utils";
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
      (item) =>
        item.asunto.toLowerCase().includes(lower) ||
        item.remitente.toLowerCase().includes(lower) ||
        item.snippet.toLowerCase().includes(lower),
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

  const sendReply = useCallback(
    async (text: string) => {
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
    },
    [selected, t],
  );

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

export const formatGmailDate = (iso: string, t: Record<string, any>): string => {
  return formatGmailDateBase(iso, t);
};

export const cleanSnippet = (snippet: string): string => {
  return cleanSnippetBase(snippet);
};
