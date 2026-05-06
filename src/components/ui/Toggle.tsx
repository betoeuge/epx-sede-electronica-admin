"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function Toggle({ checked, onChange, disabled, className, label }: ToggleProps) {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
      <div
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors",
          checked ? "bg-[#2f80ed]" : "bg-[#2d2d2d]"
        )}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        <div
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </div>
      {label && <span className="text-[#e0e0e0] text-sm">{label}</span>}
    </label>
  );
}
