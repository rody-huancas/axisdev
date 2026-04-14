"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RiArrowDownSLine, RiCheckLine } from "react-icons/ri";

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value       : string;
  onChange    : (value: string) => void;
  options     : SelectOption[];
  placeholder?: string;
  className  ?: string;
  disabled   ?: boolean;
};

export const CustomSelect = (props: CustomSelectProps) => {
  const { value, onChange, options, placeholder = "Seleccionar...", className, disabled } = props;

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-14 w-full items-center justify-between rounded-2xl border border-(--axis-border) bg-(--axis-surface-strong) px-5 py-3 text-base text-(--axis-text) transition hover:border-(--axis-accent)",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-(--axis-accent)",
        )}
      >
        <span className={selectedOption ? "text-(--axis-text)" : "text-(--axis-muted)"}>
          {selectedOption?.label || placeholder}
        </span>
        <RiArrowDownSLine
          className={cn("h-5 w-5 text-(--axis-muted) transition", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-(--axis-border) bg-(--axis-surface) shadow-[0_14px_40px_rgba(15,23,42,0.25)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-(--axis-surface-strong)",
                option.value === value && "bg-(--axis-accent)/10 text-(--axis-accent)",
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <RiCheckLine className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
