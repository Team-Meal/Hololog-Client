import { instance } from "@/shared/api";
import type {
  IngredientPlan,
  CreateIngredientPlanRequest,
  UpdateIngredientPlanRequest,
} from "@/entities/ingredient-plan";

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

export async function createIngredientPlan(data: CreateIngredientPlanRequest): Promise<void> {
  await instance.post("/ingredients/plans", data, { requiresAuth: true });
}

export async function updateIngredientPlan(
  planId: number,
  data: UpdateIngredientPlanRequest,
): Promise<IngredientPlan> {
  const response = await instance.patch<IngredientPlan>(`/ingredients/plans/${planId}`, data, {
    requiresAuth: true,
  });
  return response.data;
}

export async function deleteIngredientPlan(planId: number): Promise<void> {
  await instance.delete(`/ingredients/plans/${planId}`, { requiresAuth: true });
}
