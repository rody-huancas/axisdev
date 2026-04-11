import { create } from "zustand";

type ThemeMode = "light" | "dark";

type ThemeState = {
  theme      : ThemeMode;
  setTheme   : (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme      : "light",
  setTheme   : (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
