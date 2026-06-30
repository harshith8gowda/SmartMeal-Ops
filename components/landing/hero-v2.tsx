"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FoodMap } from "@/components/food-map/food-map";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export function HeroV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background grain">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              Swiggy-powered food copilot
            </motion.p>
            <motion.h1
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Decide dinner. <br />
              <span className="text-primary">No second guessing.</span>
            </motion.h1>
            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              MealMap compares Cook, Order, and Dineout on Swiggy, plans your week, and builds your cart — all in one place.
            </motion.p>
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link href={"/sign-up" as Route}>
                <Button size="lg" className="h-12 px-6 text-base">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={"/sign-in" as Route}>
                <Button variant="secondary" size="lg" className="h-12 px-6 text-base">
                  Already have an account?
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-dineout/10" />
            <div className="relative rounded-3xl border border-border bg-flour p-4 shadow-lg">
              <FoodMap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
