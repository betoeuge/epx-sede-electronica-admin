"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-[#bdbdbd] text-sm font-medium">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "bg-black border rounded-lg px-3 py-2 text-[#e0e0e0] text-sm outline-none transition-colors cursor-pointer",
            "focus:border-[#2d9cdb]",
            error ? "border-[#eb5757]" : "border-[#2d2d2d]"
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[#eb5757] text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
