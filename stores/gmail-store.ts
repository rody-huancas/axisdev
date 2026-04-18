import { create } from "zustand";
import type { GmailMensaje } from "@/services/google-service";

type GmailState = {
  messages   : GmailMensaje[];
  query      : string;
  page       : number;
  isLoading  : boolean;
  setMessages: (messages: GmailMensaje[]) => void;
  addMessage : (message: GmailMensaje) => void;
  setQuery   : (query: string) => void;
  setPage    : (page: number) => void;
  setLoading : (loading: boolean) => void;
};

export const useGmailStore = create<GmailState>((set) => ({
  messages : [],
  query    : "",
  page     : 1,
  isLoading: false,
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  
  setQuery: (query) => set({ query, page: 1 }),
  
  setPage: (page) => set({ page }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
