import axios from "axios";
import type { TareaPendiente } from "@/services/google-service";

export const tasksApi = {
  getAll: async (): Promise<TareaPendiente[]> => {
    const response = await axios.get("/api/tasks");
    return response.data.items;
  },

  create: async (data: { title: string; due?: string; notes?: string }): Promise<TareaPendiente> => {
    const response = await axios.post("/api/tasks", data);
    return response.data.item;
  },

  update: async (id: string, data: {
    title    ?: string;
    due      ?: string;
    notes    ?: string;
    completed?: boolean;
    tasklist ?: string;
    parent   ?: string;
  }): Promise<TareaPendiente> => {
    const response = await axios.patch(`/api/tasks/${id}`, data);
    return response.data.item;
  },

  delete: async (id: string, tasklist?: string, parent?: string): Promise<void> => {
    await axios.delete(`/api/tasks/${id}`, { data: { tasklist, parent } });
  },

  toggleComplete: async (id: string, completed: boolean, tasklist?: string): Promise<TareaPendiente> => {
    return tasksApi.update(id, { completed, tasklist });
  },
};