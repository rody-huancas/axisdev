import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { signOutAction } from "@/actions/auth/sign-out";
import { BiLogOut } from "react-icons/bi";
import { RiBookOpenLine, RiDashboardLine, RiGroupLine, RiMessage3Line, RiSettings3Line, RiTaskLine } from "react-icons/ri";

type NavItem = {
  key: string;
  href : string;
  icon : React.ReactNode;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    href : "/dashboard",
    icon : <RiDashboardLine className="h-4 w-4" />,
  },
  {
    key: "drive",
    href : "/drive",
    icon : <RiBookOpenLine className="h-4 w-4" />,
  },
  {
    key: "calendar",
    href : "/calendar",
    icon : <RiGroupLine className="h-4 w-4" />,
  },
  {
    key: "tasks",
    href : "/tasks",
    icon : <RiTaskLine className="h-4 w-4" />,
  },
  {
    key: "gmail",
    href : "/gmail",
    icon : <RiMessage3Line className="h-4 w-4" />,
  },
];

type AdminSidebarProps = {
  isMobileOpen : boolean;
  onMobileClose: () => void;
  isDesktopOpen: boolean;
};

export const AdminSidebar = ({ isMobileOpen, onMobileClose, isDesktopOpen }: AdminSidebarProps) => {
  const pathname    = usePathname();
  const isCollapsed = !isDesktopOpen;
  const { t } = useTranslation();
  
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
      />

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-(--axis-border) bg-(--axis-surface) px-6 py-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur lg:translate-x-0 transition-all duration-500 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDesktopOpen ? "lg:w-72 lg:px-6" : "lg:w-20 lg:px-3",
        )}
      >
        <div className="space-y-10">
          <div className={cn("flex items-center justify-center")}>
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              className={cn("flex items-center justify-center gap-3", isCollapsed && "lg:justify-center")}
            >
              <Image
                src={isCollapsed ? "/icon-axisdev.png" : "/axisdev.webp"}
                alt="Axisdev"
                width={isCollapsed ? 44 : 180}
                height={44}
                priority
                className="rounded-xl object-cover"
              />
            </Link>
          </div>

          <nav className="space-y-3 text-sm">
            <p className={cn("text-[10px] uppercase tracking-[0.3em] text-(--axis-muted)", isCollapsed && "lg:hidden")}>
              {t.common.menu}
            </p>
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                      isActive ? "bg-(--axis-accent) text-white shadow-[0_8px_20px_rgba(108,99,255,0.25)]" : "text-(--axis-muted) hover:bg-(--axis-surface-strong)",
                      isCollapsed && "lg:justify-center lg:px-3",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-(--axis-surface-strong) text-(--axis-muted) group-hover:bg-(--axis-surface-strong)",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className={cn("font-medium", isCollapsed && "lg:hidden")}>{t.sidebar[item.key as keyof typeof t.sidebar]}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="space-y-3">
          {(() => {
            const settingsActive = pathname === "/settings";
            return (
          <Link
            href="/settings"
            onClick={onMobileClose}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface) px-4 py-3 text-sm font-medium transition",
              settingsActive 
                ? "bg-(--axis-accent) text-white shadow-[0_8px_20px_rgba(108,99,255,0.25)]" 
                : "text-(--axis-muted) hover:bg-(--axis-surface-strong) hover:border-(--axis-accent)/30",
              isCollapsed && "lg:justify-center lg:px-3",
            )}
          >
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              settingsActive 
                ? "bg-white/20 text-white" 
                : "bg-(--axis-surface-strong) text-(--axis-muted) group-hover:bg-(--axis-accent)/10 group-hover:text-(--axis-accent)"
            )}>
              <RiSettings3Line className="h-4 w-4" />
            </span>
            <span className={cn(isCollapsed && "lg:hidden")}>{t.sidebar.settings}</span>
          </Link>
            );
          })()}

          <form action={signOutAction}>
            <button
              className={cn(
                "axis-logout w-full rounded-xl border p-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-colors duration-300 cursor-pointer flex items-center justify-center gap-4",
                isCollapsed && "lg:px-2 lg:text-[9px] lg:tracking-[0.15em]",
              )}
              type="submit"
            >
              <BiLogOut size={18} />
              <span className={cn(isCollapsed && "lg:hidden")}>{t.sidebar.logout}</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};
