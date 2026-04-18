import { cn } from "@/lib/utils";

type ToggleProps = {
  enabled  : boolean;
  onChange : () => void;
  disabled?: boolean;
};

export const Toggle = ({ enabled, onChange, disabled }: ToggleProps) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      "relative h-6 w-10 rounded-full transition-all cursor-pointer",
      enabled ? "bg-green-500" : "bg-(--axis-surface-strong)",
      disabled && "opacity-50 cursor-not-allowed",
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all",
        enabled ? "left-4.5" : "left-0.5",
      )}
    />
  </button>
);
