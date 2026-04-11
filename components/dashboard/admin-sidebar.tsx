"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBookOpenLine, RiDashboardLine, RiGroupLine, RiMessage3Line, RiSettings3Line, RiTaskLine } from "react-icons/ri";

import { signOutAction } from "@/actions/auth/sign-out";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href : string;
  icon : React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href : "/dashboard",
    icon : <RiDashboardLine className="h-4 w-4" />,
  },
  {
    label: "Drive",
    href : "/drive",
    icon : <RiBookOpenLine className="h-4 w-4" />,
  },
  {
    label: "Calendar",
    href : "/calendar",
    icon : <RiGroupLine className="h-4 w-4" />,
  },
  {
    label: "Tasks",
    href : "/tasks",
    icon : <RiTaskLine className="h-4 w-4" />,
  },
  {
    label: "Gmail",
    href : "/gmail",
    icon : <RiMessage3Line className="h-4 w-4" />,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-(--axis-border) bg-(--axis-surface) px-4 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-center">
          <Image
            src="/axisdev.webp"
            alt="Axisdev"
            width={36}
            height={36}
            priority
            className="rounded-xl"
          />
        </div>
        <button
          className="flex h-10 w-10 flex-col items-center justify-center rounded-full border border-(--axis-border) bg-(--axis-surface) text-(--axis-text) transition hover:bg-(--axis-surface-strong)"
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          aria-controls="admin-sidebar"
        >
          <span className="block h-0.5 w-5 rounded-full bg-(--axis-text)" />
          <span className="mt-1 block h-0.5 w-5 rounded-full bg-(--axis-text)" />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={handleClose}
      />

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-(--axis-border) bg-(--axis-surface) px-6 py-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="space-y-10">
          <Link href="/dashboard" className="flex items-center justify-center gap-3">
            <Image
              src="/axisdev.webp"
              alt="Axisdev"
              width={150}
              height={44}
              priority
              className="rounded-xl object-cover"
            />
          </Link>

          <nav className="space-y-3 text-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-(--axis-muted)">Menu</p>
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                      isActive
                        ? "bg-(--axis-accent) text-white shadow-[0_8px_20px_rgba(108,99,255,0.25)]"
                        : "text-(--axis-muted) hover:bg-(--axis-surface-strong)",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition",
                        isActive ? "bg-white/20 text-white" : "bg-(--axis-surface-strong) text-(--axis-muted) group-hover:bg-(--axis-surface-strong)",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="space-y-3">
          <Link
            href="/settings"
            onClick={handleClose}
            className="flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-3 text-sm font-medium text-(--axis-muted) transition hover:bg-(--axis-surface-strong)"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--axis-surface-strong) text-(--axis-muted)">
              <RiSettings3Line className="h-4 w-4" />
            </span>
            Configuracion
          </Link>

          <form action={signOutAction}>
            <button
              className="w-full rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-(--axis-text) transition hover:bg-(--axis-surface)"
              type="submit"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
