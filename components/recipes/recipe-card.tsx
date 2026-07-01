"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee, Flame, Beef, Wheat, Droplets, Heart } from "lucide-react";

export type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  source: "COOK" | "ORDER" | "DINEOUT";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string[];
  cookTimeMinutes: number;
  cost: number;
  isFavorite: boolean;
};

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

export function RecipeCard({
  recipe,
  onToggleFavorite,
  onDelete
}: {
  recipe: Recipe;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">{sourceLabels[recipe.source]}</p>
          <h3 className="font-display text-lg font-semibold">{recipe.title}</h3>
          {recipe.description ? <p className="text-sm text-muted-foreground">{recipe.description}</p> : null}
        </div>
        <Badge variant={sourceVariant[recipe.source]}>{sourceLabels[recipe.source]}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><Flame className="h-4 w-4 text-primary" />{recipe.calories} kcal</p>
        <p className="flex items-center gap-2"><Beef className="h-4 w-4 text-cook" />{recipe.protein}g protein</p>
        <p className="flex items-center gap-2"><Wheat className="h-4 w-4 text-accent" />{recipe.carbs}g carbs</p>
        <p className="flex items-center gap-2"><Droplets className="h-4 w-4 text-dineout" />{recipe.fat}g fat</p>
        <p className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-success" />₹{recipe.cost}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" />{recipe.cookTimeMinutes} min</p>
      </div>

      {recipe.ingredients.length > 0 && (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          Ingredients: {recipe.ingredients.join(", ")}
        </p>
      )}

      <div className="mt-auto flex items-center gap-2 pt-4">
        <Button
          variant={recipe.isFavorite ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => onToggleFavorite?.(recipe.id)}
        >
          <Heart className={`h-4 w-4 ${recipe.isFavorite ? "fill-current" : ""}`} />
          {recipe.isFavorite ? "Saved" : "Save"}
        </Button>
        {onDelete && (
          <Button variant="outline" size="sm" className="text-error hover:bg-error/10" onClick={() => onDelete(recipe.id)}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
}
