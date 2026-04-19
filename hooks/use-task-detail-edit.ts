"use client";

import { useEffect, useState } from "react";
import type { TareaPendiente } from "@/services/google-service";
import { parseDisplayDateToInput } from "@/lib/tasks-utils";

type UseTaskDetailEditParams = {
  task       : TareaPendiente | null;
  isEditOpen : boolean;
  onClose    : () => void;
  onEditClose: () => void;
  onUpdate   : (data: { title: string; due?: string; notes?: string }) => Promise<void>;
};

export function useTaskDetailEdit(params: UseTaskDetailEditParams) {
  const { task, isEditOpen, onClose, onEditClose, onUpdate } = params;

  const [editTitle, setEditTitle] = useState<string>("");
  const [editDue  , setEditDue  ] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    if (task && isEditOpen) {
      setEditTitle(task.titulo);
      setEditDue(parseDisplayDateToInput(task.vence || ""));
      setEditNotes(task.descripcion || "");
    }
  }, [task, isEditOpen]);

  const resetEdit = () => {
    setEditTitle("");
    setEditDue("");
    setEditNotes("");
  };

  const closeAll = () => {
    resetEdit();
    onEditClose();
    onClose();
  };

  const cancelEdit = () => {
    if (task) {
      setEditTitle(task.titulo);
      setEditDue(parseDisplayDateToInput(task.vence || ""));
      setEditNotes(task.descripcion || "");
    }
    onEditClose();
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    await onUpdate({
      title: editTitle.trim(),
      due  : editDue   || undefined,
      notes: editNotes || undefined,
    });
    closeAll();
  };

  return {
    editTitle,
    setEditTitle,
    editDue,
    setEditDue,
    editNotes,
    setEditNotes,
    closeAll,
    cancelEdit,
    saveEdit,
  };
}
