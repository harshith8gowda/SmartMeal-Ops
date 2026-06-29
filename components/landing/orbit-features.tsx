"use client";

import { ScrollReveal } from "./scroll-reveal";
import { TiltCard } from "@/components/3d/tilt-card";
import { Utensils, CalendarDays, ShoppingCart } from "lucide-react";

const features = [
  {
    title: "Compare all three",
    body: "Cook, Order, and Dineout options ranked by price, time, and your pantry.",
    icon: Utensils,
    color: "text-primary",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Weekly planner",
    body: "Drop meals into a week grid and let AI fill the gaps.",
    icon: CalendarDays,
    color: "text-success",
    span: "lg:col-span-1",
  },
  {
    title: "Cart builder",
    body: "One click pushes ingredients and dishes to your Swiggy cart.",
    icon: ShoppingCart,
    color: "text-dineout",
    span: "lg:col-span-1",
  },
];

export function OrbitFeatures() {
  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One copilot, three ways to eat.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1} className={f.span}>
              <TiltCard className="h-full">
                <div className="premium-card h-full p-8">
                  <f.icon className={`h-8 w-8 ${f.color}`} />
                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{f.body}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
