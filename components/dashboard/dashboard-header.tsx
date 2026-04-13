"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useThemeStore } from "@/lib/store/theme";
import { useAdminShell } from "@/components/dashboard/admin-shell";
import { RiMenuFoldLine, RiMenuUnfoldLine, RiMenuLine, RiMoonLine, RiSunLine } from "react-icons/ri";


type DashboardHeaderProps = {
  userName  : string;
  userEmail?: string | null;
  userImage?: string | null;
};

export const DashboardHeader = ({ userName, userEmail, userImage }: DashboardHeaderProps) => {
  const { isDesktopOpen, toggleDesktop, openMobile } = useAdminShell();

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
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-(--axis-surface) px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:px-5 sm:py-3">
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong) lg:hidden"
          type="button"
          onClick={openMobile}
          aria-label="Abrir menu"
        >
          <RiMenuLine className="h-5 w-5" />
        </button>
        <button
          className="hidden h-10 w-10 items-center justify-center rounded-xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong) lg:flex"
          type="button"
          onClick={toggleDesktop}
          aria-label={isDesktopOpen ? "Contraer menu" : "Expandir menu"}
        >
          {isDesktopOpen ? (
            <RiMenuFoldLine className="h-4 w-4" />
          ) : (
            <RiMenuUnfoldLine className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-2xl border bg-(--axis-surface) text-(--axis-muted) shadow-sm transition hover:-translate-y-0.5 hover:bg-(--axis-surface-strong) sm:h-10 sm:w-10"
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

        <div className="flex min-w-0 items-center gap-2 rounded-2xl border bg-(--axis-surface) px-2 py-2 shadow-sm sm:px-3">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-purple-400 text-xs font-semibold text-white sm:h-9 sm:w-9">
              {userName.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 text-[10px] sm:text-xs hidden sm:block">
            <p className="truncate font-semibold text-(--axis-text)">
              {userName}
            </p>
            <p className="truncate text-(--axis-muted)">
              {userEmail ?? "Cuenta Google"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
