import { MealCard } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function MealPlanCard({ meal }: { meal: MealCard }) {
  return (
    <Card className="glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">{meal.day}</p>
          <h3 className="text-lg font-semibold">{meal.title}</h3>
        </div>
        <Badge>{meal.source}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 md:grid-cols-4">
        <p>{meal.calories} kcal</p>
        <p>{meal.protein}g protein</p>
        <p>₹{meal.cost}</p>
        <p>{meal.prepMinutes} mins</p>
      </div>
    </Card>
  );
}
