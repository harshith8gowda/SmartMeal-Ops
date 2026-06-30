"use client";

import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";

export function FooterV2() {
  return (
    <section className="bg-flour py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl">
          Stop scrolling. Start eating.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join MealMap and let Swiggy do the heavy lifting.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href={"/sign-up" as Route}>Get started free</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={"/sign-in" as Route}>Already have an account?</Link>
          </Button>
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MealMap. No real orders are placed here.
        </p>
      </div>
    </section>
  );
}
