"use client";

import { ScrollReveal } from "./scroll-reveal";
import { HeroCTA } from "./hero-cta";

export function MotionFooter() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Stop scrolling. Start eating.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join MealMap and let Swiggy do the heavy lifting.
          </p>
          <div className="mt-8 flex justify-center">
            <HeroCTA />
          </div>
          <footer className="mt-12 space-y-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MealMap. All rights reserved.</p>
            <p>Built with Clerk, Neon, OpenAI, and Swiggy MCP.</p>
            <p className="font-medium text-warning">No real orders are placed here.</p>
          </footer>
        </ScrollReveal>
      </div>
    </section>
  );
}
