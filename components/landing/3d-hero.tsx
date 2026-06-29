"use client";

import { motion } from "framer-motion";
import { HeroCTA } from "./hero-cta";
import { MealMapOrbit } from "@/components/3d/mealmap-orbit";
import { SceneProvider } from "@/components/3d/scene-provider";

export function Hero3D() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
      <SceneProvider
        fallback={
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,hsl(var(--primary)/0.15),transparent_50%)]" />
        }
      >
        <MealMapOrbit className="opacity-80" speed={0.15} />
      </SceneProvider>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 lg:px-8">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Swiggy-powered food copilot
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-7xl"
          >
            Decide dinner.
            <br />
            <span className="text-primary">Build the cart.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            MealMap compares Cook, Order, and Dineout options on Swiggy, plans
            your week, and assembles the cart — no more tab juggling.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8"
          >
            <HeroCTA />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
