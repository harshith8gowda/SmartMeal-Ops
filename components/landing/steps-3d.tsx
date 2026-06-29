"use client";

import { ScrollReveal } from "./scroll-reveal";
import { TiltCard } from "@/components/3d/tilt-card";

const steps = [
  {
    n: "01",
    title: "Set your mood",
    body: "Tell MealMap what you crave, your budget, and dietary goals.",
  },
  {
    n: "02",
    title: "See the map",
    body: "AI surfaces the best Cook, Order, and Dineout options.",
  },
  {
    n: "03",
    title: "Build & go",
    body: "Add the winning choice to your Swiggy cart and checkout there.",
  },
];

export function Steps3D() {
  return (
    <section className="bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.12}>
              <TiltCard>
                <div className="premium-card p-8">
                  <span className="text-5xl font-bold text-primary/20">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{s.body}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
