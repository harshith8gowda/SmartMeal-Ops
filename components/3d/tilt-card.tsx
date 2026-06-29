"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Minimal stub for the 3D tilt card primitive.
 *
 * Task 4 will replace/extend this with the full tilt / glare implementation.
 * For now it preserves layout and hover classes while keeping the landing page
 * compilable.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  return (
    <div className={cn("h-full perspective-1000", className)}>
      <div className="preserve-3d h-full">{children}</div>
    </div>
  );
}
