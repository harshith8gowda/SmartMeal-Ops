"use client";

import Link from "next/link";
import type { Route } from "next";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketingNav() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="px-4 pt-4">
      <header className="sticky top-4 z-50 rounded-2xl border border-white/[0.08] bg-white/[0.06] px-5 py-3 shadow-lg backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-amber-500 text-sm font-bold text-white">
              MM
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">MealMap</span>
          </Link>

          <div className="flex items-center gap-3">
            {!isLoaded ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            ) : isSignedIn ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={"/dashboard" as Route}>Dashboard</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={"/sign-in" as Route}>Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={"/sign-up" as Route}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
