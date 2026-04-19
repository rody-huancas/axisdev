"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { usePageTranslations } from "@/lib/i18n";

type Props = {
  isOpen   : boolean;
  onClose  : () => void;
  onCreate : (data: { title: string; due?: string; notes?: string }) => Promise<void>;
  isLoading: boolean;
};

export const CreateTaskModal = ({ isOpen, onClose, onCreate, isLoading }: Props) => {
  const t = usePageTranslations();
  const [title, setTitle] = useState<string>("");
  const [due  , setDue  ] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onCreate({
      title: title.trim(),
      due  : due || undefined,
      notes: notes || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDue("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative z-10 flex h-dvh items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.25)]">
          <div className="flex items-center justify-between border-b border-(--axis-border) px-6 py-4">
            <h3 className="text-xl font-semibold text-(--axis-text)">
              {t.pages.tasks.newTask}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-muted) transition hover:bg-(--axis-surface) hover:text-(--axis-text)"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                {t.pages.tasks.titleField}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.pages.tasks.titlePlaceholder}
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) placeholder:text-(--axis-muted) focus:border-(--axis-accent) focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                {t.pages.tasks.dueDate}
              </label>
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) focus:border-(--axis-accent) focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-muted)">
                {t.pages.tasks.notes}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.pages.tasks.notesPlaceholder}
                rows={4}
                className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-4 text-base text-(--axis-text) placeholder:text-(--axis-muted) focus:border-(--axis-accent) focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-(--axis-border) px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !title.trim()}
                className="rounded-2xl bg-(--axis-accent) px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? t.pages.tasks.creating : t.pages.tasks.create}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
