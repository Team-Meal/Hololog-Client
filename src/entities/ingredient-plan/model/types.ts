export interface IngredientPlan {
  ingredientPlanId: number;
  title: string;
  startDate: string;
  endDate: string;
  memo: string;
  createdAt: string;
}

export interface CreateIngredientPlanRequest {
  title: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
}

export type UpdateIngredientPlanRequest = Partial<CreateIngredientPlanRequest>;
