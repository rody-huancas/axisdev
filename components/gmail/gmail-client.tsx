"use client";

import { useMemo, useState } from "react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import type { GmailMensaje } from "@/services/google-service";
import { RiArrowLeftLine, RiEmailLine, RiInboxLine, RiMailLine, RiSearchLine, RiSpamLine, RiStarLine, RiTimeLine } from "react-icons/ri";

type GmailClientProps = {
  initialItems: GmailMensaje[];
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
  return snippet.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").slice(0, 120);
};

export const GmailClient = ({ initialItems }: GmailClientProps) => {
  const [items, setItems] = useState<GmailMensaje[]>(initialItems);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<GmailMensaje | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<"inbox" | "starred" | "snoozed" | "spam">("inbox");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSelect = (item: GmailMensaje) => {
    setSelected(item);
    setIsDetailOpen(true);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const url = new URL("/api/gmail/messages", window.location.origin);

    const run = async () => {
      const response = await fetch(url.toString());
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        if (response.status === 403 && text.includes("insufficient authentication scopes")) {
          throw new Error(
            "Falta permiso de Gmail. Cierra sesion y vuelve a entrar para aceptar los nuevos permisos.",
          );
        }
        throw new Error(text || `Error ${response.status}`);
      }
      const data = (await response.json()) as { items: GmailMensaje[] };
      setItems(data.items);
    };

    sileo.promise(run(), {
      loading: { title: "Cargando mensajes..." },
      success: { title: "Mensajes actualizados" },
      error: (err) => ({
        title: "No se pudo cargar",
        description: err instanceof Error ? err.message : undefined,
      }),
    });

    try {
      await run();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const run = async () => {
      const response = await fetch(`/api/gmail/messages/${id}/read`, { method: "POST" });
      if (!response.ok) {
        throw new Error("No se pudo marcar como ledo");
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item } : item)),
      );
    };

    sileo.promise(run(), {
      loading: { title: "Marcando como ledo..." },
      success: { title: "Marcado" },
      error: { title: "Error" },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-(--axis-border) pb-5">
        <div className="relative flex-1 lg:max-w-md">
          <RiSearchLine
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--axis-muted)"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar mensajes..."
            className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) py-3 pl-11 pr-4 text-sm text-(--axis-text) placeholder:text-(--axis-muted) focus:border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--axis-accent)_22%,transparent)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
        {(["inbox", "starred", "snoozed", "spam"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
              tab === value
                ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
                : "text-(--axis-muted) hover:text-(--axis-text)",
            )}
          >
            {value === "inbox" && <RiInboxLine className="mr-2 inline h-4 w-4" />}
            {value === "starred" && <RiStarLine className="mr-2 inline h-4 w-4" />}
            {value === "snoozed" && <RiTimeLine className="mr-2 inline h-4 w-4" />}
            {value === "spam" && <RiSpamLine className="mr-2 inline h-4 w-4" />}
            {value === "inbox" ? "Recibidos" : value === "starred" ? "Destacados" : value === "snoozed" ? "Pospuestos" : "Spam"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length ? (
          <div className="grid gap-2">
            {filtered.map((item) => (
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--axis-border) bg-(--axis-surface-strong)">
                  <RiMailLine className="h-5 w-5 text-(--axis-muted)" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--axis-text)">{item.remitente}</p>
                  <p className="mt-0.5 truncate text-xs text-(--axis-muted)">{item.asunto}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-(--axis-muted)">{getSnippetClean(item.snippet)}</p>
                </div>
                <span className="shrink-0 text-xs text-(--axis-muted)">{formatDate(new Date().toISOString())}</span>
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

      {isDetailOpen && selected && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsDetailOpen(false)} />
          <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
              <div className="flex items-start justify-between gap-4 border-b border-(--axis-border) px-6 py-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-(--axis-muted)">Mensaje</p>
                  <h3 className="mt-2 truncate text-lg font-semibold text-(--axis-text)">{selected.asunto}</h3>
                  <p className="mt-1 text-sm text-(--axis-muted)">{selected.remitente}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text)"
                >
                  <RiArrowLeftLine className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60dvh] overflow-auto px-6 py-4">
                <div className="whitespace-pre-wrap text-sm text-(--axis-text)">{selected.snippet}</div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-(--axis-border) bg-(--axis-surface) px-6 py-4">
                <button
                  type="button"
                  className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
                >
                  Responder
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-2xl border border-(--axis-border) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};