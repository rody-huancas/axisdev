import { create } from "zustand";
import type { TareaPendiente } from "@/services/google-service";

type TaskStatus = "all" | "pendiente" | "completada";

type TaskState = {
  tasks       : TareaPendiente[];
  query       : string;
  status      : TaskStatus;
  page        : number;
  isLoading   : boolean;
  setTasks    : (tasks: TareaPendiente[]) => void;
  addTask     : (task: TareaPendiente) => void;
  updateTask  : (id: string, updates: Partial<TareaPendiente>) => void;
  removeTask  : (id: string) => void;
  setQuery    : (query: string) => void;
  setStatus   : (status: TaskStatus) => void;
  setPage     : (page: number) => void;
  setLoading  : (loading: boolean) => void;
  resetFilters: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks    : [],
  query    : "",
  status   : "all",
  page     : 1,
  isLoading: false,
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  
  setQuery: (query) => set({ query, page: 1 }),
  
  setStatus: (status) => set({ status, page: 1 }),
  
  setPage: (page) => set({ page }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  resetFilters: () => set({ query: "", status: "all", page: 1 }),
}));
