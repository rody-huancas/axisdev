"use client";

import { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { buildTimeOptions } from "@/lib/calendar-utils";

type TimeDropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const TimeDropdown = ({ label, value, options, onChange, disabled }: TimeDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current && !ref.current.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="space-y-2" ref={ref}>
      <span className="text-xs font-semibold text-(--axis-muted)">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => (disabled ? null : setOpen((prev) => !prev))}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-4 py-3 text-left text-sm text-(--axis-text) transition",
            open && "border-[color-mix(in_srgb,var(--axis-accent)_45%,var(--axis-border))] ring-2 ring-[color-mix(in_srgb,var(--axis-accent)_18%,transparent)]",
            disabled && "opacity-60",
          )}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="tabular-nums">{value}</span>
          <RiArrowDownSLine className={cn("h-5 w-5 text-(--axis-muted) transition", open && "rotate-180")} aria-hidden />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
            <div className="max-h-64 overflow-auto p-2">
              <div className="grid grid-cols-2 gap-1" role="listbox" aria-label={label}>
                {options.map((option) => {
                  const active = option === value;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setOpen(false);
                      }}
                      className={cn(
                        "rounded-xl px-3 py-2 text-left text-sm tabular-nums transition",
                        active
                          ? "bg-[color-mix(in_srgb,var(--axis-accent)_14%,transparent)] text-(--axis-text) ring-1 ring-[color-mix(in_srgb,var(--axis-accent)_28%,var(--axis-border))]"
                          : "text-(--axis-muted) hover:bg-(--axis-surface-strong) hover:text-(--axis-text)",
                      )}
                      role="option"
                      aria-selected={active}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};