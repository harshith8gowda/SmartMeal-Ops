"use client";

import { motion } from "framer-motion";
import { useMotionPreference } from "@/lib/hooks/use-reduced-motion";

export function DashboardHero3D() {
  const { reduceMotion } = useMotionPreference();

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-border/40 bg-card/50 p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />

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
