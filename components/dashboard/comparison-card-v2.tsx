"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Bike, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ComparisonMode = "cook" | "order" | "dineout";

export type ComparisonRecommendation = {
  source: ComparisonMode;
  title: string;
  description: string;
  cost: number;
  timeMinutes: number;
  effort: "low" | "medium" | "high";
  imageUrl?: string;
  items: { name: string; quantity?: string; price?: number }[];
  actionLabel: string;
};

export type ComparisonCardV2Props = {
  mode: ComparisonMode;
  title: string;
  description: string;
  price: string;
  time: string;
};

const modeMeta = {
  cook: { label: "Cook", icon: ChefHat, color: "cook", bg: "bg-cook-light" },
  order: { label: "Order", icon: Bike, color: "order", bg: "bg-order-light" },
  dineout: { label: "Dineout", icon: MapPin, color: "dineout", bg: "bg-dineout-light" },
};

export function ComparisonCardV2({ mode, title, description, price, time }: ComparisonCardV2Props) {
  const meta = modeMeta[mode];
  const Icon = meta.icon;

  return (
    <Card className="overflow-hidden border-border bg-flour shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className={cn("flex flex-row items-center gap-3 pb-3", meta.bg)}>
        <Icon className={cn("h-5 w-5", `text-${meta.color}`)} />
        <Badge variant="outline" className="border-0 bg-transparent font-semibold text-foreground">
          {meta.label}
        </Badge>
      </CardHeader>
      <CardContent className="p-5">
        <CardTitle className="font-display text-lg">{title}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium">{price}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
