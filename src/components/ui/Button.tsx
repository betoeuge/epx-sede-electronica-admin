"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        brand: "bg-[#003DA6] text-white hover:bg-[#003DA6]/90 focus-visible:ring-[#003DA6]",
        secondary: "bg-[#181818] border border-[#2d2d2d] text-[#e0e0e0] hover:bg-[#2d2d2d]",
        ghost: "bg-transparent text-[#bdbdbd] hover:bg-white/10 hover:text-white",
        danger: "bg-[#eb5757] text-white hover:bg-[#eb5757]/90",
        primary: "bg-[#2d9cdb] text-white hover:bg-[#2d9cdb]/90",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
