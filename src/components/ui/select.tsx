"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-input bg-surface px-2 text-sm text-foreground outline-none focus:border-ring",
        className,
      )}
      {...props}
    />
  );
}

