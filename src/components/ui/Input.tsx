"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-[#bdbdbd] text-sm font-medium">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "bg-black border rounded-lg px-3 py-2 text-[#e0e0e0] text-sm placeholder:text-[#828282] outline-none transition-colors",
            "focus:border-[#2d9cdb]",
            error ? "border-[#eb5757]" : "border-[#2d2d2d]"
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-[#828282] text-xs">{hint}</p>
        )}
        {error && (
          <p className="text-[#eb5757] text-xs">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
