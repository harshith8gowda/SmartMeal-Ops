import { MealCard } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, IndianRupee, Salad, Zap } from "lucide-react";

const sourceLabels = {
  COOK: "Cook",
  ORDER: "Order",
  DINEOUT: "Dineout"
};

const sourceVariant = {
  COOK: "default" as const,
  ORDER: "accent" as const,
  DINEOUT: "dineout" as const
};

export function MealPlanCard({ meal }: { meal: MealCard }) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{meal.day}</p>
          <h3 className="mt-1 font-display text-lg font-semibold">{meal.title}</h3>
          {meal.reason ? <p className="mt-1 text-sm text-muted-foreground">{meal.reason}</p> : null}
        </div>
        <Badge variant={sourceVariant[meal.source]}>{sourceLabels[meal.source]}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4">
        <p className="flex items-center gap-2"><Salad className="h-4 w-4 text-primary" />{meal.calories} kcal</p>
        <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-warning" />{meal.protein}g protein</p>
        <p className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-success" />{meal.cost}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" />{meal.prepMinutes} mins</p>
      </div>
      {meal.ingredients?.length ? (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          Ingredients: {meal.ingredients.join(", ")}
        </p>
      ) : null}
    </Card>
  );
}
