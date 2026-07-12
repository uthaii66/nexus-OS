import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FilterBar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/70 p-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
      {...props}
    />
  );
}
