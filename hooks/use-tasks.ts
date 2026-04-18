"use client";

import { useState, useCallback, useMemo } from "react";
import { sileo } from "sileo";
import type { TareaPendiente } from "@/services/google-service";
import { tasksApi } from "@/services/tasks-api";
import { useTranslation } from "@/lib/i18n";
import { calculatePageCount, filterTasksByStatus, sortTasks } from "@/lib/tasks-utils";

type TaskFilters = "all" | "pendiente" | "completada";

export const useTasks = (initialTasks: TareaPendiente[]) => {
  const { t } = useTranslation();
  
  const [tasks       , setTasks       ] = useState<TareaPendiente[]>(initialTasks);
  const [query       , setQuery       ] = useState<string>("");
  const [status      , setStatus      ] = useState<TaskFilters>("all");
  const [page        , setPage        ] = useState<number>(1);
  const [isLoading   , setIsLoading   ] = useState<boolean>(false);
  const [selected    , setSelected    ] = useState<TareaPendiente | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const filtered = useMemo(() => {
    let result = tasks;

    if (query) {
      const lower = query.toLowerCase();
      result = result.filter((t) => t.titulo.toLowerCase().includes(lower));
    }

    return filterTasksByStatus(result, status);
  }, [tasks, query, status]);

  const sorted     = useMemo(() => sortTasks(filtered, "date"), [filtered]);
  const totalPages = calculatePageCount(sorted.length);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await tasksApi.getAll();
      setTasks(items);
      setPage(1);
    } catch {
      sileo.error({ title: t.pages.tasks.loadError });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const createTask = useCallback(async (data: { title: string; due?: string; notes?: string }) => {
    setIsLoading(true);
    try {
      const task = await tasksApi.create(data);
      setTasks((prev) => [task, ...prev]);
      sileo.success({ title: t.pages.tasks.taskCreated });
    } catch {
      sileo.error({ title: t.pages.tasks.createError });
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const updateTask = useCallback(async (data: { title: string; due?: string; notes?: string }) => {
    if (!selected) return;
    setIsLoading(true);
    try {
      const task = await tasksApi.update(selected.id, {
        title   : data.title,
        due     : data.due,
        notes   : data.notes,
        tasklist: selected.tasklist,
        parent  : selected.parent,
      });
      
      setTasks((prev) => prev.map((t) => (t.id === selected.id ? task : t)));
      setSelected(task);
      setIsDetailOpen(false);
      sileo.success({ title: t.pages.tasks.taskUpdated });
    } catch {
      sileo.error({ title: t.pages.tasks.updateError });
    } finally {
      setIsLoading(false);
    }
  }, [selected, t]);

  const toggleTask = useCallback((task: TareaPendiente, completed: boolean) => {
    const taskId = task.id;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, estado: completed ? "completada" : "pendiente" } : t)),
    );
    
    sileo.promise(
      tasksApi.toggleComplete(taskId, completed, task.tasklist),
      {
        loading: { title: completed ? t.pages.tasks.completing : t.pages.tasks.reopening },
        success: { title: completed ? t.pages.tasks.taskCompleted : t.pages.tasks.taskOpen },
        error  : { title: t.pages.tasks.updateError },
      },
    );
  }, [t]);

  const deleteTask = useCallback(async (task: TareaPendiente) => {
    sileo.promise(
      (async () => {
        await tasksApi.delete(task.id, task.tasklist, task.parent);
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
      })(),
      {
        loading: { title: t.pages.tasks.deleting },
        success: { title: t.pages.tasks.taskDeleted },
        error  : { title: t.pages.tasks.deleteError },
      },
    );
  }, [t]);

  const openDetail = useCallback((task: TareaPendiente) => {
    setSelected(task);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelected(null);
  }, []);

  return {
    tasks,
    query,
    setQuery,
    status,
    setStatus,
    page,
    setPage,
    isLoading,
    selected,
    isDetailOpen,
    isCreateOpen,
    setIsCreateOpen,
    filtered,
    sorted,
    totalPages,
    refresh,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    openDetail,
    closeDetail,
    setSelected,
  };
};
