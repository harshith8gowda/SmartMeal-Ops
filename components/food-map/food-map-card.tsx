"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type FoodMapCardProps = {
  mode: "cook" | "order" | "dineout";
  title: string;
  description: string;
  price: string;
  time: string;
  icon: LucideIcon;
  image: string;
};

const modeStyles = {
  cook: { badge: "bg-cook-light text-cook", border: "border-cook/20" },
  order: { badge: "bg-order-light text-order", border: "border-order/20" },
  dineout: { badge: "bg-dineout-light text-dineout", border: "border-dineout/20" },
};

const modeLabels = { cook: "Cook", order: "Order", dineout: "Dineout" };

export function FoodMapCard({ mode, title, description, price, time, icon: Icon, image }: FoodMapCardProps) {
  const style = modeStyles[mode];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border bg-flour shadow-md",
        style.border
      )}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold", style.badge)}>
          {modeLabels[mode]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-lg font-semibold text-foreground">{title}</h4>
          <Icon className={cn("h-5 w-5 shrink-0", style.badge.split(" ")[1])} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="font-medium text-foreground">{price}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
      </div>
    </motion.article>
  );
}
