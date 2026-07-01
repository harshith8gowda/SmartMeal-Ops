"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { RecipeCard, type Recipe } from "@/components/recipes/recipe-card";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import { toast } from "sonner";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setRecipes(data.recipes || []))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load recipes");
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleFavorite(id: string) {
    try {
      const res = await fetch("/api/recipes", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setRecipes((prev) =>
        prev
          ? prev.map((r) => (r.id === id ? { ...r, isFavorite: data.recipe?.isFavorite ?? !r.isFavorite } : r))
          : prev
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function deleteRecipe(id: string) {
    try {
      const res = await fetch(`/api/recipes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRecipes((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
      toast.success("Recipe deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-6">
            <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
              <Package className="h-4 w-4" /> Recipes
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Recipe collection
            </h1>
            <p className="mt-2 text-muted-foreground">
              Save meals from your plan and build your personal cookbook.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : recipes?.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No recipes yet"
            description="Save a meal from your planner to start your collection."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes?.map((recipe) => (
              <ScrollReveal key={recipe.id}>
                <RecipeCard recipe={recipe} onToggleFavorite={toggleFavorite} onDelete={deleteRecipe} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
