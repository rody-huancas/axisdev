import { cn } from "@/lib/utils";
import { RiCheckLine, RiLoader4Line } from "react-icons/ri";

type SaveButtonProps = {
  saving : boolean;
  saved  : boolean;
  onClick: () => void;
  t      : Record<string, any>;
};

export const SaveButton = ({ saving, saved, onClick, t }: SaveButtonProps) => (
  <button
    onClick={onClick}
    disabled={saving || saved}
    className={cn(
      "rounded-xl px-5 py-2.5 text-sm font-medium text-white transition cursor-pointer flex items-center gap-2",
      saving ? "bg-(--axis-accent)/70 cursor-wait" : saved ? "bg-emerald-500 hover:bg-emerald-600" : "bg-(--axis-accent) hover:opacity-90",
      (saving || saved) && "disabled:opacity-70 disabled:cursor-not-allowed",
    )}
  >
    {saving ? (
      <>
        <RiLoader4Line className="h-4 w-4 animate-spin" />
        {t.common.saving}
      </>
    ) : saved ? (
      <>
        <RiCheckLine className="h-4 w-4" />
        {t.common.saved}
      </>
    ) : (
      <>
        <RiCheckLine className="h-4 w-4" />
        {t.common.save}
      </>
    )}
  </button>
);
