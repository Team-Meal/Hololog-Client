export type GeneratorStatus = "idle" | "loading" | "done";

export interface SeasonalIngredient {
  id: string;
  label: string;
}

export interface NutritionCriterion {
  id: string;
  label: string;
}

export interface GeneratorConditions {
  month: string; // YYYY-MM
  useInventory: boolean;
  budgetPerPerson: number;
  preferenceWeight: number;
  seasonalIngredients: SeasonalIngredient[];
  nutritionCriteria: NutritionCriterion[];
}

// Result of POST /meals/ai-generations. The backend returns a summary only —
// the generated diets themselves are retrievable from the 식단 관리 화면.
export interface GeneratorResult {
  month: string;
  totalMeals: number;
  validationErrors: unknown[];
  budgetInfo: Record<string, unknown>;
  error?: string;
}
