"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

type AdminShellContextValue = {
  isDesktopOpen: boolean;
  toggleDesktop: () => void;
  openMobile   : () => void;
  closeMobile  : () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export const useAdminShell = () => {
  const context = useContext(AdminShellContext);

  if (!context) {
    throw new Error("useAdminShell must be used within AdminShell");
  }

  return context;
};

export const AdminShell = ({ children }: AdminShellProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const contextValue = useMemo(
    () => ({
      isDesktopOpen,
      toggleDesktop: () => setIsDesktopOpen((current) => !current),
      openMobile   : () => setIsMobileOpen(true),
      closeMobile : () => setIsMobileOpen(false),
    }),
    [isDesktopOpen],
  );

  return (
    <AdminShellContext.Provider value={contextValue}>
      <div className="min-h-screen overflow-x-hidden bg-(--axis-bg) text-(--axis-text)">
        <AdminSidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          isDesktopOpen={isDesktopOpen}
        />
        <main
          className={cn(
            "min-h-screen px-5 pb-10 pt-6 lg:px-10",
            isDesktopOpen ? "lg:ml-72" : "lg:ml-20",
          )}
        >
          {children}
        </main>
      </div>
    </AdminShellContext.Provider>
  );
};
