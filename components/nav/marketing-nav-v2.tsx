"use client";

import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function MarketingNavV2() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-flour/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">MealMap</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-11 px-4" asChild>
            <Link href={"/sign-in" as Route}>Sign in</Link>
          </Button>
          <Button className="h-11 px-5" asChild>
            <Link href={"/sign-up" as Route}>Get started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
