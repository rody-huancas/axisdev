import { RiArrowRightSLine } from "react-icons/ri";

type DriveBreadcrumbProps = {
  inFolder         : boolean;
  currentFolderName: string | null | undefined;
  onBack           : () => void;
  t                : Record<string, any>;
};

export const DriveBreadcrumb = ({ inFolder, currentFolderName, onBack, t }: DriveBreadcrumbProps) => (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <button
      type="button"
      onClick={inFolder ? onBack : undefined}
      className={`inline-flex items-center rounded-2xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
        inFolder
          ? "border-(--axis-border) bg-(--axis-surface-strong) text-(--axis-text) hover:bg-(--axis-surface)"
          : "cursor-default border-(--axis-border) bg-(--axis-surface) text-(--axis-muted)"
      }`}
      aria-current={!inFolder ? "page" : undefined}
      title={inFolder ? t.pages.drive.backToMyDrive : t.pages.drive.myDrive}
    >
      {t.pages.drive.myDrive}
    </button>
    
    {inFolder && (
      <>
        <RiArrowRightSLine
          className="h-4 w-4 text-(--axis-muted)"
          aria-hidden
        />
        <span
          className="max-w-[60ch] truncate font-medium text-(--axis-text)"
          aria-current="page"
        >
          {currentFolderName ?? t.pages.drive.folder}
        </span>
      </>
    )}
  </div>
);
