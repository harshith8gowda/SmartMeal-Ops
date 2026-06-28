"use client";

import { Button } from "@/components/ui/button";
import { ChefHat, ShoppingBag, UtensilsCrossed, Clock, IndianRupee, Gauge } from "lucide-react";

export type ComparisonRecommendation = {
  source: "cook" | "order" | "dineout";
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
  effort: "low" | "medium" | "high";
  imageUrl?: string;
  items: { name: string; quantity?: string; price?: number }[];
  actionLabel: string;
};

const sourceConfig = {
  cook: {
    icon: ChefHat,
    label: "Cook",
    gradient: "from-emerald-500/20 to-teal-500/10",
    accent: "text-emerald-400"
  },
  order: {
    icon: ShoppingBag,
    label: "Order",
    gradient: "from-primary/20 to-accent/10",
    accent: "text-primary"
  },
  dineout: {
    icon: UtensilsCrossed,
    label: "Dineout",
    gradient: "from-purple-500/20 to-pink-500/10",
    accent: "text-purple-400"
  }
};

export function ComparisonCard({
  recommendation,
  onSelect
}: {
  recommendation: ComparisonRecommendation;
  onSelect: () => void;
}) {
  const config = sourceConfig[recommendation.source];
  const Icon = config.icon;

  return (
    <div className="premium-card flex flex-col p-5">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} ${config.accent}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wider ${config.accent}`}>{config.label}</p>
      <h3 className="mt-1 font-display text-xl font-semibold">{recommendation.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{recommendation.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <IndianRupee className="h-3.5 w-3.5" />₹{recommendation.cost}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />{recommendation.timeMinutes}m
        </span>
        <span className="flex items-center gap-1 capitalize">
          <Gauge className="h-3.5 w-3.5" />{recommendation.effort} effort
        </span>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {recommendation.items.slice(0, 3).map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {item.name}
            {item.quantity ? <span className="text-xs opacity-60">({item.quantity})</span> : null}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button onClick={onSelect} className="w-full gap-2">
          {recommendation.actionLabel}
        </Button>
      </div>
    </div>
  );
}
