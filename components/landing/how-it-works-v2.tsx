"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Set your goal",
    body: "Tell MealMap your budget, household size, diet, and what you want to improve.",
  },
  {
    n: "02",
    title: "See the map",
    body: "AI surfaces the best Cook, Order, and Dineout options for tonight and the week.",
  },
  {
    n: "03",
    title: "Build and go",
    body: "Add the winning choice to your Swiggy cart or grocery list and checkout there.",
  },
];

export function HowItWorksV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold text-foreground sm:text-4xl"
        >
          How it works
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-flour p-6 shadow-sm"
            >
              <span className="font-display text-4xl font-bold text-primary/30">{s.n}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
