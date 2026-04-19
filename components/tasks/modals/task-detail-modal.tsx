"use client";

import { RiCloseLine, RiDeleteBin6Line, RiEditLine, RiCheckboxCircleLine, RiCheckboxLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import type { TareaPendiente } from "@/services/google-service";
import { useTaskDetailEdit } from "@/hooks/use-task-detail-edit";

type Props = {
  task       : TareaPendiente | null;
  isOpen     : boolean;
  isEditOpen : boolean;
  onClose    : () => void;
  onEditOpen : () => void;
  onEditClose: () => void;
  onUpdate   : (data: { title: string; due?: string; notes?: string }) => Promise<void>;
  onToggle   : (completed: boolean) => Promise<void>;
  onDelete   : () => Promise<void>;
  isLoading  : boolean;
};

export const TaskDetailModal = (props: Props) => {
  const { t } = useTranslation();
  const { task, isOpen, isEditOpen, onClose, onEditOpen, onEditClose, onUpdate, onToggle, onDelete, isLoading } = props;

  const {
    editTitle,
    setEditTitle,
    editDue,
    setEditDue,
    editNotes,
    setEditNotes,
    closeAll,
    cancelEdit,
    saveEdit,
  } = useTaskDetailEdit({ task, isEditOpen, onClose, onEditClose, onUpdate });

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={closeAll} />
      <div className="relative z-10 flex h-dvh items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="flex items-center justify-between border-b border-(--axis-border) px-6 py-4">
            <h3 className="text-xl font-semibold text-(--axis-text)">{t.pages.tasks.detail || "Detalle"}</h3>
            <button
              type="button"
              onClick={closeAll}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text)"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            {isEditOpen ? (
              <>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                    {t.pages.tasks.titleField || "Titulo"}
                  </label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) focus:border-(--axis-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                    {t.pages.tasks.dueDate || "Fecha limite"}
                  </label>
                  <input
                    type="date"
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                    className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) focus:border-(--axis-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                    {t.pages.tasks.notes || "Notas / Detalles"}
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) placeholder:text-(--axis-muted) focus:border-(--axis-accent) focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-2xl border border-(--axis-border) px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={isLoading || !editTitle.trim()}
                    className="rounded-2xl bg-(--axis-accent) px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? t.common.saving : t.common.save}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-accent)">
                      {t.pages.tasks.title || "Tarea"}
                    </p>
                  <p
                    className={cn(
                      "text-xl font-semibold text-(--axis-text)",
                      task.estado === "completada" && "line-through text-(--axis-muted)",
                    )}
                  >
                    {task.titulo}
                  </p>
                </div>

                {task.vence && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-accent)">
                      {t.pages.tasks.due || "Vence"}
                    </p>
                    <p className="text-base text-(--axis-text)">{task.vence}</p>
                  </div>
                )}

                {task.descripcion && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-accent)">
                      {t.pages.tasks.notes || "Notas"}
                    </p>
                    <p className="whitespace-pre-wrap text-base text-(--axis-text)">
                      {task.descripcion}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onDelete}
                    disabled={isLoading}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-400 transition hover:bg-rose-500/20 disabled:opacity-50"
                  >
                    <RiDeleteBin6Line className="mr-2 inline h-4 w-4" />
                    {isLoading ? t.pages.tasks.deleting : t.pages.tasks.delete}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onEditOpen}
                      className="flex items-center gap-2 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface)"
                    >
                      <RiEditLine className="h-4 w-4" />
                      {t.pages.tasks.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggle(task.estado === "pendiente")}
                      className="flex items-center gap-2 rounded-2xl bg-(--axis-accent) px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                    >
                      {task.estado === "pendiente" ? (
                        <>
                          <RiCheckboxCircleLine className="h-4 w-4" />
                          {t.pages.tasks.complete}
                        </>
                      ) : (
                        <>
                          <RiCheckboxLine className="h-4 w-4" />
                          {t.pages.tasks.reopen}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
