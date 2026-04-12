"use client";

import { useMemo, useState } from "react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import type { GmailMensaje } from "@/services/google-service";
import { RiArrowLeftLine, RiDeleteBin6Line, RiInboxLine, RiMailLine, RiRefreshLine, RiReplyLine, RiSearchLine, RiSpamLine, RiStarLine, RiTimeLine } from "react-icons/ri";

type GmailClientProps = {
  initialItems: GmailMensaje[];
};

type GmailMessageFull = GmailMensaje & {
  fecha?: string;
  destinatario?: string;
  htmlContent?: string;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `${days} dias atras`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

const getSnippetClean = (snippet: string) => {
  if (!snippet) return "";
  return snippet.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").slice(0, 200);
};

const ITEMS_PER_PAGE = 20;

export const GmailClient = ({ initialItems }: GmailClientProps) => {
  const [items, setItems] = useState<GmailMensaje[]>(initialItems);
  const [query, setQuery] = useState<string>("");
  const [tab, setTab] = useState<"inbox" | "starred" | "snoozed" | "spam">("inbox");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<GmailMessageFull | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  const filtered = useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.asunto.toLowerCase().includes(lower) ||
        item.remitente.toLowerCase().includes(lower) ||
        item.snippet.toLowerCase().includes(lower),
    );
  }, [items, query]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleSelect = async (item: GmailMensaje) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/gmail/messages/${item.id}`);
      if (!response.ok) throw new Error("Error");
      const data = await response.json() as { item: GmailMessageFull };
      setSelected(data.item);
      setIsDetailOpen(true);
    } catch {
      setSelected(item);
      setIsDetailOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setIsLoading(true);
    const run = async () => {
      const response = await fetch(`/api/gmail/messages/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText }),
      });
      if (!response.ok) throw new Error("Error");
      setIsReplyOpen(false);
      setReplyText("");
    };
    sileo.promise(run(), {
      loading: { title: "Enviando..." },
      success: { title: "Enviado" },
      error: { title: "Error al enviar" },
    });
    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const url = new URL("/api/gmail/messages", window.location.origin);

    const run = async () => {
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Error");
      const data = (await response.json()) as { items: GmailMensaje[] };
      setItems(data.items);
      setPage(1);
    };

    sileo.promise(run(), {
      loading: { title: "Actualizando..." },
      success: { title: "Actualizado" },
      error: { title: "Error" },
    });

    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 lg:max-w-md">
          <RiSearchLine
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--axis-muted)"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar mensajes..."
            className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
          />
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-accent) disabled:opacity-50"
          title="Actualizar"
        >
          <RiRefreshLine className={cn("h-5 w-5", isLoading && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-2">
        {paginatedItems.length ? (
          <div className="grid gap-2">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(item);
                  }
                }}
                className="group flex items-start gap-4 rounded-2xl border border-(--axis-border) bg-(--axis-surface) p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))] hover:bg-(--axis-surface-strong) hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--axis-border) bg-(--axis-accent)/10">
                  <RiMailLine className="h-5 w-5 text-(--axis-accent)" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--axis-text)">{item.remitente}</p>
                  <p className="mt-0.5 truncate text-xs font-medium text-(--axis-muted)">{item.asunto}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-(--axis-muted)">{getSnippetClean(item.snippet)}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-(--axis-muted)">{formatDate(new Date().toISOString())}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--axis-border) bg-[color-mix(in_srgb,var(--axis-bg)_40%,transparent)] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--axis-surface-strong) ring-1 ring-(--axis-border)">
              <RiInboxLine className="h-7 w-7 text-(--axis-muted)" />
            </div>
            <p className="mt-4 text-sm font-semibold text-(--axis-text)">No hay mensajes</p>
            <p className="mt-1 max-w-sm text-sm text-(--axis-muted)">
              {query ? "Prueba otro termino de busqueda." : "Tu bandeja de entrada esta vacia."}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs text-(--axis-muted)">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--axis-text) transition hover:bg-(--axis-surface) disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {isDetailOpen && selected && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsDetailOpen(false)} />
          <div className="relative z-10 flex h-dvh items-center justify-center p-4">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-start justify-between gap-4 border-b border-(--axis-border) px-6 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-(--axis-accent)">Mensaje</p>
                  <h3 className="mt-2 truncate text-xl font-semibold text-(--axis-text)">{selected.asunto}</h3>
                  <p className="mt-1 text-sm text-(--axis-muted)">{selected.remitente}</p>
                  {selected.fecha && <p className="mt-1 text-xs text-(--axis-muted)">{selected.fecha}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text)"
                >
                  <RiArrowLeftLine className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[55dvh] overflow-y-auto px-6 py-5">
                {selected.htmlContent ? (
                  <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.htmlContent }} />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-(--axis-text)">{selected.snippet || "Sin contenido"}</div>
                )}
              </div>

              <div className="shrink-0 flex items-center justify-between gap-3 border-t border-(--axis-border) bg-(--axis-surface) px-6 py-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReplyOpen(true)}
                    className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface)"
                  >
                    <RiReplyLine className="h-4 w-4" />
                    Responder
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-text) transition hover:bg-(--axis-surface)"
                  >
                    <RiReplyLine className="h-4 w-4 rotate-180" />
                    Reenviar
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-amber-400"
                    title="Destacar"
                  >
                    <RiStarLine className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-red-400"
                    title="Marcar como spam"
                  >
                    <RiSpamLine className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-red-500"
                    title="Eliminar"
                  >
                    <RiDeleteBin6Line className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isReplyOpen && (
                <div className="border-t border-(--axis-border) bg-(--axis-surface-strong) p-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-3 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReplyOpen(false)}
                      className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface)"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleReply}
                      disabled={isLoading || !replyText.trim()}
                      className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};