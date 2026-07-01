import { Prisma } from "@prisma/client";
import { getPrisma } from "./prisma";

export type RecipeInput = {
  title: string;
  description?: string;
  source: "COOK" | "ORDER" | "DINEOUT";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string[];
  cookTimeMinutes: number;
  cost: number;
  imageUrl?: string;
  isFavorite?: boolean;
};

export async function getRecipes(userId: string) {
  const prisma = getPrisma();
  return prisma.recipe.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }]
  });
}

export async function getRecipeById(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.recipe.findFirst({
    where: { id, userId }
  });
}

export async function createRecipe(userId: string, input: RecipeInput) {
  const prisma = getPrisma();
  return prisma.recipe.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      source: input.source,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
      ingredients: input.ingredients,
      steps: input.steps,
      cookTimeMinutes: input.cookTimeMinutes,
      cost: input.cost,
      imageUrl: input.imageUrl,
      isFavorite: input.isFavorite ?? false
    }
  });
}

export async function updateRecipe(id: string, userId: string, input: Partial<RecipeInput>) {
  const prisma = getPrisma();
  const data: Prisma.RecipeUncheckedUpdateManyInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.source !== undefined) data.source = input.source;
  if (input.calories !== undefined) data.calories = input.calories;
  if (input.protein !== undefined) data.protein = input.protein;
  if (input.carbs !== undefined) data.carbs = input.carbs;
  if (input.fat !== undefined) data.fat = input.fat;
  if (input.ingredients !== undefined) data.ingredients = input.ingredients;
  if (input.steps !== undefined) data.steps = input.steps;
  if (input.cookTimeMinutes !== undefined) data.cookTimeMinutes = input.cookTimeMinutes;
  if (input.cost !== undefined) data.cost = input.cost;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.isFavorite !== undefined) data.isFavorite = input.isFavorite;

  return prisma.recipe.updateMany({
    where: { id, userId },
    data
  });
}

export async function deleteRecipe(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.recipe.deleteMany({
    where: { id, userId }
  });
}

export async function toggleFavoriteRecipe(id: string, userId: string) {
  const prisma = getPrisma();
  const recipe = await getRecipeById(id, userId);
  if (!recipe) return null;

  return prisma.recipe.update({
    where: { id },
    data: { isFavorite: !recipe.isFavorite }
  });
}
