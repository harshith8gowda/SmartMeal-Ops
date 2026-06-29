"use client";

import { motion } from "framer-motion";
import { MealMapOrbit } from "@/components/3d/mealmap-orbit";
import { SceneProvider } from "@/components/3d/scene-provider";
import { useMotionPreference } from "@/lib/hooks/use-reduced-motion";

export function DashboardHero3D() {
  const { reduceMotion } = useMotionPreference();

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-border/40 bg-card/50 p-8">
      <SceneProvider
        fallback={
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        }
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 top-0 h-full w-full opacity-30 md:w-1/2 md:opacity-60">
          <MealMapOrbit className="h-full w-full" speed={0.25} />
        </div>
      </SceneProvider>

      <div className="relative z-10 max-w-lg">
        {reduceMotion ? (
          <h2 className="text-3xl font-bold text-foreground">
            What are you eating today?
          </h2>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-3xl font-bold text-foreground"
          >
            What are you eating today?
          </motion.h2>
        )}
        <p className="mt-2 text-muted-foreground">
          Type a craving, budget, or dietary goal below.
        </p>
      </div>
    </section>
  );
}
