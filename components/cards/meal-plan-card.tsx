import { MealCard } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, IndianRupee, Salad, Zap } from "lucide-react";

const sourceLabels = {
  COOK: "Cook",
  ORDER: "Order",
  DINEOUT: "Dineout"
};

export function MealPlanCard({ meal }: { meal: MealCard }) {
  return (
    <Card className="glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{meal.day}</p>
          <h3 className="text-lg font-semibold">{meal.title}</h3>
          {meal.reason ? <p className="mt-1 text-sm text-muted-foreground">{meal.reason}</p> : null}
        </div>
        <Badge>{sourceLabels[meal.source]}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4">
        <p className="flex items-center gap-2"><Salad className="h-4 w-4" />{meal.calories} kcal</p>
        <p className="flex items-center gap-2"><Zap className="h-4 w-4" />{meal.protein}g protein</p>
        <p className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />{meal.cost}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{meal.prepMinutes} mins</p>
      </div>
      {meal.ingredients?.length ? (
        <p className="mt-3 text-xs text-muted-foreground">Ingredients: {meal.ingredients.join(", ")}</p>
      ) : null}
    </Card>
  );
}
