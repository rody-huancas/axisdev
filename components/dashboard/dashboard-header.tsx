"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RiMessage3Line, RiMoonLine, RiNotification3Line, RiSearchLine, RiSunLine } from "react-icons/ri";

import { useThemeStore } from "@/lib/store/theme";

type DashboardHeaderProps = {
  userName  : string;
  userEmail?: string | null;
  userImage?: string | null;
};

export const DashboardHeader = ({ userName, userEmail, userImage }: DashboardHeaderProps) => {
  const theme       = useThemeStore((state) => state.theme);
  const setTheme    = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem("axisdev-theme") as | "light" | "dark" | null;

    if (stored) {
      setTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    
    setTheme(prefersDark ? "dark" : "light");
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("axisdev-theme", theme);
  }, [theme]);

  return (
    <div className="fixed left-0 right-0 top-16 z-30 px-5 lg:top-6 lg:pl-82 lg:pr-10">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-(--axis-surface) px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center gap-2 rounded-2xl border bg-(--axis-surface) px-4 py-2 text-xs text-(--axis-muted) shadow-sm">
          <RiSearchLine className="h-4 w-4" />
          <input
            className="w-40 bg-transparent text-xs text-(--axis-text) placeholder:text-(--axis-muted) focus:outline-none"
            placeholder="Buscar curso..."
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong)"
            type="button"
            aria-label="Notificaciones"
          >
            <RiNotification3Line className="h-4 w-4" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong)"
            type="button"
            aria-label="Mensajes"
          >
            <RiMessage3Line className="h-4 w-4" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong)"
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <RiSunLine className="h-4 w-4" />
            ) : (
              <RiMoonLine className="h-4 w-4" />
            )}
          </button>
          <div className="flex items-center gap-3 rounded-2xl border bg-(--axis-surface) px-3 py-2 shadow-sm">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-purple-400 text-xs font-semibold text-white">
                {userName.slice(0, 1)}
              </div>
            )}
            <div className="text-xs">
              <p className="font-semibold text-(--axis-text)">
                {userName}
              </p>
              <p className="text-(--axis-muted)">
                {userEmail ?? "Cuenta Google"}
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
