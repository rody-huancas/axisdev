import { cn } from "@/lib/utils";

type Props = {
  tab         : "all" | "folders" | "files";
  onTabChange : (tab: "all" | "folders" | "files") => void;
  foldersCount: number;
  filesCount  : number;
  t           : Record<string, any>;
};

export const DriveTabs = ({ tab, onTabChange, foldersCount, filesCount, t }: Props) => (
  <div className="flex flex-wrap gap-1 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) p-1">
    {(["all", "folders", "files"] as const).map((value) => (
      <button
        key={value}
        type="button"
        onClick={() => onTabChange(value)}
        className={cn(
          "rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
          tab === value
            ? "bg-(--axis-surface) text-(--axis-text) shadow-sm ring-1 ring-(--axis-border)"
            : "text-(--axis-muted) hover:text-(--axis-text)",
        )}
      >
        {value === "all"
          ? t.pages.drive.all
          : value === "folders"
            ? `${t.pages.drive.folders} (${foldersCount})`
            : `${t.pages.drive.filesCount} (${filesCount})`}
      </button>
    ))}
  </div>
);
