import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "rounded-full border-transparent border-t-current animate-spin",
        sizeClasses[size],
        className
      )}
      style={{ borderTopColor: "currentColor" }}
    />
  );
}
