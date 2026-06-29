"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import { useAuth } from "@clerk/nextjs";

export function HeroCTA() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 w-40 rounded-md" />
        <Skeleton className="h-11 w-48 rounded-md" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={"/dashboard" as Route}>
            Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href={"/chat" as Route}>Try AI Assistant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <Link href={"/sign-up" as Route}>
          Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="secondary" size="lg">
        <Link href={"/sign-in" as Route}>Already have an account?</Link>
      </Button>
    </div>
  );
}
