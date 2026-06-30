"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChefHat, Bike, MapPin, CalendarDays, ShoppingCart, Target } from "lucide-react";

const features = [
  {
    title: "Compare all three",
    body: "Cook, Order, and Dineout ranked by price, time, and what you already have at home.",
    icon: CompareIcon,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Goal-first planning",
    body: "Set a monthly budget and dietary goal, then track your spend and weekly adherence.",
    icon: TargetIcon,
    span: "",
  },
  {
    title: "Weekly planner",
    body: "Drop meals into a week grid and let MealMap fill the gaps.",
    icon: CalendarDays,
    span: "",
  },
  {
    title: "Cart builder",
    body: "One click pushes ingredients and dishes to your Swiggy cart.",
    icon: ShoppingCart,
    span: "",
  },
];

function CompareIcon() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cook-light text-cook">
        <ChefHat className="h-5 w-5" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-order-light text-order">
        <Bike className="h-5 w-5" />
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-dineout-light text-dineout">
        <MapPin className="h-5 w-5" />
      </span>
    </div>
  );
}

function TargetIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
      <Target className="h-5 w-5" />
    </span>
  );
}

export function FeaturesV2() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-flour py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="max-w-2xl font-display text-3xl font-bold text-foreground sm:text-4xl">
            One copilot, three ways to eat.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            MealMap does the math so you can do the eating.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md ${f.span}`}
            >
              <f.icon />
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
