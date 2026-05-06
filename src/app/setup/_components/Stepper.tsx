"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Conexión al backend" },
  { label: "Base de datos" },
  { label: "APIs ECM" },
  { label: "Entidad & Admin" },
  { label: "Confirmar" },
];

interface StepperProps {
  current: number;
}

export function Stepper({ current }: StepperProps) {
  return (
    <nav className="flex flex-col gap-1 w-full">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={step.label} className="flex items-start gap-3">
            {/* Left: circle + vertical line */}
            <div className="flex flex-col items-center shrink-0">
              <div className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                done  && "bg-[#27ae60] border-[#27ae60] text-white",
                active && "bg-[#2d9cdb] border-[#2d9cdb] text-white",
                !done && !active && "bg-transparent border-[rgba(255,255,255,0.15)] text-[#828282]",
              )}>
                {done ? <Check size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "w-px h-8 mt-1 transition-all",
                  i < current ? "bg-[#27ae60]" : "bg-[rgba(255,255,255,0.1)]"
                )} />
              )}
            </div>

            {/* Right: label */}
            <p className={cn(
              "text-sm pt-0.5 transition-all",
              active && "text-white font-semibold",
              done  && "text-[#27ae60] font-medium",
              !done && !active && "text-[#4f4f4f]",
            )}>
              {step.label}
            </p>
          </div>
        );
      })}
    </nav>
  );
}
