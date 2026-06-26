"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";


export function HeroCTA() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/dashboard">Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/chat">Try AI Assistant</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <Link href={{ pathname: "/sign-up" }}>Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
      <Button asChild variant="secondary" size="lg">
        <Link href={{ pathname: "/sign-in" }}>Already have an account?</Link>
      </Button>
    </div>
  );
}
