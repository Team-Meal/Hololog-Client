import { instance } from "@/shared/api";
import type { IngredientPlan } from "@/entities/ingredient-plan";

export async function getIngredientPlans(): Promise<IngredientPlan[]> {
  const response = await instance.get<IngredientPlan[]>("/ingredients/plans", {
    requiresAuth: true,
  });
  return response.data;
}

export async function getIngredientPlanById(planId: number): Promise<IngredientPlan> {
  const response = await instance.get<IngredientPlan>(`/ingredients/plans/${planId}`, {
    requiresAuth: true,
  });
  return response.data;
}
