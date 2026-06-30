"use client";

import { Check } from "lucide-react";

export function Checkbox({
  id,
  checked,
  onCheckedChange
}: {
  id?: string;
  checked?: boolean;
  onCheckedChange?: () => void;
}) {
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-secondary checked:border-primary checked:bg-primary"
      />
      <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 peer-checked:opacity-100" />
    </div>
  );
}
